# pstack playground

A single-page, single-user guided learning surface inspired by pstack 0.15.0. Two tabs:

- **Prompt coach** (default): the 3-command starter path (`/add-plugin pstack` → `/setup-pstack`
  → new chat → `/poteto-mode <goal>`), eight copyable starter prompts, the shape of a good
  prompt, a "which door?" decision helper, common pitfalls, and the full command catalog
  tucked into accordions so it doesn't overwhelm.
- **Token savings demo**: assign models to agent roles and toggle pstack-style skill stubs
  (`/poteto-mode`, `/how`, `/why`, `/interrogate`, `/architect`, `/tdd`) to see a live
  "skills loaded → token savings" readout.

The savings math is deterministic demo math, not a live pstack install: the baseline assumes
every skill's full instructions are pasted into every role prompt, and loading a skill swaps
that inline text for a small metadata stub.

## Run it

```sh
bun install
bun run dev
```

Then open the printed URL (default http://localhost:5173). Production builds also work with a
subpath base: `bun run build --base /pstack-playground/`.

## What to click

- **Prompt coach**: hit the copy button on any starter prompt; pick a door in "Which door?"
  to get a recommended command plus a ready-to-copy prompt; expand "The full toolbox" groups.
- **Token savings demo**: flip switches in **Skill stack** — the big percentage, tokens saved,
  and per-role bars update immediately. Change a model in **Agent roles** to see the cost
  figures move. **Reset** restores defaults.

## Stack

Bun + Vite + React + TypeScript, with shadcn/ui (radix base, Vega preset) on Tailwind CSS v4.
