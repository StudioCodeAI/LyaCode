import type { Command } from '../../commands.js'

const onboardHuggingFace: Command = {
  name: 'onboard-huggingface',
  aliases: [
    'onboarding-huggingface',
    'onboardhuggingface',
    'onboardinghuggingface',
    'onboard-hf',
    'onboardhf',
  ],
  description:
    'Interactive setup for Hugging Face: OAuth device login stored in secure storage',
  type: 'local-jsx',
  load: () => import('./onboard-huggingface.js'),
}

export default onboardHuggingFace
