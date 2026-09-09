export type StarterStep = {
  command: string
  title: string
  detail: string
}

/** The 3-command starter path from the official guide. */
export const STARTER_PATH: StarterStep[] = [
  {
    command: '/add-plugin pstack',
    title: 'Install the plugin',
    detail: 'One-time. Pulls the skills and playbooks into Cursor.',
  },
  {
    command: '/setup-pstack',
    title: 'Pick models per role',
    detail: 'One-time. Assigns your available models to each agent role.',
  },
  {
    command: '/poteto-mode <goal>',
    title: 'New chat, state the goal',
    detail: 'Daily driver. The playbook sequences the skills — you don\u2019t.',
  },
]

export type StarterPrompt = {
  label: string
  prompt: string
  note: string
}

export const STARTER_PROMPTS: StarterPrompt[] = [
  {
    label: 'Set up models',
    prompt: '/setup-pstack',
    note: 'Pick which model powers each role. Run once, revisit when models change.',
  },
  {
    label: 'Bug fix, repro first',
    prompt:
      '/poteto-mode users get two notifications after a retry. repro first, then fix and verify.',
    note: 'Goal + repro-first + verify. The gold-standard bug prompt.',
  },
  {
    label: 'Feature with done criteria',
    prompt:
      '/poteto-mode add a --json flag to this command. Keep the text output unchanged. Verify both forms against the sample project.',
    note: 'Says what done looks like and what must not change.',
  },
  {
    label: 'Investigate only',
    prompt:
      '/poteto-mode new task. figure out why the cache entry survives logout. don\u2019t change any code yet.',
    note: '"new task" resets scope; "don\u2019t change any code yet" keeps it read-only.',
  },
  {
    label: 'How does it work?',
    prompt: '/how how does the rate limiter work?',
    note: 'Trace the mechanics of existing code.',
  },
  {
    label: 'Why is it like this?',
    prompt: '/why why was this limit chosen?',
    note: 'Surface the intent and trade-offs behind a decision.',
  },
  {
    label: 'Skeptical branch review',
    prompt:
      '/interrogate the whole branch, but skeptically. don\u2019t change anything yet. no nitpicks unless it\u2019s an actual bug or regression.',
    note: 'Review without edits, filtered to real problems.',
  },
  {
    label: 'Plain words, please',
    prompt: '/bro',
    note: 'Rewrites the last reply without the jargon.',
  },
]

export type PromptIngredient = {
  name: string
  example: string
  required: boolean
}

export const PROMPT_SHAPE: PromptIngredient[] = [
  { name: 'The goal', example: 'users get two notifications after a retry', required: true },
  {
    name: 'How you\u2019ll know it\u2019s done',
    example: 'fix and verify \u00b7 keep the text output unchanged',
    required: true,
  },
  { name: 'Repro first', example: 'repro first, then fix', required: false },
  { name: 'Read-only', example: 'don\u2019t change any code yet', required: false },
  { name: 'Fresh scope', example: 'new task.', required: false },
]

export type CommandEntry = {
  command: string
  whenToUse: string
}

export type CommandGroup = {
  id: string
  title: string
  tagline: string
  commands: CommandEntry[]
}

export const COMMAND_GROUPS: CommandGroup[] = [
  {
    id: 'understand',
    title: 'Understand',
    tagline: 'Read the codebase before touching it',
    commands: [
      { command: '/how', whenToUse: 'Trace how a subsystem actually works.' },
      { command: '/why', whenToUse: 'Surface the intent behind a decision.' },
      { command: '/teach', whenToUse: 'Turn unfamiliar code into a short lesson.' },
      { command: '/recall', whenToUse: 'Pull context back from earlier work.' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    tagline: 'Decide before you build',
    commands: [
      { command: '/architect', whenToUse: 'Propose a design before writing code.' },
      { command: '/arena', whenToUse: 'Pit competing designs against each other.' },
      { command: '/swarm', whenToUse: 'Run parallel attempts at the same task.' },
      { command: '/interrogate', whenToUse: 'Skeptical review of a branch, no nitpicks.' },
    ],
  },
  {
    id: 'build',
    title: 'Build & clean',
    tagline: 'Write it, then remove the slop',
    commands: [
      { command: '/tdd', whenToUse: 'Test-first loop for behavior you can pin down.' },
      { command: '/unslop', whenToUse: 'Strip AI filler and dead weight from a diff.' },
      { command: '/no-comments', whenToUse: 'Delete narration comments that restate code.' },
    ],
  },
  {
    id: 'verify',
    title: 'Verify & ship',
    tagline: 'Prove behavior, not compilation',
    commands: [
      {
        command: 'verification skills',
        whenToUse: 'Demonstrate the change works against the real requirement.',
      },
      {
        command: 'babysit / ship notes',
        whenToUse: 'Watch long jobs; leave notes for whoever ships it.',
      },
    ],
  },
  {
    id: 'overnight',
    title: 'Overnight',
    tagline: 'Long unattended runs',
    commands: [
      {
        command: 'finish condition + decision log',
        whenToUse:
          'Give an explicit stop condition and ask for a log of every judgment call made while you were away.',
      },
    ],
  },
]

export type Pitfall = {
  title: string
  detail: string
}

export const PITFALLS: Pitfall[] = [
  {
    title: 'Enumerating skills in the prompt',
    detail:
      '"use /how then /architect then /arena" fights the playbook. State goal + constraints; the playbook sequences the skills.',
  },
  {
    title: 'Vague done criteria',
    detail: '"Make it better" stalls. Say how you\u2019ll know it\u2019s done.',
  },
  {
    title: 'Mixing up /arena and /swarm',
    detail: 'Arena compares competing designs. Swarm runs parallel implementation attempts.',
  },
  {
    title: 'Green build \u2260 proof',
    detail: 'Compiling isn\u2019t verifying. Ask for evidence the behavior matches the goal.',
  },
]

export type DoorOption = {
  id: string
  label: string
  command: string
  samplePrompt: string
  why: string
}

export const DOORS: DoorOption[] = [
  {
    id: 'broken',
    label: 'Something\u2019s broken',
    command: '/poteto-mode',
    samplePrompt:
      '/poteto-mode users get two notifications after a retry. repro first, then fix and verify.',
    why: 'Repro first proves the bug exists before anything changes.',
  },
  {
    id: 'confused',
    label: 'I don\u2019t understand this code',
    command: '/how',
    samplePrompt: '/how how does the rate limiter work?',
    why: 'Read-only tracing. Follow up with /why for the intent.',
  },
  {
    id: 'design',
    label: 'I need a design decision',
    command: '/architect',
    samplePrompt:
      '/poteto-mode new task. we need per-tenant rate limits. propose a design first, don\u2019t change any code yet.',
    why: 'Design before code. If two approaches compete, /arena settles it.',
  },
  {
    id: 'review',
    label: 'Review my branch',
    command: '/interrogate',
    samplePrompt:
      '/interrogate the whole branch, but skeptically. don\u2019t change anything yet. no nitpicks unless it\u2019s an actual bug or regression.',
    why: 'Skepticism on demand, filtered to real bugs and regressions.',
  },
]
