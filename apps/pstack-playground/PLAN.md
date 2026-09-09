# PLAN — pstack-playground

## Goal
A single-user guided learning surface for pstack: teach the 3-command starter path first, back it with a large searchable library of copyable prompts from the official guide, and keep the role → model / skill-stub token-savings demo as a secondary explainer.

## Single-user MVP
- One page, two tabs. **Prompt coach** (default): the `/add-plugin pstack` → `/setup-pstack` → `/poteto-mode <goal>` starter path, then a **prompt library** of 50+ copyable prompts grouped into 12 situations (first-day setup, explore/understand, bug fixes, features, refactors & cleanup, tests/TDD, design & architecture, review & verify, ship the PR, steering mid-run, handoffs/overnight/fleets, make it yours) with text search and category filters; the shape of a good prompt (goal + done criteria plus optional constraints, with one fully assembled example), an expanded 14-scenario "which door?" decision helper, pitfalls rewritten as copyable before → after pairs, and the full command catalog (skills, playbooks, and the 23-principle steering vocabulary) collapsed into accordions.
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
7. Expand the coach into a learning library: 50+ prompts in 12 searchable/filterable categories sourced from the official pstack 0.15 guide chapters (setup, poteto-mode, understand, design, build & clean, verify & ship, overnight, principles, make-it-yours, recipes & pitfalls), before → after pitfall rewrites, a 14-door decision helper, a 9-ingredient prompt shape with an assembled example, and a toolbox catalog that now covers verification skills, overnight playbooks, and the principle steering vocabulary. ✅

## Stack
- **Bun** — runtime / package manager / scripts (repo default)
- **Vite + React + TS** — one-page utility; lighter than Next/TanStack Start
- **shadcn/ui** — minimalist UI without inventing a design system
- **Local React state** — enough for MVP; no backend

## Deferred
- Real pstack CLI integration (demo is illustrative)
- Saving configs to disk / URL share links
- Fancy charts beyond a clear numeric + progress readout
