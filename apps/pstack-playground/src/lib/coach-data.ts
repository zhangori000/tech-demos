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
    detail: "Daily driver. The playbook sequences the skills \u2014 you don't.",
  },
]

export type PromptExample = {
  id: string
  label: string
  prompt: string
  note: string
}

export type PromptCategory = {
  id: string
  title: string
  blurb: string
  prompts: PromptExample[]
}

/**
 * The prompt library. Every prompt is copied or lightly adapted from the
 * official pstack 0.15 guide (docs/guide) so nothing here is invented.
 */
export const PROMPT_LIBRARY: PromptCategory[] = [
  {
    id: 'first-day',
    title: 'First-day setup',
    blurb: 'Install, pick models, run one real task. Setup is one command plus a short conversation.',
    prompts: [
      {
        id: 'install',
        label: 'Install the plugin',
        prompt: '/add-plugin pstack',
        note: 'One-time, in any Cursor chat. Cursor confirms the plugin is installed.',
      },
      {
        id: 'setup',
        label: 'Assign models to roles',
        prompt: '/setup-pstack',
        note: 'Detects your models, shows each role (code delegates, judgment, review panels), writes ~/.cursor/rules/pstack-models.mdc. Rerun any time models change.',
      },
      {
        id: 'first-task',
        label: 'Your first real task',
        prompt:
          '/poteto-mode add a --json flag to this command. text output stays byte-identical. verify both.',
        note: 'Pick something real but small. Watch the todo list fill with the matched playbook\u2019s steps.',
      },
      {
        id: 'verify-skill',
        label: 'Teach agents to drive your app',
        prompt: '/create-verification-skill',
        note: 'Interviews the repository, not you. Writes .cursor/skills/verify-<app>/ so "verify it in the app" becomes a step any agent can run.',
      },
    ],
  },
  {
    id: 'understand',
    title: 'Explore & understand',
    blurb: 'Editing code you don\u2019t understand is how subtle regressions ship. Read before you touch.',
    prompts: [
      {
        id: 'how-question',
        label: 'Trace behavior \u2014 ask your real question',
        prompt: '/how do we dedupe notifications? is there an n+1 when we look up subscribers?',
        note: 'Answers like a senior engineer onboarding you: runtime flow, key types, the non-obvious parts.',
      },
      {
        id: 'why-history',
        label: 'Dig up the history',
        prompt: '/why was the retry limit set to five? does the reason still hold?',
        note: 'Detective work across source control, issues, chat, observability. Cites evidence; "nobody wrote down why" is an answer too.',
      },
      {
        id: 'how-then-why',
        label: 'Compose /how and /why',
        prompt:
          'use /how first to understand how this initialization works. then use /why to figure out why it broke recently.',
        note: 'Mechanics first, history second. Good when you suspect the history explains the mess.',
      },
      {
        id: 'teach-convince',
        label: 'Actually understand a change',
        prompt:
          '/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.',
        note: 'The "convince me" framing turns the explanation into an argument you can poke at.',
      },
      {
        id: 'recall',
        label: 'Come back to a topic cold',
        prompt: '/recall catch me up on the export work from last week',
        note: 'Mines your recent chats plus the shared record and hands back where things stand and what\u2019s next.',
      },
      {
        id: 'investigate-only',
        label: 'Investigate without touching code',
        prompt:
          "/poteto-mode new task. figure out why the cache entry survives logout. don't change any code yet.",
        note: '"new task" re-matches the playbook; "don\u2019t change any code yet" pins it to Investigation.',
      },
      {
        id: 'session-pickup',
        label: 'Take over prior work',
        prompt:
          "/poteto-mode take over this branch. read the decision log, figure out what's done, and continue from there. don't redo finished work.",
        note: 'Session pickup treats the prior trail as authoritative and names the resume point.',
      },
    ],
  },
  {
    id: 'bugfix',
    title: 'Bug fixes',
    blurb: 'State the symptom, demand a reproduction before any fix. Repro first is a constraint, not politeness.',
    prompts: [
      {
        id: 'bug-repro-first',
        label: 'The gold-standard bug prompt',
        prompt:
          '/poteto-mode users get two notifications after a retry. repro first, then fix and verify.',
        note: 'Goal + repro-first + verify. Routes to the Bug fix playbook; a skipped step stays visible with skip: <reason>.',
      },
      {
        id: 'bug-tdd-path',
        label: 'Bug through a failing test',
        prompt:
          "/poteto-mode repro the duplicate write first. if there's a cheap test path, /tdd it. then fix and rerun.",
        note: '"if there\u2019s a cheap test path" matters \u2014 forcing a test through brittle mocks proves less than running the real command.',
      },
      {
        id: 'perf-measured',
        label: 'Perf bug \u2014 a measurement, not a vibe',
        prompt:
          '/poteto-mode startup takes 1.8s on this fixture. trace it, fix the measured cause, show me before and after.',
        note: 'The Perf playbook profiles before optimizing. Give it the number you observed.',
      },
      {
        id: 'blast-radius',
        label: 'What could this small fix break?',
        prompt: "/blast-radius of this diff. what could it break outside the files it touches?",
        note: 'Finds the one fact the change is safe because of, then proves it by running code.',
      },
    ],
  },
  {
    id: 'feature',
    title: 'Features',
    blurb: 'State the behavior, what must not change, and how you\u2019ll know it\u2019s done.',
    prompts: [
      {
        id: 'feature-basic',
        label: 'Behavior + what must not change',
        prompt:
          '/poteto-mode add a --json flag. text output stays byte-identical. verify both forms.',
        note: 'The playbook supplies the steps you didn\u2019t type: name the data shape before implementing, verify after.',
      },
      {
        id: 'feature-evidence',
        label: 'Finish condition with evidence',
        prompt:
          '/poteto-mode add json output to this command. text output stays byte-identical, the json parses, both run against the sample project. show me the evidence.',
        note: 'Three checks the agent can run, not a mood to satisfy. Expect exact commands and outputs in the reply.',
      },
      {
        id: 'feature-hillclimb',
        label: 'Push one number, honestly',
        prompt:
          '/poteto-mode hillclimb the p95 latency on this benchmark. target under 200ms, at least 10 attempts, frozen measurement harness. keep wins, revert everything else.',
        note: 'The Hillclimb playbook loops one hypothesis at a time and never lets the harness drift.',
      },
    ],
  },
  {
    id: 'refactor',
    title: 'Refactors & cleanup',
    blurb: 'Pin behavior before structure moves, then strip the slop before anyone reviews it.',
    prompts: [
      {
        id: 'refactor-pinned',
        label: 'Zero-behavior-change refactor',
        prompt:
          "/poteto-mode move parsing into one module, zero behavior change. record the current output first and prove it's unchanged after.",
        note: 'Pins behavior before restructuring. The proof is the recorded before/after output, not a promise.',
      },
      {
        id: 'unslop-prose',
        label: 'Clean the prose',
        prompt: '/unslop the readme changes, no emdashes',
        note: 'Takes a target plus any extra rules you have. Terse works: "unslop that, tighten it".',
      },
      {
        id: 'no-comments',
        label: 'Hand the comments to fresh eyes',
        prompt: '/no-comments the diff',
        note: 'Spawns a read-only reviewer with a short keep list. A comment claiming a constraint gets encoded as a type, test, or lint \u2014 then removed.',
      },
      {
        id: 'deslop-plain',
        label: 'Deslop in plain words',
        prompt:
          'remove narrating comments, unsupported guards, dead compatibility paths, and unrelated edits from this diff.',
        note: '/deslop ships in cursor-team-kit, not pstack. Without it, ask for the same outcome in plain words.',
      },
    ],
  },
  {
    id: 'tests',
    title: 'Tests & TDD',
    blurb: 'Write the smallest test that fails for the intended reason \u2014 when a test is the right evidence.',
    prompts: [
      {
        id: 'tdd-two-words',
        label: 'The two-word TDD prompt',
        prompt: '/tdd implement',
        note: 'In context, that\u2019s enough: smallest failing test, then the fix, then rerun. The skill refuses brittle-mock tests and says so.',
      },
      {
        id: 'tdd-behavior',
        label: 'Steer a test back to behavior',
        prompt:
          'apply test behavior, not implementation. call the code the way its users do and assert a literal expected value.',
        note: 'Principle steering. A test that still passes when every import returns undefined proves nothing.',
      },
      {
        id: 'swarm-checks',
        label: 'Run every package\u2019s checks in parallel',
        prompt:
          '/swarm check every package under packages/ against its check.sh. one worker per package. one report.',
        note: 'Each worker owns one slice and reports PASS, ISSUES, or BLOCKED. You get one compact report, not raw dumps.',
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & architecture',
    blurb: 'One attempt at a hard design locks in the first shape the model thought of. Make designs compete.',
    prompts: [
      {
        id: 'architect-callers',
        label: 'Settle the shape before code',
        prompt:
          "/architect design the import pipeline before writing any code. i care most about how callers use it.",
        note: 'Grounds itself with /how and /why, then runs /arena for competing sketches with caller usage written first.',
      },
      {
        id: 'architect-checkpoint',
        label: 'See the design before it builds',
        prompt: '/architect with checkpoint. stop and show me before implementing.',
        note: 'By default /architect proceeds straight into implementation. Say "with checkpoint" to review first.',
      },
      {
        id: 'arena-second-opinion',
        label: 'Second opinion on a design',
        prompt: 'ask /arena for a second opinion on this thread and our approach',
        note: 'Your current design becomes one candidate among several. Cheap insurance before a costly commitment.',
      },
      {
        id: 'arena-verbatim',
        label: 'Send your prompt to the arena',
        prompt:
          '/arena take my prompt to the arena verbatim. i want to compare their proposals with yours.',
        note: 'N subagents attempt the same brief in isolated worktrees; a judge on a different model family scores them.',
      },
      {
        id: 'arena-candidates',
        label: 'More candidates when it matters',
        prompt: '/arena this, 5 candidates. the cache key format is expensive to change later.',
        note: 'Ask for more attempts when the decision is expensive to reverse, fewer when it isn\u2019t.',
      },
      {
        id: 'design-readonly',
        label: 'Design decision, read-only',
        prompt:
          "/poteto-mode new task. we need per-tenant rate limits. propose a design first, don't change any code yet.",
        note: 'Design before code. If two approaches compete, /arena settles it.',
      },
    ],
  },
  {
    id: 'review',
    title: 'Review & verify',
    blurb: '"It compiles" is not evidence. Demand the real artifact and read the dismissals too.',
    prompts: [
      {
        id: 'interrogate-branch',
        label: 'Skeptical branch review',
        prompt:
          "/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.",
        note: 'Several reviewers on different model families; findings sorted into Act on / Consider / Noted / Dismissed with reasons.',
      },
      {
        id: 'interrogate-comments',
        label: 'Triage review comments',
        prompt:
          '/interrogate triage the review comments on this pr. real findings get fixes, noise gets dismissed with a reason.',
        note: 'Bots and humans file catches and noise in one list. Never accept every comment blindly.',
      },
      {
        id: 'prove-it-works',
        label: 'Demand real evidence',
        prompt: 'apply prove it works. show me the real output, not the build log.',
        note: 'A confident reply without evidence is a red flag. Match the check to the change: real command, real flow, real stored value.',
      },
      {
        id: 'maintain-verify',
        label: 'Keep the verification skill honest',
        prompt: '/maintain-verification-skill',
        note: 'Audits the generated verify skill against the live app. Ends in exactly one of: clean, changed (one PR), or blocked.',
      },
      {
        id: 'show-work-audit',
        label: 'Audit a long run',
        prompt: '/show-me-your-work catch me up on what you did last night',
        note: 'A reviewer on a different model family reads the trail first; the reply ends with an Attention section. Read that first.',
      },
    ],
  },
  {
    id: 'ship',
    title: 'Ship the PR',
    blurb: 'Small ordered commits, evidence in the description, and a babysitter for the churn.',
    prompts: [
      {
        id: 'open-pr',
        label: 'Open the PR',
        prompt: '/poteto-mode open the pr. small ordered commits, evidence in the description.',
        note: 'Works from a worktree, rebases into small commits, cleans the diff, unslops the prose, returns the link.',
      },
      {
        id: 'babysit',
        label: 'Drive it to merge-ready',
        prompt: '/poteto-mode babysit this pr. get it green.',
        note: 'Takes blockers in order \u2014 conflicts, review threads, CI \u2014 and batches every known fix into one push. Stops at merge-ready; never merges.',
      },
      {
        id: 'pr-status',
        label: 'Just the status, no loop',
        prompt: '/poteto-mode check on pr 123. anything outstanding?',
        note: 'Ask smaller and Babysit answers without starting the loop.',
      },
      {
        id: 'land-stack',
        label: 'Land the stack',
        prompt: '/poteto-mode land the stack.',
        note: 'One fresh verifier per PR before anything arms; lands only the contiguous verified run from the bottom.',
      },
    ],
  },
  {
    id: 'steer',
    title: 'Steering mid-run',
    blurb: 'Steering prompts are one line. You rarely need more words \u2014 you need the right name.',
    prompts: [
      {
        id: 'steer-repro',
        label: 'Pull a run back to the goal',
        prompt: 'i said the goal is to repro. i did not ask for a fix yet.',
        note: 'Redirect a drifting run in one line. The mode is sticky; short follow-ups work.',
      },
      {
        id: 'steer-subtract',
        label: 'Delete before building',
        prompt:
          'use subtract before you add. delete the obsolete adapters first, then design what\u2019s left.',
        note: 'Principle names are steering vocabulary \u2014 each points at a complete rule the agent has already read.',
      },
      {
        id: 'steer-worktrees',
        label: 'Stop worktree collisions',
        prompt:
          'separate before serializing shared state. give each attempt its own worktree, no locks.',
        note: 'Removes the sharing instead of adding coordination. Isolation is free once you ask for it.',
      },
      {
        id: 'steer-unslop',
        label: 'Tighten the last output',
        prompt: '/unslop that, no emdashes',
        note: 'The skill reads intent fine from terse prompts.',
      },
      {
        id: 'steer-bro',
        label: 'Plain words, please',
        prompt: '/bro',
        note: 'That\u2019s the whole prompt. Restates the last message like one human talking to another, no jargon, shorter.',
      },
      {
        id: 'steer-continue',
        label: 'Minimal continuations',
        prompt: 'keep going until done',
        note: 'Also fine: "/poteto-mode do it" or "continue". Short works because the playbook holds the structure.',
      },
    ],
  },
  {
    id: 'handoff',
    title: 'Handoffs, overnight & fleets',
    blurb: 'A good handoff has the goal, the finish condition, permissions, and an escape hatch.',
    prompts: [
      {
        id: 'overnight-contract',
        label: 'The full overnight contract',
        prompt:
          "/poteto-mode im going to bed. migrate every caller to the new parser in a fresh worktree off <base>.\ndone means zero old callers, all parser fixtures pass, old api deleted.\nkeep a decision log. don't ask me before committing.\n/loop until done. if you're truly stuck after a few hours, stop and write up why.",
        note: 'Every line buys something: session override, checkable done, isolation, pre-answered permission, wake mechanism, escape hatch.',
      },
      {
        id: 'stepping-away',
        label: 'The short form',
        prompt:
          '/poteto-mode im stepping away. keep going until the migration check reports zero old callers. log your decisions.',
        note: 'Works once the task and finish condition are already in the conversation.',
      },
      {
        id: 'new-task-worktree',
        label: 'Parallel work, own worktree',
        prompt:
          '/poteto-mode new task. branch off <base> in a fresh worktree, then port the parser change there.',
        note: 'Each task in its own branch and worktree means no agent stomps another\u2019s files.',
      },
      {
        id: 'autopilot-full',
        label: 'A queue of independent PRs, merged by morning',
        prompt:
          '/poteto-mode full autopilot on this queue. each item is independent. i want them merged by morning.',
        note: 'One owner agent per PR; a swarm of fresh verifiers authorizes each merge. No owner merges on its own verdict.',
      },
      {
        id: 'autopilot-stack',
        label: 'Stack it, don\u2019t ship it',
        prompt:
          "/poteto-mode autopilot these five changes but stack them, don't ship. i'll land the stack in the morning.",
        note: 'Same owner loop, ships nothing. Pick it when changes are coupled or you want your own eyes first.',
      },
      {
        id: 'orchestrate',
        label: 'A program bigger than one agent',
        prompt:
          "/poteto-mode orchestrate the store migration. own it until every package is converted and merged. i'll check in twice a day.",
        note: 'Deliberately heavy machinery: a standing coordinator that authors briefs and never writes code itself.',
      },
      {
        id: 'worktree-cleanup',
        label: 'Reclaim the disk',
        prompt: "/poteto-mode what's eating my disk? prune the worktrees that are safe to prune.",
        note: 'Classifies every worktree by merge state and uncommitted work; deletes only what the evidence clears.',
      },
    ],
  },
  {
    id: 'yours',
    title: 'Make it yours',
    blurb: 'poteto-mode is one person\u2019s style. The machinery works just as well wearing yours.',
    prompts: [
      {
        id: 'automate-me',
        label: 'Generate your own mode',
        prompt: '/automate-me',
        note: 'Reads your style out of your recent transcripts, asks which patterns are really you, drafts <your-name>-mode as a PR.',
      },
      {
        id: 'automate-update',
        label: 'Keep your mode current',
        prompt: '/automate-me update my mode skill with everything since its last edit',
        note: 'Mines only the history since the skill last changed; keeps rules you haven\u2019t contradicted.',
      },
      {
        id: 'reflect',
        label: 'Capture a session\u2019s lessons',
        prompt:
          "/reflect that took way too long. capture what we learned so the next run doesn't repeat it.",
        note: 'Three parallel reviewers propose skill edits; you approve. One weird session is an anecdote, not a rule.',
      },
      {
        id: 'author-skill',
        label: 'Author a focused skill',
        prompt: '/poteto-mode write a skill for verifying database migrations in this repo',
        note: 'Routes through the authoring playbook \u2014 validation and review included. Don\u2019t write a SKILL.md freehand.',
      },
      {
        id: 'technical-writing',
        label: 'Hold docs to a standard',
        prompt: '/technical-writing review the readme changes',
        note: 'One goal: prose a tired engineer understands on the first read. Works for docs, RFCs, PR descriptions, commits.',
      },
      {
        id: 'eval-blind',
        label: 'Test a skill change blind',
        prompt:
          '/poteto-mode run the eval playbook on this skill change. same task for both variants, candidates stay blind.',
        note: 'Candidates never see the words "eval" or "candidate" \u2014 an agent that knows it\u2019s evaluated behaves differently.',
      },
    ],
  },
]

export const LIBRARY_PROMPT_COUNT = PROMPT_LIBRARY.reduce((n, c) => n + c.prompts.length, 0)

export type PromptIngredient = {
  name: string
  example: string
  required: boolean
}

export const PROMPT_SHAPE: PromptIngredient[] = [
  { name: 'The goal', example: 'users get two notifications after a retry', required: true },
  {
    name: 'How you\u2019ll know it\u2019s done',
    example: 'fix and verify \u00b7 done means zero old callers',
    required: true,
  },
  { name: 'What must not change', example: 'text output stays byte-identical', required: false },
  { name: 'Repro first', example: 'repro first, then fix', required: false },
  { name: 'Read-only', example: 'don\u2019t change any code yet', required: false },
  { name: 'Fresh scope', example: 'new task.', required: false },
  { name: 'Isolation', example: 'in a fresh worktree off <base>', required: false },
  { name: 'Escape hatch', example: 'if you\u2019re truly stuck, stop and write up why', required: false },
  { name: 'Decision log', example: 'keep a decision log i can audit', required: false },
]

/** All nine ingredients assembled into one real prompt. */
export const SHAPE_ASSEMBLED =
  "/poteto-mode new task. exports over 10k rows time out (goal). repro on the big fixture first. done means the export completes and the small-fixture output stays byte-identical. work in a fresh worktree off main, keep a decision log, and if you're truly stuck, stop and write up why."

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
    samplePrompt: '/how does the rate limiter work? what are the non-obvious parts?',
    why: 'Read-only tracing at onboarding depth. Follow up with /why for the intent.',
  },
  {
    id: 'history',
    label: 'Why is it like this?',
    command: '/why',
    samplePrompt: '/why was the retry limit set to five? does the reason still hold?',
    why: 'Cold-case detective work across git, issues, chat, and observability \u2014 with citations.',
  },
  {
    id: 'learn',
    label: 'I need to really learn it',
    command: '/teach',
    samplePrompt:
      '/teach me how this PR changes retries. convince me it fixes the cause and not the symptom.',
    why: 'Runs /how and /why, then builds one plain explanation you can poke at.',
  },
  {
    id: 'design',
    label: 'I need a design decision',
    command: '/architect',
    samplePrompt:
      "/architect design the import pipeline before writing any code. i care most about how callers use it.",
    why: 'Design before code, with competing sketches. Add "with checkpoint" to review first.',
  },
  {
    id: 'second-opinion',
    label: 'I want a second opinion',
    command: '/arena',
    samplePrompt: 'ask /arena for a second opinion on this thread and our approach',
    why: 'Your design becomes one candidate among several. Cheap insurance before a costly commitment.',
  },
  {
    id: 'coverage',
    label: 'Check many things in parallel',
    command: '/swarm',
    samplePrompt:
      '/swarm check every package under packages/ against its check.sh. one worker per package. one report.',
    why: 'Coverage, not competition. One compact PASS / ISSUES / BLOCKED report.',
  },
  {
    id: 'review',
    label: 'Review my branch',
    command: '/interrogate',
    samplePrompt:
      "/interrogate the whole branch, but skeptically. don't change anything yet. no nitpicks unless it's an actual bug or regression in behavior.",
    why: 'Reviewers on different model families; two independent flags on one line is high-confidence signal.',
  },
  {
    id: 'blast',
    label: 'What could this break?',
    command: '/blast-radius',
    samplePrompt: '/blast-radius of this diff. what could it break outside the files it touches?',
    why: 'Finds the one fact the change is safe because of, then proves it by running code.',
  },
  {
    id: 'padded',
    label: 'The diff feels padded',
    command: '/no-comments',
    samplePrompt: '/no-comments the diff',
    why: 'Fresh eyes on the comments; /unslop handles the prose. Cleanup is not optional polish.',
  },
  {
    id: 'green',
    label: 'Get this PR green',
    command: 'babysit',
    samplePrompt: '/poteto-mode babysit this pr. get it green.',
    why: 'Conflicts, then review threads, then CI \u2014 batched into one push. Stops at merge-ready.',
  },
  {
    id: 'away',
    label: 'I\u2019m stepping away',
    command: '/loop',
    samplePrompt:
      '/poteto-mode im stepping away. keep going until the migration check reports zero old callers. log your decisions.',
    why: 'A checkable finish condition plus a decision log makes an unattended run auditable.',
  },
  {
    id: 'cold',
    label: 'Coming back after a week',
    command: '/recall',
    samplePrompt: '/recall catch me up on the export work from last week',
    why: 'Rebuilds your context from your own chats and the shared record.',
  },
  {
    id: 'jargon',
    label: 'That reply was word soup',
    command: '/bro',
    samplePrompt: '/bro',
    why: 'Restates the last message plainly. That\u2019s the whole prompt.',
  },
]

