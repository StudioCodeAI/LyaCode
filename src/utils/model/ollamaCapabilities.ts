/**
 * Ollama per-model capability detection.
 *
 * Ollama's /api/show returns a `capabilities` array (e.g. ["tools",
 * "thinking", "completion", "vision"]). Models that do NOT list "thinking"
 * reject requests carrying a reasoning/thinking parameter with a 400
 * (`"<model>" does not support thinking`). We probe + cache the capabilities
 * so the request builder can decide whether to emit `reasoning_effort`.
 */

const capabilitiesCache = new Map<string, string[]>()
const inFlight = new Map<string, Promise<string[]>>()

/** Strip a trailing `/v1` (OpenAI-compat suffix) to reach the Ollama API root. */
function toOllamaApiRoot(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, '').replace(/\/v1$/, '')
}

/**
 * Fetch + cache the capabilities of an Ollama model. Returns [] on any
 * failure (server down, model unknown, timeout) so callers degrade safely.
 */
export async function getOllamaCapabilities(
  model: string,
  baseUrl: string | undefined,
): Promise<string[]> {
  if (!model || !baseUrl) return []
  const cacheKey = `${toOllamaApiRoot(baseUrl)}::${model}`
  const cached = capabilitiesCache.get(cacheKey)
  if (cached) return cached
  const pending = inFlight.get(cacheKey)
  if (pending) return pending

  const promise = (async () => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    try {
      const response = await fetch(`${toOllamaApiRoot(baseUrl)}/api/show`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model }),
        signal: controller.signal,
      })
      if (!response.ok) return []
      const data = (await response.json()) as { capabilities?: string[] }
      const caps = Array.isArray(data.capabilities) ? data.capabilities : []
      capabilitiesCache.set(cacheKey, caps)
      return caps
    } catch {
      return []
    } finally {
      clearTimeout(timeout)
      inFlight.delete(cacheKey)
    }
  })()
  inFlight.set(cacheKey, promise)
  return promise
}

/**
 * Whether an Ollama model supports the thinking/reasoning parameter.
 * Defaults to `false` when capabilities can't be determined, so we never send
 * a reasoning request to a model that would reject it.
 */
export async function ollamaModelSupportsThinking(
  model: string,
  baseUrl: string | undefined,
): Promise<boolean> {
  const caps = await getOllamaCapabilities(model, baseUrl)
  return caps.includes('thinking')
}
