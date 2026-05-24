import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import '@xterm/xterm/css/xterm.css';

export function Terminal({ onOpenPalette }: { onOpenPalette?: () => void }) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#0a0a0c',
        foreground: '#e5e7eb',
        cursor: '#22c55e',
        selectionBackground: 'rgba(34, 197, 94, 0.3)'
      },
      fontFamily: '"Fira Code", monospace',
      fontSize: 14,
      cursorBlink: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    let unlistenData: UnlistenFn | null = null;

    // Connect to Rust PTY
    invoke('spawn_pty').then(async () => {
      unlistenData = await listen<string>('pty-data', (event) => {
        term.write(event.payload);
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
