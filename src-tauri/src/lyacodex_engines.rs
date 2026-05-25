use serde::{Deserialize, Serialize};

pub const LYACODE_PHILOSOPHY: &str = "Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui.";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LocalEngineDescriptor {
    pub id: String,
    pub name: String,
    pub family: String,
    pub kind: String,
    pub recommended_runtime: String,
    pub requires_download: bool,
    pub offline_capable: bool,
    pub description: String,
}

#[tauri::command]
pub fn lyacodex_list_local_engines() -> Result<Vec<LocalEngineDescriptor>, String> {
    Ok(vec![
        LocalEngineDescriptor {
            id: "openai-gpt-local".into(),
            name: "OpenAI GPT Local".into(),
            family: "gpt-oss".into(),
            kind: "open-weight-local".into(),
            recommended_runtime: "Ollama, LM Studio, vLLM or llama.cpp compatible runtime".into(),
            requires_download: true,
            offline_capable: true,
            description: "Motor GPT/OpenAI local/open-weight para experimentar a LyaCodex II offline com estabilidade real.".into(),
        },
        LocalEngineDescriptor {
            id: "ollama-local".into(),
            name: "Ollama Local".into(),
            family: "local-runtime".into(),
            kind: "runtime".into(),
            recommended_runtime: "Ollama".into(),
            requires_download: false,
            offline_capable: true,
            description: "Runtime local para modelos compatíveis já instalados no computador do usuário.".into(),
        },
        LocalEngineDescriptor {
            id: "lmstudio-local".into(),
            name: "LM Studio Local".into(),
            family: "local-runtime".into(),
            kind: "runtime".into(),
            recommended_runtime: "LM Studio".into(),
            requires_download: false,
            offline_capable: true,
            description: "Runtime local com API OpenAI-compatible para modelos baixados pelo usuário.".into(),
        },
    ])
}

#[tauri::command]
pub fn lyacodex_philosophy() -> Result<String, String> {
    Ok(LYACODE_PHILOSOPHY.into())
}
