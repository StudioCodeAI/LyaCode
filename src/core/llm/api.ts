export async function fetchLLMResponse(prompt: string, providerInfo: any, systemPrompt: string): Promise<string> {
  // Se for WebLLM Embedded e não tivermos o motor carregado, voltamos uma msg amigável.
  if (providerInfo.apiKey === 'embedded') {
    return "[WebLLM] O modelo experimental WebGPU está offline nesta versão. Mude para o OpenRouter (Free) via /connect para testar a nuvem.";
  }

  // OpenRouter Fallback
  if (providerInfo.apiKey === '' || !providerInfo.apiKey) {
    // Usar a rota livre do OpenRouter sem apiKey pode falhar dependendo do CORS, 
    // mas o OpenRouter requer pelo menos um referer. Vamos simular se não houver chave para MVP.
    return "Você ativou a LYA, mas a sua chave de API do OpenRouter não foi configurada! Digite /connect para configurar.";
  }

  try {
    const activeModel = providerInfo.activeModel || "google/gemma-2-9b-it:free";
    let endpoint = "https://openrouter.ai/api/v1/chat/completions";
    let headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    // Determine the endpoint and headers based on the provider
    if (providerInfo.baseUrl && (providerInfo.baseUrl.includes('11434') || providerInfo.apiKey === 'local')) {
      // Ollama or LMStudio local
      endpoint = `${providerInfo.baseUrl.replace(/\/$/, '')}/v1/chat/completions`;
      if (providerInfo.apiKey !== 'local') {
        headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
      }
    } else if (activeModel.includes('gemini') || providerInfo.apiKey.startsWith('AIza')) {
      // Google Gemini directly
      endpoint = `https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`;
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
    } else if (providerInfo.apiKey && providerInfo.apiKey.startsWith('gsk_')) {
      // Groq
      endpoint = `https://api.groq.com/openai/v1/chat/completions`;
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
    } else {
      // Default to OpenRouter/OpenAI structure
      headers["Authorization"] = `Bearer ${providerInfo.apiKey}`;
      headers["HTTP-Referer"] = "https://github.com/LuisCard/LyaCode";
      headers["X-Title"] = "LyaCode Studio";
    }

    const payload = {
      model: activeModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    };

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
