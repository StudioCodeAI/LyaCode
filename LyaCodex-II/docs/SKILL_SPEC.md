# Skill Specification — LyaCodex II

## Objetivo

Skills no LyaCodex II não são prompts soltos.

Cada skill deve ser:

- modular;
- segura;
- versionada;
- documentada;
- ativável sob demanda.

---

# Estrutura mínima

```text
skills/
└── category/
    └── skill-name/
        ├── skill.yml
        ├── prompt.md
        ├── examples.md
        └── README.md
```

---

# skill.yml

Toda skill deve possuir manifesto.

Exemplo:

```yaml
id: git.commit-assistant
name: Commit Assistant
version: 1.0.0
description: Ajuda a criar mensagens de commit e revisar alterações
category: git
author: LyaCode
permissions:
  filesystem: read
  shell: deny
  network: deny
triggers:
  - commit
  - git diff
  - staged files
inputs:
  - git_status
  - git_diff
outputs:
  - markdown
  - command_suggestion
```

---

# Categorias sugeridas

```text
coding/
debugging/
git/
frontend/
backend/
python/
javascript/
rust/
tauri/
devops/
database/
security/
linux/
windows/
powershell/
docker/
kubernetes/
ai/
documentation/
```

---

# Permissões

## filesystem

```text
none
read
write
```

## shell

```text
deny
ask
allow
```

## network

```text
deny
ask
allow
```

---

# Ativação

O sistema nunca deve carregar 1000 skills no prompt.

Fluxo correto:

```text
Pedido do usuário
↓
Classificação de intenção
↓
Busca de skills relevantes
↓
Ranking
↓
Ativação top 3 ou top 5
↓
Injeção no contexto
```

---

# Boas práticas

## Fazer

- skills pequenas;
- focadas;
- com exemplos;
- com permissões mínimas;
- com linguagem clara.

## Evitar

- prompts gigantes;
- permissões excessivas;
- dependência entre skills;
- lógica duplicada;
- múltiplos assuntos na mesma skill.

---

# Objetivo futuro

Permitir:

- skills oficiais;
- skills da comunidade;
- marketplace;
- assinatura digital;
- versionamento;
- ranking por qualidade;
- sandbox.
