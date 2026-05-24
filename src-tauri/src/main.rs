// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Cli {
    /// Enable debug mode
    #[arg(short, long)]
    debug: bool,

    /// Set current working directory
    #[arg(short, long)]
    cwd: Option<String>,

    /// Run a single prompt in non-interactive mode
    #[arg(short, long)]
    prompt: Option<String>,

    /// Output format for non-interactive mode (text, json)
    #[arg(short = 'f', long, default_value = "text")]
    output_format: String,

    /// Hide loading indicator in non-interactive mode
    #[arg(short, long)]
    quiet: bool,
}

fn main() {
    let cli = Cli::parse();

    if let Some(prompt_text) = cli.prompt {
        // Headless mode
        if !cli.quiet {
            println!("LyaCode is processing your request...");
        }
        
        let response = format!("Simulated AI response for: {}", prompt_text);
        
        if cli.output_format == "json" {
            println!("{{\"response\": \"{}\"}}", response);
        } else {
            println!("{}", response);
        }
        
        std::process::exit(0);
    }

    // Interactive GUI mode
    lyacode_lib::run()
}
