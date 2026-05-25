use std::collections::HashMap;
use std::fs;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct ProviderKeys {
    pub api_key: String,
    pub base_url: Option<String>,
}

#[tauri::command]
pub fn save_vault_keys(keys: HashMap<String, ProviderKeys>) -> Result<(), String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let vault_dir = PathBuf::from(app_data).join("lyacode");
    if !vault_dir.exists() {
        fs::create_dir_all(&vault_dir).map_err(|e| e.to_string())?;
    }
    let vault_path = vault_dir.join("vault.json");
    let json_str = serde_json::to_string_pretty(&keys).map_err(|e| e.to_string())?;
    fs::write(vault_path, json_str).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn load_vault_keys() -> Result<HashMap<String, ProviderKeys>, String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let vault_path = PathBuf::from(app_data).join("lyacode").join("vault.json");
    if !vault_path.exists() {
        return Ok(HashMap::new());
    }
    let content = fs::read_to_string(vault_path).map_err(|e| e.to_string())?;
    let keys: HashMap<String, ProviderKeys> = serde_json::from_str(&content).map_err(|e| e.to_string())?;
    Ok(keys)
}
