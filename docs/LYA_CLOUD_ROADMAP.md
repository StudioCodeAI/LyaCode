# Lya Cloud Roadmap

Produto: Lya Cloud
Familia: Studio CodeAI
Categoria: CLI agentic terminal para desenvolvimento local
Papel no ecossistema: CLI Star 1 e camada terminal da Lya Studio Coder
Base inicial: coding-agent CLI herdada
Status: fundacao

## Visao

Lya Cloud sera uma CLI agentic terminal da familia Studio CodeAI. Ela nasce como Star 1: a camada CLI que pode operar sozinha no terminal e tambem servir a irma mais velha, `StudioCodeAI/Lya-Studio-Coder`, como base terminal-first para tarefas agentic em projetos reais.

O produto deve manter o que a base atual ja entrega bem: terminal interativo, ferramentas de arquivos, shell, provedores, agentes, memoria, MCP, tarefas e extensao VS Code. A primeira etapa nao e reescrever o motor. A primeira etapa e transformar identidade, distribuicao e governanca sem quebrar a base funcional.

Na tela inicial, o alvo e consolidar a identidade:

```text
LYA CLOUD
Um produto Studio CodeAI
```

O comando principal sugerido para a CLI e:

```text
lyacloud
```

Aliases futuros possiveis:

```text
lya
lyacode
```

## Decisao De Arquitetura

A base principal do novo produto e o projeto na raiz. O projeto antigo `StudioCodeAI/LyaCode` foi descontinuado, e sua evolucao oficial migrou para o Lya Cloud. Ele fica como legado historico e referencia de inspiracao, mas nao e produto paralelo nem arquitetura principal. A CLI atual deve evoluir a partir do motor terminal-first existente.

`StudioCodeAI/Lya-Studio-Coder` e a irma mais velha do ecossistema: cockpit/IDE visual, multi-IA e local-first. Lya Cloud nao substitui essa aplicacao. Lya Cloud fornece a CLI Star 1: uma camada menor, instalavel, scriptavel e terminal-first que pode ser usada de forma independente ou integrada a fluxos da Lya Studio Coder.

## Regra De Identidade

`Lya Cloud` e a identidade final do produto. A marca herdada da base original deve sair da interface, documentacao, pacote, binarios, site e extensao.

`Claude Code` nao e tratado como marca do nosso produto quando aparecer como provider, rota, compatibilidade tecnica, modelo, variavel herdada ou integracao. Nesses casos, ele pode permanecer ate a area tecnica ser substituida por uma alternativa propria.

## Inventario De Identidade

### Trocar Primeiro

Estes pontos sao identidade pura e devem mudar na primeira fase de implementacao:

- `package.json`: nome do pacote, descricao, binario, repositorio e scripts que chamam `lyacloud`.
- `bin/lyacloud`: criar launcher `bin/lyacloud` e trocar mensagens de erro.
- `src/constants/brand.ts`: nome, tagline, cor principal e wordmark.
- `src/components/StartupScreen.ts`: logo grande, texto de versao e tagline da tela inicial.
- `src/components/StartupScreen.palettes.ts`: labels e comentario de paleta.
- `src/constants/product.ts`: `PRODUCT_DISPLAY_NAME` e URL de produto.
- `scripts/build.ts`: nome exibido no build, pacote, URLs de feedback e issues.
- `README.md`: substituir documentacao publica por README minimo de Lya Cloud.
- `docs/quick-start-windows.md` e `docs/quick-start-mac-linux.md`: atualizar comando e instalacao.
- `web/package.json`, `web/src/data/site.ts`, `web/public/*`: identidade do site.
- `vscode-extension/lyacloud-vscode/package.json`: nome, displayName, comandos e prefixos.

### Trocar Com Cuidado

Estes nomes aparecem como configuracao, persistencia ou compatibilidade. Devem migrar com fallback para nao perder dados do usuario:

