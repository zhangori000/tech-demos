# pstack playground

A single-screen, single-user playground inspired by pstack 0.15.0. Assign models to a few
agent roles, toggle which skills are loaded, and watch a live "skills loaded → token savings"
readout update.

The savings math is deterministic demo math, not a live pstack install: the baseline assumes
every skill's full instructions are pasted into every role prompt, and loading a skill swaps
that inline text for a small metadata stub.

## Run it

```sh
bun install
bun run dev
```

Then open the printed URL (default http://localhost:5173).

## What to click

- Flip switches in **Skill stack** — the big percentage, tokens saved, and per-role bars in
  **Token savings** update immediately.
- Change a model in **Agent roles** — the per-role and total **cost saved / day** figures update.
- **Reset** restores the default models and the two initially loaded skills.

## Stack

Bun + Vite + React + TypeScript, with shadcn/ui (radix base, Vega preset) on Tailwind CSS v4.
