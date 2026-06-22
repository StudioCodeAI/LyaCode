import { defineGateway } from '../define.js'

/**
 * Hugging Face gateway.
 *
 * Auth: OAuth 2.0 device flow (public OAuth app, no client secret).
 *       The end user logs into their own Hugging Face account and authorizes
 *       the "Lya Code CLI" OAuth app. Their access token is stored in the
 *       shared Lya Code secure storage blob and hydrated into `HF_TOKEN`.
 *
 * Endpoint: Hugging Face Inference Providers router at
 *           https://router.huggingface.co/v1 — OpenAI-compatible.
 *
 * Quota: Each user draws from their own HF account free tier (~1k req/day
 *        for free accounts). Paid models can be enabled by the user in their
 *        HF billing settings; Lya Code never sees the user's billing info.
 *
 * Models: discovery is hybrid. We ship a curated subset of strong
 *         OpenAI-compatible chat models from the HF router and let the
 *         runtime list additional models via the OpenAI-compatible /models
 *         endpoint when a token is available.
 *
 * @see src/services/huggingface/deviceFlow.ts   — device flow implementation
 * @see src/utils/huggingfaceCredentials.ts      — secure storage hydration
 * @see src/commands/onboard-huggingface/        — interactive onboarding
 */
export default defineGateway({
  id: 'huggingface',
  label: 'Hugging Face',
  vendorId: 'openai',
  category: 'aggregating',
  defaultBaseUrl: 'https://router.huggingface.co/v1',
  defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
  supportsModelRouting: true,
  setup: {
    requiresAuth: true,
    authMode: 'oauth',
    credentialEnvVars: ['HF_TOKEN'],
  },
  transportConfig: {
    kind: 'openai-compatible',
    openaiShim: {
      supportsAuthHeaders: true,
      // HF router follows OpenAI shape: max_tokens, not max_completion_tokens.
      maxTokensField: 'max_tokens',
    },
  },
  validation: {
    kind: 'credential-env',
    credentialEnvVars: ['HF_TOKEN'],
    routing: {
      enablementEnvVar: 'CLAUDE_CODE_USE_HUGGINGFACE',
      skipWhenUseOpenAI: true,
    },
    missingCredentialMessage:
      'Hugging Face authentication required.\nRun /onboard-huggingface in the CLI to sign in with your Hugging Face account.\nThis will store your OAuth token securely and enable the HF Inference Providers router.',
  },
  preset: {
    id: 'huggingface',
    description: 'Hugging Face Inference Providers router (OpenAI-compatible)',
    apiKeyEnvVars: ['HF_TOKEN'],
    vendorId: 'openai',
    badge: {
      text: 'Free',
      color: 'success',
    },
  },
  catalog: {
    source: 'hybrid',
    discovery: {
      kind: 'openai-compatible',
      mapModel(raw: unknown) {
        const model = raw as {
          id?: string
          context_length?: number
          max_completion_tokens?: number
          max_total_tokens?: number
        }
        if (!model.id) return null
        // Skip non-chat artifacts surfaced by the router (embeddings, audio,
        // image, vision-only). Users can still call them by hand if needed.
        if (
          /(embed|whisper|tts|stable-diffusion|flux|image-classification)/i.test(
            model.id,
          )
        ) {
          return null
        }
        const contextWindow =
          model.context_length ??
          model.max_total_tokens ??
          undefined
        return {
          id: model.id,
          apiName: model.id,
          label: model.id,
          ...(contextWindow ? { contextWindow } : {}),
        }
      },
    },
    discoveryCacheTtl: '1d',
    discoveryRefreshMode: 'background-if-stale',
    allowManualRefresh: true,
    models: [
      {
        id: 'hf-llama-3.3-70b',
        apiName: 'meta-llama/Llama-3.3-70B-Instruct',
        label: 'Llama 3.3 70B Instruct (HF)',
        contextWindow: 131_072,
        maxOutputTokens: 8_192,
      },
      {
        id: 'hf-qwen2.5-coder-32b',
        apiName: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        label: 'Qwen2.5 Coder 32B (HF)',
        contextWindow: 131_072,
        maxOutputTokens: 8_192,
      },
      {
        id: 'hf-qwen2.5-72b',
        apiName: 'Qwen/Qwen2.5-72B-Instruct',
        label: 'Qwen2.5 72B Instruct (HF)',
        contextWindow: 131_072,
        maxOutputTokens: 8_192,
      },
      {
        id: 'hf-deepseek-v3',
        apiName: 'deepseek-ai/DeepSeek-V3',
        label: 'DeepSeek V3 (HF)',
        contextWindow: 65_536,
        maxOutputTokens: 8_192,
      },
      {
        id: 'hf-mistral-small-3',
        apiName: 'mistralai/Mistral-Small-3.1-24B-Instruct-2503',
        label: 'Mistral Small 3.1 24B (HF)',
        contextWindow: 128_000,
        maxOutputTokens: 8_192,
      },
      {
        id: 'hf-phi-4',
        apiName: 'microsoft/Phi-4',
        label: 'Phi-4 (HF)',
        contextWindow: 16_384,
        maxOutputTokens: 4_096,
      },
      {
        id: 'hf-llama-3.1-8b',
        apiName: 'meta-llama/Llama-3.1-8B-Instruct',
        label: 'Llama 3.1 8B Instruct (HF)',
        contextWindow: 131_072,
        maxOutputTokens: 4_096,
      },
    ],
  },
  usage: { supported: false },
})
