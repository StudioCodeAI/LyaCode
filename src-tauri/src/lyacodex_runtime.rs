use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RuntimeEvent {
    pub event_type: String,
    pub message: String,
    pub provider: Option<String>,
    pub model: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RuntimeStatus {
    pub status: String,
    pub message: String,
    pub supports_streaming: bool,
    pub supports_cancel: bool,
}

#[tauri::command]
pub fn lyacodex_runtime_status() -> Result<RuntimeStatus, String> {
    Ok(RuntimeStatus {
        status: "breathing".into(),
        message: "LyaCodex II runtime protocol initialized. Streaming transport is the next step.".into(),
        supports_streaming: false,
        supports_cancel: false,
    })
}

#[tauri::command]
pub fn lyacodex_preview_runtime_event(provider: Option<String>, model: Option<String>) -> Result<RuntimeEvent, String> {
    Ok(RuntimeEvent {
        event_type: "runtime.preview".into(),
        message: "O sopro inicial do LyaCodex II foi criado.".into(),
        provider,
        model,
    })
}
