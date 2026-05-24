use std::process::Command;
use std::path::PathBuf;
use std::fs;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Skill {
    pub name: String,
    pub description: String,
    pub path: String,
}

#[tauri::command]
pub fn sync_community_skills() -> Result<String, String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let skills_dir = PathBuf::from(app_data).join("lyacode").join("community_skills");
    
    if !skills_dir.exists() {
        fs::create_dir_all(&skills_dir).map_err(|e| e.to_string())?;
        
        let output = Command::new("git")
            .arg("clone")
            .arg("https://github.com/sickn33/antigravity-awesome-skills.git")
            .arg(&skills_dir)
            .output()
            .map_err(|e| e.to_string())?;
            
        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stderr).to_string());
        }
        Ok("Skills cloned successfully".to_string())
    } else {
        let output = Command::new("git")
            .current_dir(&skills_dir)
            .arg("pull")
            .output()
            .map_err(|e| e.to_string())?;
            
        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stderr).to_string());
        }
        Ok("Skills synced successfully".to_string())
    }
}

#[tauri::command]
pub fn get_skills() -> Result<Vec<Skill>, String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    // O repo pode ter as skills na raiz ou numa pasta skills. Vamos assumir que as pastas de skill estão na pasta raiz ou em 'skills'
    let repo_dir = PathBuf::from(app_data).join("lyacode").join("community_skills");
    let skills_dir = repo_dir.join("skills"); 
    
    // Fallback: se não tiver uma pasta skills, lê direto do repo
    let search_dir = if skills_dir.exists() { skills_dir } else { repo_dir };
    
    let mut skills = Vec::new();
    
    if search_dir.exists() {
        if let Ok(entries) = fs::read_dir(search_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    let skill_file = path.join("SKILL.md");
                    if skill_file.exists() {
                        let content = fs::read_to_string(&skill_file).unwrap_or_default();
                        
                        let mut name = String::new();
                        let mut description = String::new();
                        let mut in_frontmatter = false;
                        
                        for line in content.lines() {
                            if line.trim() == "---" {
                                if in_frontmatter { break; } else { in_frontmatter = true; continue; }
                            }
                            if in_frontmatter {
                                if line.starts_with("name:") {
                                    name = line.replace("name:", "").trim().trim_matches('"').trim_matches('\'').to_string();
                                } else if line.starts_with("description:") {
                                    description = line.replace("description:", "").trim().trim_matches('"').trim_matches('\'').to_string();
                                }
                            }
                        }
                        
                        if name.is_empty() {
                            name = path.file_name().unwrap_or_default().to_string_lossy().to_string();
                        }
                        if description.is_empty() {
                            description = "Sem descrição".to_string();
                        }
                        
                        skills.push(Skill {
                            name,
                            description,
                            path: skill_file.to_string_lossy().to_string()
                        });
                    }
                }
            }
        }
    }
    
    Ok(skills)
}
