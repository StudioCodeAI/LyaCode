# LyaCodex II Architecture

> Arquitetura oficial do motor LyaCodex II.

## 1. Propósito

O LyaCodex II é o motor responsável por transformar o LyaCode Studio em um ambiente de engenharia assistido por IA, local-first, multi-modelo, seguro e extensível por skills.

## 2. Princípio central

> A IA pensa e propõe. O LyaCode controla, executa, audita e protege.

## 3. Camadas

```text
LyaCode Studio UI
  ↓
Tauri Commands Boundary
  ↓
LyaCodex II Core
  ├── Keychain
  ├── Model Gateway
  ├── Workspace Engine
  ├── Skill Engine
  ├── Agent Runtime
  ├── Memory Engine
  ├── Security Policy
  └── Event Log
```

## 4. Responsabilidades

### UI React

A UI deve cuidar de:

- renderização;
- input do usuário;
- terminal visual;
- chat visual;
- paleta de comandos;
- painéis de configuração;
- diff viewer;
- confirmação de ações.

A UI não deve:

- armazenar API keys reais;
- decidir política de segurança;
- executar comandos perigosos diretamente;
- montar regras complexas de providers;
- enviar arquivos sensíveis para nuvem sem autorização.

### Rust Core

O backend Rust deve cuidar de:

- pseudo-terminal;
- cofre de chaves;
- chamadas de modelos;
- roteamento de provedores;
- workspace;
- skills;
- memória;
- execução de ações;
- logs auditáveis;
- políticas de segurança.

## 5. Módulos do Core

### Keychain

Salva e recupera segredos usando referência segura.

A UI usa:

```text
secret://provider/openrouter/default
```

O Rust resolve a chave real.

### Model Gateway

Interface única para modelos locais e online.

Métodos desejados:

```text
list_models(provider)
test_connection(provider, key_ref)
chat(request)
stream_chat(request)
```

### Workspace Engine

Responsável por abrir, ler e alterar projetos.

Tudo que escreve arquivo deve passar por autorização.

### Skill Engine

Carrega skills, valida manifestos, aplica ranking e injeta apenas skills relevantes no contexto.

### Agent Runtime

Converte pedidos em planos, ações, patches e comandos, sempre respeitando a política de aprovação.

### Memory Engine

Guarda memória de sessão, projeto, decisões técnicas e preferências do usuário.

### Security Policy

Classifica ações em:

- Safe
- Ask
- Danger

### Event Log

Registra ações importantes sem vazar segredos.

## 6. Fluxo de agente

```text
User Request
  ↓
Intent Detection
  ↓
Workspace Context
  ↓
Skill Selection
  ↓
Model Routing
  ↓
Plan Generation
  ↓
User Approval
  ↓
Execution
  ↓
Verification
  ↓
Memory Update
```

## 7. Regras de ouro

1. API key real nunca fica no frontend.
2. IA nunca executa comando destrutivo sem aprovação.
3. Skills não são prompts soltos; são módulos com manifesto.
4. O terminal deve permanecer confiável acima de qualquer feature de IA.
5. Toda ação do agente deve ser auditável.
6. O usuário sempre deve poder cancelar, editar ou negar uma ação.
