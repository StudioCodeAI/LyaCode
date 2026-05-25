import { Terminal } from './components/terminal/Terminal';
import { CommandPalette, PaletteMode } from './components/terminal/CommandPalette';
import { AIChatOverlay } from './components/terminal/AIChatOverlay';
import { FirstRunPanel } from './components/lyacodex/FirstRunPanel';
import { TerminalSquare, Settings, Box, Play, Cpu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useConfigStore } from './store/configStore';
import './index.css';

function App() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [paletteMode, setPaletteMode] = useState<PaletteMode>('commands');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState<string>('terminal');
  const activeProvider = useConfigStore((state) => state.activeProvider);
  const loadFromVault = useConfigStore((state) => state.loadFromVault);

  const slogans = [
    "Se você pensa, você executa.",
    "Se você executa, você indexa.",
    "Se você indexa, você evolui."
  ];
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        setFadeState('in');
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadFromVault();
  }, [loadFromVault]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteMode('commands');
        setIsPaletteOpen(true);
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setIsLogsOpen(prev => !prev);
      }

      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setPaletteMode('providers');
        setIsPaletteOpen(true);
      }

      if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setIsAiChatOpen(false);
        setIsLogsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-container">
      <div className="sidebar" data-tauri-drag-region>
        <div
          className={`sidebar-icon ${activeSidebar === 'terminal' ? 'active' : ''}`}
          title="Terminal"
          onClick={() => { setActiveSidebar('terminal'); setIsLogsOpen(false); setIsPaletteOpen(false); }}
        >
          <TerminalSquare size={22} strokeWidth={1.5} />
        </div>
        <div
          className={`sidebar-icon ${activeSidebar === 'skills' ? 'active' : ''}`}
          title="Extensions / MCP Store"
          onClick={() => { setActiveSidebar('skills'); setPaletteMode('skills'); setIsPaletteOpen(true); }}
        >
          <Box size={22} strokeWidth={1.5} />
        </div>
        <div
          className={`sidebar-icon ${isLogsOpen ? 'active' : ''}`}
          title="Run / Debug (Logs)"
          onClick={() => { setIsLogsOpen(!isLogsOpen); }}
        >
          <Play size={22} strokeWidth={1.5} />
        </div>

        <div style={{ flex: 1 }} data-tauri-drag-region></div>

        <div
          className={`sidebar-icon ${activeSidebar === 'engines' ? 'active' : ''}`}
          title="AI Engines"
          onClick={() => { setActiveSidebar('engines'); }}
        >
          <Cpu size={22} strokeWidth={1.5} />
        </div>
        <div
          className="sidebar-icon"
          title="Settings"
          onClick={() => { alert('Settings overlay coming soon!'); }}
        >
          <Settings size={22} strokeWidth={1.5} />
        </div>
      </div>

      <div className="main-content">
        <div className="glass-header">
          <div className="header-title" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="lyacode-breathing">LyaCode</span>
            <span className={`slogan-text fade-${fadeState}`}>
              "{slogans[sloganIndex]}"
            </span>
          </div>
          <div className="ai-badge" style={{ textTransform: 'capitalize' }}>
            <div className="pulse-dot"></div>
            {activeProvider} Ready
          </div>
        </div>

        <div className="terminal-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
          {activeSidebar === 'engines' ? (
            <FirstRunPanel />
          ) : (
            <>
              {isLogsOpen && (
                <div className="logs-panel" style={{ height: '30%', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', padding: '10px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <div>[RUST PTY] System initialized.</div>
                  <div>[WEBLLM] Engine standby.</div>
                  <div>[SWARM] Agent manager idle.</div>
                </div>
              )}

              <Terminal onOpenAIChat={() => setIsAiChatOpen(true)} />
            </>
          )}

          <CommandPalette
            isOpen={isPaletteOpen}
            onClose={() => {
              setIsPaletteOpen(false);
              setActiveSidebar('terminal');
            }}
            initialMode={paletteMode}
          />

          <AIChatOverlay
            isOpen={isAiChatOpen}
            onClose={() => setIsAiChatOpen(false)}
            onOpenPalette={(mode) => {
              setPaletteMode(mode || 'commands');
              setIsPaletteOpen(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;