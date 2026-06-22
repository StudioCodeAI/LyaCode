/**
 * Hugging Face OAuth device flow for CLI login.
 *
 * Uses Hugging Face's official public OAuth app (no client secret required)
 * to authorize Lya Code on behalf of the end user. After consent, an
 * access token is returned that can be used with the Hugging Face Inference
 * Providers router (OpenAI-compatible endpoint).
 *
 * Docs: https://huggingface.co/docs/hub/oauth
 * RFC:   https://datatracker.ietf.org/doc/html/rfc8628 (Device Flow)
 */

import { execFileNoThrow } from '../../utils/execFileNoThrow.js'

/**
 * Public OAuth app registered at huggingface.co/settings/applications/new
 * by Studio CodeAI for Lya Code. Public apps do NOT require a client secret,
 * which is the correct posture for a CLI distributed to end users.
 */
export const DEFAULT_HF_DEVICE_FLOW_CLIENT_ID =
  'c67a43aa-b9a4-4869-bd40-f97a14e6a670'

export const HF_DEVICE_CODE_URL = 'https://huggingface.co/oauth/device'
export const HF_DEVICE_ACCESS_TOKEN_URL = 'https://huggingface.co/oauth/token'

/**
 * Scopes requested at device-code time.
 * - openid:    stable identity
 * - profile:   display name + avatar for the consent screen / UI
 * - inference-api: required to call the HF Inference Providers router
 *
 * Keep this list minimal — over-broad scopes hurt conversion on the consent
 * screen. Add scopes only when a concrete feature needs them.
 */
export const DEFAULT_HF_DEVICE_SCOPE = 'openid profile inference-api'

export const HF_HEADERS: Record<string, string> = {
  'User-Agent': 'LyaCode/1.1.0 (Studio CodeAI)',
}

export class HuggingFaceDeviceFlowError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'HuggingFaceDeviceFlowError'
  }
}

