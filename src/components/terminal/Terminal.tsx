import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import '@xterm/xterm/css/xterm.css';

export function Terminal({ onOpenPalette, onOpenAIChat }: { onOpenPalette?: () => void, onOpenAIChat?: () => void }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background:          '#0d0d0f',
        foreground:          '#ffffff',
        cursor:              '#22c55e',
        cursorAccent:        '#0d0d0f',
        selectionBackground: 'rgba(34, 197, 94, 0.25)',
        black:               '#111114',
        red:                 '#ef4444',
        green:               '#22c55e',
        yellow:              '#eab308',
        blue:                '#3b82f6',
        magenta:             '#a855f7',
        cyan:                '#06b6d4',
        white:               '#ffffff',
        brightBlack:         '#555560',
        brightRed:           '#f87171',
        brightGreen:         '#4ade80',
        brightYellow:        '#facc15',
        brightBlue:          '#60a5fa',
        brightMagenta:       '#c084fc',
        brightCyan:          '#22d3ee',
        brightWhite:         '#ffffff',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      lineHeight: 1.4,
      cursorBlink: true,
      scrollback: 5000,
      allowTransparency: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    let unlistenData: UnlistenFn | null = null;

    // Connect to Rust PTY
    invoke('spawn_pty').then(async () => {
      unlistenData = await listen<string>('pty-data', (event) => {
        if (event.payload.includes('[[LYA_UI_TRIGGER]]')) {
          if (onOpenAIChat) onOpenAIChat();
          const cleanPayload = event.payload.replace('[[LYA_UI_TRIGGER]]\r\n', '').replace('[[LYA_UI_TRIGGER]]', '');
          if (cleanPayload) term.write(cleanPayload);
        } else {
          term.write(event.payload);
        }
      });
      
      term.onData((data) => {
        invoke('write_to_pty', { data }).catch(console.error);
      });
      
      term.onResize((size) => {
        invoke('resize_pty', { rows: size.rows, cols: size.cols }).catch(console.error);
      });
    }).catch(console.error);

    term.onKey(({ key, domEvent }) => {
      const ev = domEvent as KeyboardEvent;
      if (ev.key === '/' || key === '/') {
        if (onOpenPalette) {
          onOpenPalette();
        }
      }
    });

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch (e) {}
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      if (unlistenData) unlistenData();
      resizeObserver.disconnect();
      term.dispose();
    };
  }, []);

  return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
}
