use crate::lyacodex_keychain::resolve_secret;
use serde::{Deserialize, Serialize};
use serde_json::json;
use std::time::Duration;

const TRANSPORT_TIMEOUT_SECS: u64 = 60;

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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TransportRunState {
    pub state: String,
    pub message: String,
}

fn http_client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(TRANSPORT_TIMEOUT_SECS))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))
}

fn chat_completions_url(base_url: &str) -> String {
    format!("{}/chat/completions", base_url.trim_end_matches('/'))
}

fn sanitized_provider_error(status: reqwest::StatusCode) -> String {
    match status.as_u16() {
        401 | 403 => "Provider rejected the request. Check your keyRef, provider account or permissions.".into(),
        404 => "Provider endpoint or model was not found. Check base URL and model name.".into(),
        408 | 429 => "Provider is busy or rate limited. Try again later or switch model/provider.".into(),
        500..=599 => "Provider returned a server error. Try again later or switch provider.".into(),
        code => format!("Provider returned HTTP {}.", code),
    }
}

#[tauri::command]
pub async fn lyacodex_transport_ping(provider: String, base_url: String) -> Result<TransportStatus, String> {
    let client = http_client()?;

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
pub fn lyacodex_transport_states() -> Result<Vec<TransportRunState>, String> {
    Ok(vec![
        TransportRunState { state: "started".into(), message: "Request accepted by LyaCodex transport.".into() },
        TransportRunState { state: "running".into(), message: "Provider request is in progress.".into() },
        TransportRunState { state: "done".into(), message: "Provider returned a valid response.".into() },
        TransportRunState { state: "error".into(), message: "Provider or transport failed safely.".into() },
    ])
}

#[tauri::command]
pub async fn lyacodex_chat_once(request: ChatRequest) -> Result<ChatResponse, String> {
    let client = http_client()?;
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
        return Err(sanitized_provider_error(response.status()));
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
        return Err("Provider response did not include a usable message.".into());
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
