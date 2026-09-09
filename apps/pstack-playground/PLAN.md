# PLAN — pstack-playground

## Goal
A single-user playground that shows how pstack-style role → model assignment and stacked skills translate into a visible token-savings readout.

## Single-user MVP
- One screen: configure a few agent roles, assign a model to each, toggle which skills are loaded, see estimated token savings update live.
- Seeded demo data inspired by pstack 0.15.0 claims (skills loaded → savings), not a live pstack install.
- Self-contained under `apps/pstack-playground/`: `bun install && bun run dev` works from that folder.

## Explicitly out of scope
- Installing or running real pstack / Cursor cloud agents from this UI
- Auth, multi-user, persistence beyond local state
- Publishing to a separate GitHub repo
- Cloudflare / production deploy wiring

## Outcome-oriented tasks
1. Scaffold a Vite + React + TypeScript app in `apps/pstack-playground/` via `bunx create-vite` (skip initial install), add `bunfig.toml` with `[install] minimumReleaseAge = 259200`, then `bun install`.
2. Init shadcn/ui (minimalist preset) and add only the components needed for selects, toggles/switches, cards, and badges.
3. Build the role → model assignment panel (3–5 preset roles; pick from a small model list).
4. Build the skills stack toggles with a live “skills loaded → token savings” readout (simple deterministic formula from toggled skills + role count is fine).
5. Polish one cohesive playground page; verify `bun run dev` locally.
6. Open one PR; attach ≥1 screenshot AND ≥1 video of the running app.

## Stack
- **Bun** — runtime / package manager / scripts (repo default)
- **Vite + React + TS** — one-screen utility; lighter than Next/TanStack Start
- **shadcn/ui** — minimalist UI without inventing a design system
- **Local React state** — enough for MVP; no backend

## Deferred
- Real pstack CLI integration (demo is illustrative)
- Saving configs to disk / URL share links
- Fancy charts beyond a clear numeric + progress readout
