import React, { useState, useEffect, useRef } from 'react';
import './palette.css';
import { useConfigStore } from '../../store/configStore';
import { invoke } from '@tauri-apps/api/core';

interface Command {
  id: string;
  command: string;
  description: string;
}

const COMMANDS: Command[] = [
  { id: 'connect', command: '/connect', description: 'Connect provider (Google, Groq, etc)' },
  { id: 'models', command: '/models', description: 'Switch active model' },
  { id: 'skills', command: '/skills', description: 'Load Community Skills' },
  { id: 'agents', command: '/agents', description: 'Switch or create AI agent' },
  { id: 'mcps', command: '/mcps', description: 'Toggle MCPs / Tools' },
  { id: 'clear', command: '/clear', description: 'Clear terminal screen' },
];

interface Skill {
  name: string;
  description: string;
  path: string;
}

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Modos de estado: 'commands', 'providers', 'apikey', 'skills'
  const [mode, setMode] = useState<'commands' | 'providers' | 'apikey' | 'skills'>('commands');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [activeSkills, setActiveSkills] = useState<Set<string>>(new Set());
  
  const config = useConfigStore();

  const filteredCommands = COMMANDS.filter(c => 
    c.command.toLowerCase().includes(query.toLowerCase()) || 
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  const providersList = Object.keys(config.providers).map(p => ({
    id: p,
    label: p.charAt(0).toUpperCase() + p.slice(1),
    status: config.providers[p].enabled ? 'Configured' : 'Needs Setup'
  }));

  const activeList = mode === 'commands' ? filteredCommands : (mode === 'skills' ? skills : providersList);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      setMode('commands');
    }
  }, [isOpen]);

  const loadSkills = async () => {
    try {
      setLoadingSkills(true);
      // Sincroniza em background
      invoke('sync_community_skills').then(() => console.log('Skills synced')).catch(console.error);
      // Puxa as que já temos
      const localSkills: Skill[] = await invoke('get_skills');
      setSkills(localSkills);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < activeList.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      
      if (mode === 'commands') {
        const selectedCmd = filteredCommands[selectedIndex]?.id;
        if (selectedCmd === 'connect') {
          setMode('providers');
          setSelectedIndex(0);
          setQuery('');
        } else if (selectedCmd === 'skills') {
          setMode('skills');
          setSelectedIndex(0);
          setQuery('');
          loadSkills();
        } else {
          // Outros comandos
          console.log('Execute:', selectedCmd);
          onClose();
        }
      } else if (mode === 'skills') {
        const skill = skills[selectedIndex];
        // Toggle skill
        setActiveSkills(prev => {
          const next = new Set(prev);
          if (next.has(skill.path)) {
            next.delete(skill.path);
          } else {
            next.add(skill.path);
          }
          return next;
        });
        // Não fecha o modal, deixa o usuário ligar/desligar várias
        console.log('Toggled Skill:', skill.name);
      } else if (mode === 'providers') {
        const providerId = providersList[selectedIndex]?.id;
        if (providerId === 'ollama' || providerId === 'lmstudio') {
          config.setActiveProvider(providerId);
          onClose();
        } else {
          setSelectedProvider(providerId);
          setMode('apikey');
          setQuery('');
        }
      } else if (mode === 'apikey') {
        config.setApiKey(selectedProvider, query);
        config.setActiveProvider(selectedProvider);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="palette-overlay">
      <div className="palette-input-container">
        {mode === 'apikey' ? (
          <span className="prefix">API Key ({selectedProvider}):</span>
        ) : mode === 'providers' ? (
          <span className="prefix">Select Provider:</span>
        ) : mode === 'skills' ? (
          <span className="prefix">Search Skills:</span>
        ) : (
          <span className="prefix">/</span>
        )}
        
        <input
          ref={inputRef}
          className="palette-input"
          type={mode === 'apikey' ? 'password' : 'text'}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'commands' ? "type a command..." : ""}
        />
      </div>

      {mode !== 'apikey' && (
        <div className="palette-list">
          {mode === 'commands' && filteredCommands.map((cmd, idx) => (
            <div key={cmd.id} className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}>
              <span className="cmd-name">{cmd.command}</span>
              <span className="description">{cmd.description}</span>
            </div>
          ))}
          
          {mode === 'providers' && providersList.map((prov, idx) => (
            <div key={prov.id} className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`}>
              <span className="cmd-name">{prov.label}</span>
              <span className="description">{prov.status}</span>
            </div>
          ))}

          {mode === 'skills' && (
            loadingSkills && skills.length === 0 ? (
              <div className="palette-item"><span className="description">Loading skills from GitHub...</span></div>
            ) : skills.map((skill, idx) => {
              const isActive = activeSkills.has(skill.path);
              return (
                <div key={skill.path} className={`palette-item ${idx === selectedIndex ? 'selected' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="cmd-name">{skill.name}</span>
                    <span className="description" style={{maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                      {skill.description}
                    </span>
                  </div>
                  <div className={isActive ? "skill-badge-on" : "skill-badge-off"}>
                    {isActive ? 'ON' : 'OFF'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div className="palette-footer">
        <span><span className="key-hint">↑↓</span> to navigate</span>
        <span><span className="key-hint">↵</span> to select</span>
        <span><span className="key-hint">esc</span> to close</span>
      </div>
    </div>
  );
}
