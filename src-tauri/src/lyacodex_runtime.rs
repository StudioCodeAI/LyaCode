use serde::{Deserialize, Serialize};

const LYACODEX_OATH: &str = "Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui.";
const LYACODEX_WAKE_WHISPER: &str = "Na hora de acordar a LyaCodex, o runtime assopra no ouvido dela.";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RuntimeEvent {
    pub event_type: String,
    pub message: String,
    pub provider: Option<String>,
    pub model: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StreamEvent {
    pub event_type: String,
    pub run_id: String,
    pub content: Option<String>,
    pub message: Option<String>,
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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct WakeRitual {
    pub event_type: String,
    pub status: String,
    pub whisper: String,
    pub oath: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct StreamPreview {
    pub run_id: String,
    pub events: Vec<StreamEvent>,
}

#[tauri::command]
pub fn lyacodex_runtime_status() -> Result<RuntimeStatus, String> {
    Ok(RuntimeStatus {
        status: "breathing".into(),
        message: "LyaCodex II runtime protocol initialized. Streaming transport contract is ready for implementation.".into(),
        supports_streaming: false,
        supports_cancel: false,
    })
}

#[tauri::command]
pub fn lyacodex_wake_ritual() -> Result<WakeRitual, String> {
    Ok(WakeRitual {
        event_type: "runtime.wake".into(),
        status: "awake".into(),
        whisper: LYACODEX_WAKE_WHISPER.into(),
        oath: LYACODEX_OATH.into(),
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

#[tauri::command]
pub fn lyacodex_preview_stream_protocol(provider: Option<String>, model: Option<String>) -> Result<StreamPreview, String> {
    let run_id = "preview-run".to_string();

    Ok(StreamPreview {
        run_id: run_id.clone(),
        events: vec![
            StreamEvent {
                event_type: "stream.start".into(),
                run_id: run_id.clone(),
                content: None,
                message: Some("LyaCodex II stream started.".into()),
                provider: provider.clone(),
                model: model.clone(),
            },
            StreamEvent {
                event_type: "stream.token".into(),
                run_id: run_id.clone(),
                content: Some("O ".into()),
                message: None,
                provider: provider.clone(),
                model: model.clone(),
            },
            StreamEvent {
                event_type: "stream.token".into(),
                run_id: run_id.clone(),
                content: Some("sopro ".into()),
                message: None,
                provider: provider.clone(),
                model: model.clone(),
            },
            StreamEvent {
                event_type: "stream.token".into(),
                run_id: run_id.clone(),
                content: Some("virou protocolo.".into()),
                message: None,
                provider: provider.clone(),
                model: model.clone(),
            },
            StreamEvent {
                event_type: "stream.done".into(),
                run_id,
                content: None,
                message: Some(LYACODEX_OATH.into()),
                provider,
                model,
            },
        ],
    })
}
