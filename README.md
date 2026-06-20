# Lya Cloud

**CLI agentic terminal by Studio CodeAI.**

![Lya Cloud brand preview](docs/assets/lyacloud-readme-hero.png)

> Abra um projeto real no terminal e trabalhe com **Lya** — uma IA capaz de ler código, editar arquivos, executar comandos, alternar provedores de modelo e apoiar tarefas de engenharia ponta-a-ponta.

[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/StudioCodeAI/lyacloud/releases/latest)
[![License](https://img.shields.io/badge/license-See%20LICENSE-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/family-Studio%20CodeAI-ff7a1a)](https://github.com/StudioCodeAI)

Lya Cloud faz parte da família **Studio CodeAI** e nasce como a **CLI Star 1** do ecossistema: a camada terminal agêntica que serve a irmã mais velha, [Lya Studio Coder](https://github.com/StudioCodeAI/Lya-Studio-Coder).

---

## ⚡ Instalação rápida

### Windows (PowerShell — recomendado)

```powershell
# Baixe e rode o instalador oficial do GitHub Releases
irm https://github.com/StudioCodeAI/lyacloud/releases/latest/download/lyacloud-setup-x64-1.0.0.exe -OutFile lyacloud-setup.exe
.\lyacloud-setup.exe
```

Após a instalação, abra um novo terminal e digite `lya`.

### Multi-plataforma (via npm + tarball do release)

```bash
npm install -g https://github.com/StudioCodeAI/lyacloud/releases/latest/download/studiocodeai-lyacloud-1.0.0.tgz
```

### Validar instalação

Qualquer alias funciona — todos apontam para o mesmo binário:

```bash
lya --version           # → 1.0.0 (Lya Cloud)
lyacloud --version
lscloud --version
lyacode --version
lscode --version
```

### Desinstalar

```bash
npm uninstall -g @studiocodeai/lyacloud
```

---

## 🚀 Primeiros passos

```bash
# 1. Inicie a CLI
lya

# 2. Configure um provedor (escolha Ollama Local se tiver Ollama rodando)
> /provider

# 3. Entre em modo Lya (carrega persona sênior + sub-agentes)
> /lya

# 4. Veja o que mais existe
> /help
```

---

## 🧠 A Persona Lya

**Lya** é a engenheira de software sênior e CEO de projeto da família Studio CodeAI. Arquitetada para combinar dois estilos complementares:

| Camada | Estilo | Foco |
|--------|--------|------|
| **Decisão** | Claude Opus | arquitetura, tradeoffs de longo prazo, evidência antes de convicção, retorno honesto quando o contexto é insuficiente |
| **Execução** | Sonnet 4.8 | patches cirúrgicos, cobertura em três camadas (typecheck + test + smoke/doctor), mensagens de commit atômicas |

### Invocação

- `/lya` — slash command explícito que carrega o system prompt base da Lya
- Agente default do loop principal — quando você inicia o CLI sem especificar outro agente

### Sub-agentes (via `Task(agent=...)` ou `/agents`)

- **lya-architect** — design + tradeoffs, planos com ADR
- **lya-explorer** — investigação read-only, mapeia código antes de patch
- **lya-reviewer** — code review pré-merge com veredito + findings
- **lya-tester** — escrita de testes `bun:test` (happy + edges + mock side-effects)
- **lya-recorder** — commits, PRs e changelogs no formato da Studio CodeAI
- **lya-memory** — memória de sessão e contexto persistente
- **lya-provider** — gestão de perfis de provedor

Perfil completo, voice e operating principles em `src/agents/lya/profile.ts`.

---

## 🌐 Provedores suportados

A ordem que aparece em `/provider`:

| Posição | Provedor | Descrição |
|---------|----------|-----------|
| 1 | **Ollama Local** | Roda 100% local em `http://localhost:11434` (qwen2.5-coder, llama3.1, etc.) |
| 2 | **OpenAI-compatible** | OpenAI, OpenCode Gateway, GitHub Models, OpenRouter, Groq, etc. |
| 3 | **Gemini** | Google Gemini via API key, access token ou ADC local |
| 4 | **Mistral** | Mistral AI (devstral-latest e variantes) |
| 5 | **Codex** | ChatGPT Codex CLI auth ou env credentials |
| 6 | **Codex OAuth** | Login com ChatGPT via browser + storage seguro |
| 7 | **Auto** | Prefere Ollama local; cai em OpenAI-compatible se não houver |

O **Anthropic / Claude** é o **provedor default** quando nenhum perfil é configurado (usa `ANTHROPIC_API_KEY`).

---

## 🏗️ Identidade do projeto

| Campo | Valor |
|-------|-------|
| Nome do produto | Lya Cloud |
| Família | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| Repositório | https://github.com/StudioCodeAI/lyacloud |
| Pacote npm | `@studiocodeai/lyacloud` |
| Versão | **1.0.0** (produção) |
| Política de versão | `v0.x.y` = teste · `v1.0.0+` = produção estável |

---

## 🧰 Recursos

- ✅ CLI em TypeScript, runtime Node.js ≥ 22
- ✅ Interface terminal com React/Ink + ANSI gradients
- ✅ Persona **Lya** com 7 sub-agentes especializados
- ✅ Ferramentas de leitura, busca, edição e inspeção de arquivos
- ✅ Execução de shell/PowerShell com fluxo de permissão
- ✅ Multi-provedor: Ollama, OpenAI, Gemini, Mistral, Codex, Anthropic
- ✅ MCP (Model Context Protocol), agentes, tarefas, memória, sessões
- ✅ Extensão VS Code em `vscode-extension/lyacloud-vscode`
- ✅ Site/documentação em `web/`
- ✅ 4607 testes verdes, typecheck verde, smoke verde
- ✅ Anti-phone-home verificado (`bun run verify:privacy`)

---

## 🧪 Desenvolvimento a partir do código-fonte

O projeto usa **Bun** como gerenciador de dependências, executor de scripts e ferramenta de build.

### Setup

```bash
git clone https://github.com/StudioCodeAI/lyacloud.git
cd lyacloud
bun install
bun install --cwd web
```

### Build + run

```bash
bun run build          # builda dist/cli.mjs
node bin/lyacloud      # roda o CLI
```

### Comandos de validação

```bash
bun run typecheck                    # tsc --noEmit
bun run smoke                        # build + sanity (CLI + SDK + exports)
bun test                             # todos os testes
bun test --max-concurrency=1         # suite cheia (recomendado)
bun run doctor:runtime               # diagnóstico runtime
bun run doctor:runtime:json          # relatório JSON
bun run verify:privacy               # anti-phone-home
bun run hardening:strict             # typecheck + smoke + doctor
```

### Build do instalador Windows (.exe)

```bash
bun run build:installer:windows
```

Saída em `dist/installer/`:
- `lyacloud-setup-x64-1.0.0.exe` (Windows com iexpress)
- `lyacloud-portable-1.0.0/` (pasta extraída, fallback multi-plataforma)
- `studiocodeai-lyacloud-1.0.0.tgz` (tarball npm)

---

## 📦 Publicar release no GitHub

O workflow em `.github/workflows/release.yml` builda automaticamente quando você dá push de uma tag `v*.*.*`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

O GitHub Actions:
1. Builda o CLI
2. Gera o tarball npm
3. Builda o instalador Windows (`.exe`)
4. Cria o GitHub Release com todos os artefatos
5. Adiciona instruções de instalação prontas para copiar

---

## 🧭 Papel no ecossistema Studio CodeAI

- **Lya Studio Coder** — cockpit/IDE maior, multi-IA, editor, automações, orquestração visual
- **Lya Cloud** *(este projeto)* — CLI Star 1, terminal-first, instalável, scriptável, base de execução local/cloud

Lya Cloud funciona sozinha no terminal e serve como fundação CLI para fluxos do Lya Studio Coder.

---

## 🔗 Aliases do binário

Todos equivalentes, apontam para `dist/cli.mjs`:

```text
lyacloud   # canônico
lscloud    # short cloud
lya        # curto (recomendado)
lyacode    # legacy (sucessor de LyaCode v0.1.0)
lscode     # short code
```

---

## 📜 Licença

Veja [LICENSE](./LICENSE).

---

## 🙌 Créditos

**Luis Cardozo** · `studiocoder.ai@gmail.com` · Studio CodeAI
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)

---

<sub>Lya Cloud v1.0.0 — produção estável · Built with Lya 🟠</sub>
