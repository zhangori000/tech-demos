export type Model = {
  id: string
  name: string
  vendorTag: string
  /** demo $ per 1M input tokens */
  pricePerMTok: number
}

export type Role = {
  id: string
  name: string
  description: string
  /** demo agent invocations per day */
  runsPerDay: number
  /** tokens of role prompt that never move into a skill */
  basePromptTokens: number
  defaultModelId: string
}

export type Skill = {
  id: string
  name: string
  description: string
  /** tokens if the full instructions are pasted into every prompt */
  inlineTokens: number
  /** tokens of the one-line metadata stub when loaded as a pstack skill */
  stubTokens: number
}

export const MODELS: Model[] = [
  { id: 'opus-5', name: 'Claude Opus 5 Thinking', vendorTag: 'anthropic', pricePerMTok: 15 },
  { id: 'sonnet-5', name: 'Claude Sonnet 5 Thinking', vendorTag: 'anthropic', pricePerMTok: 3 },
  { id: 'gpt-5-6-sol', name: 'GPT-5.6 Sol', vendorTag: 'openai', pricePerMTok: 2.5 },
  { id: 'composer-2-5', name: 'Composer 2.5', vendorTag: 'cursor', pricePerMTok: 1.25 },
  { id: 'gemini-3-8-flash', name: 'Gemini 3.8 Flash', vendorTag: 'google', pricePerMTok: 0.3 },
]

export const ROLES: Role[] = [
  {
    id: 'planner',
    name: 'Planner',
    description: 'Scopes tasks and writes implementation plans',
    runsPerDay: 6,
    basePromptTokens: 1200,
    defaultModelId: 'opus-5',
  },
  {
    id: 'implementer',
    name: 'Implementer',
    description: 'Writes and edits code from the plan',
    runsPerDay: 24,
    basePromptTokens: 1600,
    defaultModelId: 'sonnet-5',
  },
  {
    id: 'reviewer',
    name: 'Reviewer',
    description: 'Reviews diffs before they land',
    runsPerDay: 12,
    basePromptTokens: 1000,
    defaultModelId: 'gpt-5-6-sol',
  },
  {
    id: 'test-runner',
    name: 'Test Runner',
    description: 'Runs the suite and triages failures',
    runsPerDay: 18,
    basePromptTokens: 800,
    defaultModelId: 'gemini-3-8-flash',
  },
]

export const SKILLS: Skill[] = [
  {
    id: 'project-planning',
    name: 'project-planning',
    description: 'MVP-first planning workflow and stack rules',
    inlineTokens: 4800,
    stubTokens: 140,
  },
  {
    id: 'shadcn-ui-patterns',
    name: 'shadcn-ui-patterns',
    description: 'Component recipes and theming conventions',
    inlineTokens: 6200,
    stubTokens: 130,
  },
  {
    id: 'bun-workflows',
    name: 'bun-workflows',
    description: 'Install, scripts, and runtime conventions',
    inlineTokens: 3500,
    stubTokens: 120,
  },
  {
    id: 'git-hygiene',
    name: 'git-hygiene',
    description: 'Branching, commit, and PR etiquette',
    inlineTokens: 2900,
    stubTokens: 110,
  },
  {
    id: 'code-review-checklist',
    name: 'code-review-checklist',
    description: 'What reviewers check, in priority order',
    inlineTokens: 5400,
    stubTokens: 150,
  },
  {
    id: 'test-triage',
    name: 'test-triage',
    description: 'Flake detection and failure bucketing',
    inlineTokens: 4100,
    stubTokens: 135,
  },
]

export type SavingsBreakdown = {
  baselineTokensPerDay: number
  currentTokensPerDay: number
  tokensSavedPerDay: number
  savingsPercent: number
  baselineCostPerDay: number
  currentCostPerDay: number
  costSavedPerDay: number
  perRole: {
    roleId: string
    baselineTokens: number
    currentTokens: number
    costPerDay: number
  }[]
}

/**
 * Deterministic demo math. Baseline = every skill's full instructions pasted
 * into every role prompt. Loading a skill swaps its inline text for a small
 * metadata stub (the pstack model), so each toggle moves tokens out of every
 * role's prompt on every run.
 */
export function computeSavings(
  modelByRole: Record<string, string>,
  loadedSkillIds: Set<string>,
): SavingsBreakdown {
  const inlineAll = SKILLS.reduce((sum, s) => sum + s.inlineTokens, 0)
  const withStack = SKILLS.reduce(
    (sum, s) => sum + (loadedSkillIds.has(s.id) ? s.stubTokens : s.inlineTokens),
    0,
  )

  const perRole = ROLES.map((role) => {
    const model = MODELS.find((m) => m.id === modelByRole[role.id]) ?? MODELS[0]
    const baselineTokens = (role.basePromptTokens + inlineAll) * role.runsPerDay
    const currentTokens = (role.basePromptTokens + withStack) * role.runsPerDay
    return {
      roleId: role.id,
      baselineTokens,
      currentTokens,
      costPerDay: (currentTokens / 1_000_000) * model.pricePerMTok,
      baselineCostPerDay: (baselineTokens / 1_000_000) * model.pricePerMTok,
    }
  })

  const baselineTokensPerDay = perRole.reduce((s, r) => s + r.baselineTokens, 0)
  const currentTokensPerDay = perRole.reduce((s, r) => s + r.currentTokens, 0)
  const baselineCostPerDay = perRole.reduce((s, r) => s + r.baselineCostPerDay, 0)
  const currentCostPerDay = perRole.reduce((s, r) => s + r.costPerDay, 0)

  return {
    baselineTokensPerDay,
    currentTokensPerDay,
    tokensSavedPerDay: baselineTokensPerDay - currentTokensPerDay,
    savingsPercent:
      baselineTokensPerDay === 0
        ? 0
        : ((baselineTokensPerDay - currentTokensPerDay) / baselineTokensPerDay) * 100,
    baselineCostPerDay,
    currentCostPerDay,
    costSavedPerDay: baselineCostPerDay - currentCostPerDay,
    perRole: perRole.map(({ roleId, baselineTokens, currentTokens, costPerDay }) => ({
      roleId,
      baselineTokens,
      currentTokens,
      costPerDay,
    })),
  }
}

export const formatTokens = (n: number): string =>
  Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

export const formatUsd = (n: number): string =>
  Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(n)
