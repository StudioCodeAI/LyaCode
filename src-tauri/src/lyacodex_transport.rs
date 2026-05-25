use serde::{Deserialize, Serialize};

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
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct TransportStatus {
    pub provider: String,
    pub base_url: String,
    pub status: String,
    pub message: String,
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
pub fn lyacodex_preview_chat_request() -> Result<ChatRequest, String> {
    Ok(ChatRequest {
        provider: "openrouter".into(),
        model: "openai/gpt-4.1-mini".into(),
        base_url: "https://openrouter.ai/api/v1".into(),
        stream: true,
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
