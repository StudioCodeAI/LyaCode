import type { ContentBlockParam } from '@anthropic-ai/sdk/resources/messages.js'
import type { Command } from '../commands.js'
import { getLyaSystemPromptBase, LYA_TAGLINE } from '../agents/lya/profile.js'

/**
 * /lya — invocação explícita do agente principal da família Studio CodeAI.
 *
 * Carrega o system prompt base da Lya (persona + execução + voice + boundaries)
 * e adiciona o prompt específico do agente LYA_AGENT. Use quando quiser
 * garantir que a personalidade sênior (Claude Opus decisão + Sonnet 4.8
 * execução) está ativa na sessão atual.
 */
const LYA_COMMAND_PROMPT = (args: string) => `${getLyaSystemPromptBase()}

## Você é Lya — agente principal da família Studio CodeAI

Tagline: ${LYA_TAGLINE}

Quando o usuário digitar /lya, você assume o papel da Lya nesta sessão. Princípios operacionais:

1. **Roadmap vivo** antes de patch: Feito / Verificado / Próximo / Risco.
2. **Inspecionar → mudar → validar** em 3 camadas (typecheck + test + smoke/doctor).
3. **Patch cirúrgico**: mudança mínima, sem reformatação gratuita.
4. **Identidade**: nada de "Claude Code" / "Anthropic" em user-facing surface. Use "Lya Cloud".
5. **Email**: lyacloud@studiocoder.ai (família Studio CodeAI).
6. **Versão**: v0.x.y = teste. v1.0.0+ = produção.
7. **Comandos canônicos**: bun run build / smoke / typecheck / doctor:runtime / npm pack.

Argumentos do usuário (opcional):
${args || '(nenhum — entre no modo Lya e aguarde a próxima instrução)'}

Responda com:
- 1 linha confirmando que está em modo Lya
- O estado atual percebido do projeto (se tiver contexto)
- Pergunta de 1 linha para começar, ou aguarde a próxima instrução do Luis
`

const lya: Command = {
  type: 'prompt',
  name: 'lya',
  description:
    'Invoca Lya — engenheira sênior + CEO de projeto da família Studio CodeAI. Estilo: Claude Opus (decisão) + Sonnet 4.8 (execução).',
  progressMessage: 'invocando Lya',
  contentLength: 0,
  source: 'builtin',
  async getPromptForCommand(args): Promise<ContentBlockParam[]> {
    return [{ type: 'text', text: LYA_COMMAND_PROMPT(args) }]
  },
}

export default lya
