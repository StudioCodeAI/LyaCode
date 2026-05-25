# Onboarding & First-Run Engines

## Ideia

O LyaCodex II deve acordar com uma experiência inicial simples, forte e honesta.

O usuário não deve abrir o app e encontrar apenas uma tela vazia pedindo chave. Ele precisa sentir, logo na primeira execução, que o terminal tem estabilidade, inteligência e potencial real.

A proposta é criar um fluxo chamado:

```text
Lya First Run
```

ou:

```text
Lya Engine Selection
```

## Objetivo

Oferecer ao usuário uma primeira experiência guiada com IA sem comprometer segurança, privacidade ou custos inesperados.

## Importante

O LyaCode/LyaCodex II não deve prometer créditos gratuitos de terceiros sem acordo oficial.

Se algum provedor oferecer plano gratuito, free tier, trial ou modelo local/open-weight, o app pode facilitar o uso, mas sempre com transparência.

---

# Estratégia OpenAI GPT Local

## Conceito

A primeira experiência do usuário pode destacar um motor local open-weight da OpenAI, quando disponível, como forma de sentir a estabilidade e a identidade da experiência GPT/OpenAI sem começar pela API paga.

Nome oficial sugerido:

```text
OpenAI GPT Local
```

Nomes secundários aceitáveis:

```text
OpenAI Local Engine
OpenAI Foundation Engine
Lya OpenAI GPT Local
```

Evitar chamar essa experiência de apenas `starter`, porque um modelo local forte não deve parecer uma amostra fraca. Ele é a fundação local da experiência.

## Posicionamento

Este caminho deve ser apresentado como:

```text
Motor GPT/OpenAI local/open-weight para experimentar a LyaCodex II offline com estabilidade real.
```

E não como:

```text
API OpenAI grátis.
```

## Fluxo sugerido

```text
LyaCodex II acorda
↓
Antes de executar, a Lya precisa respirar um motor
↓
Escolha uma opção:
  1. Baixar OpenAI GPT Local
  2. Usar Ollama/LM Studio já instalado
  3. Conectar OpenAI API Key
  4. Conectar outro provedor
```

## Mensagem de transparência

```text
Este é um modelo open-weight/local. Ele não é o mesmo que usar modelos premium pela API da OpenAI. Velocidade, qualidade e contexto dependem do seu computador.
```

## Estratégia de produto

Se o usuário experimentar primeiro um motor com identidade GPT/OpenAI, a opção natural de upgrade premium passa a ser conectar uma OpenAI Key.

Fluxo comercial honesto:

```text
Experimente local
↓
Entenda o poder do terminal com IA
↓
Conecte OpenAI API Key para modelos premium e maior capacidade
```

## Regras

1. Nunca embutir chave OpenAI global no app.
2. Nunca prometer gratuidade de API sem acordo oficial.
3. Sempre diferenciar modelo local/open-weight de API premium.
4. Sempre permitir alternativas locais e outros providers.
5. Sempre mostrar requisitos de hardware antes de baixar.
6. Nunca diminuir o valor do motor local chamando-o de amostra fraca.

---

## Estratégias possíveis

### 1. Local-first onboarding

Primeira opção sugerida:

- OpenAI GPT Local, se disponível no catálogo configurado;
- Ollama;
- LM Studio;
- vLLM local;
- llama.cpp server.

Fluxo:

```text
Detectar engine local
↓
Listar modelos disponíveis
↓
Sugerir instalação de motor compatível
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
Lya Evaluation Credits
```

Exemplo conceitual:

```text
Use mensagens iniciais para testar a LyaCodex II com um provider patrocinado.
```

Isso deve ser implementado apenas com backend próprio, controle de abuso, política de privacidade e termos claros.

## OpenAI como marca de inteligência

O LyaCodex II deve suportar OpenAI como provider premium quando o usuário configurar uma OpenAI Key.

Possível UX:

```text
OpenAI
Status: não conectado
Ação: adicionar OpenAI Key ao Lya Keychain
Uso: raciocínio forte, código, agentes, tool calling e modelos premium
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
  1. Baixar OpenAI GPT Local
  2. Usar modelo local já instalado
  3. Conectar minha OpenAI Key
  4. Conectar outro provider
  5. Ver provedores com free tier
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
Escolha um motor local, conecte uma chave ou explore provedores compatíveis.
```
