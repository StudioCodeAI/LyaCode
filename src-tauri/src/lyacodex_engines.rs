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

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FirstRunOption {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub kind: String,
    pub recommended: bool,
    pub requires_key: bool,
    pub requires_download: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct FirstRunPlan {
    pub title: String,
    pub whisper: String,
    pub philosophy: String,
    pub options: Vec<FirstRunOption>,
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
pub fn lyacodex_first_run_plan() -> Result<FirstRunPlan, String> {
    Ok(FirstRunPlan {
        title: "Antes de executar, a Lya precisa respirar um motor.".into(),
        whisper: "Na hora de acordar a LyaCodex, o runtime assopra no ouvido dela.".into(),
        philosophy: LYACODE_PHILOSOPHY.into(),
        options: vec![
            FirstRunOption {
                id: "openai-gpt-local".into(),
                title: "Baixar OpenAI GPT Local".into(),
                subtitle: "Motor GPT/OpenAI local/open-weight para sentir estabilidade real offline.".into(),
                kind: "local_open_weight".into(),
                recommended: true,
                requires_key: false,
                requires_download: true,
            },
            FirstRunOption {
                id: "existing-local-runtime".into(),
                title: "Usar motor local já instalado".into(),
                subtitle: "Conectar Ollama, LM Studio, vLLM ou runtime compatível.".into(),
                kind: "local_runtime".into(),
                recommended: false,
                requires_key: false,
                requires_download: false,
            },
            FirstRunOption {
                id: "openai-api-key".into(),
                title: "Conectar minha OpenAI Key".into(),
                subtitle: "Usar modelos premium da OpenAI via Lya Keychain.".into(),
                kind: "cloud_provider".into(),
                recommended: false,
                requires_key: true,
                requires_download: false,
            },
            FirstRunOption {
                id: "other-provider".into(),
                title: "Conectar outro provider".into(),
                subtitle: "OpenRouter, Gemini, Groq, Anthropic ou endpoint compatível.".into(),
                kind: "cloud_or_custom_provider".into(),
                recommended: false,
                requires_key: true,
                requires_download: false,
            },
        ],
    })
}

#[tauri::command]
pub fn lyacodex_philosophy() -> Result<String, String> {
    Ok(LYACODE_PHILOSOPHY.into())
}
