# ⚡ LyaCode Studio (v0.1.0-preview)

```
██╗     ██╗   ██╗ █████╗  ██████╗  ██████╗ ██████╗ ███████╗
██║     ╚██╗ ██╔╝██╔══██╗██╔════╝ ██╔═══██╗██╔══██╗██╔════╝
██║      ╚████╔╝ ███████║██║      ██║   ██║██║  ██║█████╗  
██║       ╚██╔╝  ██╔══██║██║      ██║   ██║██║  ██║██╔══╝  
███████╗   ██║   ██║  ██║╚██████╗ ╚██████╔╝██████╔╝███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
                                STUDIO - The Next-Gen AI IDE
```

> "Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui."
> — *LyaCode Philosophy*

---

**LyaCode Studio** é um ambiente de desenvolvimento e terminal inteligente de última geração acelerado por GPU e nativo em Rust (Tauri) + React/TypeScript. Ele foi projetado para ser **10x mais avançado, rápido e completo** do que editores de linha de comando baseados puramente em texto (como OpenCode e Claude Code), trazendo a fusão de Pseudo-Terminais (PTY) reais e um sistema profundo de habilidades de IA.

---

# 🎨 Temas Oficiais LyaCode

> **O que agrada os olhos, agrada o coração.**

O LyaCode possui uma arquitetura visual baseada em temas oficiais escuros, desenvolvidos para unir:

- foco;
- engenharia;
- conforto visual;
- identidade premium;
- terminal moderno.

## 🌑 Lya Deep Dark — Padrão

Tema oficial principal do projeto.

Visual:
- profundo;
- elegante;
- técnico;
- moderno;
- equilibrado.

Paleta principal:

```css
--bg-primary: #0d0d0f;
--accent-primary: #7c3aed;
--color-green: #22c55e;
```

Indicado para:
- uso diário;
- programação geral;
- experiência premium sem exageros.

---

## ✨ Lya Glass Dev — Premium IDE

Inspirado em IDEs modernas com blur, profundidade e glow suave.

Visual:
- glass;
- blur;
- neon suave;
- profundidade;
- ambiente de engenharia premium.

Paleta principal:

```css
--bg-primary: #0b0d13;
--accent-primary: #8b7cff;
--color-green: #4fffb9;
```

Indicado para:
- AI panels;
- dashboards;
- first run;
- modo apresentação;
- experiência visual marcante.

---

## ⚫ Lya Classic Terminal — Root Mode

Tema minimalista inspirado em terminais clássicos.

Visual:
- preto;
- limpo;
- técnico;
- silencioso;
- direto.

Paleta principal:

```css
--bg-primary: #000000;
--accent-primary: #22c55e;
--text-primary: #e8e8e8;
```

Indicado para:
- foco extremo;
- coding pesado;
- programadores raiz;
- sessões longas;
- telas OLED.

---

📁 Referência completa de tokens:

```text
LyaCodex-II/docs/THEME_TOKENS.md
```

Esse arquivo pode ser reutilizado em:

- extensões;
- complementos;
- plugins;
- dashboards;
- runtimes externos;
- páginas;
- projetos derivados do ecossistema Lya.

---

## ✨ Novidades da v0.1.0-preview: Cofre de API Keys Seguro

Nesta versão de preview, introduzimos o **Cofre de API Keys Seguro (Secure API Key Vault)** nativo em Rust:
* **Persistência Total:** As chaves de API e URLs de provedores locais (como Google Gemini, OpenRouter, Groq, Ollama e LMStudio) são armazenadas de forma segura e permanente no disco em `%APPDATA%/lyacode/vault.json`.
* **Sem Redigitação:** Ao navegar pelo Command Palette (`/connect`) e alternar entre provedores (por exemplo, de Gemini para Ollama e de volta para Gemini), sua chave de API antiga é mantida e pré-carregada automaticamente no input. Basta apertar `Enter` para re-validar e prosseguir.
* **Sobrevivência a Resets:** Ao contrário de soluções que usam apenas o `localStorage` do navegador do WebView, o cofre de arquivos nativo do LyaCode garante que suas credenciais sobrevivam a qualquer reinicialização, atualização ou limpeza de cache.
