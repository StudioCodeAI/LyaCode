import { isBareMode, isEnvTruthy } from './envUtils.js'
import { getSecureStorage } from './secureStorage/index.js'

/** JSON key in the shared Lya Code secure storage blob. */
export const HUGGINGFACE_STORAGE_KEY = 'huggingface' as const
export const HUGGINGFACE_HYDRATED_ENV_MARKER =
  'LYACODE_HF_TOKEN_HYDRATED' as const

export type HuggingFaceCredentialBlob = {
  accessToken: string
  refreshToken?: string
  /** Unix epoch (ms) when the token expires. 0 = unknown / never. */
  expiresAtMs?: number
  scope?: string
}

/**
 * Hugging Face access tokens are OAuth bearer strings (not JWTs like Copilot).
 * We rely on the `expires_in` from the token response to compute expiry.
 * HF default lifetime is 8 hours for device flow tokens.
 */
export function computeHfExpiryMs(expiresInSeconds: number): number {
  return Date.now() + expiresInSeconds * 1000
}

export function readHuggingFaceCredentialBlob():
  | HuggingFaceCredentialBlob
  | undefined {
  if (isBareMode()) return undefined
  try {
    const data = getSecureStorage().read() as
      | ({ huggingface?: HuggingFaceCredentialBlob } & Record<
          string,
          unknown
        >)
      | null
    const blob = data?.huggingface
    const accessToken = blob?.accessToken?.trim()
    if (!accessToken) return undefined
    return {
      accessToken,
      refreshToken: blob?.refreshToken?.trim() || undefined,
      expiresAtMs:
        typeof blob?.expiresAtMs === 'number' ? blob.expiresAtMs : undefined,
      scope: blob?.scope?.trim() || undefined,
    }
  } catch {
    return undefined
  }
}

export function readHuggingFaceToken(): string | undefined {
  return readHuggingFaceCredentialBlob()?.accessToken
}

export async function readHuggingFaceTokenAsync(): Promise<string | undefined> {
  if (isBareMode()) return undefined
  try {
    const data = (await getSecureStorage().readAsync()) as
      | ({ huggingface?: HuggingFaceCredentialBlob } & Record<
          string,
          unknown
        >)
      | null
    const t = data?.huggingface?.accessToken?.trim()
    return t || undefined
  } catch {
    return undefined
  }
}

/**
 * If Hugging Face mode is on and no token is in the environment, copy the
 * stored token into process.env.HF_TOKEN so the OpenAI shim and provider
 * validation pick it up. Mirrors the GitHub hydrate pattern.
 */
export function hydrateHuggingFaceTokenFromSecureStorage(): void {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_USE_HUGGINGFACE)) {
    delete process.env[HUGGINGFACE_HYDRATED_ENV_MARKER]
    return
  }
  if (process.env.HF_TOKEN?.trim()) {
    delete process.env[HUGGINGFACE_HYDRATED_ENV_MARKER]
    return
  }
  if (isBareMode()) {
    delete process.env[HUGGINGFACE_HYDRATED_ENV_MARKER]
    return
  }
  const stored = readHuggingFaceCredentialBlob()
  if (stored?.accessToken) {
    process.env.HF_TOKEN = stored.accessToken
    process.env[HUGGINGFACE_HYDRATED_ENV_MARKER] = '1'
    return
  }
  delete process.env[HUGGINGFACE_HYDRATED_ENV_MARKER]
}

/**
 * Startup auto-refresh for Hugging Face mode.
 *
 * HF device-flow tokens do NOT currently expose a usable refresh_token grant
 * for public apps in the same way GitHub Copilot does, so this function only
 * re-hydrates the stored token into the environment when it is still valid.
 * When it has expired, the caller must prompt the user to re-run
 * /onboard-huggingface.
 */
export async function refreshHuggingFaceTokenIfNeeded(): Promise<boolean> {
  if (!isEnvTruthy(process.env.CLAUDE_CODE_USE_HUGGINGFACE)) {
    return false
  }
  if (isBareMode()) {
    return false
  }
  if (process.env.HF_TOKEN?.trim()) {
    return false
  }
  const stored = readHuggingFaceCredentialBlob()
  if (!stored?.accessToken) {
    return false
  }
  if (stored.expiresAtMs && Date.now() >= stored.expiresAtMs) {
    // Token is expired — caller must re-onboard. Do not hydrate a stale token.
    return false
  }
  process.env.HF_TOKEN = stored.accessToken
  process.env[HUGGINGFACE_HYDRATED_ENV_MARKER] = '1'
  return true
}

export function saveHuggingFaceToken(
  accessToken: string,
  options?: {
    refreshToken?: string
    expiresAtMs?: number
    scope?: string
  },
): {
  success: boolean
  warning?: string
} {
  if (isBareMode()) {
    return { success: false, warning: 'Bare mode: secure storage is disabled.' }
  }
  const trimmed = accessToken.trim()
  if (!trimmed) {
    return { success: false, warning: 'Token is empty.' }
  }
  const secureStorage = getSecureStorage()
  const prev = secureStorage.read() || {}
  const mergedBlob: HuggingFaceCredentialBlob = {
    accessToken: trimmed,
  }
  const refreshToken = options?.refreshToken?.trim()
  if (refreshToken) {
    mergedBlob.refreshToken = refreshToken
  }
  if (typeof options?.expiresAtMs === 'number' && options.expiresAtMs > 0) {
    mergedBlob.expiresAtMs = options.expiresAtMs
  }
  if (options?.scope?.trim()) {
    mergedBlob.scope = options.scope.trim()
  }
  const merged = {
    ...(prev as Record<string, unknown>),
    [HUGGINGFACE_STORAGE_KEY]: mergedBlob,
  }
  return secureStorage.update(merged as typeof prev)
}

export function clearHuggingFaceToken(): {
  success: boolean
  warning?: string
} {
  if (isBareMode()) {
    return { success: true }
  }
  const secureStorage = getSecureStorage()
  const prev = secureStorage.read() || {}
  const next = { ...(prev as Record<string, unknown>) }
  delete next[HUGGINGFACE_STORAGE_KEY]
  return secureStorage.update(next as typeof prev)
}
