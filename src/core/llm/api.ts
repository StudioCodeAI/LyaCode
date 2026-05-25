export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function fetchLLMResponse(
  prompt: string,
  providerInfo: any,
  systemPrompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  // WebLLM Embedded — offline nesta versão
  if (providerInfo.apiKey === 'embedded') {
    return "[WebLLM] O modelo experimental WebGPU está offline nesta versão. Mude para o OpenRouter (Free) via /connect para testar a nuvem.";
  }

  // Sem chave configurada
  if (providerInfo.apiKey === '' || !providerInfo.apiKey) {
    return "Você ativou a LYA, mas a sua chave de API do OpenRouter não foi configurada! Digite /connect para configurar.";
  }

  try {
    const activeModel = providerInfo.activeModel || "google/gemma-2-9b-it:free";
    let endpoint = "https://openrouter.ai/api/v1/chat/completions";
    let headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // Determinar endpoint e headers baseado no provider
    if (providerInfo.baseUrl && (providerInfo.baseUrl.includes('11434') || providerInfo.apiKey === 'local')) {
      // Ollama ou LMStudio local
      endpoint = `${providerInfo.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
      if (providerInfo.apiKey !== 'local') {
        headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
      }
    } else if (activeModel.includes('gemini') || providerInfo.apiKey.startsWith('AIza')) {
      // Google Gemini direto
      endpoint = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
    } else if (providerInfo.apiKey && providerInfo.apiKey.startsWith('gsk_')) {
      // Groq
      endpoint = `https://api.groq.com/openai/v1/chat/completions`;
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
    } else {
      // OpenRouter / OpenAI padrão
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
      headers["HTTP-Referer"] = "https://github.com/LuisCard/LyaCode";
      headers["X-Title"] = "LyaCode Studio";
    }

    // Montar histórico completo: system + history + mensagem atual
    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: prompt }
    ];

    const payload = { model: activeModel, messages };

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`API Error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (err: any) {
    throw new Error("Falha na comunicação com a LYA: " + err.message);
  }
}
