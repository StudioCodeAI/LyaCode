use crate::lyacodex_keychain::resolve_secret;
use futures_util::StreamExt;
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
pub struct StreamChunk {
    pub event_type: String,
    pub content: Option<String>,
    pub message: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StreamResponse {
    pub provider: String,
    pub model: String,
    pub chunks: Vec<StreamChunk>,
    pub full_content: String,
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

fn extract_openai_stream_delta(data: &str) -> Option<String> {
    let value: serde_json::Value = serde_json::from_str(data).ok()?;

    value
        .get("choices")
        .and_then(|choices| choices.get(0))
        .and_then(|choice| choice.get("delta"))
        .and_then(|delta| delta.get("content"))
        .and_then(|content| content.as_str())
        .map(|s| s.to_string())
}

fn apply_auth_headers(mut builder: reqwest::RequestBuilder, request: &ChatRequest) -> Result<reqwest::RequestBuilder, String> {
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

    Ok(builder)
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
        TransportRunState { state: "streaming".into(), message: "Provider is streaming tokens.".into() },
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

    let builder = client
        .post(endpoint)
        .header("Content-Type", "application/json")
        .json(&payload);

    let builder = apply_auth_headers(builder, &request)?;

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
pub async fn lyacodex_chat_stream_collect(request: ChatRequest) -> Result<StreamResponse, String> {
    let client = http_client()?;
    let endpoint = chat_completions_url(&request.base_url);

    let payload = json!({
        "model": request.model,
        "messages": request.messages,
        "stream": true
    });

    let builder = client
        .post(endpoint)
        .header("Content-Type", "application/json")
        .header("Accept", "text/event-stream")
        .json(&payload);

    let builder = apply_auth_headers(builder, &request)?;

    let response = builder
        .send()
        .await
        .map_err(|e| format!("Transport error: {}", e))?;

    if !response.status().is_success() {
        return Err(sanitized_provider_error(response.status()));
    }

    let mut chunks = vec![StreamChunk {
        event_type: "stream.start".into(),
        content: None,
        message: Some("LyaCodex stream started.".into()),
    }];
    let mut full_content = String::new();
    let mut stream = response.bytes_stream();

    while let Some(item) = stream.next().await {
        let bytes = item.map_err(|e| format!("Stream transport error: {}", e))?;
        let text = String::from_utf8_lossy(&bytes);

        for line in text.lines() {
            let line = line.trim();
            if !line.starts_with("data:") {
                continue;
            }

            let data = line.trim_start_matches("data:").trim();
            if data == "[DONE]" {
                chunks.push(StreamChunk {
                    event_type: "stream.done".into(),
                    content: None,
                    message: Some("LyaCodex stream completed.".into()),
                });
                return Ok(StreamResponse {
                    provider: request.provider,
                    model: request.model,
                    chunks,
                    full_content,
                });
            }

            if let Some(delta) = extract_openai_stream_delta(data) {
                full_content.push_str(&delta);
                chunks.push(StreamChunk {
                    event_type: "stream.token".into(),
                    content: Some(delta),
                    message: None,
                });
            }
        }
    }

    chunks.push(StreamChunk {
        event_type: "stream.done".into(),
        content: None,
        message: Some("LyaCodex stream ended without explicit [DONE].".into()),
    });

    Ok(StreamResponse {
        provider: request.provider,
        model: request.model,
        chunks,
        full_content,
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
