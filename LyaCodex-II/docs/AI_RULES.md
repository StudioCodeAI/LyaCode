# AI Rules — LyaCodex II

Estas regras existem para impedir retrabalho, conflito de arquitetura e mudanças inseguras.

## 1. Nenhuma IA reescreve arquitetura sem atualizar documentação

Antes de alterar arquitetura:

- atualizar `ARCHITECTURE.md`;
- explicar motivo;
- explicar impacto;
- explicar rollback.

## 2. Segurança vem antes de feature nova

Não implementar:

- execução automática;
- memória longa;
- automação agressiva;
- envio automático de arquivos;

antes de:

- keychain;
- políticas de aprovação;
- logs;
- regras de segurança.

## 3. Frontend não guarda segredo real

Nunca salvar:

- API keys;
- tokens;
- secrets;
- credenciais;

em:

- localStorage;
- Zustand persist;
- logs;
- prompt;
- analytics.

Frontend guarda apenas:

```text
secret://provider/openrouter/default
```

## 4. Não misturar responsabilidades

Não colocar no mesmo arquivo:

- UI;
- provider;
- workspace;
- skills;
- lógica de segurança;
- execução de agente.

## 5. Toda ação do agente deve ser auditável

Toda ação relevante deve informar:

- motivo;
- comando;
- arquivos afetados;
- risco;
- resultado.

## 6. Não interceptar teclas essenciais do terminal

O terminal é prioridade.

Não quebrar:

- `/`
- pipes
- atalhos comuns
- input shell
- comportamento PTY

sem justificativa extremamente forte.

## 7. Mudanças devem ser pequenas

Evitar:

- mega commits;
- reescritas totais;
- alterações sem teste;
- mudanças sem rollback.

## 8. Skills precisam de manifesto

Toda skill deve ter:

- `skill.yml`
- descrição
- permissões
- categoria
- triggers
- exemplos

## 9. O usuário sempre tem controle

O usuário deve poder:

- aprovar;
- negar;
- editar;
- cancelar;
- desfazer.

## 10. O projeto deve continuar leve

Evitar:

- dependências gigantes sem necessidade;
- frameworks pesados;
- excesso de abstração;
- processos em segundo plano desnecessários.
