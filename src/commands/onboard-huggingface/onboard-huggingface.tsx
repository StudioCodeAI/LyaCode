import * as React from 'react'
import { useCallback, useState } from 'react'
import { Select } from '../../components/CustomSelect/select.js'
import { Spinner } from '../../components/Spinner.js'
import { Box, Text } from '../../ink.js'
import { useTerminalSize } from '../../hooks/useTerminalSize.js'
import {
  openHfVerificationUri,
  pollHfAccessToken,
  requestHfDeviceCode,
} from '../../services/huggingface/deviceFlow.js'
import {
  computeHfExpiryMs,
  hydrateHuggingFaceTokenFromSecureStorage,
  readHuggingFaceToken,
  saveHuggingFaceToken,
} from '../../utils/huggingfaceCredentials.js'
import {
  getSettingsFilePathForSource,
  getSettingsForSource,
  updateSettingsForSource,
} from '../../utils/settings/settings.js'
import { getDisplayPath } from '../../utils/file.js'
import type { LocalJSXCommandCall } from '../../types/command.js'

const DEFAULT_MODEL = 'meta-llama/Llama-3.3-70B-Instruct'

/**
 * Provider-specific env vars that must be cleared from the current session
 * when Hugging Face mode is activated, so resolveProviderRequest() does not
 * pick up a previous provider's base URL or key.
 */
const PROVIDER_SPECIFIC_KEYS = new Set([
  'CLAUDE_CODE_USE_OPENAI',
  'CLAUDE_CODE_USE_GEMINI',
  'CLAUDE_CODE_USE_GITHUB',
  'CLAUDE_CODE_USE_BEDROCK',
  'CLAUDE_CODE_USE_VERTEX',
  'CLAUDE_CODE_USE_FOUNDRY',
  'CLAUDE_CODE_USE_HUGGINGFACE',
  'OPENAI_API_KEY',
  'OPENAI_API_BASE',
  'OPENAI_BASE_URL',
  'OPENAI_MODEL',
  'OPENAI_ORG',
  'OPENAI_ORGANIZATION',
  'OPENAI_PROJECT',
  'HF_TOKEN',
  'GITHUB_TOKEN',
  'GH_TOKEN',
  'GITHUB_COPILOT_KEY',
  'GEMINI_API_KEY',
  'GOOGLE_API_KEY',
  'GEMINI_BASE_URL',
  'GEMINI_MODEL',
  'GEMINI_ACCESS_TOKEN',
  'GEMINI_AUTH_MODE',
])

const FORCE_RELOGIN_ARGS = new Set([
  'force',
  '--force',
  'relogin',
  '--relogin',
  'reauth',
  '--reauth',
])

type Step = 'menu' | 'device-busy' | 'error'

function getUserSettingsDisplayPath(): string {
  const userSettingsPath = getSettingsFilePathForSource('userSettings')
  return userSettingsPath ? getDisplayPath(userSettingsPath) : 'user settings'
}

export function shouldForceHfRelogin(args?: string): boolean {
  const normalized = (args ?? '').trim().toLowerCase()
  if (!normalized) {
    return false
  }
  return normalized.split(/\s+/).some(arg => FORCE_RELOGIN_ARGS.has(arg))
}

export function hasExistingHuggingFaceLoginToken(
  env: NodeJS.ProcessEnv = process.env,
  storedToken?: string,
): boolean {
  if (env.HF_TOKEN?.trim()) {
    return true
  }
  const persisted = (storedToken ?? readHuggingFaceToken())?.trim()
  return Boolean(persisted)
}

function mergeUserSettingsEnv(model: string): {
  ok: boolean
  detail?: string
} {
  const currentSettings = getSettingsForSource('userSettings')
  const currentEnv = currentSettings?.env ?? {}

  const newEnv: Record<string, string> = {}
  for (const [key, value] of Object.entries(currentEnv)) {
    if (!PROVIDER_SPECIFIC_KEYS.has(key)) {
      newEnv[key] = value
    }
  }

  newEnv.CLAUDE_CODE_USE_HUGGINGFACE = '1'
  newEnv.OPENAI_BASE_URL = 'https://router.huggingface.co/v1'
  newEnv.OPENAI_MODEL = model

  const { error } = updateSettingsForSource('userSettings', {
    env: newEnv,
  })
  if (error) {
    return { ok: false, detail: error.message }
  }
  return { ok: true }
}

