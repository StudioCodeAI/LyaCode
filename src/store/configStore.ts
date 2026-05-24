import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProviderConfig {
  apiKey: string;
  enabled: boolean;
  activeModel?: string;
}

interface ConfigState {
  providers: Record<string, ProviderConfig>;
  activeProvider: string;
  setApiKey: (provider: string, key: string) => void;
  setActiveModel: (provider: string, model: string) => void;
  setActiveProvider: (provider: string) => void;
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
        'ollama': { apiKey: 'local', enabled: true },
        'lmstudio': { apiKey: 'local', enabled: true },
      },
      activeProvider: 'webllm',
      
      setApiKey: (provider, key) => set((state) => ({
        providers: {
          ...state.providers,
          [provider]: { ...state.providers[provider], apiKey: key, enabled: true }
        }
      })),
      
      setActiveModel: (provider, model) => set((state) => ({
        providers: {
          ...state.providers,
          [provider]: { ...state.providers[provider], activeModel: model }
        }
      })),
      
      setActiveProvider: (provider) => set({ activeProvider: provider }),
    }),
    {
      name: 'lyacode-config-storage', // saves to localStorage securely enough for webview
    }
  )
);
