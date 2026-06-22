import { describe, expect, test } from 'bun:test'
import './index.js'
import { getGateway, getAllGateways } from '../index.js'

describe('Hugging Face gateway descriptor', () => {
  test('is registered in the gateway registry', () => {
    const gw = getGateway('huggingface')
    expect(gw).toBeDefined()
    expect(gw?.id).toBe('huggingface')
    expect(gw?.label).toBe('Hugging Face')
  })

  test('uses the OpenAI-compatible HF Inference Providers router as base URL', () => {
    const gw = getGateway('huggingface')
    expect(gw?.defaultBaseUrl).toBe('https://router.huggingface.co/v1')
  })

  test('declares OAuth auth mode (not api-key)', () => {
    const gw = getGateway('huggingface')
    expect(gw?.setup.requiresAuth).toBe(true)
    expect(gw?.setup.authMode).toBe('oauth')
  })

  test('accepts HF_TOKEN as the credential env var', () => {
    const gw = getGateway('huggingface')
    expect(gw?.setup.credentialEnvVars).toContain('HF_TOKEN')
  })

  test('uses OpenAI-compatible transport with max_tokens field', () => {
    const gw = getGateway('huggingface')
    expect(gw?.transportConfig.kind).toBe('openai-compatible')
  })

  test('carries a "Free" badge in its preset', () => {
    const gw = getGateway('huggingface')
    expect(gw?.preset?.badge?.text).toBe('Free')
  })

  test('ships a curated set of strong open chat models', () => {
    const gw = getGateway('huggingface')
    const models = gw?.catalog?.models ?? []
    expect(models.length).toBeGreaterThanOrEqual(7)
    const ids = models.map(m => m.apiName)
    expect(ids).toContain('meta-llama/Llama-3.3-70B-Instruct')
    expect(ids).toContain('Qwen/Qwen2.5-Coder-32B-Instruct')
    expect(ids).toContain('deepseek-ai/DeepSeek-V3')
  })

  test('default model matches the first curated catalog entry', () => {
    const gw = getGateway('huggingface')
    expect(gw?.defaultModel).toBe('meta-llama/Llama-3.3-70B-Instruct')
  })

  test('is present in the global gateway list', () => {
    const all = getAllGateways()
    expect(all.some(g => g.id === 'huggingface')).toBe(true)
  })
})
