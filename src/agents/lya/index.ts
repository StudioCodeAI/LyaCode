import { LYA_ARCHITECT_AGENT } from './built-in/architectAgent.js'
import { LYA_EXPLORER_AGENT } from './built-in/explorerAgent.js'
import { LYA_AGENT } from './built-in/lyaAgent.js'
import { LYA_RECORDER_AGENT } from './built-in/recorderAgent.js'
import { LYA_REVIEWER_AGENT } from './built-in/reviewerAgent.js'
import { LYA_TESTER_AGENT } from './built-in/testerAgent.js'

/**
 * All Lya agents (built-in + loadable from .lyacode/agents/).
 * The AgentTool loader picks these up at startup; users see them in
 * `/agents` and can invoke explicitly with Task(agent=lya-explorer).
 */
export const LYA_AGENTS = [
  LYA_AGENT,
  LYA_ARCHITECT_AGENT,
  LYA_EXPLORER_AGENT,
  LYA_REVIEWER_AGENT,
  LYA_TESTER_AGENT,
  LYA_RECORDER_AGENT,
]

export {
  LYA_AGENT,
  LYA_ARCHITECT_AGENT,
  LYA_EXPLORER_AGENT,
  LYA_REVIEWER_AGENT,
  LYA_TESTER_AGENT,
  LYA_RECORDER_AGENT,
}

export {
  LYA_PRODUCT_NAME,
  LYA_FAMILY,
  LYA_ORG,
  LYA_REPO,
  LYA_REPO_URL,
  LYA_PRODUCT_URL,
  LYA_AUTHOR,
  LYA_AUTHOR_EMAIL,
  LYA_CLI_BIN,
  LYA_CLI_ALIASES,
  LYA_CLI_INVOCATION,
  LYA_VERSION_POLICY,
  LYA_TAGLINE,
  LYA_ROLE_LINE,
  LYA_VERSION_LINE,
  getLyaSystemPromptBase,
} from './profile.js'
