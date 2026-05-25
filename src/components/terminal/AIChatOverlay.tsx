import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import './aichat.css';
import { useConfigStore } from '../../store/configStore';
import { fetchLLMResponse, ChatMessage } from '../../core/llm/api';
import { LYA_CORE_PROMPT } from '../../core/prompt';
import { Cpu, Send, X, Copy, CheckCircle, ChevronUp, Trash2 } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export function AIChatOverlay({ isOpen, onClose, onOpenPalette }: {
  isOpen: boolean;
  onClose: () => void;
  onOpenPalette?: (mode?: 'commands' | 'models' | 'skills' | 'agents' | 'providers') => void;
}) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const config = useConfigStore();

  const activeProv = config.providers[config.activeProvider];
  const modelName = activeProv?.activeModel || config.activeProvider;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Converter messages UI para o formato da API (histórico real)
  const buildHistory = (msgs: Message[]): ChatMessage[] => {
    return msgs.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content,
    }));
  };

  const handleSubmit = async () => {
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');

    const newMessages: Message[] = [...messages, { role: 'user', content: userQuery }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Passa o histórico completo (excluindo a mensagem atual que já está em prompt)
      const history = buildHistory(messages);
      const response = await fetchLLMResponse(userQuery, activeProv, LYA_CORE_PROMPT, history);
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', content: `**[Erro]:** ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === 'Escape') onClose();
    if (e.ctrlKey && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      if (onOpenPalette) onOpenPalette('commands');
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (onOpenPalette) onOpenPalette('commands');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val === '/') {
      if (onOpenPalette) onOpenPalette('commands');
      setInput('');
      return;
    }
    setInput(val);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const clearHistory = () => setMessages([]);

  if (!isOpen) return null;

  return (
    <div className="aichat-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="aichat-container">

        <div className="aichat-header">
          <div className="aichat-brand"></div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {messages.length > 0 && (
              <button className="aichat-close" onClick={clearHistory} title="Clear conversation">
                <Trash2 size={15} />
              </button>
            )}
            <button className="aichat-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="aichat-messages">
          {messages.length === 0 ? (
            <div className="aichat-empty">
              <div className="ascii-logo">
{`██╗     ██╗   ██╗ █████╗  ██████╗ ██████╗ ██████╗ ███████╗
██║     ╚██╗ ██╔╝██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║      ╚████╔╝ ███████║██║     ██║   ██║██║  ██║█████╗  
██║       ╚██╔╝  ██╔══██║██║     ██║   ██║██║  ██║██╔══╝  
███████╗   ██║   ██║  ██║╚██████╗╚██████╔╝██████╔╝███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝`}
              </div>
              <p>Ask LYA anything. Se você pensa, você executa.</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.role}`}>
                <div className="message-bubble">
                  <div className="message-content markdown-body">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                  {msg.role === 'ai' && (
                    <div className="message-actions-bottom">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        title="Copy text"
                        className="copy-btn"
                      >
                        {copiedIdx === idx
                          ? <><CheckCircle size={14} /> Copied</>
                          : <><Copy size={14} /> Copy</>
                        }
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message-row ai">
              <div className="message-bubble loading-pulse">
                <span className="pulse-dot-green"></span> LYA está pensando...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="aichat-input-area">
          <textarea
            ref={inputRef}
            className="aichat-input"
            placeholder="Ask Lya anything..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button className="aichat-submit" onClick={handleSubmit} disabled={loading || !input.trim()}>
            <Send size={16} />
          </button>
        </div>

        <div className="aichat-footer">
          <Cpu size={12} />
          <span
            className="engine-switcher"
            onClick={() => onOpenPalette && onOpenPalette('models')}
            title="Click to change model"
          >
            Active Engine: <strong>{modelName}</strong> ({config.activeProvider}) <ChevronUp size={12} style={{ marginLeft: '4px' }} />
          </span>
          <span style={{ flex: 1 }}></span>
          <div className="footer-hints">
            <span><strong>tab</strong> agents</span>
            <span><strong>ctrl+p</strong> commands</span>
          </div>
          <span style={{ marginLeft: '16px' }}><kbd>↵</kbd> send, <kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
