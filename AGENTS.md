# Agent rules

This is the sticky tech-demos monorepo. One approved bookmark becomes one self-contained app under `apps/<kebab-slug>/`.

## Scope
- Only add or update files under `apps/<kebab-slug>/`.
- Do not create a new GitHub repository.
- Do not edit other apps, `tracking/`, or this file unless the task explicitly says to.
- Read `skills/project-planning/SKILL.md` and the app's `PLAN.md` before writing code.

## How an app ships
- Bun is the runtime, package manager, and script runner.
- The app must start with `bun install && bun run dev`.
- Include a root `bunfig.toml` with `[install] minimumReleaseAge = 259200` before `bun install` or `bun add`.
- Build for one user. Prefer an official `bunx create-*` scaffold and shadcn/ui. Prefer prebuilt over bespoke.

## Pull request
- Open one pull request.
- Attach both at least one screenshot and at least one video of the running app. Both are required.
