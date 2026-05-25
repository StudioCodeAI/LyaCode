# Shell Native Presence — LyaCodex II

## Ideia

O LyaCodex II deve estar presente no terminal nativo do programador.

O usuário deve poder instalar o LyaCode no Windows e chamar a Lya de qualquer terminal:

```powershell
lya
Lya
lyacodex
lyacode
```

Isso deve funcionar em:

- PowerShell nativo;
- Windows Terminal;
- terminal do VS Code;
- terminal do Antigravity;
- qualquer IDE com terminal integrado;
- CMD, quando possível;
- Git Bash/WSL em fases futuras.

## Experiência desejada

O usuário instala o app e sente que a ferramenta está ali, no ambiente dele.

```text
programador abre terminal
↓
digita lya
↓
LyaCodex acorda
↓
escolhe modo leve, local, híbrido ou cloud
↓
resolve o problema sem sair do fluxo
```

## Frase de produto

```text
A Lya está no seu terminal. Chame quando precisar.
```

## Comandos oficiais

### lya

Comando curto e humano.

Uso esperado:

```powershell
lya
```

Deve abrir a conversa ou acionar o runtime no modo padrão.

### lyacodex

Comando técnico e explícito.

Uso esperado:

```powershell
lyacodex status
lyacodex run "explique esse erro"
lyacodex models
```

### lyacode

Comando de produto.

Uso esperado:

```powershell
lyacode
lyacode --help
```

## Modos de uso

### Modo leve

Para rotina:

```powershell
lya
```

Usa motor local ou modelo padrão.

### Modo híbrido

Para tarefas maiores:

```powershell
lyacodex --hybrid
```

Começa local e sugere escalar para cloud quando necessário.

### Modo cloud

Para força pesada:

```powershell
lyacodex --cloud
```

Usa provider online configurado.

### Modo local-only

Para privacidade:

```powershell
lyacodex --local
```

Não envia contexto para nuvem.

## Integração com IDEs

Como VS Code, Antigravity, JetBrains e outras IDEs usam terminal do sistema, a integração principal deve ser no shell.

Se `lya` funciona no PowerShell do Windows, tende a funcionar também dentro do terminal integrado da IDE.

## Estratégia Windows

### Fase 1

- adicionar diretório do executável ao PATH com segurança;
- evitar duplicar PATH;
- remover PATH no uninstall;
- criar comandos shim se necessário.

### Fase 2

Criar um executável CLI dedicado:

```text
lyacodex.exe
```

E aliases:

```text
lya.exe
lyacode.exe
```

### Fase 3

Permitir subcomandos:

```powershell
lyacodex status
lyacodex wake
lyacodex models
lyacodex engines
lyacodex keychain
lyacodex hybrid
lyacodex local
lyacodex cloud
```

## Segurança

1. O comando de shell não deve executar ações destrutivas automaticamente.
2. Comandos perigosos devem pedir aprovação.
3. Contexto sensível não deve ser enviado para cloud sem permissão.
4. O modo local-only deve estar sempre disponível.
5. PATH deve ser manipulado com cuidado e removido no uninstall.

## Identidade

Quando o usuário digitar:

```powershell
lya
```

A resposta inicial pode ser:

```text
LyaCodex II awake.
Se você pensa, você executa.
Se você executa, você indexa.
Se você indexa, você evolui.
```

## Objetivo final

O LyaCode não deve depender apenas de uma interface gráfica.

Ele deve ser sentido como uma presença nativa no terminal do programador.

> A Lya está onde o código acontece: no terminal.
