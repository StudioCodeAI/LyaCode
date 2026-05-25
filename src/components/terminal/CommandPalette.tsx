import React, { useState, useEffect, useRef } from 'react';
import './palette.css';
import { useConfigStore } from '../../store/configStore';
import { invoke } from '@tauri-apps/api/core';
import { fetchProviderModels } from '../../core/llm/models';

// === TYPES ===
interface SlashCommand {
  id: string;
  command: string;
  description: string;
}

interface Skill {
  name: string;
  description: string;
  path: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt?: string;
}

export type PaletteMode = 'commands' | 'providers' | 'apikey' | 'baseurl' | 'skills' | 'models' | 'agents';

// === STATIC DATA ===
// Comandos slash — baseados no padrão OpenCode, mas com os do LyaCode
const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'agents',  command: '/agents',  description: 'Switch AI persona (Lya, Lua, custom...)' },
  { id: 'skills',  command: '/skills',  description: 'Load/manage skill modules (1000+)' },
  { id: 'connect', command: '/connect', description: 'Connect or change LLM provider' },
  { id: 'models',  command: '/models',  description: 'Switch active model' },
  { id: 'compact', command: '/compact', description: 'Compact / summarize current session' },
  { id: 'copy',    command: '/copy',    description: 'Copy session transcript' },
  { id: 'clear',   command: '/clear',   description: 'Clear terminal screen' },
  { id: 'exit',    command: '/exit',    description: 'Close LyaCode terminal' },
];

// Agentes built-in — personas com system prompts distintas
const BUILT_IN_AGENTS: Agent[] = [
  {
    id: 'lya-base',
    name: 'LYA',
    description: 'LYA Base — assistente omnipresente do LyaCode Studio',
  },
  {
    id: 'lua-researcher',
    name: 'Lua — Pesquisadora',
    description: 'Especialista em pesquisa, análise e síntese de informações',
  },
  {
    id: 'lya-coder',
    name: 'LYA Coder',
    description: 'Modo coder agressivo. Foca em código, debug e refatoração',
  },
  {
    id: 'lya-devops',
    name: 'LYA DevOps',
    description: 'Infraestrutura, CI/CD, Docker, Kubernetes e automação',
  },
];

