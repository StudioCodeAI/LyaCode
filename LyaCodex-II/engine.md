# LyaCodex II Engine Overview

O LyaCodex II será dividido em módulos desacoplados.

## Módulos planejados

### keychain
Responsável por segredos, API keys e integração com cofres do sistema operacional.

### models
Responsável pelo gateway multi-provider e roteamento de modelos.

### workspace
Responsável por abrir projetos, ler arquivos, git status e patches.

### skills
Responsável por skills, ranking, permissões e contexto.

### agent
Responsável por planejamento, aprovação e execução.

### memory
Responsável por memória local e decisões persistentes.

### security
Responsável por políticas de risco, aprovação e auditoria.

## Objetivo técnico

Separar o motor do frontend para permitir:

- estabilidade;
- segurança;
- escalabilidade;
- testes;
- manutenção limpa;
- evolução gradual.
