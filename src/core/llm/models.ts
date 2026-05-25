export async function fetchProviderModels(providerId: string, apiKey: string, baseUrl?: string): Promise<string[]> {
  try {
    if (providerId === 'ollama') {
      const url = baseUrl || 'http://localhost:11434';
      const res = await fetch(`${url}/api/tags`);
      if (!res.ok) throw new Error('Ollama offline ou URL inválida');
      const data = await res.json();
      return data.models.map((m: any) => m.name);
    } 
    
    if (providerId === 'google') {
      // Gemini can use OpenAI compatible endpoint
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/openai/models`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error('API Key do Google Inválida');
      const data = await res.json();
      return data.data.map((m: any) => m.id);
    }
    
    if (providerId === 'openrouter') {
      const res = await fetch(`https://openrouter.ai/api/v1/models`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error('API Key do OpenRouter Inválida');
      const data = await res.json();
      return data.data.map((m: any) => m.id);
    }

    if (providerId === 'groq') {
      const res = await fetch(`https://api.groq.com/openai/v1/models`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error('API Key do Groq Inválida');
      const data = await res.json();
      return data.data.map((m: any) => m.id);
    }
    
    if (providerId === 'openai') {
      const res = await fetch(`https://api.openai.com/v1/models`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });
      if (!res.ok) throw new Error('API Key da OpenAI Inválida');
      const data = await res.json();
      return data.data.map((m: any) => m.id);
    }
    
    if (providerId === 'lmstudio') {
      const url = baseUrl || 'http://localhost:1234';
      const res = await fetch(`${url}/v1/models`);
      if (!res.ok) throw new Error('LMStudio offline ou URL inválida');
      const data = await res.json();
      return data.data.map((m: any) => m.id);
    }

    // Default Fallback
    return [];
  } catch (err: any) {
    throw new Error(err.message);
  }
}
