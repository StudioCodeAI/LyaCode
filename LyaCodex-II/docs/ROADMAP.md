# Roadmap — LyaCodex II

## Filosofia

O projeto deve crescer em fases pequenas, testáveis e reversíveis.

Nada de:

- reescrever tudo de uma vez;
- adicionar 1000 features sem base;
- múltiplas IAs alterando arquitetura ao mesmo tempo.

---

# Fase 0 — Constituição

Objetivo: impedir bagunça arquitetural.

## Entregas

- ARCHITECTURE.md
- AI_RULES.md
- SECURITY.md
- ROADMAP.md
- SKILL_SPEC.md

## Resultado esperado

- visão única do projeto;
- regras claras;
- separação correta de responsabilidades.

---

# Fase 1 — Núcleo seguro

Objetivo: preparar a fundação.

## Entregas

- Lya Keychain
- `keyRef` no frontend
- backend Rust para providers
- timeout
- streaming
- logs seguros

## Resultado esperado

- segredos protegidos;
- providers desacoplados;
- base pronta para expansão.

---

# Fase 2 — Settings e Providers

Objetivo: UX profissional.

## Entregas

- Settings real
- gerenciador de providers
- teste de conexão
- seletor de modelos
- modo de privacidade
- shell manager

## Resultado esperado

- configuração simples;
- troca de modelos fluida;
- providers organizados.

---

# Fase 3 — Workspace Engine

Objetivo: entender projetos reais.

## Entregas

- abrir pasta
- árvore de arquivos
- busca
- leitura segura
- git status
- git diff
- patch viewer

## Resultado esperado

- IA entendendo contexto do projeto.

---

# Fase 4 — Agent Runtime

Objetivo: IA capaz de agir com segurança.

## Entregas

- planner
- approval modal
- command runner
- verifier
- rollback básico
- logs reais

## Resultado esperado

- agente útil sem perder controle.

---

# Fase 5 — Skills Engine

Objetivo: sistema modular real.

## Entregas

- manifesto oficial
- skill registry
- ranking
- permissões
- ativação dinâmica
- primeiras skills oficiais

## Resultado esperado

- skills relevantes sem poluir contexto.

---

# Fase 6 — Memory Engine

Objetivo: continuidade.

## Entregas

- SQLite local
- resumo de sessão
- memória do projeto
- decisões técnicas
- histórico de comandos
- preferências

## Resultado esperado

- continuidade entre sessões.

---

# Fase 7 — Produto final

Objetivo: experiência profissional.

## Entregas

- README final
- screenshots
- instalador refinado
- auto-update opcional
- telemetria opcional
- export de logs
- documentação pública

## Resultado esperado

- release pública sólida.
