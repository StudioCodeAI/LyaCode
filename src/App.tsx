import { Terminal } from './components/terminal/Terminal';
import { CommandPalette } from './components/terminal/CommandPalette';
import { TerminalSquare, Settings, Box, Play, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K -> Command Palette
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
      // Ctrl+L -> Toggle Logs
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsLogsOpen(prev => !prev);
      }
      // Ctrl+O -> Select Models
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        // Pode ser implementado depois, vamos só abrir a paleta por enquanto
        setIsPaletteOpen(true);
      }
      // Esc -> Close overlays
      if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsLogsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar" data-tauri-drag-region>
        <div className="sidebar-icon active" title="Terminal">
          <TerminalSquare size={22} strokeWidth={1.5} />
        </div>
        <div className="sidebar-icon" title="Extensions / MCP Store">
          <Box size={22} strokeWidth={1.5} />
        </div>
        <div className="sidebar-icon" title="Run / Debug">
          <Play size={22} strokeWidth={1.5} />
        </div>
        
        <div style={{ flex: 1 }} data-tauri-drag-region></div>
        
        <div className="sidebar-icon" title="AI Engines">
          <Cpu size={22} strokeWidth={1.5} />
        </div>
        <div className="sidebar-icon" title="Settings">
          <Settings size={22} strokeWidth={1.5} />
        </div>
      </div>

      {/* Main Workspace */}
      <div className="main-content">
        <div className="glass-header">
          <div className="header-title">LyaCode Studio</div>
          <div className="ai-badge">
            <div className="pulse-dot"></div>
            Ollama Ready
          </div>
        </div>
        
        <div className="terminal-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
          {isLogsOpen && (
            <div className="logs-panel" style={{ height: '30%', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', padding: '10px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <div>[RUST PTY] System initialized.</div>
              <div>[WEBLLM] Engine standby.</div>
              <div>[SWARM] Agent manager idle.</div>
            </div>
          )}
          <Terminal onOpenPalette={() => setIsPaletteOpen(true)} />
          <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        </div>
      </div>
    </div>
  );
}

export default App;
