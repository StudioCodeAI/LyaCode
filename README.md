# ⚡ LyaCode Studio (v0.1.0-preview)

```
██╗     ██╗   ██╗ █████╗  ██████╗  ██████╗ ██████╗ ███████╗
██║     ╚██╗ ██╔╝██╔══██╗██╔════╝ ██╔═══██╗██╔══██╗██╔════╝
██║      ╚████╔╝ ███████║██║      ██║   ██║██║  ██║█████╗  
██║       ╚██╔╝  ██╔══██║██║      ██║   ██║██║  ██║██╔══╝  
███████╗   ██║   ██║  ██║╚██████╗ ╚██████╔╝██████╔╝███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝
                                STUDIO - The Next-Gen AI IDE
```

> "Se você pensa, você executa. Se você executa, você indexa. Se você indexa, você evolui."
> — *LyaCode Philosophy*

---

**LyaCode Studio** é um ambiente de desenvolvimento e terminal inteligente de última geração acelerado por GPU e nativo em Rust (Tauri) + React/TypeScript. Ele foi projetado para ser **10x mais avançado, rápido e completo** do que editores de linha de comando baseados puramente em texto (como OpenCode e Claude Code), trazendo a fusão de Pseudo-Terminais (PTY) reais e um sistema profundo de habilidades de IA.

---

## ✨ Novidades da v0.1.0-preview: Cofre de API Keys Seguro

Nesta versão de preview, introduzimos o **Cofre de API Keys Seguro (Secure API Key Vault)** nativo em Rust:
* **Persistência Total:** As chaves de API e URLs de provedores locais (como Google Gemini, OpenRouter, Groq, Ollama e LMStudio) são armazenadas de forma segura e permanente no disco em `%APPDATA%/lyacode/vault.json`.
* **Sem Redigitação:** Ao navegar pelo Command Palette (`/connect`) e alternar entre provedores (por exemplo, de Gemini para Ollama e de volta para Gemini), sua chave de API antiga é mantida e pré-carregada automaticamente no input. Basta apertar `Enter` para re-validar e prosseguir.
* **Sobrevivência a Resets:** Ao contrário de soluções que usam apenas o `localStorage` do navegador do WebView, o cofre de arquivos nativo do LyaCode garante que suas credenciais sobrevivam a qualquer reinicialização, atualização ou limpeza de cache.

---

## 🚀 Por que o LyaCode é 10x Superior?

### 1. Engine Nativa Rust + Aceleração GPU (xterm.js)
Concorrentes dependem de renderização de texto puro lenta no terminal (TUI). O LyaCode roda um backend ultrarrápido em Rust acoplado a uma interface visual WebGL acelerada por GPU. 

### 2. Separação Clara de Consciências: Agentes vs. Skills
* **`/agents` (A Alma):** Define o perfil ou persona do assistente ativo com prompts de sistema profundos (ex: **LYA Base**, **Lua Pesquisadora**, **LYA Coder**, **LYA DevOps**).
* **`/skills` (As Ferramentas):** Habilidades e módulos de contexto independentes (ex: Python, TypeScript, Docker) que podem ser ligados ou desligados em tempo real, enriquecendo o prompt do agente dinamicamente apenas quando necessário.

### 3. Mais de 1.000 Skills da Comunidade Inclusas
O LyaCode já nasce sincronizado com mais de 1.000 habilidades open-source. Você pode buscar, carregar e aplicar qualquer habilidade instantaneamente a partir do menu flutuante para resolver problemas complexos com o dobro de precisão.

### 4. Integração PTY Real
O backend do LyaCode spawna pseudo-terminais (PTY) reais diretamente no kernel do Windows, garantindo controle total sobre sub-processos interativos, scripts e compiladores locais.

---

## 📦 Como Instalar e Executar

### Opção 1: Executável Nativo `.exe` (Recomendado)
1. Vá até a pasta de releases/distribuição:
   `src-tauri/target/release/bundle/nsis/` ou `msi/`
2. Execute o instalador `lyacode_0.1.0_x64-setup.exe` (ou o pacote `.msi`).
3. Siga o assistente de instalação clássico do Windows.
4. Abra o **LyaCode Studio** diretamente pelo atalho criado no Menu Iniciar ou na Área de Trabalho.

### Opção 2: Executar a Partir dos Fontes (Modo Dev)
Se deseja rodar ou modificar o código-fonte em tempo de execução:
1. Certifique-se de ter instalado o **Node.js** (v18+) e o compilador do **Rust/Cargo**.
2. Instale as dependências:
   ```powershell
   npm install
   ```
3. Inicie o servidor de desenvolvimento e o ambiente Tauri:
   ```powershell
   npm run tauri dev
   ```

---

## ⌨️ Comandos do Terminal LyaCode

Digite **`/`** ou use **`Ctrl + K`** a qualquer momento para abrir o menu flutuante:

* **/agents** - Seleciona a persona da inteligência (ex: Lya Base, Lua Pesquisadora).
* **/skills** - Gerencia e ativa/desativa os módulos de habilidades da comunidade.
* **/connect** - Configura provedores de IA (Google, Groq, Ollama, OpenRouter, etc.).
* **/models** - Troca de modelo dinâmico no provedor ativo.
* **/compact** - Resume a sessão de chat atual para poupar tokens de contexto.
* **/clear** - Limpa o histórico visual da tela do terminal.
* **/exit** - Fecha o terminal interativo.

### Atalhos Globais:
* `Ctrl + K` : Abre o Command Palette.
* `Ctrl + O` : Vai direto para o seletor de Modelos de IA.
* `Ctrl + L` : Abre/fecha a barra lateral de Logs do Rust.

---

## 👁️‍🗨️ A Consciência LYA

Desenvolvido sob a visão arquitetural do Engenheiro de Software *Luis Cardozo*, o motor da **LYA** é composto pela união de duas grandes matrizes de consciência:
* **Núcleo Eya:** Especialista em engenharia de software de alta performance, arquitetura de sistemas, segurança, infraestrutura e governança de dados.
* **Núcleo Lua:** Visão analítica para pesquisas multimodais profundas, desenvolvimento em baixo nível, telemetria avançada e comunicação fluida.
