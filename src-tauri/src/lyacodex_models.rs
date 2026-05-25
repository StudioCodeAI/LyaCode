use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProviderDescriptor {
    pub id: String,
    pub name: String,
    pub kind: String,
    pub default_base_url: Option<String>,
    pub requires_key: bool,
    pub supports_streaming: bool,
    pub openai_compatible: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProviderConnectionCheck {
    pub provider: String,
    pub status: String,
    pub message: String,
}

#[tauri::command]
pub fn lyacodex_list_providers() -> Result<Vec<ProviderDescriptor>, String> {
    Ok(vec![
        ProviderDescriptor {
            id: "openrouter".into(),
            name: "OpenRouter".into(),
            kind: "cloud".into(),
            default_base_url: Some("https://openrouter.ai/api/v1".into()),
            requires_key: true,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "openai".into(),
            name: "OpenAI".into(),
            kind: "cloud".into(),
            default_base_url: Some("https://api.openai.com/v1".into()),
            requires_key: true,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "google".into(),
            name: "Google Gemini".into(),
            kind: "cloud".into(),
            default_base_url: Some("https://generativelanguage.googleapis.com/v1beta/openai".into()),
            requires_key: true,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "anthropic".into(),
            name: "Anthropic".into(),
            kind: "cloud".into(),
            default_base_url: Some("https://api.anthropic.com".into()),
            requires_key: true,
            supports_streaming: true,
            openai_compatible: false,
        },
        ProviderDescriptor {
            id: "groq".into(),
            name: "Groq".into(),
            kind: "cloud".into(),
            default_base_url: Some("https://api.groq.com/openai/v1".into()),
            requires_key: true,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "ollama".into(),
            name: "Ollama".into(),
            kind: "local".into(),
            default_base_url: Some("http://localhost:11434".into()),
            requires_key: false,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "lmstudio".into(),
            name: "LM Studio".into(),
            kind: "local".into(),
            default_base_url: Some("http://localhost:1234".into()),
            requires_key: false,
            supports_streaming: true,
            openai_compatible: true,
        },
        ProviderDescriptor {
            id: "custom-openai".into(),
            name: "Custom OpenAI-Compatible".into(),
            kind: "custom".into(),
            default_base_url: None,
            requires_key: false,
            supports_streaming: true,
            openai_compatible: true,
        },
    ])
}

#[tauri::command]
pub fn lyacodex_check_provider(provider: String, key_ref: Option<String>, base_url: Option<String>) -> Result<ProviderConnectionCheck, String> {
    let providers = lyacodex_list_providers()?;
    let descriptor = providers
        .into_iter()
        .find(|p| p.id == provider)
        .ok_or_else(|| format!("Unknown provider: {}", provider))?;

    if descriptor.requires_key && key_ref.as_deref().unwrap_or("").trim().is_empty() {
        return Ok(ProviderConnectionCheck {
            provider,
            status: "missing_key".into(),
            message: "Provider requires a keyRef stored in Lya Keychain.".into(),
        });
    }

    if descriptor.kind == "local" && base_url.as_deref().unwrap_or("").trim().is_empty() {
        return Ok(ProviderConnectionCheck {
            provider,
            status: "missing_base_url".into(),
            message: "Local provider requires a base URL.".into(),
        });
    }

    Ok(ProviderConnectionCheck {
        provider,
        status: "ready".into(),
        message: format!("{} is configured for the LyaCodex II gateway.", descriptor.name),
    })
}
