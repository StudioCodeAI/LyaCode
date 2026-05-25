import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { invoke } from '@tauri-apps/api/core';

interface ProviderConfig {
  apiKey: string;
  baseUrl?: string; // For Ollama or LMStudio custom endpoints
  enabled: boolean;
  activeModel?: string;
  availableModels?: string[]; // Cached dynamic models
}

interface ConfigState {
  providers: Record<string, ProviderConfig>;
  activeProvider: string;
  setApiKey: (provider: string, key: string) => void;
  setBaseUrl: (provider: string, url: string) => void;
  setActiveModel: (provider: string, model: string) => void;
  setAvailableModels: (provider: string, models: string[]) => void;
  setActiveProvider: (provider: string) => void;
  loadFromVault: () => Promise<void>;
}

async function saveToVault(providers: Record<string, ProviderConfig>) {
  try {
    const keys: Record<string, { api_key: string; base_url?: string }> = {};
    for (const [name, config] of Object.entries(providers)) {
      keys[name] = {
        api_key: config.apiKey,
        base_url: config.baseUrl,
      };
    }
    await invoke('save_vault_keys', { keys });
  } catch (err) {
    console.error('Failed to save to vault:', err);
  }
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      providers: {
        'webllm': { apiKey: 'embedded', enabled: true, activeModel: 'Llama-3-8B-Instruct-q4f32_1-1k' },
        'openrouter': { apiKey: '', enabled: true, activeModel: 'google/gemma-2-9b-it:free' },
        'google': { apiKey: '', enabled: false },
        'openai': { apiKey: '', enabled: false },
        'groq': { apiKey: '', enabled: false },
        'anthropic': { apiKey: '', enabled: false },
        'ollama': { apiKey: 'local', baseUrl: 'http://localhost:11434', enabled: true },
        'lmstudio': { apiKey: 'local', baseUrl: 'http://localhost:1234', enabled: true },
      },
      activeProvider: 'webllm',
      
      setApiKey: (provider, key) => set((state) => {
        const nextProviders = {
          ...state.providers,
          [provider]: { ...state.providers[provider], apiKey: key, enabled: true }
        };
        saveToVault(nextProviders);
        return { providers: nextProviders };
      }),
      
      setBaseUrl: (provider, url) => set((state) => {
        const nextProviders = {
          ...state.providers,
          [provider]: { ...state.providers[provider], baseUrl: url, enabled: true }
        };
        saveToVault(nextProviders);
        return { providers: nextProviders };
      }),

      setActiveModel: (provider, model) => set((state) => ({
        providers: {
          ...state.providers,
          [provider]: { ...state.providers[provider], activeModel: model }
        }
      })),

      setAvailableModels: (provider, models) => set((state) => ({
        providers: {
          ...state.providers,
          [provider]: { ...state.providers[provider], availableModels: models }
        }
      })),
      
      setActiveProvider: (provider) => set({ activeProvider: provider }),

      loadFromVault: async () => {
        try {
          const keys: Record<string, { api_key: string; base_url?: string }> = await invoke('load_vault_keys');
          if (keys && Object.keys(keys).length > 0) {
            set((state) => {
              const updatedProviders = { ...state.providers };
              for (const [name, info] of Object.entries(keys)) {
                if (updatedProviders[name]) {
                  updatedProviders[name] = {
                    ...updatedProviders[name],
                    apiKey: info.api_key,
                    baseUrl: info.base_url,
                    enabled: info.api_key !== ''
                  };
                } else {
                  updatedProviders[name] = {
                    apiKey: info.api_key,
                    baseUrl: info.base_url,
                    enabled: info.api_key !== ''
                  };
                }
              }
              return { providers: updatedProviders };
            });
          }
        } catch (err) {
          console.error('Failed to load from vault:', err);
        }
      },
    }),
    {
      name: 'lyacode-config-storage', // saves to localStorage securely enough for webview
    }
  )
);
