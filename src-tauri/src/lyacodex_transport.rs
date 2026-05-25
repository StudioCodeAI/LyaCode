use crate::lyacodex_keychain::resolve_secret;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatMessage {
    pub role: String,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatRequest {
    pub provider: String,
    pub model: String,
    pub base_url: String,
    pub messages: Vec<ChatMessage>,
    pub stream: bool,
    pub key_ref: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ChatResponse {
    pub provider: String,
    pub model: String,
    pub content: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TransportStatus {
    pub provider: String,
    pub base_url: String,
    pub status: String,
    pub message: String,
}

fn chat_completions_url(base_url: &str) -> String {
    format!("{}/chat/completions", base_url.trim_end_matches('/'))
}

#[tauri::command]
pub async fn lyacodex_transport_ping(provider: String, base_url: String) -> Result<TransportStatus, String> {
    let client = reqwest::Client::new();

    let response = client
        .get(&base_url)
        .send()
        .await;

    match response {
        Ok(resp) => Ok(TransportStatus {
            provider,
            base_url,
            status: "online".into(),
            message: format!("Endpoint responded with HTTP {}", resp.status()),
        }),
        Err(err) => Ok(TransportStatus {
            provider,
            base_url,
            status: "offline".into(),
            message: format!("Transport error: {}", err),
        }),
    }
}

#[tauri::command]
pub async fn lyacodex_chat_once(request: ChatRequest) -> Result<ChatResponse, String> {
    let client = reqwest::Client::new();
    let endpoint = chat_completions_url(&request.base_url);

    let payload = json!({
        "model": request.model,
        "messages": request.messages,
        "stream": false
    });

    let mut builder = client
        .post(endpoint)
        .header("Content-Type", "application/json")
        .json(&payload);

    if let Some(key_ref) = request.key_ref.as_deref() {
        let secret = resolve_secret(key_ref)?;

        if !secret.trim().is_empty() && secret != "local" {
            builder = builder.header("Authorization", format!("Bearer {}", secret));
        }
    }

    if request.provider == "openrouter" {
        builder = builder
            .header("HTTP-Referer", "https://github.com/StudioCodeAI/LyaCode")
            .header("X-Title", "LyaCode Studio");
    }

    let response = builder
        .send()
        .await
        .map_err(|e| format!("Transport error: {}", e))?;

    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_else(|_| "<empty error body>".into());
        return Err(format!("Provider returned HTTP {}: {}", status, text));
    }

    let value: serde_json::Value = response
        .json()
        .await
        .map_err(|e| format!("Invalid provider JSON: {}", e))?;

    let content = value
        .get("choices")
        .and_then(|choices| choices.get(0))
        .and_then(|choice| choice.get("message"))
        .and_then(|message| message.get("content"))
        .and_then(|content| content.as_str())
        .unwrap_or("")
        .to_string();

    if content.trim().is_empty() {
        return Err("Provider response did not include choices[0].message.content".into());
    }

    Ok(ChatResponse {
        provider: request.provider,
        model: request.model,
        content,
    })
}

#[tauri::command]
pub fn lyacodex_preview_chat_request() -> Result<ChatRequest, String> {
    Ok(ChatRequest {
        provider: "openrouter".into(),
        model: "openai/gpt-4.1-mini".into(),
        base_url: "https://openrouter.ai/api/v1".into(),
        stream: true,
        key_ref: Some("secret://provider/openrouter/main".into()),
        messages: vec![
            ChatMessage {
                role: "system".into(),
                content: "You are LyaCodex II.".into(),
            },
            ChatMessage {
                role: "user".into(),
                content: "O sopro começou.".into(),
            },
        ],
    })
}
