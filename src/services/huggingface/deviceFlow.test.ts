import { describe, expect, test, mock } from 'bun:test'
import {
  HuggingFaceDeviceFlowError,
  DEFAULT_HF_DEVICE_FLOW_CLIENT_ID,
  DEFAULT_HF_DEVICE_SCOPE,
  HF_DEVICE_CODE_URL,
  HF_DEVICE_ACCESS_TOKEN_URL,
  getHfDeviceFlowClientId,
  requestHfDeviceCode,
  pollHfAccessToken,
} from './deviceFlow.js'

describe('Hugging Face device flow', () => {
  describe('constants', () => {
    test('uses the registered Studio CodeAI OAuth app client id', () => {
      expect(DEFAULT_HF_DEVICE_FLOW_CLIENT_ID).toBe(
        'c67a43aa-b9a4-4869-bd40-f97a14e6a670',
      )
    })

    test('requests openid, profile, and inference-api scopes', () => {
      expect(DEFAULT_HF_DEVICE_SCOPE).toContain('openid')
      expect(DEFAULT_HF_DEVICE_SCOPE).toContain('profile')
      expect(DEFAULT_HF_DEVICE_SCOPE).toContain('inference-api')
    })

    test('targets the Hugging Face OAuth endpoints', () => {
      expect(HF_DEVICE_CODE_URL).toBe('https://huggingface.co/oauth/device')
      expect(HF_DEVICE_ACCESS_TOKEN_URL).toBe(
        'https://huggingface.co/oauth/token',
      )
    })
  })

  describe('getHfDeviceFlowClientId', () => {
    test('returns the default client id when env is unset', () => {
      const prev = process.env.HF_DEVICE_FLOW_CLIENT_ID
      delete process.env.HF_DEVICE_FLOW_CLIENT_ID
      try {
        expect(getHfDeviceFlowClientId()).toBe(DEFAULT_HF_DEVICE_FLOW_CLIENT_ID)
      } finally {
        if (prev) process.env.HF_DEVICE_FLOW_CLIENT_ID = prev
      }
    })

    test('honors HF_DEVICE_FLOW_CLIENT_ID override', () => {
      const prev = process.env.HF_DEVICE_FLOW_CLIENT_ID
      process.env.HF_DEVICE_FLOW_CLIENT_ID = 'test-client-id'
      try {
        expect(getHfDeviceFlowClientId()).toBe('test-client-id')
      } finally {
        if (prev) process.env.HF_DEVICE_FLOW_CLIENT_ID = prev
        else delete process.env.HF_DEVICE_FLOW_CLIENT_ID
      }
    })
  })

  describe('requestHfDeviceCode', () => {
    test('returns device code fields on a successful response', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              device_code: 'dc_123',
              user_code: 'ABCD1234',
              verification_uri: 'https://huggingface.co/oauth/device/verify',
              expires_in: 600,
              interval: 3,
            }),
            { status: 200, headers: { 'content-type': 'application/json' } },
          ),
        ),
      ) as unknown as typeof fetch

      const result = await requestHfDeviceCode({
        clientId: 'test-client',
        fetchImpl: fetchMock,
      })

      expect(result.device_code).toBe('dc_123')
      expect(result.user_code).toBe('ABCD1234')
      expect(result.verification_uri).toBe(
        'https://huggingface.co/oauth/device/verify',
      )
      expect(result.expires_in).toBe(600)
      expect(result.interval).toBe(3)
    })

    test('throws HuggingFaceDeviceFlowError on HTTP error', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response('invalid_client', { status: 400 }),
        ),
      ) as unknown as typeof fetch

      await expect(
        requestHfDeviceCode({
          clientId: 'bad-client',
          fetchImpl: fetchMock,
        }),
      ).rejects.toThrow(HuggingFaceDeviceFlowError)
    })

    test('throws on malformed response missing device_code', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(JSON.stringify({ user_code: 'X' }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          }),
        ),
      ) as unknown as typeof fetch

      await expect(
        requestHfDeviceCode({
          clientId: 'test-client',
          fetchImpl: fetchMock,
        }),
      ).rejects.toThrow('Malformed device code response')
    })
  })

  describe('pollHfAccessToken', () => {
    test('returns access token on immediate success', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              access_token: 'hf_test_token_123',
              expires_in: 28800,
              scope: 'openid profile inference-api',
            }),
            { status: 200, headers: { 'content-type': 'application/json' } },
          ),
        ),
      ) as unknown as typeof fetch

      const result = await pollHfAccessToken('dc_123', {
        clientId: 'test-client',
        fetchImpl: fetchMock,
      })

      expect(result.accessToken).toBe('hf_test_token_123')
      expect(result.expiresIn).toBe(28800)
      expect(result.scope).toContain('inference-api')
    })

    test('throws on access_denied', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ error: 'access_denied' }),
            { status: 400, headers: { 'content-type': 'application/json' } },
          ),
        ),
      ) as unknown as typeof fetch

      await expect(
        pollHfAccessToken('dc_123', {
          clientId: 'test-client',
          fetchImpl: fetchMock,
        }),
      ).rejects.toThrow('denied')
    })

    test('throws on expired_token', async () => {
      const fetchMock = mock(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ error: 'expired_token' }),
            { status: 400, headers: { 'content-type': 'application/json' } },
          ),
        ),
      ) as unknown as typeof fetch

      await expect(
        pollHfAccessToken('dc_123', {
          clientId: 'test-client',
          fetchImpl: fetchMock,
        }),
      ).rejects.toThrow('expired')
    })
  })
})
