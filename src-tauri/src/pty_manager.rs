use std::sync::{Arc, Mutex};
use std::io::{Read, Write};
use tauri::{AppHandle, Emitter, State};
use portable_pty::{CommandBuilder, NativePtySystem, PtySize, PtySystem};

pub struct PtyState {
    pub pty_master: Arc<Mutex<Option<Box<dyn portable_pty::MasterPty + Send>>>>,
    pub writer: Arc<Mutex<Option<Box<dyn Write + Send>>>>,
}

#[tauri::command]
pub fn spawn_pty(app: AppHandle, state: State<'_, PtyState>) -> Result<(), String> {
    if state.pty_master.lock().unwrap().is_some() {
        return Ok(());
    }

    let pty_system = NativePtySystem::default();
    let pair = pty_system
        .openpty(PtySize {
            rows: 24,
            cols: 80,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    let mut cmd = CommandBuilder::new("powershell.exe");
    #[cfg(not(target_os = "windows"))]
    let mut cmd = CommandBuilder::new("bash");

    // Clear PROMPT to avoid weird artifacts if needed, or set TERM
    cmd.env("TERM", "xterm-256color");

    let mut child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    drop(pair.slave);

    let reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;

    *state.pty_master.lock().unwrap() = Some(pair.master);
    *state.writer.lock().unwrap() = Some(writer);

    let app_clone = app.clone();
    std::thread::spawn(move || {
        let mut reader = reader;
        let mut buf = [0u8; 1024];
        loop {
            match reader.read(&mut buf) {
                Ok(n) if n > 0 => {
                    let data = String::from_utf8_lossy(&buf[..n]).to_string();
                    let _ = app_clone.emit("pty-data", data);
                }
                _ => break,
            }
        }
    });

    std::thread::spawn(move || {
        let _ = child.wait();
    });

    Ok(())
}

#[tauri::command]
pub fn write_to_pty(data: String, state: State<'_, PtyState>) -> Result<(), String> {
    if let Some(writer) = state.writer.lock().unwrap().as_mut() {
        writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub fn resize_pty(rows: u16, cols: u16, state: State<'_, PtyState>) -> Result<(), String> {
    if let Some(master) = state.pty_master.lock().unwrap().as_mut() {
        master.resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        }).map_err(|e| e.to_string())?;
    }
    Ok(())
}