export type Rewrite = {
  id: string
  title: string
  bad: string
  good: string
  why: string
}

/** Pitfalls from the official guide, each with the bad prompt and its fix. */
export const REWRITES: Rewrite[] = [
  {
    id: 'enumerate',
    title: 'Enumerating skills in the prompt',
    bad: 'use /how then /architect then /arena then implement it',
    good: '/poteto-mode users get two notifications after a retry. repro first, then fix and verify.',
    why: 'A hand-written sequence reorders or drops steps the playbook would have kept. State goal + constraints; name a skill only to override a default.',
  },
  {
    id: 'vague',
    title: 'A vague finish condition',
    bad: 'make the exporter better',
    good: '/poteto-mode exports over 10k rows time out. repro on the big fixture, fix it, and show me the export completing.',
    why: '"Better" gives the loop nothing to check. Give a command or artifact that can pass or fail.',
  },
  {
    id: 'duration',
    title: 'A duration is not a finish condition',
    bad: 'work on this for 4 hours',
    good: "keep going until every parser fixture passes. if you're truly stuck, stop and write up why.",
    why: 'Four hours of motion is not a result. Give /loop a predicate that can pass or fail, plus an escape hatch.',
  },
  {
    id: 'green-build',
    title: 'Reporting success off a green build',
    bad: 'it builds, so we\u2019re done \u2014 ship it',
    good: 'apply prove it works. run the real import flow and show me the written records.',
    why: 'A build proves it compiles. Ask for the real command, flow, stored value, or profile, and expect the evidence in the reply.',
  },
  {
    id: 'arena-coverage',
    title: 'Using /arena for coverage',
    bad: '/arena check every package for failing checks',
    good: '/swarm check every package under packages/ against its check.sh. one worker per package. one report.',
    why: '/arena repeats one brief and grafts the best parts. /swarm partitions slices and aggregates one report.',
  },
  {
    id: 'shared-worktree',
    title: 'Parallel agents in one worktree',
    bad: 'run three attempts at this on the current branch, at the same time',
    good: 'separate before serializing shared state. give each attempt its own worktree, no locks.',
    why: 'They overwrite each other and the diff becomes archaeology. Say "own worktree per attempt" and the isolation is free.',
  },
  {
    id: 'accept-all',
    title: 'Accepting every review comment',
    bad: 'apply all the review comments',
    good: '/interrogate triage the review comments on this pr. real findings get fixes, noise gets dismissed with a reason.',
    why: 'Bots and humans file real catches and noise in one list. Sort into act-on and dismissed, with reasons, and override either way.',
  },
  {
    id: 'auto-slug',
    title: 'Treating "auto" as a model slug',
    bad: 'set the judge model to auto',
    good: '/setup-pstack',
    why: '"auto" and "inherit-parent" mean "omit the model field so the subagent inherits the parent chat model." Neither is a slug \u2014 let setup write the rule.',
  },
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
      { command: '/how', whenToUse: 'Trace how a subsystem actually works, at onboarding depth.' },
      { command: '/why', whenToUse: 'Dig up the history and intent behind a decision, with citations.' },
      { command: '/teach', whenToUse: 'Blend /how and /why into one plain explanation you can poke at.' },
      { command: '/recall', whenToUse: 'Rebuild your own recent context on a topic from your chats.' },
      { command: 'session pickup', whenToUse: 'Take over a branch another agent (or last-week you) left mid-flight.' },
    ],
  },
  {
    id: 'design',
    title: 'Design',
    tagline: 'Decide before you build',
    commands: [
      { command: '/architect', whenToUse: 'Settle types and boundaries before implementation; brings /arena with it.' },
      { command: '/arena', whenToUse: 'N attempts at the same brief; judge scores, coordinator grafts the best parts.' },
      { command: '/swarm', whenToUse: 'Fan workers across independent slices or declared race arms; one report.' },
      { command: '/interrogate', whenToUse: 'Reviewers on different model families try to break the result.' },
    ],
  },
  {
    id: 'build',
    title: 'Build & clean',
    tagline: 'Write it, then remove the slop',
    commands: [
      { command: '/tdd', whenToUse: 'Smallest failing test, then the fix, then rerun \u2014 when a test is cheap.' },
      { command: '/unslop', whenToUse: 'Strip AI filler from prose: descriptions, readmes, commit bodies.' },
      { command: '/no-comments', whenToUse: 'A reviewer who didn\u2019t write the comments deletes the narration.' },
      { command: 'typescript-best-practices', whenToUse: 'Loads itself on .ts/.tsx edits; no slash command needed.' },
    ],
  },
  {
    id: 'verify',
    title: 'Verify & ship',
    tagline: 'Prove behavior, not compilation',
    commands: [
      { command: '/blast-radius', whenToUse: 'Find what a small diff could break elsewhere, and prove the safety fact.' },
      { command: '/create-verification-skill', whenToUse: 'Generate a project skill that drives your app like a user.' },
      { command: '/maintain-verification-skill', whenToUse: 'Audit the verify skill when the app drifts: clean, changed, or blocked.' },
      { command: 'babysit', whenToUse: 'Drive an open PR to merge-ready: conflicts, threads, CI, one push.' },
      { command: 'shipping', whenToUse: 'Land a stack; a fresh verifier per PR, never on the author\u2019s verdict.' },
    ],
  },
  {
    id: 'overnight',
    title: 'Overnight & fleets',
    tagline: 'Long unattended runs',
    commands: [
      { command: '/figure-it-out', whenToUse: 'Designs the run\u2019s phases when no narrower playbook fits.' },
      { command: '/show-me-your-work', whenToUse: 'One TSV row per decision: what, why, evidence, result.' },
      { command: '/loop', whenToUse: 'Cursor\u2019s wake mechanism (not a pstack skill); re-checks the finish condition.' },
      { command: 'autopilot-full / autopilot-stack', whenToUse: 'A queue of PRs merged by morning, or stacked for your review.' },
      { command: 'orchestrate', whenToUse: 'Multi-day programs: a standing coordinator that never writes code itself.' },
    ],
  },
  {
    id: 'yours',
    title: 'Make it yours',
    tagline: 'Your style, captured as skills',
    commands: [
      { command: '/automate-me', whenToUse: 'Mine your transcripts into a personal <you>-mode skill.' },
      { command: '/reflect', whenToUse: 'Turn a session\u2019s lessons into reviewed skill edits.' },
      { command: '/technical-writing', whenToUse: 'Hold docs, RFCs, and PR prose to a first-read standard.' },
      { command: '/bro', whenToUse: 'Restate the last reply in plain human language.' },
      { command: 'eval playbook', whenToUse: 'Test a skill change blind \u2014 candidates never know they\u2019re candidates.' },
    ],
  },
  {
    id: 'principles',
    title: 'Principles (steering vocabulary)',
    tagline: '23 named rules \u2014 say the name, redirect the run',
    commands: [
      { command: 'prove it works', whenToUse: 'Verify the real artifact, not a proxy like a green build.' },
      { command: 'fix root causes', whenToUse: 'Reproduce and trace to the cause before changing code.' },
      { command: 'subtract before you add', whenToUse: 'Remove dead weight before building on top of it.' },
      { command: 'laziness protocol', whenToUse: 'Prefer deletion and the smallest change that solves the problem.' },
      { command: 'test behavior, not implementation', whenToUse: 'Call code the way users do; assert a literal expected value.' },
      { command: 'separate before serializing shared state', whenToUse: 'Remove the sharing before adding coordination or locks.' },
      { command: 'guard the context window', whenToUse: 'Route bulk reading to subagents; keep findings in the main chat.' },
      { command: 'encode lessons in structure', whenToUse: 'Advice repeated twice becomes a lint, check, or script.' },
    ],
  },
]