export type HFDeviceCodeResult = {
  device_code: string
  user_code: string
  verification_uri: string
  expires_in: number
  interval: number
}

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export function getHfDeviceFlowClientId(): string {
  return (
    process.env.HF_DEVICE_FLOW_CLIENT_ID?.trim() ||
    DEFAULT_HF_DEVICE_FLOW_CLIENT_ID
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function requestHfDeviceCode(options?: {
  clientId?: string
  scope?: string
  fetchImpl?: FetchLike
}): Promise<HFDeviceCodeResult> {
  const clientId = options?.clientId ?? getHfDeviceFlowClientId()
  if (!clientId) {
    throw new HuggingFaceDeviceFlowError(
      'No OAuth client ID: set HF_DEVICE_FLOW_CLIENT_ID.',
    )
  }
  const fetchFn = options?.fetchImpl ?? fetch
  const requestedScope =
    options?.scope?.trim() || DEFAULT_HF_DEVICE_SCOPE

  const res = await fetchFn(HF_DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      ...HF_HEADERS,
    },
    body: new URLSearchParams({
      client_id: clientId,
      scope: requestedScope,
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new HuggingFaceDeviceFlowError(
      `Device code request failed: ${res.status} ${text}`,
    )
  }

  const data = (await res.json()) as Record<string, unknown>
  const device_code = data.device_code
  const user_code = data.user_code
  const verification_uri = data.verification_uri
  if (
    typeof device_code !== 'string' ||
    typeof user_code !== 'string' ||
    typeof verification_uri !== 'string'
  ) {
    throw new HuggingFaceDeviceFlowError(
      'Malformed device code response from Hugging Face',
    )
  }

  return {
    device_code,
    user_code,
    verification_uri,
    expires_in: typeof data.expires_in === 'number' ? data.expires_in : 900,
    interval: typeof data.interval === 'number' ? data.interval : 5,
  }
}

export type HFPollOptions = {
  clientId?: string
  initialInterval?: number
  timeoutSeconds?: number
  fetchImpl?: FetchLike
}

export type HFAccessTokenResult = {
  accessToken: string
  expiresIn: number
  scope: string
  /** Optional JWT id_token if `openid` scope was granted. */
  idToken?: string
  /** Optional refresh token if the server returned one. */
  refreshToken?: string
}

export async function pollHfAccessToken(
  deviceCode: string,
  options?: HFPollOptions,
): Promise<HFAccessTokenResult> {
  const clientId = options?.clientId ?? getHfDeviceFlowClientId()
  if (!clientId) {
    throw new HuggingFaceDeviceFlowError('client_id required for polling')
  }
  let interval = Math.max(1, options?.initialInterval ?? 5)
  const timeoutSeconds = options?.timeoutSeconds ?? 900
  const fetchFn = options?.fetchImpl ?? fetch
  const start = Date.now()

  while ((Date.now() - start) / 1000 < timeoutSeconds) {
    const res = await fetchFn(HF_DEVICE_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...HF_HEADERS,
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        device_code: deviceCode,
        client_id: clientId,
      }),
    })

    // HF returns 400 with a JSON body for pending/denied/expired states.
    if (res.ok) {
      const data = (await res.json()) as Record<string, unknown>
      const token = data.access_token
      if (typeof token !== 'string' || !token) {
        throw new HuggingFaceDeviceFlowError(
          'No access_token in Hugging Face response',
        )
      }
      return {
        accessToken: token,
        expiresIn:
          typeof data.expires_in === 'number' ? data.expires_in : 28800,
        scope: typeof data.scope === 'string' ? data.scope : '',
        idToken:
          typeof data.id_token === 'string' ? data.id_token : undefined,
        refreshToken:
          typeof data.refresh_token === 'string'
            ? data.refresh_token
            : undefined,
      }
    }

    // Non-200: parse error code from JSON body (RFC 8628 / RFC 6749)
    let errCode: string | undefined
    try {
      const errBody = (await res.json()) as Record<string, unknown>
      errCode = typeof errBody.error === 'string' ? errBody.error : undefined
      if (
        typeof errBody.interval === 'number' &&
        errBody.interval > interval
      ) {
        interval = errBody.interval
      }
    } catch {
      // Body was not JSON; fall through to generic error below.
    }

    if (errCode === 'authorization_pending') {
      await sleep(interval * 1000)
      continue
    }
    if (errCode === 'slow_down') {
      interval += 5
      await sleep(interval * 1000)
      continue
    }
    if (errCode === 'expired_token') {
      throw new HuggingFaceDeviceFlowError(
        'Device code expired. Start the login flow again.',
      )
    }
    if (errCode === 'access_denied') {
      throw new HuggingFaceDeviceFlowError(
        'Authorization was denied or cancelled.',
      )
    }
    const text = await res.text().catch(() => '')
    throw new HuggingFaceDeviceFlowError(
      `Hugging Face OAuth error: ${errCode ?? `HTTP ${res.status}`} ${text}`,
    )
  }

  throw new HuggingFaceDeviceFlowError(
    'Timed out waiting for Hugging Face authorization.',
  )
}

/**
 * Best-effort open browser / OS handler for the verification URL.
 * Mirrors the GitHub flow so behavior is consistent across providers.
 */
export async function openHfVerificationUri(uri: string): Promise<void> {
  try {
    if (process.platform === 'darwin') {
      await execFileNoThrow('open', [uri], {
        useCwd: false,
        timeout: 5000,
      })
    } else if (process.platform === 'win32') {
      await execFileNoThrow('cmd', ['/c', 'start', '', uri], {
        useCwd: false,
        timeout: 5000,
      })
    } else {
      await execFileNoThrow('xdg-open', [uri], {
        useCwd: false,
        timeout: 5000,
      })
    }
  } catch {
    // User can open the URL manually if the OS handler fails.
  }
}
