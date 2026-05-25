use keyring::Entry;
use serde::{Deserialize, Serialize};

const SERVICE_NAME: &str = "LyaCodexII";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct KeyMetadata {
    pub label: String,
    pub key_ref: String,
    pub provider: String,
}

fn build_key_ref(provider: &str, label: &str) -> String {
    format!(
        "secret://provider/{}/{}",
        provider.to_lowercase(),
        label.to_lowercase().replace(" ", "-")
    )
}

#[tauri::command]
pub fn save_secret(provider: String, label: String, secret: String) -> Result<KeyMetadata, String> {
    let key_ref = build_key_ref(&provider, &label);

    let entry = Entry::new(SERVICE_NAME, &key_ref)
        .map_err(|e| format!("Keychain init error: {}", e))?;

    entry
        .set_password(&secret)
        .map_err(|e| format!("Failed to store secret: {}", e))?;

    Ok(KeyMetadata {
        label,
        key_ref,
        provider,
    })
}

#[tauri::command]
pub fn delete_secret(key_ref: String) -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, &key_ref)
        .map_err(|e| format!("Keychain init error: {}", e))?;

    entry
        .delete_password()
        .map_err(|e| format!("Failed to delete secret: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn test_secret(key_ref: String) -> Result<bool, String> {
    let entry = Entry::new(SERVICE_NAME, &key_ref)
        .map_err(|e| format!("Keychain init error: {}", e))?;

    match entry.get_password() {
        Ok(secret) => Ok(!secret.trim().is_empty()),
        Err(_) => Ok(false),
    }
}
