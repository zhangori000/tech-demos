# PLAN — coinbase-agentkit

## Goal
A single-user chat-style playground that demonstrates Coinbase AgentKit-style onchain agent actions on **Base Sepolia** — create/show wallet, faucet, balances, and transfer/swap previews — with a deterministic **mock mode** so the demo always works without CDP keys.

## Single-user MVP
- One page: a chat transcript with **action chips** (Create wallet, Show address, Faucet, Balances, Preview transfer, Preview swap) plus a free-text input that routes simple phrases to the same actions.
- Actions on **Base Sepolia only** (testnet, no real money):
  - Create / show the agent wallet address
  - Request testnet faucet funds (ETH)
  - Show balances (ETH + demo USDC)
  - Preview a transfer (dry-run: to-address + amount → gas estimate + effect summary)
  - Preview a swap (dry-run: ETH ⇄ USDC quote)
- **Mock mode is the default and always works**: a deterministic fake wallet (address derived from a fixed seed), fake balances that respond to faucet/transfer previews, simulated latency and tx hashes. State persists in `localStorage` so the wallet survives reload.
- **Live mode (optional, local only)**: a thin Bun server (`server/`) that uses the real CDP SDK / AgentKit wallet provider on `base-sepolia` when `CDP_API_KEY_ID`, `CDP_API_KEY_SECRET`, and `CDP_WALLET_SECRET` are set. The SPA polls `/api/health` on a local port; if the server is up it proxies actions there, otherwise it stays in mock mode. CDP secrets live only in the server process — never in the client bundle.
- Clear **Mock / Live badge** in the header showing which mode is active.
- Self-contained under `apps/coinbase-agentkit/`: `bun install && bun run dev` works from that folder; `vite build --base /coinbase-agentkit/` must also pass (static Cloudflare deploy ships the mock SPA).

## Explicitly out of scope
- Mainnet or real funds
- The full `create onchain-agent` Next.js/LangChain scaffold (too heavy for this monorepo's Vite + Cloudflare static path)
- Real LLM tool-calling loop (chips / scripted phrase routing stand in for it)
- Auth, multi-user, persistence beyond `localStorage`
- New GitHub repo; Cloudflare workflow edits

## Outcome-oriented tasks
1. Scaffold Vite + React + TS via `bunx create-vite` (skip install), add `bunfig.toml` with `[install] minimumReleaseAge = 259200`, `bun install`, init shadcn/ui (radix, vega preset). ✅
2. Write this PLAN.md. ✅
3. Build the mock agent action layer (`src/lib/agent/`): typed action results, deterministic wallet, balance state machine, faucet/transfer/swap simulation with fake tx hashes and latency.
4. Build the chat UI: transcript of user actions + agent replies (rich cards for wallet/balances/previews), action chips, free-text routing, Mock/Live badge, localStorage persistence.
5. Optional live path: Bun server using the CDP SDK on `base-sepolia`, gated on env vars; client transport picks live only when `/api/health` responds. Secrets stay server-side.
6. README: what it is, how to run, how to get CDP keys from portal.cdp.coinbase.com, `.env.example` with the env var names.
7. Verify `vite build --base /coinbase-agentkit/` succeeds.
8. One PR with screenshot **and** video of the running app.

## Stack
- **Bun** — repo default runtime / package manager / scripts
- **Vite + React + TS** — matches sibling apps; static deploy under `/coinbase-agentkit/`
- **shadcn/ui (radix, vega)** — chat cards, chips, badges without a bespoke design system
- **@coinbase/cdp-sdk** (server-only, optional) — the bookmarked AgentKit/CDP stack for the live path on Base Sepolia
- **Local React state + localStorage** — enough for a one-user demo

## Deferred
- Real LLM agent loop with tool-calling (chips are the demo stand-in)
- Solana / smart-wallet providers beyond the Base Sepolia EVM wallet
- Live swap execution (preview/quote only, even in live mode)
