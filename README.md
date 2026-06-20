<div align="center">

# Lya Cloud

**CLI agentic terminal · Studio CodeAI**

*Abra qualquer projeto no terminal e trabalhe com Lya — uma IA que lê código, edita arquivos, executa comandos e apoia tarefas de engenharia do início ao fim.*

[![Version](https://img.shields.io/badge/version-1.0.3-orange?style=flat-square)](https://github.com/StudioCodeAI/lyacloud-installers/releases/latest)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/📦%20installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/lyacloud-installers/releases/latest)

</div>

---

> ⚠️ **Repositório público — código-fonte restrito.**
> Este repositório contém documentação, identidade do projeto e histórico de releases.
> O acesso ao código-fonte é concedido apenas a colaboradores autorizados pela Studio CodeAI.
> Para instalação, use os links abaixo — nenhum acesso ao código é necessário.

---

## ⚡ Instalação rápida

> 📦 **Instaladores e releases:** [github.com/StudioCodeAI/lyacloud-installers](https://github.com/StudioCodeAI/lyacloud-installers/releases/latest)

### Multi-plataforma via npm (recomendado)

```bash
npm install -g https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.3/studiocodeai-lyacloud-1.0.3.tgz
```

### Windows — Portable .zip

```powershell
irm https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.3/lyacloud-portable-1.0.3.zip -OutFile lyacloud-portable.zip
Expand-Archive lyacloud-portable.zip -DestinationPath .\lyacloud-portable -Force
cd lyacloud-portable
.\install.cmd
```

### Windows — Instalador .exe

```powershell
irm https://github.com/StudioCodeAI/lyacloud-installers/releases/download/v1.0.3/lyacloud-setup-x64-1.0.3.exe -OutFile lyacloud-setup.exe
.\lyacloud-setup.exe
```

Após a instalação, abra um **novo terminal** e digite `lya`.

### Validar instalação

Todos os aliases abaixo apontam para o mesmo binário:

```bash
lya --version       # → 1.0.3 (Lya Cloud)
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

# 2. Configure um provedor de IA
> /provider          # Ollama Local aparece 1º se estiver rodando

# 3. Ative a persona Lya (engenheira sênior + sub-agentes)
> /lya

# 4. Explore todos os comandos
> /help
```

---

## 🧠 Persona Lya

**Lya** é a engenheira de software sênior e CEO de projeto da família Studio CodeAI.
Arquitetada para combinar dois estilos complementares:

| Camada | Modelo base | Foco |
|--------|-------------|------|
| **Decisão** | Claude Opus | Arquitetura, tradeoffs de longo prazo, evidência antes de convicção |
| **Execução** | Sonnet 4.x | Patches cirúrgicos, cobertura typecheck + test + smoke, commits atômicos |

### 7 Sub-agentes especializados

| Agente | Papel |
|--------|-------|
| `lya-architect` | Design de sistemas, tradeoffs, ADRs |
| `lya-explorer` | Investigação read-only, mapeamento de código |
| `lya-reviewer` | Code review pré-merge com veredito + findings |
| `lya-tester` | Escrita de testes `bun:test` (happy + edge + mocks) |
| `lya-recorder` | Commits, PRs e changelogs no padrão Studio CodeAI |
| `lya-memory` | Memória de sessão e contexto persistente |
| `lya-provider` | Gestão de perfis de provedor de IA |

### Invocar Lya

```bash
lya          # inicia o CLI — Lya é o agente default
> /lya       # recarrega o system prompt base da Lya explicitamente
> /agents    # lista todos os sub-agentes disponíveis
```

---

## 🌐 Provedores suportados (35+)

Configure via `/provider`. A ordem de exibição:

| # | Provedor | Descrição |
|---|----------|-----------|
| 1 | **Ollama Local** | 100% local · `http://localhost:11434` · sem chave de API |
| 2 | **Anthropic / Claude** | Provider default · `ANTHROPIC_API_KEY` |
| 3 | **DashScope** (CN / Intl) | Alibaba Qwen via API |
| 4 | **Atlas Cloud** | OpenAI-compatible |
| 5 | **Azure OpenAI** | Endpoint corporativo Azure |
| 6 | **Bankr** | LLM Gateway OpenAI-compatible |
| 7 | **DeepSeek** | Modelos de raciocínio DeepSeek |
| 8 | **Fireworks AI** | Modelos open via Fireworks |
| 9 | **Gemini** | Google Gemini · `GEMINI_API_KEY` |
| 10 | **Groq** | Inferência ultra-rápida |
| 11 | **Hicap** | Gateway OpenAI-compatible |
| 12 | **LM Studio** | Local · interface gráfica |
| 13 | **Atomic Chat** | Local Model Provider |
| 14 | **MiniMax** | API MiniMax |
| 15 | **Mistral** | devstral-latest e variantes |
| 16 | **Moonshot AI** | API Kimi / Moonshot |
| 17 | **Kimi Code** | Assinatura Kimi Code |
| 18 | **NEAR AI** | Gateway unificado Claude + GPT + Gemini |
| 19 | **NVIDIA NIM** | Modelos NVIDIA otimizados |
| 20 | **OpenAI** | API OpenAI · `OPENAI_API_KEY` |
| 21 | **OpenCode Go** | $10/mês · 13 modelos open |
| 22 | **OpenCode Zen** | Pay-as-you-go · 43 modelos |
| 23 | **OpenRouter** | Agregador de 200+ modelos |
| 24 | **Together AI** | Modelos open via Together |
| 25 | **Venice** | OpenAI-compatible |
| 26 | **xAI / Grok** | Grok OpenAI-compatible |
| 27 | **Xiaomi MiMo** | OpenAI-compatible |
| 28 | **Z.AI** | GLM Coding Plan |
| 29 | **Custom** | Qualquer endpoint OpenAI-compatible |
| 30 | **Gitlawb Opengateway** | Gateway via gitlawb.com/opengateway |

---

## 🧰 Funcionalidades

- ✅ CLI TypeScript · runtime Node.js ≥ 22
- ✅ Interface terminal com React/Ink + gradientes ANSI Studio CodeAI
- ✅ Persona **Lya** com 7 sub-agentes especializados
- ✅ Leitura, busca, edição e inspeção de arquivos em qualquer projeto
- ✅ Execução de shell / PowerShell com fluxo de permissão explícita
- ✅ Multi-provedor: 35+ provedores configuráveis via `/provider`
- ✅ MCP (Model Context Protocol) — integração com servidores externos
- ✅ Agentes, tarefas, memória de sessão e contexto persistente
- ✅ Extensão VS Code em `vscode-extension/lyacloud-vscode`
- ✅ Anti-phone-home verificado — sem telemetria não autorizada
- ✅ 4607 testes verdes · typecheck verde · smoke verde

---

## 🔗 Aliases do binário

Todos equivalentes, apontam para `dist/cli.mjs`:

```text
lya        # curto — recomendado
lyacloud   # canônico
lscloud    # short cloud
lyacode    # legacy (sucessor de LyaCode v0.1.0)
lscode     # short code
```

---

## 🧭 Ecossistema Studio CodeAI

```
Studio CodeAI
├── Lya Studio Coder   → IDE/cockpit multi-IA, editor, automações, orquestração visual
└── Lya Cloud  ★       → CLI Star 1, terminal-first, instalável, scriptável
                          (este projeto — base de execução local e cloud)
```

Lya Cloud funciona sozinha no terminal e serve como fundação CLI para fluxos do Lya Studio Coder.

---

## 🏗️ Identidade do projeto

| Campo | Valor |
|-------|-------|
| Produto | **Lya Cloud** |
| Família | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| Repositório | [github.com/StudioCodeAI/lyacloud](https://github.com/StudioCodeAI/lyacloud) |
| Releases | [github.com/StudioCodeAI/lyacloud-installers](https://github.com/StudioCodeAI/lyacloud-installers) |
| Pacote npm | `@studiocodeai/lyacloud` |
| Versão atual | **1.0.3** — produção estável |
| Política | `v0.x.y` = teste · `v1.0.0+` = produção estável |

---

## 📜 Licença e código-fonte

O código-fonte deste projeto é **propriedade da Studio CodeAI** e de uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

- Os **instaladores e binários** são de livre uso para instalação pessoal e comercial.
- O **código-fonte** não é open-source — acesso mediante autorização da Studio CodeAI.
- Contribuições externas são bem-vindas via issues e discussões neste repositório.

---

## 📦 Releases e instaladores

Todas as releases, changelogs e artefatos de instalação estão disponíveis publicamente em:

**[github.com/StudioCodeAI/lyacloud-installers](https://github.com/StudioCodeAI/lyacloud-installers)**

---

## 🙌 Créditos

**Luis Cardozo** · `studiocoder.ai@gmail.com` · Studio CodeAI
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)

---

<div align="center">
<sub>Lya Cloud v1.0.3 — produção estável · Built with Lya 🟠 · Studio CodeAI</sub>
</div>
