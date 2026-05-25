pub mod skills_manager;
pub mod pty_manager;
pub mod vault_manager;
pub mod lyacodex_keychain;
pub mod lyacodex_models;
pub mod lyacodex_tools;
pub mod lyacodex_runtime;

use std::sync::{Arc, Mutex};
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(pty_manager::PtyState {
            pty_master: Arc::new(Mutex::new(None)),
            writer: Arc::new(Mutex::new(None)),
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            skills_manager::sync_community_skills,
            skills_manager::get_skills,
            pty_manager::spawn_pty,
            pty_manager::write_to_pty,
            pty_manager::resize_pty,
            vault_manager::save_vault_keys,
            vault_manager::load_vault_keys,
            lyacodex_keychain::save_secret,
            lyacodex_keychain::delete_secret,
            lyacodex_keychain::test_secret,
            lyacodex_models::lyacodex_list_providers,
            lyacodex_models::lyacodex_check_provider,
            lyacodex_tools::lyacodex_list_tool_providers,
            lyacodex_runtime::lyacodex_runtime_status,
            lyacodex_runtime::lyacodex_preview_runtime_event,
            lyacodex_runtime::lyacodex_preview_stream_protocol
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
