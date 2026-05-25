# Onboarding Credits & First-Run Providers

## Ideia

O LyaCodex II deve acordar com uma experiência inicial simples.

O usuário não deve abrir o app e encontrar apenas uma tela vazia pedindo chave.

A proposta é criar um fluxo chamado:

```text
Lya First Run
```

ou:

```text
Lya Starter Engine
```

## Objetivo

Oferecer ao usuário uma primeira experiência guiada com IA sem comprometer segurança, privacidade ou custos inesperados.

## Importante

O LyaCode/LyaCodex II não deve prometer créditos gratuitos de terceiros sem acordo oficial.

Se algum provedor oferecer plano gratuito, free tier, trial ou modelo local, o app pode facilitar o uso, mas sempre com transparência.

## Estratégias possíveis

### 1. Local-first onboarding

Primeira opção sugerida:

- Ollama
- LM Studio
- vLLM local
- llama.cpp server

Fluxo:

```text
Detectar engine local
↓
Listar modelos disponíveis
↓
Sugerir instalação de modelo leve
↓
Rodar primeiro prompt local
```

### 2. User API Key onboarding

O usuário informa sua própria chave:

- OpenAI Key
- OpenRouter Key
- Gemini Key
- Groq Key
- Anthropic Key

A chave é salva no Lya Keychain e usada pelo Model Gateway.

### 3. Free-tier provider presets

O LyaCodex II pode listar provedores que tenham modelos gratuitos ou planos de teste, mas deve deixar claro:

- limites pertencem ao provedor;
- disponibilidade pode mudar;
- usuário deve revisar termos;
- custos podem existir após limite gratuito.

### 4. Official sponsored credits

No futuro, caso exista acordo oficial com algum provedor, o app pode oferecer:

```text
Lya Starter Credits
```

Exemplo conceitual:

```text
Use 100 mensagens iniciais para testar a LyaCodex II.
```

Isso deve ser implementado apenas com backend próprio, controle de abuso, política de privacidade e termos claros.

## OpenAI como marca de inteligência

O LyaCodex II deve suportar OpenAI como provider premium quando o usuário configurar uma OpenAI Key.

Possível UX:

```text
OpenAI
Status: não conectado
Ação: adicionar OpenAI Key ao Lya Keychain
Uso: raciocínio forte, código, agentes e tool calling
```

Não prometer acesso gratuito da OpenAI sem parceria oficial.

## Regras de segurança

1. Nunca embutir chave global no app desktop.
2. Nunca esconder custo do usuário.
3. Nunca usar chave do desenvolvedor em instalação pública.
4. Sempre salvar chaves no Lya Keychain.
5. Sempre permitir modo local-only.

## Primeira experiência ideal

```text
LyaCodex II acorda
↓
Mostra opções:
  1. Usar modelo local
  2. Conectar minha chave
  3. Ver provedores com free tier
↓
Usuário escolhe
↓
Lya testa conexão
↓
Primeiro prompt guiado
```

## Frase de onboarding

```text
Antes de executar, a Lya precisa respirar um motor.
Escolha um modelo local, conecte uma chave ou explore provedores compatíveis.
```
