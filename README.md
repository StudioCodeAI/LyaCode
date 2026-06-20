<div align="center">

# Lya Code

**CLI agentic terminal da Studio CodeAI**

Abra qualquer projeto no terminal e trabalhe com Lya: uma IA que le codigo,
edita arquivos, executa comandos e apoia tarefas de engenharia do inicio ao fim.

[![Version](https://img.shields.io/badge/source-1.0.9-orange?style=flat-square)](./package.json)
[![License](https://img.shields.io/badge/license-Proprietary-red?style=flat-square)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-green?style=flat-square)](https://nodejs.org)
[![Studio CodeAI](https://img.shields.io/badge/Studio-CodeAI-ff7a1a?style=flat-square)](https://github.com/StudioCodeAI)
[![Releases](https://img.shields.io/badge/installers-public-brightgreen?style=flat-square)](https://github.com/StudioCodeAI/LyaCode-installers/releases/latest)

</div>

---

## Status

Lya Code e o CLI Star 1 da familia Studio CodeAI: terminal-first, instalavel,
scriptavel e preparado para servir como camada de execucao para o Lya Studio
Coder.

O codigo-fonte fica no repositorio `StudioCodeAI/LyaCode`. Instaladores,
pacotes e releases publicas ficam em `StudioCodeAI/LyaCode-installers`.

Versao atual: **v1.0.9**.

---

## Instalacao

Veja a release mais recente em:

[github.com/StudioCodeAI/LyaCode-installers/releases](https://github.com/StudioCodeAI/LyaCode-installers/releases)

Quando a release desejada estiver publicada, instale o pacote `.tgz` com:

```bash
npm install -g https://github.com/StudioCodeAI/LyaCode-installers/releases/download/v<VERSAO>/studiocodeai-lyacode-<VERSAO>.tgz
```

Exemplo para uma release publicada:

```bash
npm install -g https://github.com/StudioCodeAI/LyaCode-installers/releases/download/v1.0.9/studiocodeai-lyacode-1.0.9.tgz
```

### Windows Portable

Baixe o arquivo `lyacode-portable-<VERSAO>.zip` da pagina de releases, extraia
e execute `install.cmd`.

### Windows Installer

Baixe o arquivo `lyacode-setup-x64-<VERSAO>.exe` da pagina de releases e
execute o instalador.

---

## Validacao

Depois de instalar, abra um novo terminal e rode:

```bash
lya --version
lyacode --version
lscode --version
```

Todos os aliases acima apontam para o mesmo binario `lyacode`.

---

## Primeiros Passos

```bash
# Iniciar a CLI
lya

# Dentro da sessao interativa
/provider
/lya
/help
```

`/provider` configura o provedor de IA. Se o Ollama local estiver rodando, ele
aparece como opcao local-first.

`/lya` recarrega a persona Lya explicitamente.

`/help` lista comandos e fluxos disponiveis.

---

## Persona Lya

Lya e a engenheira de software senior da familia Studio CodeAI. Ela combina
arquitetura, execucao pratica, revisao e testes dentro do terminal.

Sub-agentes principais:

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

## Provedores

Lya Code suporta provedores cloud e locais por meio de perfis OpenAI-compatible,
Anthropic, Gemini, DeepSeek, Ollama, MCP e backends locais.

Configure pelo comando:

```text
/provider
```

O motor de LLM deve permanecer trocavel por configuracao. Evite fixar modelo no
codigo quando a escolha puder ser definida por perfil, variavel de ambiente ou
argumento de execucao.

---

## Funcionalidades

- CLI TypeScript com runtime Node.js `>=22.0.0`.
- Interface terminal com React e Ink.
- Gerenciamento de arquivos, busca, edicao e shell com fluxo de permissao.
- Multi-provedor via `/provider`.
- MCP para integracoes externas.
- Agentes, tarefas, memoria de sessao e contexto persistente.
- Extensao VS Code em `vscode-extension/lyacode-vscode`.
- Politica anti-phone-home para telemetria nao autorizada.

---

## Desenvolvimento

Requisitos:

- Node.js `>=22.0.0`
- Bun

Comandos principais:

```bash
bun install
bun run build
bun run smoke
bun run typecheck
```

Checks adicionais:

```bash
bun run check
bun run typecheck:type-tests
bun run doctor:runtime
bun run security:pr-scan
```

Quando alterar comportamento de provedor, consulte primeiro
`docs/integrations/overview.md` e o guia correspondente em
`docs/integrations/how-to/`.

---

## Identidade

| Campo | Valor |
|-------|-------|
| Produto | **Lya Code** |
| Familia | Studio CodeAI |
| Autor | Luis Cardozo |
| Email | `studiocoder.ai@gmail.com` |
| Repositorio | [github.com/StudioCodeAI/LyaCode](https://github.com/StudioCodeAI/LyaCode) |
| Releases | [github.com/StudioCodeAI/LyaCode-installers](https://github.com/StudioCodeAI/LyaCode-installers) |
| Pacote | `@studiocodeai/lyacode` |
| Binario canonico | `lyacode` |
| Aliases | `lya`, `lscode` |

O nome visual oficial e **Lya Code**, em title case. Nao use `LYA CODE` como
marca principal e nao reintroduza `Lya Cloud` em superficies de produto.

---

## Licenca

O codigo-fonte deste projeto e propriedade da Studio CodeAI e tem uso restrito.
Leia [LICENSE](./LICENSE) para detalhes.

Instaladores e binarios podem ser distribuidos conforme a politica definida
pela Studio CodeAI nas releases publicas.

---

<div align="center">
<sub>Lya Code · Studio CodeAI</sub>
</div>
