import { describe, expect, test, mock } from 'bun:test'

// `hasExistingHuggingFaceLoginToken` reads from both env and secure
// storage; mock the storage reader so the test stays hermetic and does
// not depend on whether the host machine has a stored HF token.
mock.module('../../utils/huggingfaceCredentials.js', () => ({
  readHuggingFaceToken: () => undefined,
  hydrateHuggingFaceTokenFromSecureStorage: () => {},
  computeHfExpiryMs: (s: number) => Date.now() + s * 1000,
  saveHuggingFaceToken: () => ({ success: true }),
}))

const {
  shouldForceHfRelogin,
  hasExistingHuggingFaceLoginToken,
  applyHfOnboardingProcessEnv,
  activateHfOnboardingMode,
} = await import('./onboard-huggingface.js')

describe('onboard-huggingface helpers', () => {
  describe('shouldForceHfRelogin', () => {
    test('returns false for empty args', () => {
      expect(shouldForceHfRelogin('')).toBe(false)
      expect(shouldForceHfRelogin(undefined)).toBe(false)
    })

    test('returns true for --force', () => {
      expect(shouldForceHfRelogin('--force')).toBe(true)
      expect(shouldForceHfRelogin('force')).toBe(true)
    })

    test('returns true for relogin / reauth variants', () => {
      expect(shouldForceHfRelogin('relogin')).toBe(true)
      expect(shouldForceHfRelogin('--reauth')).toBe(true)
    })

    test('returns false for unknown args', () => {
      expect(shouldForceHfRelogin('model')).toBe(false)
    })
  })

  describe('hasExistingHuggingFaceLoginToken', () => {
    test('returns true when HF_TOKEN is in env', () => {
      const prev = process.env.HF_TOKEN
      process.env.HF_TOKEN = 'hf_existing'
      try {
        expect(hasExistingHuggingFaceLoginToken()).toBe(true)
      } finally {
        if (prev) process.env.HF_TOKEN = prev
        else delete process.env.HF_TOKEN
      }
    })

    test('returns false when no token in env or storage', () => {
      const prev = process.env.HF_TOKEN
      delete process.env.HF_TOKEN
      try {
        expect(hasExistingHuggingFaceLoginToken()).toBe(false)
      } finally {
        if (prev) process.env.HF_TOKEN = prev
      }
    })
  })

  describe('applyHfOnboardingProcessEnv', () => {
    test('sets CLAUDE_CODE_USE_HUGGINGFACE and OpenAI-compatible env', () => {
      const env: Record<string, string | undefined> = {}
      applyHfOnboardingProcessEnv('meta-llama/Llama-3.3-70B-Instruct', env)
      expect(env.CLAUDE_CODE_USE_HUGGINGFACE).toBe('1')
      expect(env.OPENAI_BASE_URL).toBe('https://router.huggingface.co/v1')
      expect(env.OPENAI_MODEL).toBe('meta-llama/Llama-3.3-70B-Instruct')
    })

    test('clears conflicting provider env vars', () => {
      const env: Record<string, string | undefined> = {
        CLAUDE_CODE_USE_GITHUB: '1',
        GITHUB_TOKEN: 'ghp_123',
        OPENAI_API_KEY: 'sk-xxx',
        CLAUDE_CODE_USE_OPENAI: '1',
      }
      applyHfOnboardingProcessEnv('test-model', env)
      expect(env.CLAUDE_CODE_USE_GITHUB).toBeUndefined()
      expect(env.GITHUB_TOKEN).toBeUndefined()
      expect(env.OPENAI_API_KEY).toBeUndefined()
      expect(env.CLAUDE_CODE_USE_OPENAI).toBeUndefined()
    })
  })

  describe('activateHfOnboardingMode', () => {
    test('applies env and calls hydrate + onChangeAPIKey', () => {
      let hydrated = false
      let apiKeyChanged = false
      const result = activateHfOnboardingMode('test-model', {
        mergeSettingsEnv: () => ({ ok: true }),
        applyProcessEnv: (model: string) => {
          applyHfOnboardingProcessEnv(model)
        },
        hydrateToken: () => {
          hydrated = true
        },
        onChangeAPIKey: () => {
          apiKeyChanged = true
        },
      })
      expect(result.ok).toBe(true)
      expect(process.env.CLAUDE_CODE_USE_HUGGINGFACE).toBe('1')
      expect(hydrated).toBe(true)
      expect(apiKeyChanged).toBe(true)
    })

    test('returns detail when mergeSettingsEnv fails', () => {
      const result = activateHfOnboardingMode('test-model', {
        mergeSettingsEnv: () => ({ ok: false, detail: 'disk full' }),
        applyProcessEnv: () => {},
        hydrateToken: () => {},
      })
      expect(result.ok).toBe(false)
      expect(result.detail).toBe('disk full')
    })
  })
})