- Consolidar config em `LYACLOUD_CONFIG_DIR`.
- Consolidar diretorio de usuario em `~/.lyacloud`.
- Consolidar perfil de workspace em `.lyacloud-profile.json`.
- Variaveis de heap como `LYACLOUD_NODE_MAX_OLD_SPACE_SIZE_MB`.
- Logs, sessoes em background e diretorios de memoria.
- Nomes internos de funcoes como `getClaudeConfigHomeDir`, que podem ser renomeados depois de estabilizar a migracao.

### Manter Por Enquanto

Estas referencias nao sao apenas marca. Muitas ainda fazem parte de suporte a provider, protocolo ou compatibilidade:

- Referencias a Claude Code quando significarem provider, integracao ou compatibilidade tecnica.
- Modelos Anthropic e nomes de modelos Claude.
- Variaveis `CLAUDE_CODE_*` usadas como compatibilidade herdada.
- Rotas e tipos de `claude.ai` relacionados a bridge/remote, ate decidirmos remover ou substituir essa area.
- Documentacao de provider Anthropic, Bedrock e Vertex.
- Testes que garantem compatibilidade com caminhos antigos.

## Fases Do Projeto

### Fase 0 — Preparacao

Objetivo: preparar a base para virar projeto proprio sem contaminar o futuro Git.

Entregas:
- Remover ou isolar metadados antigos de Git.
- Decidir se `LyaCode/` fica como referencia fora do repo final ou em `legacy/`.
- Atualizar `.gitignore` para excluir `LyaCode/node_modules`, builds e `.git` internos se a pasta continuar dentro.
- Instalar dependencias da raiz.
- Rodar `bun run smoke` ou build minimo.

Saida esperada:
- Base local limpa e executavel.
- Nenhuma mudanca grande de codigo ainda.

### Fase 1 — Identidade Minima Lya Cloud

Objetivo: a CLI abrir como Lya Cloud.

Entregas:
- Criar launcher `bin/lyacloud`.
- Atualizar `package.json` para expor comando `lyacloud`.
- Alterar `BRAND_NAME` para `Lya Cloud`.
- Alterar tagline para `Um produto Studio CodeAI` ou `Agentic terminal by Studio CodeAI`.
- Trocar logo grande da startup screen para Lya Cloud.
- Trocar texto de versao para `lyacloud`.
- Manter alias `lyacloud` temporario apenas se for util para compatibilidade local.

Validacao:
- `bun run build`
- `node bin/lyacloud --version`
- Abrir a CLI e confirmar visual da tela inicial.

### Fase 2 — Configuracao E Persistencia Proprias

Objetivo: parar de gravar dados em caminhos Lya Cloud.

Entregas:
- Criar `LYACLOUD_CONFIG_DIR`.
- Criar `~/.lyacloud`.
- Criar perfil `.lyacloud-profile.json`.
- Migrar dados antigos somente quando isso for uma decisao explicita de compatibilidade.
- Atualizar mensagens de diagnostico e paths exibidos.

Validacao:
- Criar provider profile novo.
- Reiniciar CLI e confirmar persistencia.
- Conferir que nada novo foi gravado fora de `.lyacloud`.

### Fase 3 — Documentacao Base Do Produto

Objetivo: documentar o produto como Lya Cloud, sem prometer features que ainda nao validamos.

Entregas:
- README novo e direto.
- Quick start Windows.
- Quick start macOS/Linux.
- Documento de arquitetura inicial.
- Documento de seguranca e permissoes.
- Documento de decisoes de identidade.

Validacao:
- Comandos do README executam localmente.
- Nenhuma instrucao aponta para a identidade herdada da base.

### Fase 4 — Provedores E Modelos

Objetivo: manter o que funciona e ajustar a experiencia para Studio CodeAI.