export function CommandPalette({ isOpen, onClose, initialMode = 'commands' }: { isOpen: boolean; onClose: () => void, initialMode?: PaletteMode }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<PaletteMode>(initialMode);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [loadingMsg, setLoadingMsg] = useState<string>('');

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());
  const [activeAgent, setActiveAgent] = useState<string>('lya-base');

  const config = useConfigStore();

  // === FILTERED LISTS ===
  const filteredCommands = SLASH_COMMANDS.filter(c =>
    c.command.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAgents = BUILT_IN_AGENTS.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.description.toLowerCase().includes(query.toLowerCase())
  );

  const providersList = Object.keys(config.providers).map(p => ({
    id: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
    status: config.providers[p].enabled ? '✓ Configured' : 'Needs Setup'
  }));

  const dynamicModels = config.providers[config.activeProvider]?.availableModels;
  const modelsList = dynamicModels && dynamicModels.length > 0 ? dynamicModels : [];

  const filteredSkills = skills.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  // Active list length for navigation
  const activeLength =
    mode === 'commands' ? filteredCommands.length :
    mode === 'agents'   ? filteredAgents.length :
    mode === 'skills'   ? filteredSkills.length :
    mode === 'models'   ? modelsList.length :
    mode === 'providers' ? providersList.length : 0;

  // === EFFECTS ===
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      setMode(initialMode);
      if (initialMode === 'skills') loadSkills();
    }
  }, [isOpen, initialMode]);

  const loadSkills = async () => {
    try {
      setLoadingSkills(true);
      invoke('sync_community_skills').catch(console.error);
      const localSkills: Skill[] = await invoke('get_skills');
      setSkills(localSkills);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSkills(false);
    }
  };

  // === EXECUTION ===
  const executeSelection = (idx: number) => {
    if (mode === 'commands') {
      const cmd = filteredCommands[idx]?.id;
      if (cmd === 'connect')   { setMode('providers'); setSelectedIndex(0); setQuery(''); }
      else if (cmd === 'models') { setMode('models'); setSelectedIndex(0); setQuery(''); }
      else if (cmd === 'skills') { setMode('skills'); setSelectedIndex(0); setQuery(''); loadSkills(); }
      else if (cmd === 'agents') { setMode('agents'); setSelectedIndex(0); setQuery(''); }
      else if (cmd === 'clear')  { invoke('write_to_pty', { data: 'Clear-Host\r' }).catch(console.error); onClose(); }
      else if (cmd === 'exit')   { onClose(); }
      else { onClose(); }
    } else if (mode === 'agents') {
      const agent = filteredAgents[idx];
      if (agent) { setActiveAgent(agent.id); onClose(); }
    } else if (mode === 'skills') {
      const skill = filteredSkills[idx];
      if (skill) {
        setActiveSkills(prev => {
          const next = new Set(prev);
          if (next.has(skill.path)) next.delete(skill.path);
          else next.add(skill.path);
          return next;
        });
      }
    } else if (mode === 'providers') {
      const provider = providersList[idx]?.id;
      if (provider) {
        setSelectedProvider(provider);
        if (provider === 'ollama' || provider === 'lmstudio') {
          setMode('baseurl');
          setQuery(config.providers[provider]?.baseUrl || (provider === 'ollama' ? 'http://localhost:11434' : 'http://localhost:1234'));
        } else {
          setMode('apikey');
          setQuery(config.providers[provider]?.apiKey || '');
        }
      }
    } else if (mode === 'apikey' || mode === 'baseurl') {
      setLoadingMsg('Validating...');
      const isLocal = mode === 'baseurl';
      fetchProviderModels(selectedProvider, isLocal ? 'local' : query, isLocal ? query : undefined)
        .then(models => {
          if (isLocal) { config.setBaseUrl(selectedProvider, query); config.setApiKey(selectedProvider, 'local'); }
          else { config.setApiKey(selectedProvider, query); }
          config.setActiveProvider(selectedProvider);
          config.setAvailableModels(selectedProvider, models);
          setLoadingMsg('');
          setMode('models');
          setSelectedIndex(0);
          setQuery('');
        })
        .catch(err => setLoadingMsg(`[Error]: ${err.message}`));
    } else if (mode === 'models') {
      const model = modelsList[idx];
      if (model) config.setActiveModel(config.activeProvider, model);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(prev => Math.min(prev + 1, activeLength - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(prev => Math.max(prev - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); executeSelection(selectedIndex); }
  };

  // === TITLE ===
  const modeTitle: Record<PaletteMode, string> = {
    commands:  'skills',
    agents:    '/agents',
    skills:    '/skills',
    providers: '/connect',
    apikey:    `API Key (${selectedProvider})`,
    baseurl:   `Local URL (${selectedProvider})`,
    models:    `Model (${config.activeProvider})`,
  };

  if (!isOpen) return null;

  return (
    <div className="palette-overlay">
      <div className="palette-container">
        {/* Header */}
        <div className="palette-header">
          <span className="palette-title">{modeTitle[mode]}</span>
        </div>

        {/* Input */}
        <div className="palette-input-wrapper">
          {(mode === 'commands') && <span className="palette-slash">/</span>}
          <input
            ref={inputRef}
            className="palette-input"
            type={mode === 'apikey' ? 'password' : 'text'}
            value={query}
            disabled={loadingMsg === 'Validating...'}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={
              loadingMsg ? loadingMsg :
              mode === 'commands' ? 'Type a command...' :
              mode === 'agents'   ? 'Search agents...' :
              mode === 'skills'   ? 'Search skills...' :
              mode === 'apikey'   ? 'Paste your API key...' :
              mode === 'baseurl'  ? 'Enter local URL (e.g. http://localhost:11434)' :
              mode === 'models'   ? 'Search models...' : ''
            }
          />
        </div>

        {/* List */}
        {!loadingMsg && (
          <div className="palette-list">

            {/* COMMANDS */}
            {mode === 'commands' && filteredCommands.map((cmd, idx) => (
              <div
                key={cmd.id}
                className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => executeSelection(idx)}
              >
                <span className="cmd-slash">/</span>
                <span className="cmd-name">{cmd.command.slice(1)}</span>
                <span className="description">{cmd.description}</span>
              </div>
            ))}

            {/* AGENTS */}
            {mode === 'agents' && filteredAgents.map((agent, idx) => (
              <div
                key={agent.id}
                className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => executeSelection(idx)}
              >
                <div className="agent-row">
                  <span className="cmd-name">{agent.name}</span>
                  {activeAgent === agent.id && <span className="badge-active">Active</span>}
                </div>
                <span className="description">{agent.description}</span>
              </div>
            ))}

            {/* PROVIDERS */}
            {mode === 'providers' && providersList.map((prov, idx) => (
              <div
                key={prov.id}
                className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                onMouseEnter={() => setSelectedIndex(idx)}
                onClick={() => executeSelection(idx)}
              >
                <span className="cmd-name">{prov.label}</span>
                <span className="description" style={{ color: prov.status.startsWith('✓') ? '#50fa7b' : '#6272a4' }}>
                  {prov.status}
                </span>
              </div>
            ))}

            {/* MODELS */}
            {mode === 'models' && (
              modelsList.length === 0 ? (
                <div className="palette-item"><span className="description">No models found — connect a provider first.</span></div>
              ) : modelsList.map((model, idx) => (
                <div
                  key={model}
                  className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => executeSelection(idx)}
                >
                  <span className="cmd-name">{model}</span>
                  {config.providers[config.activeProvider]?.activeModel === model && (
                    <span className="badge-active">Active</span>
                  )}
                </div>
              ))
            )}

            {/* SKILLS */}
            {mode === 'skills' && (
              loadingSkills && filteredSkills.length === 0 ? (
                <div className="palette-item"><span className="description">Loading skills from GitHub...</span></div>
              ) : filteredSkills.map((skill, idx) => {
                const isActive = activeSkills.has(skill.path);
                return (
                  <div
                    key={skill.path}
                    className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={() => executeSelection(idx)}
                  >
                    <div className={`skill-toggle ${isActive ? 'on' : 'off'}`}>
                      <div className="skill-toggle-knob"></div>
                    </div>
                    <div className="skill-info">
                      <span className="cmd-name">{skill.name}</span>
                      <span className="description">{skill.description}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="palette-footer">
          <span><span className="key-hint">↑↓</span> navigate</span>
          <span><span className="key-hint">↵</span> select</span>
          <span><span className="key-hint">esc</span> close</span>
        </div>
      </div>
    </div>
  );
}
