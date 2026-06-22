import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import {
  acquireSharedMutationLock,
  releaseSharedMutationLock,
} from '../test/sharedMutationLock.js'

type HfCredentialsModule = typeof import('./huggingfaceCredentials.js')

function importFresh(cacheKey: string): Promise<HfCredentialsModule> {
  return import(
    `./huggingfaceCredentials.js?${cacheKey}`
  ) as Promise<HfCredentialsModule>
}

const orig = {
  HF_TOKEN: process.env.HF_TOKEN,
  CLAUDE_CODE_USE_HUGGINGFACE: process.env.CLAUDE_CODE_USE_HUGGINGFACE,
}

beforeEach(async () => {
  await acquireSharedMutationLock('utils/huggingfaceCredentials.test.ts')
})

afterEach(() => {
  try {
    mock.restore()
    for (const [k, v] of Object.entries(orig)) {
      if (v === undefined) {
        delete process.env[k as keyof typeof orig]
      } else {
        process.env[k as keyof typeof orig] = v
      }
    }
  } finally {
    releaseSharedMutationLock()
  }
})

describe('Hugging Face credentials', () => {
  describe('saveHuggingFaceToken / readHuggingFaceToken', () => {
    test('round-trips an access token through secure storage', async () => {
      let stored: Record<string, unknown> = {}
      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => stored,
          readAsync: async () => stored,
          update: (data: Record<string, unknown>) => {
            stored = data
            return { success: true }
          },
        }),
      }))

      const { saveHuggingFaceToken, readHuggingFaceToken } =
        await importFresh('round-trip')
      const result = saveHuggingFaceToken('hf_test_123')
      expect(result.success).toBe(true)
      expect(readHuggingFaceToken()).toBe('hf_test_123')
    })

    test('persists optional fields (scope, expiresAtMs, refreshToken)', async () => {
      let stored: Record<string, unknown> = {}
      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => stored,
          readAsync: async () => stored,
          update: (data: Record<string, unknown>) => {
            stored = data
            return { success: true }
          },
        }),
      }))

      const { saveHuggingFaceToken, HUGGINGFACE_STORAGE_KEY } =
        await importFresh('optional-fields')
      saveHuggingFaceToken('hf_tok', {
        scope: 'openid inference-api',
        expiresAtMs: Date.now() + 7200_000,
        refreshToken: 'hf_refresh',
      })
      const blob = stored[HUGGINGFACE_STORAGE_KEY] as {
        accessToken: string
        scope?: string
        expiresAtMs?: number
        refreshToken?: string
      }
      expect(blob.accessToken).toBe('hf_tok')
      expect(blob.scope).toBe('openid inference-api')
      expect(blob.refreshToken).toBe('hf_refresh')
    })

    test('rejects an empty token', async () => {
      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => ({}),
          readAsync: async () => ({}),
          update: () => ({ success: true }),
        }),
      }))

      const { saveHuggingFaceToken } = await importFresh('empty')
      const result = saveHuggingFaceToken('   ')
      expect(result.success).toBe(false)
      expect(result.warning).toContain('empty')
    })
  })

  describe('clearHuggingFaceToken', () => {
    test('removes the blob from secure storage', async () => {
      let stored: Record<string, unknown> = {
        huggingface: { accessToken: 'hf_temp' },
      }
      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => stored,
          readAsync: async () => stored,
          update: (data: Record<string, unknown>) => {
            stored = data
            return { success: true }
          },
        }),
      }))

      const { clearHuggingFaceToken, readHuggingFaceToken } =
        await importFresh('clear')
      expect(readHuggingFaceToken()).toBe('hf_temp')
      const result = clearHuggingFaceToken()
      expect(result.success).toBe(true)
      expect(readHuggingFaceToken()).toBeUndefined()
    })
  })

  describe('hydrateHuggingFaceTokenFromSecureStorage', () => {
    test('copies stored token into HF_TOKEN when mode is active', async () => {
      process.env.CLAUDE_CODE_USE_HUGGINGFACE = '1'
      delete process.env.HF_TOKEN

      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => ({
            huggingface: { accessToken: 'hf_hydrate_me' },
          }),
          readAsync: async () => ({
            huggingface: { accessToken: 'hf_hydrate_me' },
          }),
        }),
      }))

      const { hydrateHuggingFaceTokenFromSecureStorage } =
        await importFresh('hydrate=sets-token')
      hydrateHuggingFaceTokenFromSecureStorage()
      expect(process.env.HF_TOKEN as string | undefined).toBe('hf_hydrate_me')
    })

    test('does nothing when CLAUDE_CODE_USE_HUGGINGFACE is not set', async () => {
      delete process.env.CLAUDE_CODE_USE_HUGGINGFACE
      delete process.env.HF_TOKEN

      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => ({
            huggingface: { accessToken: 'hf_no_mode' },
          }),
          readAsync: async () => ({
            huggingface: { accessToken: 'hf_no_mode' },
          }),
        }),
      }))

      const { hydrateHuggingFaceTokenFromSecureStorage } =
        await importFresh('hydrate=no-mode')
      hydrateHuggingFaceTokenFromSecureStorage()
      expect(process.env.HF_TOKEN).toBeUndefined()
    })

    test('does not overwrite an existing HF_TOKEN from the environment', async () => {
      process.env.CLAUDE_CODE_USE_HUGGINGFACE = '1'
      process.env.HF_TOKEN = 'hf_from_env'

      mock.module('./secureStorage/index.js', () => ({
        getSecureStorage: () => ({
          read: () => ({
            huggingface: { accessToken: 'hf_from_storage' },
          }),
          readAsync: async () => ({
            huggingface: { accessToken: 'hf_from_storage' },
          }),
        }),
      }))

      const { hydrateHuggingFaceTokenFromSecureStorage } =
        await importFresh('hydrate=env-wins')
      hydrateHuggingFaceTokenFromSecureStorage()
      expect(process.env.HF_TOKEN).toBe('hf_from_env')
    })
  })
})
