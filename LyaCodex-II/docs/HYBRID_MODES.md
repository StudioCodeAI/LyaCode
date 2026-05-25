# Hybrid Modes — LyaCodex II

## Ideia

O LyaCodex II deve criar hábito primeiro com um motor local forte e, quando a tarefa exigir força maior, chamar modelos premium online.

Essa estratégia cria continuidade para o usuário:

```text
local para rotina
cloud para potência
híbrido para produtividade real
```

## Princípio

> O motor local cria confiança. O irmão mais velho online entrega força quando necessário.

## Por que isso importa

Programadores costumam ter hardware forte:

- GPU 12 GB, 16 GB, 20 GB ou mais;
- 32 GB, 64 GB ou 128 GB de RAM;
- SSD rápido;
- ambiente dev já configurado.

Quando o LyaCodex reconhece esse hardware e sugere um motor compatível, o usuário percebe cuidado técnico.

Exemplo de percepção:

```text
“o terminal reconheceu meu hardware”
```

Isso aumenta atenção, confiança e chance de adoção.

## Modos planejados

### Local Mode

Usa apenas motores locais.

Ideal para:

- código sensível;
- privacidade;
- trabalho offline;
- tarefas rotineiras;
- custo zero por token de API.

### Cloud Mode

Usa provider online configurado pelo usuário.

Ideal para:

- raciocínio pesado;
- contexto grande;
- revisão complexa;
- geração de arquitetura;
- tarefas em que velocidade e qualidade importam mais.

### Hybrid Mode

Começa local e escala para online quando necessário.

Fluxo:

```text
pedido do usuário
↓
classificação de complexidade
↓
local tenta resolver
↓
se precisar de força maior:
  pedir permissão
↓
chamar modelo online premium
```

### Auto Mode

O LyaCodex decide com base em:

- privacidade;
- tamanho do contexto;
- complexidade;
- hardware;
- custo estimado;
- preferência do usuário;
- disponibilidade de provider.

## Regras de segurança

1. Nunca enviar código sensível para nuvem sem permissão.
2. Sempre respeitar modo local-only.
3. Sempre informar quando o LyaCodex sugerir escalar para cloud.
4. Sempre permitir cancelar ou trocar modelo.
5. Sempre registrar decisão sem vazar conteúdo sensível.

## Exemplo de UX

```text
Esta tarefa parece exigir raciocínio mais forte.

Motor atual:
OpenAI GPT Local

Sugestão:
Escalar para OpenAI API por esta resposta.

Motivo:
O contexto é grande e envolve refatoração multi-arquivo.

[Usar OpenAI API] [Continuar local] [Trocar modelo]
```

## Filosofia

O usuário se acostuma com um motor local. Quando quiser velocidade, contexto e força, o LyaCodex chama o irmão mais velho via API.

Esse fluxo respeita hábito, privacidade e controle.