export function applyHfOnboardingProcessEnv(
  model: string,
  env: NodeJS.ProcessEnv = process.env,
): void {
  env.CLAUDE_CODE_USE_HUGGINGFACE = '1'
  env.OPENAI_BASE_URL = 'https://router.huggingface.co/v1'
  env.OPENAI_MODEL = model

  delete env.OPENAI_API_KEY
  delete env.OPENAI_ORG
  delete env.OPENAI_PROJECT
  delete env.OPENAI_ORGANIZATION
  delete env.OPENAI_API_BASE
  delete env.GITHUB_TOKEN
  delete env.GH_TOKEN
  delete env.GITHUB_COPILOT_KEY
  delete env.GEMINI_API_KEY
  delete env.GOOGLE_API_KEY

  delete env.CLAUDE_CODE_USE_OPENAI
  delete env.CLAUDE_CODE_USE_GEMINI
  delete env.CLAUDE_CODE_USE_GITHUB
  delete env.CLAUDE_CODE_USE_BEDROCK
  delete env.CLAUDE_CODE_USE_VERTEX
  delete env.CLAUDE_CODE_USE_FOUNDRY
  delete env.CLAUDE_CODE_PROVIDER_PROFILE_ENV_APPLIED
  delete env.CLAUDE_CODE_PROVIDER_PROFILE_ENV_APPLIED_ID
}

export function activateHfOnboardingMode(
  model: string = DEFAULT_MODEL,
  options?: {
    mergeSettingsEnv?: (model: string) => { ok: boolean; detail?: string }
    applyProcessEnv?: (model: string) => void
    hydrateToken?: () => void
    onChangeAPIKey?: () => void
  },
): { ok: boolean; detail?: string } {
  const normalizedModel = model.trim() || DEFAULT_MODEL
  const mergeSettingsEnv = options?.mergeSettingsEnv ?? mergeUserSettingsEnv
  const applyProcessEnv = options?.applyProcessEnv ?? applyHfOnboardingProcessEnv
  const hydrateToken =
    options?.hydrateToken ?? hydrateHuggingFaceTokenFromSecureStorage

  const merged = mergeSettingsEnv(normalizedModel)
  if (!merged.ok) {
    return merged
  }

  applyProcessEnv(normalizedModel)
  hydrateToken()
  options?.onChangeAPIKey?.()
  return { ok: true }
}

