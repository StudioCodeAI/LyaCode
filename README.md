<div align="center">

# Lya Code

**CLI agentic terminal Â· Studio CodeAI**

*Abra qualquer projeto no terminal e trabalhe com Lya â€” uma IA que lÃª cÃ³digo, edita arquivos, executa comandos e apoia tarefas de engenharia do inÃ­cio ao fim.*

[![Version](https://img.shields.io/badge/version-1.0.5-orange?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/ðŸ“¦%20installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

</div>

---

> âš ï¸ **RepositÃ³rio pÃºblico â€” cÃ³digo-fonte restrito.**
> Este repositÃ³rio contÃ©m documentaÃ§Ã£o, identidade do projeto e histÃ³rico de releases.
> O acesso ao cÃ³digo-fonte Ã© concedido apenas a colaboradores autorizados pela Studio CodeAI.
> Para instalaÃ§Ã£o, use os links abaixo â€” nenhum acesso ao cÃ³digo Ã© necessÃ¡rio.

---

## âš¡ InstalaÃ§Ã£o rÃ¡pida

> ðŸ“¦ **Instaladores e releases:** [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

### Multi-plataforma via npm (recomendado)

```bash
npm install -g https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.5/studiocodeai-lyacode-1.0.5.tgz
```

### Windows â€” Portable .zip

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.5/lyacode-portable-1.0.5.zip -OutFile lyacode-portable.zip
Expand-Archive lyacode-portable.zip -DestinationPath .\lyacode-portable -Force
cd lyacode-portable
.\install.cmd
```

### Windows â€” Instalador .exe

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.5/lyacode-setup-x64-1.0.5.exe -OutFile lyacode-setup.exe
.\lyacode-setup.exe
```

ApÃ³s a instalaÃ§Ã£o, abra um **novo terminal** e digite `lya`.

### Validar instalaÃ§Ã£o

Todos os aliases abaixo apontam para o mesmo binÃ¡rio:

```bash
lya --version       # â†’ 1.0.5 (Lya Code)
lyacode --version
lscloud --version
lyacode --version
lscode --version
```

### Desinstalar

```bash
npm uninstall -g @studiocodeai/lyacode
```

---

## ðŸš€ Primeiros passos

```bash
# 1. Inicie a CLI
lya

# 2. Configure um provedor de IA
> /provider          # Ollama Local aparece 1Âº se estiver rodando

# 3. Ative a persona Lya (engenheira sÃªnior + sub-agentes)
> /lya

# 4. Explore todos os comandos
> /help
```

---

## ðŸ§  Persona Lya

**Lya** Ã© a engenheira de software sÃªnior e CEO de projeto da famÃ­lia Studio CodeAI.
Arquitetada para combinar dois estilos complementares:

| Camada | Modelo base | Foco |
|--------|-------------|------|
| **DecisÃ£o** | Claude Opus | Arquitetura, tradeoffs de longo prazo, evidÃªncia antes de convicÃ§Ã£o |
| **ExecuÃ§Ã£o** | Sonnet 4.x | Patches cirÃºrgicos, cobertura typecheck + test + smoke, commits atÃ´micos |

### 7 Sub-agentes especializados

| Agente | Papel |
|--------|-------|
| `lya-architect` | Design de sistemas, tradeoffs, ADRs |
| `lya-explorer` | InvestigaÃ§Ã£o read-only, mapeamento de cÃ³digo |
| `lya-reviewer` | Code review prÃ©-merge com veredito + findings |
| `lya-tester` | Escrita de testes `bun:test` (happy + edge + mocks) |
| `lya-recorder` | Commits, PRs e changelogs no padrÃ£o Studio CodeAI |
| `lya-memory` | MemÃ³ria de sessÃ£o e contexto persistente |
| `lya-provider` | GestÃ£o de perfis de provedor de IA |

### Invocar Lya

```bash
lya          # inicia o CLI â€” Lya Ã© o agente default
> /lya       # recarrega o system prompt base da Lya explicitamente
> /agents    # lista todos os sub-agentes disponÃ­veis
```

---

## ðŸŒ Provedores suportados (35+)

Configure via `/provider`. A ordem de exibiÃ§Ã£o:

| # | Provedor | DescriÃ§Ã£o |
|---|----------|-----------|
| 1 | **Ollama Local** | 100% local Â· `http://localhost:11434` Â· sem chave de API |
| 2 | **Anthropic / Claude** | Provider default Â· `ANTHROPIC_API_KEY` |
| 3 | **DashScope** (CN / Intl) | Alibaba Qwen via API |
| 4 | **Atlas Cloud** | OpenAI-compatible |
| 5 | **Azure OpenAI** | Endpoint corporativo Azure |
| 6 | **Bankr** | LLM Gateway OpenAI-compatible |
| 7 | **DeepSeek** | Modelos de raciocÃ­nio DeepSeek |
| 8 | **Fireworks AI** | Modelos open via Fireworks |
| 9 | **Gemini** | Google Gemini Â· `GEMINI_API_KEY` |
| 10 | **Groq** | InferÃªncia ultra-rÃ¡pida |
| 11 | **Hicap** | Gateway OpenAI-compatible |
| 12 | **LM Studio** | Local Â· interface grÃ¡fica |
| 13 | **Atomic Chat** | Local Model Provider |
| 14 | **MiniMax** | API MiniMax |
| 15 | **Mistral** | devstral-latest e variantes |
| 16 | **Moonshot AI** | API Kimi / Moonshot |
| 17 | **Kimi Code** | Assinatura Kimi Code |
| 18 | **NEAR AI** | Gateway unificado Claude + GPT + Gemini |
| 19 | **NVIDIA NIM** | Modelos NVIDIA otimizados |
| 20 | **OpenAI** | API OpenAI Â· `OPENAI_API_KEY` |
| 21 | **OpenCode Go** | $10/mÃªs Â· 13 modelos open |
| 22 | **OpenCode Zen** | Pay-as-you-go Â· 43 modelos |
| 23 | **OpenRouter** | Agregador de 200+ modelos |
| 24 | **Together AI** | Modelos open via Together |
| 25 | **Venice** | OpenAI-compatible |
| 26 | **xAI / Grok** | Grok OpenAI-compatible |
| 27 | **Xiaomi MiMo** | OpenAI-compatible |
| 28 | **Z.AI** | GLM Coding Plan |
| 29 | **Custom** | Qualquer endpoint OpenAI-compatible |
| 30 | **Gitlawb Opengateway** | Gateway via gitlawb.com/opengateway |

---

## ðŸ§° Funcionalidades

- âœ… CLI TypeScript Â· runtime Node.js â‰¥ 22
- âœ… Interface terminal com React/Ink + gradientes ANSI Studio CodeAI
- âœ… Persona **Lya** com 7 sub-agentes especializados
- âœ… Leitura, busca, ediÃ§Ã£o e inspeÃ§Ã£o de arquivos em qualquer projeto
- âœ… ExecuÃ§Ã£o de shell / PowerShell com fluxo de permissÃ£o explÃ­cita
- âœ… Multi-provedor: 35+ provedores configurÃ¡veis via `/provider`
- âœ… MCP (Model Context Protocol) â€” integraÃ§Ã£o com servidores externos
- âœ… Agentes, tarefas, memÃ³ria de sessÃ£o e contexto persistente
- âœ… ExtensÃ£o VS Code em `vscode-extension/lyacode-vscode`
- âœ… Anti-phone-home verificado â€” sem telemetria nÃ£o autorizada
- âœ… 4607 testes verdes Â· typecheck verde Â· smoke verde

---

## ðŸ”— Aliases do binÃ¡rio

Todos equivalentes, apontam para `dist/cli.mjs`:

```text
lya        # curto â€” recomendado
lyacode   # canÃ´nico
lscloud    # short cloud
lyacode    # legacy (sucessor de LyaCode v0.1.0)
lscode     # short code
```

---

## ðŸ§­ Ecossistema Studio CodeAI

```
Studio CodeAI
â”œâ”€â”€ Lya Studio Coder   â†’ IDE/cockpit multi-IA, editor, automaÃ§Ãµes, orquestraÃ§Ã£o visual
â””â”€â”€ Lya Code  â˜…       â†’ CLI Star 1, terminal-first, instalÃ¡vel, scriptÃ¡vel
                          (este projeto â€” base de execuÃ§Ã£o local e cloud)
```

Lya Code funciona sozinha no terminal e serve como fundaÃ§Ã£o CLI para fluxos do Lya Studio Coder.

---

## ðŸ—ï¸ Identidade do projeto

| Campo | Valor |
|-------|-------|
| Produto | **Lya Code** |
| FamÃ­lia | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| RepositÃ³rio | [github.com/StudioCodeAI/lyacode](https://github.com/StudioCodeAI/lyacode) |
| Releases | [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers) |
| Pacote npm | `@studiocodeai/lyacode` |
| VersÃ£o atual | **1.0.5** â€” produÃ§Ã£o estÃ¡vel |
| PolÃ­tica | `v0.x.y` = teste Â· `v1.0.0+` = produÃ§Ã£o estÃ¡vel |

---

## ðŸ“œ LicenÃ§a e cÃ³digo-fonte

O cÃ³digo-fonte deste projeto Ã© **propriedade da Studio CodeAI** e de uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

- Os **instaladores e binÃ¡rios** sÃ£o de livre uso para instalaÃ§Ã£o pessoal e comercial.
- O **cÃ³digo-fonte** nÃ£o Ã© open-source â€” acesso mediante autorizaÃ§Ã£o da Studio CodeAI.
- ContribuiÃ§Ãµes externas sÃ£o bem-vindas via issues e discussÃµes neste repositÃ³rio.

---

## ðŸ“¦ Releases e instaladores

Todas as releases, changelogs e artefatos de instalaÃ§Ã£o estÃ£o disponÃ­veis publicamente em:

**[github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers)**

---

## ðŸ™Œ CrÃ©ditos

**Luis Cardozo** Â· `studiocoder.ai@gmail.com` Â· Studio CodeAI
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)

---

<div align="center">
<sub>Lya Code v1.0.5 â€” produÃ§Ã£o estÃ¡vel Â· Built with Lya ðŸŸ  Â· Studio CodeAI</sub>
</div>
