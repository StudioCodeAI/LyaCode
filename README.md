<div align="center">

# Lya Code

**CLI agentic terminal Ã‚Â· Studio CodeAI**

*Abra qualquer projeto no terminal e trabalhe com Lya Ã¢â‚¬â€ uma IA que lÃƒÂª cÃƒÂ³digo, edita arquivos, executa comandos e apoia tarefas de engenharia do inÃƒÂ­cio ao fim.*

[![Version](https://img.shields.io/badge/version-1.0.6-orange?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/Ã°Å¸â€œÂ¦%20installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

</div>

---

> Ã¢Å¡Â Ã¯Â¸Â **RepositÃƒÂ³rio pÃƒÂºblico Ã¢â‚¬â€ cÃƒÂ³digo-fonte restrito.**
> Este repositÃƒÂ³rio contÃƒÂ©m documentaÃƒÂ§ÃƒÂ£o, identidade do projeto e histÃƒÂ³rico de releases.
> O acesso ao cÃƒÂ³digo-fonte ÃƒÂ© concedido apenas a colaboradores autorizados pela Studio CodeAI.
> Para instalaÃƒÂ§ÃƒÂ£o, use os links abaixo Ã¢â‚¬â€ nenhum acesso ao cÃƒÂ³digo ÃƒÂ© necessÃƒÂ¡rio.

---

## Ã¢Å¡Â¡ InstalaÃƒÂ§ÃƒÂ£o rÃƒÂ¡pida

> Ã°Å¸â€œÂ¦ **Instaladores e releases:** [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

### Multi-plataforma via npm (recomendado)

```bash
npm install -g https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.6/studiocodeai-lyacode-1.0.6.tgz
```

### Windows Ã¢â‚¬â€ Portable .zip

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.6/lyacode-portable-1.0.6.zip -OutFile lyacode-portable.zip
Expand-Archive lyacode-portable.zip -DestinationPath .\lyacode-portable -Force
cd lyacode-portable
.\install.cmd
```

### Windows Ã¢â‚¬â€ Instalador .exe

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.6/lyacode-setup-x64-1.0.6.exe -OutFile lyacode-setup.exe
.\lyacode-setup.exe
```

ApÃƒÂ³s a instalaÃƒÂ§ÃƒÂ£o, abra um **novo terminal** e digite `lya`.

### Validar instalaÃƒÂ§ÃƒÂ£o

Todos os aliases abaixo apontam para o mesmo binÃƒÂ¡rio:

```bash
lya --version       # Ã¢â€ â€™ 1.0.6 (Lya Code)
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

## Ã°Å¸Å¡â‚¬ Primeiros passos

```bash
# 1. Inicie a CLI
lya

# 2. Configure um provedor de IA
> /provider          # Ollama Local aparece 1Ã‚Âº se estiver rodando

# 3. Ative a persona Lya (engenheira sÃƒÂªnior + sub-agentes)
> /lya

# 4. Explore todos os comandos
> /help
```

---

## Ã°Å¸Â§Â  Persona Lya

**Lya** ÃƒÂ© a engenheira de software sÃƒÂªnior e CEO de projeto da famÃƒÂ­lia Studio CodeAI.
Arquitetada para combinar dois estilos complementares:

| Camada | Modelo base | Foco |
|--------|-------------|------|
| **DecisÃƒÂ£o** | Claude Opus | Arquitetura, tradeoffs de longo prazo, evidÃƒÂªncia antes de convicÃƒÂ§ÃƒÂ£o |
| **ExecuÃƒÂ§ÃƒÂ£o** | Sonnet 4.x | Patches cirÃƒÂºrgicos, cobertura typecheck + test + smoke, commits atÃƒÂ´micos |

### 7 Sub-agentes especializados

| Agente | Papel |
|--------|-------|
| `lya-architect` | Design de sistemas, tradeoffs, ADRs |
| `lya-explorer` | InvestigaÃƒÂ§ÃƒÂ£o read-only, mapeamento de cÃƒÂ³digo |
| `lya-reviewer` | Code review prÃƒÂ©-merge com veredito + findings |
| `lya-tester` | Escrita de testes `bun:test` (happy + edge + mocks) |
| `lya-recorder` | Commits, PRs e changelogs no padrÃƒÂ£o Studio CodeAI |
| `lya-memory` | MemÃƒÂ³ria de sessÃƒÂ£o e contexto persistente |
| `lya-provider` | GestÃƒÂ£o de perfis de provedor de IA |

### Invocar Lya

```bash
lya          # inicia o CLI Ã¢â‚¬â€ Lya ÃƒÂ© o agente default
> /lya       # recarrega o system prompt base da Lya explicitamente
> /agents    # lista todos os sub-agentes disponÃƒÂ­veis
```

---

## Ã°Å¸Å’Â Provedores suportados (35+)

Configure via `/provider`. A ordem de exibiÃƒÂ§ÃƒÂ£o:

| # | Provedor | DescriÃƒÂ§ÃƒÂ£o |
|---|----------|-----------|
| 1 | **Ollama Local** | 100% local Ã‚Â· `http://localhost:11434` Ã‚Â· sem chave de API |
| 2 | **Anthropic / Claude** | Provider default Ã‚Â· `ANTHROPIC_API_KEY` |
| 3 | **DashScope** (CN / Intl) | Alibaba Qwen via API |
| 4 | **Atlas Cloud** | OpenAI-compatible |
| 5 | **Azure OpenAI** | Endpoint corporativo Azure |
| 6 | **Bankr** | LLM Gateway OpenAI-compatible |
| 7 | **DeepSeek** | Modelos de raciocÃƒÂ­nio DeepSeek |
| 8 | **Fireworks AI** | Modelos open via Fireworks |
| 9 | **Gemini** | Google Gemini Ã‚Â· `GEMINI_API_KEY` |
| 10 | **Groq** | InferÃƒÂªncia ultra-rÃƒÂ¡pida |
| 11 | **Hicap** | Gateway OpenAI-compatible |
| 12 | **LM Studio** | Local Ã‚Â· interface grÃƒÂ¡fica |
| 13 | **Atomic Chat** | Local Model Provider |
| 14 | **MiniMax** | API MiniMax |
| 15 | **Mistral** | devstral-latest e variantes |
| 16 | **Moonshot AI** | API Kimi / Moonshot |
| 17 | **Kimi Code** | Assinatura Kimi Code |
| 18 | **NEAR AI** | Gateway unificado Claude + GPT + Gemini |
| 19 | **NVIDIA NIM** | Modelos NVIDIA otimizados |
| 20 | **OpenAI** | API OpenAI Ã‚Â· `OPENAI_API_KEY` |
| 21 | **OpenCode Go** | $10/mÃƒÂªs Ã‚Â· 13 modelos open |
| 22 | **OpenCode Zen** | Pay-as-you-go Ã‚Â· 43 modelos |
| 23 | **OpenRouter** | Agregador de 200+ modelos |
| 24 | **Together AI** | Modelos open via Together |
| 25 | **Venice** | OpenAI-compatible |
| 26 | **xAI / Grok** | Grok OpenAI-compatible |
| 27 | **Xiaomi MiMo** | OpenAI-compatible |
| 28 | **Z.AI** | GLM Coding Plan |
| 29 | **Custom** | Qualquer endpoint OpenAI-compatible |
| 30 | **Gitlawb Opengateway** | Gateway via gitlawb.com/opengateway |

---

## Ã°Å¸Â§Â° Funcionalidades

- Ã¢Å“â€¦ CLI TypeScript Ã‚Â· runtime Node.js Ã¢â€°Â¥ 22
- Ã¢Å“â€¦ Interface terminal com React/Ink + gradientes ANSI Studio CodeAI
- Ã¢Å“â€¦ Persona **Lya** com 7 sub-agentes especializados
- Ã¢Å“â€¦ Leitura, busca, ediÃƒÂ§ÃƒÂ£o e inspeÃƒÂ§ÃƒÂ£o de arquivos em qualquer projeto
- Ã¢Å“â€¦ ExecuÃƒÂ§ÃƒÂ£o de shell / PowerShell com fluxo de permissÃƒÂ£o explÃƒÂ­cita
- Ã¢Å“â€¦ Multi-provedor: 35+ provedores configurÃƒÂ¡veis via `/provider`
- Ã¢Å“â€¦ MCP (Model Context Protocol) Ã¢â‚¬â€ integraÃƒÂ§ÃƒÂ£o com servidores externos
- Ã¢Å“â€¦ Agentes, tarefas, memÃƒÂ³ria de sessÃƒÂ£o e contexto persistente
- Ã¢Å“â€¦ ExtensÃƒÂ£o VS Code em `vscode-extension/lyacode-vscode`
- Ã¢Å“â€¦ Anti-phone-home verificado Ã¢â‚¬â€ sem telemetria nÃƒÂ£o autorizada
- Ã¢Å“â€¦ 4607 testes verdes Ã‚Â· typecheck verde Ã‚Â· smoke verde

---

## Ã°Å¸â€â€” Aliases do binÃƒÂ¡rio

Todos equivalentes, apontam para `dist/cli.mjs`:

```text
lya        # curto Ã¢â‚¬â€ recomendado
lyacode   # canÃƒÂ´nico
lscloud    # short cloud
lyacode    # legacy (sucessor de LyaCode v0.1.0)
lscode     # short code
```

---

## Ã°Å¸Â§Â­ Ecossistema Studio CodeAI

```
Studio CodeAI
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ Lya Studio Coder   Ã¢â€ â€™ IDE/cockpit multi-IA, editor, automaÃƒÂ§ÃƒÂµes, orquestraÃƒÂ§ÃƒÂ£o visual
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ Lya Code  Ã¢Ëœâ€¦       Ã¢â€ â€™ CLI Star 1, terminal-first, instalÃƒÂ¡vel, scriptÃƒÂ¡vel
                          (este projeto Ã¢â‚¬â€ base de execuÃƒÂ§ÃƒÂ£o local e cloud)
```

Lya Code funciona sozinha no terminal e serve como fundaÃƒÂ§ÃƒÂ£o CLI para fluxos do Lya Studio Coder.

---

## Ã°Å¸Ââ€”Ã¯Â¸Â Identidade do projeto

| Campo | Valor |
|-------|-------|
| Produto | **Lya Code** |
| FamÃƒÂ­lia | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| RepositÃƒÂ³rio | [github.com/StudioCodeAI/lyacode](https://github.com/StudioCodeAI/lyacode) |
| Releases | [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers) |
| Pacote npm | `@studiocodeai/lyacode` |
| VersÃƒÂ£o atual | **1.0.6** Ã¢â‚¬â€ produÃƒÂ§ÃƒÂ£o estÃƒÂ¡vel |
| PolÃƒÂ­tica | `v0.x.y` = teste Ã‚Â· `v1.0.0+` = produÃƒÂ§ÃƒÂ£o estÃƒÂ¡vel |

---

## Ã°Å¸â€œÅ“ LicenÃƒÂ§a e cÃƒÂ³digo-fonte

O cÃƒÂ³digo-fonte deste projeto ÃƒÂ© **propriedade da Studio CodeAI** e de uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

- Os **instaladores e binÃƒÂ¡rios** sÃƒÂ£o de livre uso para instalaÃƒÂ§ÃƒÂ£o pessoal e comercial.
- O **cÃƒÂ³digo-fonte** nÃƒÂ£o ÃƒÂ© open-source Ã¢â‚¬â€ acesso mediante autorizaÃƒÂ§ÃƒÂ£o da Studio CodeAI.
- ContribuiÃƒÂ§ÃƒÂµes externas sÃƒÂ£o bem-vindas via issues e discussÃƒÂµes neste repositÃƒÂ³rio.

---

## Ã°Å¸â€œÂ¦ Releases e instaladores

Todas as releases, changelogs e artefatos de instalaÃƒÂ§ÃƒÂ£o estÃƒÂ£o disponÃƒÂ­veis publicamente em:

**[github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers)**

---

## Ã°Å¸â„¢Å’ CrÃƒÂ©ditos

**Luis Cardozo** Ã‚Â· `studiocoder.ai@gmail.com` Ã‚Â· Studio CodeAI
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)

---

<div align="center">
<sub>Lya Code v1.0.6 Ã¢â‚¬â€ produÃƒÂ§ÃƒÂ£o estÃƒÂ¡vel Ã‚Â· Built with Lya Ã°Å¸Å¸Â  Ã‚Â· Studio CodeAI</sub>
</div>