Entregas:
- Revisar `/provider`.
- Definir provedores oficiais do primeiro release.
- Manter OpenAI-compatible, Ollama, Gemini, Anthropic, Codex e OpenRouter quando possivel.
- Exibir provider/model de forma clara na startup.
- Adicionar recomendacao local-first quando Ollama estiver disponivel.

Validacao:
- Um provider cloud funcionando.
- Um provider local funcionando.
- Troca de modelo funcionando via CLI.

### Fase 5 — Experiencia Agentic De Codigo

Objetivo: fazer a CLI parecer nossa, nao apenas renomeada.

Entregas:
- Ajustar system prompt e identidade operacional da Lya.
- Revisar comandos essenciais: `/help`, `/provider`, `/model`, `/status`, `/memory`, `/agents`, `/tasks`.
- Adicionar comando `/studio` ou `/about` mostrando Studio CodeAI.
- Definir contrato inicial para Lya Studio Coder chamar Lya Cloud como CLI de apoio.
- Padronizar linguagem do produto em pt-BR e ingles conforme tela.

Validacao:
- Fluxo real: abrir repo, pedir analise, ler arquivo, editar arquivo, rodar comando, verificar resultado.

### Fase 6 — Memoria E Projeto Local

Objetivo: tornar Lya Cloud util em projetos reais.

Entregas:
- Definir memoria por projeto em `.lyacloud/` ou no config dir.
- Criar resumo de projeto.
- Indexar instrucoes locais como AGENTS.md, README e docs.
- Registrar decisoes importantes de arquitetura.

Validacao:
- Reabrir o mesmo projeto e recuperar contexto util.

### Fase 7 — Seguranca, Permissoes E Auditoria

Objetivo: manter confianca antes de ampliar automacao.

Entregas:
- Revisar permissoes de escrita e shell.
- Confirmar prompts de aprovacao para acoes perigosas.
- Proteger secrets em logs e transcricoes.
- Criar politica clara de auto-execucao.

Validacao:
- Testes focados em file edit, shell, provider secrets e redaction.

### Fase 8 — Extensao VS Code E Site

Objetivo: completar o ecossistema Studio CodeAI.

Entregas:
- Renomear extensao para Lya Cloud ou Studio CodeAI Lya Cloud.
- Atualizar comandos VS Code.
- Atualizar tema e assets.
- Atualizar site em `web/`.

Validacao:
- Extensao instala localmente.
- Comando abre terminal com `lyacloud`.

### Fase 9 — Build, Release E Git Proprio

Objetivo: fechar a primeira versao realmente nossa.

Entregas:
- Limpar pasta legado ou move-la para fora do repo final.
- Inicializar Git novo.
- Primeiro commit da base Lya Cloud.
- Definir versao `0.1.0`.
- Criar checklist de release.

Validacao:
- `bun run build`
- `bun run smoke`
- `bun run typecheck`
- Testes focados das areas alteradas.

## Riscos Principais

- Renomear tudo de uma vez pode quebrar caminhos de config, testes e provider profiles.
- Trocar variaveis `CLAUDE_CODE_*` cedo demais pode quebrar compatibilidade com providers herdados.
- A pasta `LyaCode/` contem `node_modules`, `.git` e artefatos; nao deve entrar no Git final sem limpeza.
- A startup screen tem logo hardcoded; precisa de arte ASCII nova e teste visual no terminal.
- A extensao VS Code tem muitos IDs `lyacloud`; mudar ID sem plano pode quebrar comandos e configuracoes.

## Primeira Implementacao Recomendada

Primeiro PR interno:

- Criar `bin/lyacloud`.
- Atualizar `package.json` para comando `lyacloud`.
- Trocar constantes centrais de marca.
- Trocar startup screen para Lya Cloud.
- Atualizar scripts de dev/start para usar `bin/lyacloud`.
- Validar que nao ha chamadas penduradas para comandos ou arquivos herdados.

Esse primeiro passo entrega a imagem mental que o usuario quer ver no terminal, sem mexer ainda no motor profundo.
