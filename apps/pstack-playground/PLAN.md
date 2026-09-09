# PLAN — pstack-playground

## Goal
A single-user guided learning surface for pstack: teach the 3-command starter path and good prompt shapes first, keep the long skill catalog quiet, and keep the role → model / skill-stub token-savings demo as a secondary explainer.

## Single-user MVP
- One page, two tabs. **Prompt coach** (default): the `/add-plugin pstack` → `/setup-pstack` → `/poteto-mode <goal>` starter path, eight copyable starter prompts, the shape of a good prompt (goal + done criteria, optional "repro first" / "don't change code yet" / "new task"), a small "which door?" decision helper, common pitfalls from the official guide, and the full command catalog collapsed into accordions.
- **Token savings demo** (secondary tab): assign models to 4 agent roles, toggle pstack-style skill stubs (poteto-mode, how, why, interrogate, architect, tdd), see estimated token savings update live.
- Content sourced from the official pstack 0.15.0 guide and community deep dives (poteto's Complete Guide Pt. 1, Ray Fernando, Flavio Copes). Seeded demo math, not a live pstack install.
- Self-contained under `apps/pstack-playground/`: `bun install && bun run dev` works from that folder; `vite build --base /pstack-playground/` must also work.

## Explicitly out of scope
- Installing or running real pstack / Cursor cloud agents from this UI
- Auth, multi-user, persistence beyond local state
- Publishing to a separate GitHub repo
- Cloudflare / production deploy wiring

## Outcome-oriented tasks
1. Scaffold a Vite + React + TypeScript app via `bunx create-vite` (skip initial install), add `bunfig.toml` with `[install] minimumReleaseAge = 259200`, then `bun install`. ✅
2. Init shadcn/ui (radix base, Vega preset); add components on demand (card, select, switch, badge, progress, separator, button, tabs, accordion). ✅
3. Build the prompt coach: starter path, copyable starter prompts (copy button on every prompt), prompt-shape card, decision helper, pitfalls, collapsed command catalog. ✅
4. Build the savings demo: role → model assignment + skill-stub toggles with a live token/cost savings readout (deterministic demo math). ✅
5. Keep the coach primary and the savings demo secondary (tabs); mobile-friendly single column. ✅
6. Update the same PR with fresh screenshot(s) and video. ✅

## Stack
- **Bun** — runtime / package manager / scripts (repo default)
- **Vite + React + TS** — one-page utility; lighter than Next/TanStack Start
- **shadcn/ui** — minimalist UI without inventing a design system
- **Local React state** — enough for MVP; no backend

## Deferred
- Real pstack CLI integration (demo is illustrative)
- Saving configs to disk / URL share links
- Fancy charts beyond a clear numeric + progress readout
