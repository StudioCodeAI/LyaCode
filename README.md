<div align="center">

# Lya Code

**CLI agentic terminal da Studio CodeAI — Star 1 da familia**

Abra qualquer projeto no terminal e trabalhe com Lya: uma IA que le codigo,
edita arquivos, executa comandos e apoia tarefas de engenharia do inicio ao fim.
Suporta provedores cloud e locais por meio de um perfil unificado.

[![Version](https://img.shields.io/badge/source-1.0.9-orange?style=flat-square)](./package.json)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/LyaCode-installers/releases/latest)

</div>

---

## O que e o Lya Code?

Lya Code e o CLI agentic do ecossistema Studio CodeAI. Voce abre um terminal
em qualquer projeto e a Lya — a IA embutida — le o codigo, edita arquivos,
roda comandos e raciocina sobre problemas de engenharia em tempo real.

Principais capacidades:

- **Multi-provedor** — Anthropic Claude, Gemini, OpenAI, DeepSeek, Ollama local e outros via `/provider`
- **Ferramentas de codigo** — ler/editar/escrever arquivos, Bash, grep, glob, busca web, MCP
- **Agentes especializados** — time Lya com 8 sub-agentes (arquiteto, explorador, revisor, testador, recorder, memoria, provedor)
- **Sessoes em segundo plano** — tarefas longas rodando sem bloquear o terminal
- **Extensao VS Code** — lancamento e integracao com tema Studio CodeAI

---

## Instalacao rapida (Windows)

```powershell
irm https://raw.githubusercontent.com/StudioCodeAI/LyaCode-installers/main/quick-install.ps1 | iex
```

> Requer Node.js `>=22.0.0`. Baixe em [nodejs.org](https://nodejs.org/dist/latest-v22.x/).

### Via npm (qualquer plataforma)

```bash
npm install -g @studiocodeai/lyacode@latest
```

### Windows Portable

Baixe `lyacode-portable-<versao>.zip` em [LyaCode-installers/releases](https://github.com/StudioCodeAI/LyaCode-installers/releases/latest),
extraia e execute `install.cmd`.

### Windows Installer

Baixe `lyacode-setup-x64-<versao>.exe` em [LyaCode-installers/releases](https://github.com/StudioCodeAI/LyaCode-installers/releases/latest)
e execute o instalador.

### Versao especifica via tgz

```bash
npm install -g https://github.com/StudioCodeAI/LyaCode-installers/releases/download/v1.0.9/studiocodeai-lyacode-1.0.9.tgz
```

---

## Verificar instalacao

```bash
lya --version
lyacode --version
lscode --version
```

Todos os aliases apontam para o mesmo binario. Esperado: `1.0.9 (Lya Code)`.

---

## Primeiros passos

```bash
# Iniciar a CLI
lya

# Dentro da sessao interativa
/provider     # configurar provedor de IA (Anthropic, Ollama, Gemini...)
/lya          # ativar a persona Lya (engenheira senior Studio CodeAI)
/help         # listar todos os comandos disponiveis
```

### Sessoes em segundo plano

```bash
lya --bg "corrija os testes falhando"
lya --bg --name refactor "refatora o middleware de autenticacao"
lya ps                      # listar sessoes ativas
lya logs refactor           # ver saida da sessao
lya logs refactor -f        # seguir em tempo real
lya kill refactor           # encerrar a sessao
```

---

## Persona Lya

Lya e a engenheira de software senior da familia Studio CodeAI. Ela combina
arquitetura, execucao pratica, revisao e testes dentro do terminal.

Sub-agentes disponiveis (invoke via `/agents` ou `Task(agent=<nome>)`):

| Agente | Papel |
|--------|-------|
| `lya` | Agente principal: engenharia geral, roadmap, decisao |
| `lya-architect` | Arquitetura, tradeoffs e ADRs |
| `lya-explorer` | Investigacao read-only e mapeamento de codigo |
| `lya-reviewer` | Code review com findings e riscos |
| `lya-tester` | Testes focados com `bun:test` |
| `lya-recorder` | Commits, PRs e changelogs |
| `lya-memory` | Memoria de sessao e handoffs persistentes |
| `lya-provider` | Perfis e rotas de provedores de IA |

---

## Provedores suportados

Configure com `/provider` ou variaveis de ambiente:

| Provedor | Variavel de ambiente |
|----------|---------------------|
| Anthropic Claude | `ANTHROPIC_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` (+ `CLAUDE_CODE_USE_GEMINI=1`) |
| OpenAI / compativel | `OPENAI_API_KEY` (+ `CLAUDE_CODE_USE_OPENAI=1`) |
| DeepSeek | `OPENAI_API_KEY` + base URL DeepSeek |
| Ollama (local) | sem chave — configure o perfil com `/provider` |
| GitHub Models | `CLAUDE_CODE_USE_GITHUB=1` |
| OpenRouter, Groq, MiniMax, e outros | via perfil OpenAI-compativel |

---

## Desinstalar

```bash
npm uninstall -g @studiocodeai/lyacode
```

Todos os aliases (`lya`, `lyacode`, `lscode`) sao removidos juntos.

---

## Desenvolvimento

Requisitos: Node.js `>=22.0.0` + [Bun](https://bun.sh)

```bash
bun install
bun run build
bun run smoke        # verifica: node dist/cli.mjs --version
bun run typecheck
bun test             # suites completas
bun run doctor:runtime
```

Quando alterar comportamento de provedor, consulte primeiro
`docs/integrations/overview.md` e o guia em `docs/integrations/how-to/`.

---

## Identidade

| Campo | Valor |
|-------|-------|
| Produto | **Lya Code** |
| Familia | Studio CodeAI (Star 1) |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| Repositorio (fonte) | [StudioCodeAI/LyaCode](https://github.com/StudioCodeAI/LyaCode) |
| Releases publicas | [StudioCodeAI/LyaCode-installers](https://github.com/StudioCodeAI/LyaCode-installers) |
| Pacote npm | `@studiocodeai/lyacode` |
| Binario canonico | `lyacode` |
| Aliases | `lya`, `lscode` |
| Versao atual | **v1.0.9** |

---

## Licenca

O codigo-fonte deste projeto e propriedade da Studio CodeAI e tem uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

Instaladores e binarios podem ser distribuidos conforme a politica definida
pela Studio CodeAI nas releases publicas.

---

<div align="center">
<sub>Lya Code · Studio CodeAI · Star 1</sub>
</div>
