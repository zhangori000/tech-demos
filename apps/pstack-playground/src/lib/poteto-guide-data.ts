export type GuidePrompt = {
  id: string
  label: string
  prompt: string
  note?: string
}

export type GuideChapter = {
  id: string
  title: string
  kicker?: string
  paragraphs: string[]
  points?: { title: string; detail: string }[]
  prompts?: GuidePrompt[]
}

export type GuidePart = {
  id: 'part1' | 'part2'
  label: string
  title: string
  thesis: string
  sourceUrl: string
  chapters: GuideChapter[]
}

/**
 * Condensed teaching notes on poteto's "The Complete Guide to pstack", Parts 1
 * and 2. Every `prompt` is quoted verbatim from the article; the prose is a
 * summary, not a copy.
 */
export const GUIDE_PARTS: GuidePart[] = [
  {
    id: 'part1',
    label: 'Part 1 \u2014 Verification',
    title: 'The Complete Guide to pstack Pt. 1',
    thesis:
      'Verification is all you need. Once an agent can prove its own work it keeps going until the task is done, you stop being the bottleneck, and everyone on the team can ship with confidence.',
    sourceUrl: 'https://x.com/poteto/status/2094457600259842065',
    chapters: [
      {
        id: 'critical-infra',
        title: 'Verification is critical infrastructure',
        kicker: 'The agent closes the loop, so you stop being the bottleneck.',
        paragraphs: [
          'Verification means an agent can check its own work and keep going until it succeeds. Once it can close that loop on its own, you are no longer the bottleneck for every change.',
          'poteto treats the verification skill as critical infrastructure rather than "just" a skill. Done well, it amplifies the output of the whole team, non-engineers included, by 100 to 1000x.',
        ],
      },
      {
        id: 'build-the-skill',
        title: 'Build a verification skill',
        kicker: 'One command creates it. Dr Eggbot keeps a bot running it.',
        paragraphs: [
          'Install pstack and run /create-verification-skill. It is a meta-skill distilled from the verification skills behind Grok @Bot and Cursor, and it teaches your agent how to build a high-quality one for your own app.',
          'Dr Eggbot, the bot that helps you create high-quality bots, ships with pstack. Ask it to create an engineer bot, then have that bot run /create-verification-skill and set up a daily routine for /maintain-verification-skill.',
          'Tech stack matters here. Web and Electron apps get the Chrome DevTools Protocol, iOS apps get the simulator, and a runtime without rich tooling means asking the agent to build its own (lldb scripts, a dev-only sidecar). poteto would unironically pick a stack for verifiability, because the harder an app is to debug and control, the harder it is to use agents productively.',
        ],
        prompts: [
          {
            id: 'create-skill',
            label: 'Create the skill',
            prompt: '/create-verification-skill',
            note: 'Catalogs your app, writes a basic CLI and a Feature Map, and packages them as a skill any agent can run.',
          },
        ],
      },
      {
        id: 'build-the-lever',
        title: 'Build the Lever with an agent-friendly CLI',
        kicker: 'Give agents tools, not just markdown.',
        paragraphs: [
          'pstack has a principle called Build the Lever. For a verification skill it means a small CLI that scripts interaction and debugging of your app, so an agent runs one command instead of writing a throwaway script to click on something. Fewer tokens, and a skill that is reproducible and testable.',
          'Think about the dev experience while you are at it. Seed a dev database, decide how auth, test users, and API calls against a staging environment work, and make the dev environment install and start the same way every time. This CLI is your agents\u2019 main utility for dev work, so keep it maintained and tested, and make it good and error free before anything more advanced.',
        ],
        points: [
          {
            title: 'Composable API',
            detail: 'Easy to compose, in the spirit of John Ousterhout\u2019s deep modules.',
          },
          {
            title: '--dry-run on destructive commands',
            detail: 'Any command with potentially destructive side effects gets a dry-run option.',
          },
          {
            title: 'Subcommands',
            detail: 'Disclose functionality gradually instead of all at once.',
          },
          {
            title: 'Descriptive errors',
            detail: 'Error messages tell the agent what it should do instead.',
          },
          {
            title: 'Rich --help',
            detail: 'Help text thorough enough for an agent to learn the tool from.',
          },
          {
            title: 'Machine-readable output',
            detail: 'Return results as JSON so agents parse instead of scrape.',
          },
        ],
      },
      {
        id: 'cloud-agents',
        title: 'Cloud agents over worktrees',
        kicker: 'Parallelism without burning your machine.',
        paragraphs: [
          'Once an agent can drive a prompt to a mergeable state, the next instinct is worktrees so several agents can work in isolation. poteto recommends against it. Worktrees eat storage and machine resources, and you top out around 10 parallel agents depending on repo size and hardware.',
          'Cursor cloud agents run on a real computer on Cursor\u2019s infrastructure. They install dependencies, run your app, take videos and screenshots, and interact with it like a real user. An agent helps set up the environment the first time, and a snapshot after the first build makes every later run start quickly. If your dev experience is already good, setup is not a big lift.',
        ],
      },
      {
        id: 'feature-maps',
        title: 'Feature Maps as materialized memory',
        kicker: 'The codebase is the memory. A Feature Map is its token-saving projection.',
        paragraphs: [
          'As an app grows, agents need help finding features. A Feature Map is a searchable map of every feature, what it does, and how a user reaches it. /create-verification-skill generates it for you under references/features, with a README as the high-level map linking to per-feature detail.',
          'Combined with the CLI, the map is one of the main reasons pstack verification skills work so well. Agents know every feature and how to get there without spending precious context-window tokens rediscovering it.',
          'Think of it as materialized memory. Your codebase is the ultimate memory, a projection of every decision the team made. The Feature Map is a compact form of that, designed to save tokens, and because it is markdown inside a skill, everyone contributing to the codebase shares it.',
        ],
      },
      {
        id: 'use-it-daily',
        title: 'Use it daily',
        kicker: 'Start every prompt with /poteto-mode, then ask for proof.',
        paragraphs: [
          'Start prompts with /poteto-mode. In Cursor, Opt + Enter when autocompleting it pins the skill as a Custom Mode, so the agent is reminded to use it on every turn. In Grok @Bot, install the plugin and type /poteto-mode.',
          '/control-app in the prompts below is whatever /create-verification-skill produced for your app. The pattern is the same each time. State the goal, name the verification skill, and ask for a video and screenshots as proof. /swarm pairs well with it, fanning out cloud agents to confirm a perf win with a real sample size or to fuzz the app for regressions.',
          'Once the skill is solid, put it inside Grok @Bot routines or Cursor Automations. Bots can listen to feedback channels in Slack and try to reproduce every report with a cloud agent, and with a good enough Feature Map you may decide to auto-fix as well.',
        ],
        prompts: [
          {
            id: 'create',
            label: 'Create the verification skill',
            prompt: '/create-verification-skill',
            note: 'Produces the basic CLI and Feature Map. In the prompts below, /control-app is the result.',
          },
          {
            id: 'maintain',
            label: 'Maintain it daily',
            prompt: '/maintain-verification-skill',
            note: 'Run at least once a day. Agents update the maps as they work, and maintain catches whatever is missed.',
          },
          {
            id: 'build-feature',
            label: 'Build a feature with proof',
            prompt:
              '/poteto-mode build <description of feature, any useful context>. use /control-app to verify your changes and show me a video and screenshots as proof',
            note: 'The daily driver. Goal, verification skill, and the evidence you want back.',
          },
          {
            id: 'spawn-cloud-build',
            label: 'Same request, from Grok @Bot',
            prompt:
              'spawn a cloud agent to use /poteto-mode to build <description of feature, any useful context>. use /control-app to verify your changes and show me a video and screenshots as proof',
            note: 'The bot spawns a cloud agent instead of doing the work. Bots become coordinators, and their context window stays clean.',
          },
          {
            id: 'perf-trace',
            label: 'Perf work, trace first',
            prompt:
              'spawn a cloud agent to use /poteto-mode to improve the initial loading time of our app. first use /control-app to take a trace of the status quo, and identify opportunities for improvement. then do a targeted fix and use /control-app + a /swarm to confirm the win',
            note: 'Trace the status quo, fix the measured cause, then let /swarm confirm the win with enough runs.',
          },
        ],
      },
      {
        id: 'invest',
        title: 'Invest in it like oncall infra',
        kicker: 'Keep it sharp. Maybe put an oncall rotation on it.',
        paragraphs: [
          'Once created, keep the skill sharp with /maintain-verification-skill, keep improving the CLI, and invest in it the way you would critical infrastructure. poteto suggests even an oncall rotation, because that is what unlocking 100 to 1000x team productivity is worth.',
          'The verification skill is the foundation many other pstack skills build on, and it composes with all of them. Part 2 covers what to build once verification is in place.',
        ],
      },
    ],
  },
  {
    id: 'part2',
    label: 'Part 2 \u2014 Planning',
    title: 'The Complete Guide to pstack Pt. 2',
    thesis:
      'Once verification works, the next question is how to figure out what to build. poteto\u2019s answer is to prime the agent with high-quality context, then plan through code, prototypes, and architecture instead of abstract documents.',
    sourceUrl: 'https://x.com/poteto/status/2097732320606507506',
    chapters: [
      {
        id: 'supervising',
        title: 'The art of supervising someone smarter than you',
        kicker: 'Two failure modes, one cure. Prime the context window.',
        paragraphs: [
          'Back in 2024 you had to read enough of a system to build a mental model before changing it. Agents remove that barrier, but keeping code and user experience quality high is still hard, especially when you are not the domain expert who knows what to look for and ask.',
          'Even with frontier models, poteto sees the same two failure modes constantly. Both are related. Using agents well comes down to how well you prime the agent\u2019s context window with high-quality context, and outcomes are much better when the agent has everything it needs to do a high-quality job.',
        ],
        points: [
          {
            title: '1. Intent is under-specified',
            detail: 'The agent cannot fully understand what you want because the ask is under- or poorly specified.',
          },
          {
            title: '2. Not enough context',
            detail: 'The agent does not have enough context on how to do the work correctly.',
          },
        ],
      },
      {
        id: 'in-your-own-words',
        title: 'In your own words',
        kicker: 'Draw the problem statement out of the agent instead of leading it.',
        paragraphs: [
          'Frontier models write code better than you or I can, so the balance shifts from micromanaging toward stating what to achieve and leaving room for solutions you did not think of. That is the art of supervising someone smarter than you, on a codebase you did not write and can no longer hold in your head.',
          'poteto\u2019s favorite technique is the indirect prompt. When someone reports an issue in Slack, ask the agent to read the thread and restate the problem in its own words before it touches anything. The three payoffs are below.',
          '/teach grew out of the same idea. It calls /how (runtime mechanics, with parallel explorers on fast models for big subsystems) and /why (motivation and intent, mined from git history, PR reviews, tickets, design docs, Slack, monitors, and errors). /recall pulls context from your past transcripts, a gold mine for fresh agents. The research helps the agent as much as you, because it forces claims to be backed by data instead of confidence.',
        ],
        points: [
          {
            title: 'Compresses the noise',
            detail: 'A rambling thread becomes a structured problem statement.',
          },
          {
            title: 'Catches misunderstandings early',
            detail: 'If the agent fixates on a red herring, you correct it before any code exists.',
          },
          {
            title: 'Keeps your bias out',
            detail: 'You have not stated assumptions that could be wrong or limit what the agent might achieve.',
          },
        ],
        prompts: [
          {
            id: 'restate-slack',
            label: 'The indirect prompt',
            prompt:
              '/poteto-mode read this slack thread. restate in your own words and in plain english what you think the underlying issue is',
            note: 'Ask for the restatement before anything else. Correct it, then let the agent proceed.',
          },
          {
            id: 'how',
            label: 'Trace runtime mechanics',
            prompt: '/how is virtualization implemented?',
            note: 'For a subsystem spanning directories or services, /how spawns parallel explorer agents on fast models like Grok.',
          },
          {
            id: 'why',
            label: 'Investigate intent and history',
            prompt: '/why are we still stuck an old version of node.js?',
            note: 'Queries git history, PR comments, Linear, Notion, Slack, Datadog, Sentry, code lineage, and analytics events in parallel.',
          },
          {
            id: 'teach',
            label: 'Have it teach you the tradeoffs',
            prompt:
              '/teach me why you implemented it this way and not <other way>. what were the tradeoffs you made and why?',
            note: '/teach calls /how and /why under the hood. Teaching you what it will do and why helps the agent too.',
          },
          {
            id: 'recall',
            label: 'Pick up where you left off',
            prompt:
              '/recall the work i did yesterday on virtualization and then read this bug report on slack',
            note: 'Past transcripts are a gold mine of rich context. /recall gives a fresh agent the state a previous one had.',
          },
        ],
      },
      {
        id: 'working-backwards',
        title: 'Working backwards',
        kicker: 'Plan through code. Start from the readme.',
        paragraphs: [
          'Most plan modes over-specify implementation details and under-specify everything else, which is why poteto cheekily says "I don\u2019t believe in planning". The truth is that the planning happens through code. For shared code and packages that means readme-driven development. Describe the API to a hypothetical user first, then work backwards to the implementation and architecture.',
          'Building Dune, an in-house desktop client framework, started with writing its tutorial, and the agent\u2019s first drafts were so unreadable that /technical-writing had to be built first. The skill separates docs into the four Di\u00e1taxis modes below and runs /unslop on the result. A plan written this way gives agents a concrete target to check their own work against, and it makes obvious what they are about to build.',
          'The skills compound in the design phase. The three prompts below are one conversation. Recall the relevant history, use it to design something that eliminates the old problems entirely, then demand proof that the new approach is better. That last step is where a verification skill earns its keep.',
        ],
        points: [
          {
            title: 'Tutorial',
            detail: 'Learning by doing. A lesson that leads a newcomer through steps to build something visible.',
          },
          {
            title: 'How-to guide',
            detail: 'Steps to solve a specific, real-world problem for an experienced user.',
          },
          {
            title: 'Reference',
            detail: 'Dry, complete, authoritative descriptions of machinery, APIs, and configuration flags.',
          },
          {
            title: 'Explanation',
            detail: 'High-level discussion that clarifies background, design choices, and tradeoffs.',
          },
        ],
        prompts: [
          {
            id: 'compound-recall',
            label: 'Step 1 \u2014 recall',
            prompt:
              '/recall my work fixing virtualization bugs and perf issues from the past 7 days. use /how and /why to understand how our current virtualization implementation works.',
            note: 'Recalls past and present context about how virtualization is implemented in the app.',
          },
          {
            id: 'compound-design',
            label: 'Step 2 \u2014 design through writing',
            prompt:
              "then use /poteto-mode planning and /technical-writing to come up with a new virtualization engine that categorically eliminates flickering and jittering. let's start by writing a tutorial on how i would use this new package to virtualize a React app",
            note: 'Uses that context, including bugs it fixed before, to design something that eliminates them entirely.',
          },
          {
            id: 'compound-prove',
            label: 'Step 3 \u2014 prove it',
            prompt:
              'after you write the plan, /teach me and prove to me why this new approach is superior to our current engine',
            note: 'Proof needs tooling. This is where the verification skill from Part 1 matters.',
          },
        ],
      },
      {
        id: 'measure',
        title: 'Measure a hundred times, cut once',
        kicker: 'Prototyping is planning with code.',
        paragraphs: [
          'Two planning mistakes show up constantly. Accepting the agent\u2019s first design, and overcooking the plan without empirical evidence. Design docs used to go through many iterations before a design settled. With agents you can skip the ceremony but not the iteration, and parallel agents take "measure twice, cut once" to its limit.',
          'Playbooks are not skills. They are reference files inside /poteto-mode, loaded conditionally for token efficiency depending on the task, 23 of them as of 0.15.0, and the agent picks one automatically. Prototype is poteto\u2019s favorite. It builds throwaway sketches in the app or a scratch directory, puts two or three variations behind a switcher, drives them with /control-app, takes screenshots, and measures real timing and layout. Prototyping is planning with code. Agents get room to surprise you, and they answer their own questions with empirical evidence instead of waiting on your input.',
          'Bigger changes go through /architect. In the agentic era the engineer\u2019s time goes to architecture, data structures, and how systems fit together, while agents fill in the implementation. /architect runs the five phases below as a self-contained mini-loop that synthesizes competing designs from different model families, and it is not afraid to throw a design away when implementation proves it wrong.',
        ],
        points: [
          {
            title: '1. Ground the problem',
            detail: '/how and /why over the affected systems build an accurate model of existing ownership and constraints.',
          },
          {
            title: '2. Sketch',
            detail: 'Independent candidate runners, often across model families, each draft a design package. Type signatures first, derived from how the call sites should look.',
          },
          {
            title: '3. Cross-judge and synthesize',
            detail: 'A judge on a different model scores the candidates against a strict rubric.',
          },
          {
            title: '4. Implement against the sketch',
            detail: 'Placeholder bodies become real logic. Unexpected parameters or extra state get surfaced as discrepancies.',
          },
          {
            title: '5. Scrap when the design is wrong',
            detail: 'The same workaround across unrelated call sites, or types that need any or forced casts, is empirical proof. Throw it away and start over.',
          },
        ],
        prompts: [
          {
            id: 'prototype-dropdown',
            label: 'Prototype a few options',
            prompt: '/poteto-mode prototype a few options for the new dropdown menu',
            note: 'The playbook is matched automatically. You never load it by name.',
          },
          {
            id: 'prototype-control-app',
            label: 'Prototype with evidence to review',
            prompt:
              '/poteto-mode prototype a few options for <feature request>. use /control-app and take videos/screenshots for me to review and choose from',
            note: '/control-app is the verification skill from Part 1. Choose from real captures, not descriptions.',
          },
          {
            id: 'architect',
            label: 'Architect a bigger change',
            prompt: '/architect this new <feature request>',
            note: 'Grounds, sketches, cross-judges, implements, and scraps the design if implementation proves it wrong.',
          },
        ],
      },
      {
        id: 'planning-doc',
        title: 'Okay but I really want a planning doc',
        kicker: 'A tactical execution plan, after the design is settled.',
        paragraphs: [
          'pstack has no planning skill, but it ships a multi-phase planning playbook. poteto uses it after the agent has produced a design worth keeping, as a tactical execution plan rather than a substitute for design.',
          'Every task in the plan is structured around proof. The playbook tells agents that tests alone are not sufficient verification, and a task counts as done only when the code has actually run and been checked. An automated script validates each plan\u2019s structure and formatting, and once approved it executes item by item as small, self-contained, easily reviewed PRs.',
          'For week-scale projects the plan may be committed temporarily so other agents know about the work in progress, then deleted at the end. Plans are not worth keeping permanently.',
        ],
        prompts: [
          {
            id: 'turn-into-plan',
            label: 'Turn a design into a plan',
            prompt: '/poteto-mode turn this design into a plan',
            note: 'Use it once you are happy with the design. Each item ends in verification, not a green test suite.',
          },
        ],
      },
      {
        id: 'workflow-in-practice',
        title: 'The workflow in practice',
        kicker: 'Four prompts poteto actually types.',
        paragraphs: [
          'These examples show how the pieces fit together. Each is a real prompt, from an ambiguous production bug to the Slack one-liners you will see in Cursor\u2019s feedback channels.',
          'Many of the skills in this guide are already used automatically by /poteto-mode, so the vast majority of the time you can just use /poteto-mode and move on with your life.',
        ],
        prompts: [
          {
            id: 'investigate-bug',
            label: '1. Research an ambiguous bug',
            prompt:
              '/poteto-mode investigate why background workers periodically fail with timeout errors. give me a breakdown of what we know, what data you used, and your best hypotheses.',
            note: 'Explores the code, metrics, and history in parallel, then gives educated guesses on where the problem lies.',
          },
          {
            id: 'service-boundary',
            label: '2. Design a new service boundary',
            prompt:
              '/poteto-mode we need to add rate limiting for external webhooks. /architect this first, and answer any open questions with prototypes. let me review before proceeding.',
            note: 'Grounds the existing architecture, runs competing design runners, benchmarks with throwaway prototypes, and stops for review.',
          },
          {
            id: 'migration',
            label: '3. Execute a multi-PR migration',
            prompt:
              '/poteto-mode create a plan to migrate our entire UI library to StyleX. break the migration into small, verifiable PRs. each PR must have its visual regression tests and live verification steps. i want the final result to be 100% identical compared to the original - bugs included',
            note: 'Independent steps, an auditable checklist, and each unit built, verified, and landed safely.',
          },
          {
            id: 'slack-do-it',
            label: '4. Fix a Slack report, short form',
            prompt: '/poteto-mode do it',
            note: 'When the thread already has sufficient context.',
          },
          {
            id: 'slack-repro',
            label: '4. Fix a Slack report, with proof',
            prompt:
              '/poteto-mode repro this with /control-app. if it repros on main, fix it and show me a video as proof',
            note: 'Most of the time you can just use /poteto-mode and move on with your life.',
          },
        ],
      },
      {
        id: 'art-of-planning',
        title: 'The art of planning',
        kicker: 'Abstract plans give the illusion of progress.',
        paragraphs: [
          'Plan Mode is often a way to convince yourself the agent will do the right thing. A long, abstract plan makes you both look productive, but it is probably lacking in substance. Reviewing such plans adversarially makes it worse, because agents start hallucinating theoretical risks and inventing edge cases for problems that will never happen.',
          'Do not overcook a plan while it is still abstract. Let the agent answer open questions through prototyping and verifying its own work. Combine thorough investigation, empirical evidence, and rigorous verification, and engineering with agents stops feeling like a gamble. It becomes predictable and repeatable.',
        ],
      },
    ],
  },
]
