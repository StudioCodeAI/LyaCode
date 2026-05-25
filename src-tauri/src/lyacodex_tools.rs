use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ToolProviderDescriptor {
    pub id: String,
    pub name: String,
    pub category: String,
    pub requires_key: bool,
    pub default_base_url: Option<String>,
    pub permission_level: String,
    pub description: String,
}

#[tauri::command]
pub fn lyacodex_list_tool_providers() -> Result<Vec<ToolProviderDescriptor>, String> {
    Ok(vec![
        ToolProviderDescriptor {
            id: "tavily".into(),
            name: "Tavily Search".into(),
            category: "web_search".into(),
            requires_key: true,
            default_base_url: Some("https://api.tavily.com".into()),
            permission_level: "ask".into(),
            description: "Web search and research API for agent-assisted browsing.".into(),
        },
        ToolProviderDescriptor {
            id: "brave-search".into(),
            name: "Brave Search".into(),
            category: "web_search".into(),
            requires_key: true,
            default_base_url: Some("https://api.search.brave.com".into()),
            permission_level: "ask".into(),
            description: "Independent web search provider for online research.".into(),
        },
        ToolProviderDescriptor {
            id: "web-fetch".into(),
            name: "Web Fetch".into(),
            category: "web_fetch".into(),
            requires_key: false,
            default_base_url: None,
            permission_level: "ask".into(),
            description: "Fetches a specific URL when the user approves internet access.".into(),
        },
        ToolProviderDescriptor {
            id: "github".into(),
            name: "GitHub".into(),
            category: "code_hosting".into(),
            requires_key: true,
            default_base_url: Some("https://api.github.com".into()),
            permission_level: "ask".into(),
            description: "Repository, issue, pull request and release integration.".into(),
        },
        ToolProviderDescriptor {
            id: "huggingface".into(),
            name: "Hugging Face".into(),
            category: "model_hub".into(),
            requires_key: false,
            default_base_url: Some("https://huggingface.co".into()),
            permission_level: "ask".into(),
            description: "Model and dataset discovery, downloads and local engine support.".into(),
        },
    ])
}
