/**
 * Unit tests for ollamaCapabilities — per-model thinking detection that keeps
 * LyaCode from sending `reasoning_effort` to Ollama models that reject it
 * (400 `"<model>" does not support thinking`).
 */
import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import {
  getOllamaCapabilities,
  ollamaModelSupportsThinking,
} from './ollamaCapabilities.js'

type FetchType = typeof globalThis.fetch
let originalFetch: FetchType

function mockShow(capabilities: string[] | undefined, ok = true): { calls: string[] } {
  const calls: string[] = []
  globalThis.fetch = (async (url: string | URL | Request) => {
    calls.push(String(url))
    return {
      ok,
      json: async () => ({ capabilities }),
    } as Response
  }) as FetchType
  return { calls }
}

beforeEach(() => {
  originalFetch = globalThis.fetch
})
afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('ollamaModelSupportsThinking', () => {
  test('true when model advertises the thinking capability', async () => {
    mockShow(['tools', 'thinking', 'completion'])
    expect(
      await ollamaModelSupportsThinking('deepseek-r1:14b', 'http://localhost:11434/v1'),
    ).toBe(true)
  })

  test('false when model lacks thinking (e.g. gemma)', async () => {
    mockShow(['tools', 'completion', 'vision'])
    expect(
      await ollamaModelSupportsThinking('gemma-no-think:latest', 'http://localhost:11434'),
    ).toBe(false)
  })

  test('false (safe default) when the probe fails', async () => {
    mockShow(undefined, false)
    expect(
      await ollamaModelSupportsThinking('whatever-fail:latest', 'http://localhost:11434'),
    ).toBe(false)
  })

  test('returns false without a model or baseUrl', async () => {
    expect(await ollamaModelSupportsThinking('', 'http://localhost:11434')).toBe(false)
    expect(await ollamaModelSupportsThinking('x', undefined)).toBe(false)
  })
})

describe('getOllamaCapabilities', () => {
  test('hits /api/show at the API root, stripping a /v1 suffix', async () => {
    const { calls } = mockShow(['thinking'])
    await getOllamaCapabilities('probe-url:latest', 'http://localhost:11434/v1')
    expect(calls[0]).toBe('http://localhost:11434/api/show')
  })

  test('caches the result — second call does not refetch', async () => {
    const { calls } = mockShow(['thinking'])
    await getOllamaCapabilities('cache-me:latest', 'http://localhost:11434')
    await getOllamaCapabilities('cache-me:latest', 'http://localhost:11434')
    expect(calls.length).toBe(1)
  })
})
