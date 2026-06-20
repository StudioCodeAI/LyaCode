<div align="center">

# Lya Code

**CLI agentic terminal Ãƒâ€šÃ‚Â· Studio CodeAI**

*Abra qualquer projeto no terminal e trabalhe com Lya ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â uma IA que lÃƒÆ’Ã‚Âª cÃƒÆ’Ã‚Â³digo, edita arquivos, executa comandos e apoia tarefas de engenharia do inÃƒÆ’Ã‚Â­cio ao fim.*

[![Version](https://img.shields.io/badge/version-1.0.7-orange?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦%20installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

</div>

---

> ÃƒÂ¢Ã…Â¡Ã‚Â ÃƒÂ¯Ã‚Â¸Ã‚Â **RepositÃƒÆ’Ã‚Â³rio pÃƒÆ’Ã‚Âºblico ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â cÃƒÆ’Ã‚Â³digo-fonte restrito.**
> Este repositÃƒÆ’Ã‚Â³rio contÃƒÆ’Ã‚Â©m documentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, identidade do projeto e histÃƒÆ’Ã‚Â³rico de releases.
> O acesso ao cÃƒÆ’Ã‚Â³digo-fonte ÃƒÆ’Ã‚Â© concedido apenas a colaboradores autorizados pela Studio CodeAI.
> Para instalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, use os links abaixo ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â nenhum acesso ao cÃƒÆ’Ã‚Â³digo ÃƒÆ’Ã‚Â© necessÃƒÆ’Ã‚Â¡rio.

---

## ÃƒÂ¢Ã…Â¡Ã‚Â¡ InstalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o rÃƒÆ’Ã‚Â¡pida

> ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ **Instaladores e releases:** [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers/releases/latest)

### Multi-plataforma via npm (recomendado)

```bash
npm install -g https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.7/studiocodeai-lyacode-1.0.7.tgz
```

### Windows ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Portable .zip

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.7/lyacode-portable-1.0.7.zip -OutFile lyacode-portable.zip
Expand-Archive lyacode-portable.zip -DestinationPath .\lyacode-portable -Force
cd lyacode-portable
.\install.cmd
```

### Windows ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Instalador .exe

```powershell
irm https://github.com/StudioCodeAI/lyacode-installers/releases/download/v1.0.7/lyacode-setup-x64-1.0.7.exe -OutFile lyacode-setup.exe
.\lyacode-setup.exe
```

ApÃƒÆ’Ã‚Â³s a instalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o, abra um **novo terminal** e digite `lya`.

### Validar instalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o

Todos os aliases abaixo apontam para o mesmo binÃƒÆ’Ã‚Â¡rio:

```bash
lya --version       # ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ 1.0.7 (Lya Code)
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

## ÃƒÂ°Ã…Â¸Ã…Â¡Ã¢â€šÂ¬ Primeiros passos

```bash
# 1. Inicie a CLI
lya

# 2. Configure um provedor de IA
> /provider          # Ollama Local aparece 1Ãƒâ€šÃ‚Âº se estiver rodando

# 3. Ative a persona Lya (engenheira sÃƒÆ’Ã‚Âªnior + sub-agentes)
> /lya

# 4. Explore todos os comandos
> /help
```

---

## ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â  Persona Lya

**Lya** ÃƒÆ’Ã‚Â© a engenheira de software sÃƒÆ’Ã‚Âªnior e CEO de projeto da famÃƒÆ’Ã‚Â­lia Studio CodeAI.
Arquitetada para combinar dois estilos complementares:

| Camada | Modelo base | Foco |
|--------|-------------|------|
| **DecisÃƒÆ’Ã‚Â£o** | Claude Opus | Arquitetura, tradeoffs de longo prazo, evidÃƒÆ’Ã‚Âªncia antes de convicÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o |
| **ExecuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o** | Sonnet 4.x | Patches cirÃƒÆ’Ã‚Âºrgicos, cobertura typecheck + test + smoke, commits atÃƒÆ’Ã‚Â´micos |

### 7 Sub-agentes especializados

| Agente | Papel |
|--------|-------|
| `lya-architect` | Design de sistemas, tradeoffs, ADRs |
| `lya-explorer` | InvestigaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o read-only, mapeamento de cÃƒÆ’Ã‚Â³digo |
| `lya-reviewer` | Code review prÃƒÆ’Ã‚Â©-merge com veredito + findings |
| `lya-tester` | Escrita de testes `bun:test` (happy + edge + mocks) |
| `lya-recorder` | Commits, PRs e changelogs no padrÃƒÆ’Ã‚Â£o Studio CodeAI |
| `lya-memory` | MemÃƒÆ’Ã‚Â³ria de sessÃƒÆ’Ã‚Â£o e contexto persistente |
| `lya-provider` | GestÃƒÆ’Ã‚Â£o de perfis de provedor de IA |

### Invocar Lya

```bash
lya          # inicia o CLI ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â Lya ÃƒÆ’Ã‚Â© o agente default
> /lya       # recarrega o system prompt base da Lya explicitamente
> /agents    # lista todos os sub-agentes disponÃƒÆ’Ã‚Â­veis
```

---

## ÃƒÂ°Ã…Â¸Ã…â€™Ã‚Â Provedores suportados (35+)

Configure via `/provider`. A ordem de exibiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o:

| # | Provedor | DescriÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o |
|---|----------|-----------|
| 1 | **Ollama Local** | 100% local Ãƒâ€šÃ‚Â· `http://localhost:11434` Ãƒâ€šÃ‚Â· sem chave de API |
| 2 | **Anthropic / Claude** | Provider default Ãƒâ€šÃ‚Â· `ANTHROPIC_API_KEY` |
| 3 | **DashScope** (CN / Intl) | Alibaba Qwen via API |
| 4 | **Atlas Cloud** | OpenAI-compatible |
| 5 | **Azure OpenAI** | Endpoint corporativo Azure |
| 6 | **Bankr** | LLM Gateway OpenAI-compatible |
| 7 | **DeepSeek** | Modelos de raciocÃƒÆ’Ã‚Â­nio DeepSeek |
| 8 | **Fireworks AI** | Modelos open via Fireworks |
| 9 | **Gemini** | Google Gemini Ãƒâ€šÃ‚Â· `GEMINI_API_KEY` |
| 10 | **Groq** | InferÃƒÆ’Ã‚Âªncia ultra-rÃƒÆ’Ã‚Â¡pida |
| 11 | **Hicap** | Gateway OpenAI-compatible |
| 12 | **LM Studio** | Local Ãƒâ€šÃ‚Â· interface grÃƒÆ’Ã‚Â¡fica |
| 13 | **Atomic Chat** | Local Model Provider |
| 14 | **MiniMax** | API MiniMax |
| 15 | **Mistral** | devstral-latest e variantes |
| 16 | **Moonshot AI** | API Kimi / Moonshot |
| 17 | **Kimi Code** | Assinatura Kimi Code |
| 18 | **NEAR AI** | Gateway unificado Claude + GPT + Gemini |
| 19 | **NVIDIA NIM** | Modelos NVIDIA otimizados |
| 20 | **OpenAI** | API OpenAI Ãƒâ€šÃ‚Â· `OPENAI_API_KEY` |
| 21 | **OpenCode Go** | $10/mÃƒÆ’Ã‚Âªs Ãƒâ€šÃ‚Â· 13 modelos open |
| 22 | **OpenCode Zen** | Pay-as-you-go Ãƒâ€šÃ‚Â· 43 modelos |
| 23 | **OpenRouter** | Agregador de 200+ modelos |
| 24 | **Together AI** | Modelos open via Together |
| 25 | **Venice** | OpenAI-compatible |
| 26 | **xAI / Grok** | Grok OpenAI-compatible |
| 27 | **Xiaomi MiMo** | OpenAI-compatible |
| 28 | **Z.AI** | GLM Coding Plan |
| 29 | **Custom** | Qualquer endpoint OpenAI-compatible |
| 30 | **Gitlawb Opengateway** | Gateway via gitlawb.com/opengateway |

---

## ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â° Funcionalidades

- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ CLI TypeScript Ãƒâ€šÃ‚Â· runtime Node.js ÃƒÂ¢Ã¢â‚¬Â°Ã‚Â¥ 22
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Interface terminal com React/Ink + gradientes ANSI Studio CodeAI
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Persona **Lya** com 7 sub-agentes especializados
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Leitura, busca, ediÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o e inspeÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de arquivos em qualquer projeto
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ ExecuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de shell / PowerShell com fluxo de permissÃƒÆ’Ã‚Â£o explÃƒÆ’Ã‚Â­cita
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Multi-provedor: 35+ provedores configurÃƒÆ’Ã‚Â¡veis via `/provider`
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ MCP (Model Context Protocol) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â integraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o com servidores externos
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Agentes, tarefas, memÃƒÆ’Ã‚Â³ria de sessÃƒÆ’Ã‚Â£o e contexto persistente
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ ExtensÃƒÆ’Ã‚Â£o VS Code em `vscode-extension/lyacode-vscode`
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ Anti-phone-home verificado ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â sem telemetria nÃƒÆ’Ã‚Â£o autorizada
- ÃƒÂ¢Ã…â€œÃ¢â‚¬Â¦ 4607 testes verdes Ãƒâ€šÃ‚Â· typecheck verde Ãƒâ€šÃ‚Â· smoke verde

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ¢â‚¬â€ Aliases do binÃƒÆ’Ã‚Â¡rio

Todos equivalentes, apontam para `dist/cli.mjs`:

```text
lya        # curto ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â recomendado
lyacode   # canÃƒÆ’Ã‚Â´nico
lscloud    # short cloud
lyacode    # legacy (sucessor de LyaCode v0.1.0)
lscode     # short code
```

---

## ÃƒÂ°Ã…Â¸Ã‚Â§Ã‚Â­ Ecossistema Studio CodeAI

```
Studio CodeAI
ÃƒÂ¢Ã¢â‚¬ÂÃ…â€œÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Lya Studio Coder   ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ IDE/cockpit multi-IA, editor, automaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes, orquestraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visual
ÃƒÂ¢Ã¢â‚¬ÂÃ¢â‚¬ÂÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Lya Code  ÃƒÂ¢Ã‹Å“Ã¢â‚¬Â¦       ÃƒÂ¢Ã¢â‚¬Â Ã¢â‚¬â„¢ CLI Star 1, terminal-first, instalÃƒÆ’Ã‚Â¡vel, scriptÃƒÆ’Ã‚Â¡vel
                          (este projeto ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â base de execuÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o local e cloud)
```

Lya Code funciona sozinha no terminal e serve como fundaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o CLI para fluxos do Lya Studio Coder.

---

## ÃƒÂ°Ã…Â¸Ã‚ÂÃ¢â‚¬â€ÃƒÂ¯Ã‚Â¸Ã‚Â Identidade do projeto

| Campo | Valor |
|-------|-------|
| Produto | **Lya Code** |
| FamÃƒÆ’Ã‚Â­lia | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| RepositÃƒÆ’Ã‚Â³rio | [github.com/StudioCodeAI/lyacode](https://github.com/StudioCodeAI/lyacode) |
| Releases | [github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers) |
| Pacote npm | `@studiocodeai/lyacode` |
| VersÃƒÆ’Ã‚Â£o atual | **1.0.7** ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â¡vel |
| PolÃƒÆ’Ã‚Â­tica | `v0.x.y` = teste Ãƒâ€šÃ‚Â· `v1.0.0+` = produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â¡vel |

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã…â€œ LicenÃƒÆ’Ã‚Â§a e cÃƒÆ’Ã‚Â³digo-fonte

O cÃƒÆ’Ã‚Â³digo-fonte deste projeto ÃƒÆ’Ã‚Â© **propriedade da Studio CodeAI** e de uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

- Os **instaladores e binÃƒÆ’Ã‚Â¡rios** sÃƒÆ’Ã‚Â£o de livre uso para instalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o pessoal e comercial.
- O **cÃƒÆ’Ã‚Â³digo-fonte** nÃƒÆ’Ã‚Â£o ÃƒÆ’Ã‚Â© open-source ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â acesso mediante autorizaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o da Studio CodeAI.
- ContribuiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes externas sÃƒÆ’Ã‚Â£o bem-vindas via issues e discussÃƒÆ’Ã‚Âµes neste repositÃƒÆ’Ã‚Â³rio.

---

## ÃƒÂ°Ã…Â¸Ã¢â‚¬Å“Ã‚Â¦ Releases e instaladores

Todas as releases, changelogs e artefatos de instalaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â£o disponÃƒÆ’Ã‚Â­veis publicamente em:

**[github.com/StudioCodeAI/lyacode-installers](https://github.com/StudioCodeAI/lyacode-installers)**

---

## ÃƒÂ°Ã…Â¸Ã¢â€žÂ¢Ã…â€™ CrÃƒÆ’Ã‚Â©ditos

**Luis Cardozo** Ãƒâ€šÃ‚Â· `studiocoder.ai@gmail.com` Ãƒâ€šÃ‚Â· Studio CodeAI
[github.com/StudioCodeAI](https://github.com/StudioCodeAI)

---

<div align="center">
<sub>Lya Code v1.0.7 ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â produÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o estÃƒÆ’Ã‚Â¡vel Ãƒâ€šÃ‚Â· Built with Lya ÃƒÂ°Ã…Â¸Ã…Â¸Ã‚Â  Ãƒâ€šÃ‚Â· Studio CodeAI</sub>
</div>