function OnboardHuggingFace(props: {
  onDone: Parameters<LocalJSXCommandCall>[0]
  onChangeAPIKey: () => void
}): React.ReactNode {
  const { onDone, onChangeAPIKey } = props
  const [step, setStep] = useState<Step>('menu')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [deviceHint, setDeviceHint] = useState<{
    user_code: string
    verification_uri: string
  } | null>(null)
  const { columns } = useTerminalSize()
  void columns

  const finalize = useCallback(
    async (accessToken: string, model: string = DEFAULT_MODEL) => {
      const saved = saveHuggingFaceToken(accessToken, {
        expiresAtMs: computeHfExpiryMs(28800),
      })
      if (!saved.success) {
        setErrorMsg(
          saved.warning ?? 'Could not save token to secure storage.',
        )
        setStep('error')
        return
      }
      const activated = activateHfOnboardingMode(model, {
        onChangeAPIKey,
      })
      if (!activated.ok) {
        setErrorMsg(
          `Token saved, but settings were not updated: ${activated.detail ?? 'unknown error'}. ` +
            `Add env CLAUDE_CODE_USE_HUGGINGFACE=1, OPENAI_BASE_URL=https://router.huggingface.co/v1 and OPENAI_MODEL=${DEFAULT_MODEL} to ${getUserSettingsDisplayPath()} manually.`,
        )
        setStep('error')
        return
      }
      for (const envKey of PROVIDER_SPECIFIC_KEYS) {
        delete process.env[envKey]
      }
      process.env.CLAUDE_CODE_USE_HUGGINGFACE = '1'
      process.env.OPENAI_BASE_URL = 'https://router.huggingface.co/v1'
      process.env.OPENAI_MODEL = model.trim() || DEFAULT_MODEL
      process.env.HF_TOKEN = accessToken.trim()
      hydrateHuggingFaceTokenFromSecureStorage()
      onChangeAPIKey()
      onDone(
        'Hugging Face onboard complete. Token stored in secure storage; user settings updated. Restart if the model does not switch.',
        { display: 'user' },
      )
    },
    [onChangeAPIKey, onDone],
  )

  const runDeviceFlow = useCallback(async () => {
    setStep('device-busy')
    setErrorMsg(null)
    setDeviceHint(null)
    try {
      const device = await requestHfDeviceCode()
      setDeviceHint({
        user_code: device.user_code,
        verification_uri: device.verification_uri,
      })
      await openHfVerificationUri(device.verification_uri)
      const token = await pollHfAccessToken(device.device_code, {
        initialInterval: device.interval,
        timeoutSeconds: device.expires_in,
      })
      await finalize(token.accessToken, DEFAULT_MODEL)
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e))
      setStep('error')
    }
  }, [finalize])

  if (step === 'error' && errorMsg) {
    const options = [
      { label: 'Back to menu', value: 'back' as const },
      { label: 'Exit', value: 'exit' as const },
    ]
    return (
      <Box flexDirection="column" gap={1}>
        <Text color="red">{errorMsg}</Text>
        <Select
          options={options}
          onChange={(v: string) => {
            if (v === 'back') {
              setStep('menu')
              setErrorMsg(null)
            } else {
              onDone('Hugging Face onboard cancelled', {
                display: 'system',
              })
            }
          }}
        />
      </Box>
    )
  }

  if (step === 'device-busy') {
    return (
      <Box flexDirection="column" gap={1}>
        <Text>Hugging Face sign-in</Text>
        {deviceHint ? (
          <>
            <Text>
              Enter code <Text bold>{deviceHint.user_code}</Text> at{' '}
              {deviceHint.verification_uri}
            </Text>
            <Text dimColor>
              A browser window may have opened. Waiting for authorization...
            </Text>
          </>
        ) : (
          <Text dimColor>
            Requesting device code from Hugging Face...
          </Text>
        )}
        <Spinner />
      </Box>
    )
  }

  const menuOptions = [
    { label: 'Sign in with browser (free)', value: 'device' as const },
    { label: 'Cancel', value: 'cancel' as const },
  ]

  return (
    <Box flexDirection="column" gap={1}>
      <Text bold>Hugging Face setup</Text>
      <Text dimColor>
        Free Inference Providers router — no API key, no credit card.
        Uses your Hugging Face account free tier (~1k requests/day).
      </Text>
      <Text dimColor>
        Stores your OAuth token in the OS credential store and enables
        CLAUDE_CODE_USE_HUGGINGFACE in your user settings.
      </Text>
      <Select
        options={menuOptions}
        onChange={(v: string) => {
          if (v === 'cancel') {
            onDone('Hugging Face onboard cancelled', {
              display: 'system',
            })
            return
          }
          void runDeviceFlow()
        }}
      />
    </Box>
  )
}

export const call: LocalJSXCommandCall = async (
  onDone,
  context,
  args,
) => {
  const forceRelogin = shouldForceHfRelogin(args)
  if (hasExistingHuggingFaceLoginToken() && !forceRelogin) {
    const activated = activateHfOnboardingMode(DEFAULT_MODEL, {
      onChangeAPIKey: context.onChangeAPIKey,
    })
    if (!activated.ok) {
      onDone(
        `Hugging Face token detected, but settings activation failed: ${activated.detail ?? 'unknown error'}. ` +
          `Set CLAUDE_CODE_USE_HUGGINGFACE=1 and OPENAI_MODEL=${DEFAULT_MODEL} in ${getUserSettingsDisplayPath()} manually.`,
        { display: 'system' },
      )
      return null
    }

    onDone(
      'Hugging Face already authorized. Activated Hugging Face mode using your existing token. Use /onboard-huggingface --force to re-authenticate.',
      { display: 'user' },
    )
    return null
  }

  return (
    <OnboardHuggingFace
      onDone={onDone}
      onChangeAPIKey={context.onChangeAPIKey}
    />
  )
}
