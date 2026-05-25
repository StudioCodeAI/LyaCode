# Security Policy — LyaCodex II

## Princípio

O LyaCodex II deve ser seguro por padrão. A IA pode sugerir, planejar e explicar, mas ações com impacto real devem passar por controle do usuário.

## Segredos

Segredos incluem:

- API keys;
- tokens;
- senhas;
- arquivos `.env`;
- credenciais locais;
- chaves SSH;
- dados privados de projeto.

### Regras

1. Segredo real nunca deve ser salvo no frontend.
2. Segredo real nunca deve ir para logs.
3. Segredo real nunca deve ser enviado ao prompt sem confirmação explícita.
4. Frontend deve usar apenas `keyRef`.
5. Backend resolve `keyRef` usando o Lya Keychain.

Exemplo correto:

```json
{
  "provider": "openrouter",
  "keyRef": "secret://provider/openrouter/default"
}
```

Exemplo proibido:

```json
{
  "provider": "openrouter",
  "apiKey": "sk-or-v1-..."
}
```

## Níveis de risco

### Safe

Pode acontecer sem confirmação forte:

- explicar código;
- listar arquivos;
- ler arquivos do workspace;
- consultar status local;
- sugerir comando sem executar.

### Ask

Precisa de aprovação:

- escrever arquivo;
- aplicar patch;
- rodar comando;
- instalar pacote;
- alterar configuração;
- enviar trecho de código para modelo online.

### Danger

Precisa de confirmação destacada:

- deletar arquivos;
- alterar PATH;
- rodar script remoto;
- executar comando administrativo;
- enviar `.env` para nuvem;
- alterar git remoto;
- remover dependências em massa.

## Política de execução

Toda ação executável deve conter:

- título;
- descrição;
- risco;
- comando ou arquivos afetados;
- motivo;
- opção de cancelar;
- opção de editar;
- opção de executar.

## Logs

Logs devem registrar eventos, não segredos.

Permitido:

```text
Provider openrouter testado com sucesso.
```

Proibido:

```text
Provider openrouter testado com chave sk-or-v1-abc...
```

## Modelos online

Antes de enviar contexto de projeto para modelo online, o LyaCodex II deve respeitar o modo de privacidade configurado.

Modos desejados:

- `local_only`
- `cloud_allowed`
- `ask_before_cloud`
- `auto`

## Arquivos sensíveis

Por padrão, nunca enviar automaticamente:

- `.env`
- `.pem`
- `.key`
- `.p12`
- `.sqlite`
- `.db`
- `id_rsa`
- `credentials.json`
- diretórios `.git`
- diretórios `node_modules`
- diretórios `target`, `dist`, `build`

## Regra final

Quando houver dúvida, classificar como `Ask` ou `Danger`, nunca como `Safe`.
