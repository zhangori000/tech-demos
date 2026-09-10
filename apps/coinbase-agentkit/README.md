# Coinbase AgentKit Playground

A single-user chat-style playground demoing [Coinbase AgentKit](https://github.com/coinbase/agentkit) / CDP-style onchain agent actions on **Base Sepolia**: create/show an agent wallet, request testnet faucet funds, check balances, and preview transfers and swaps.

Built for the bookmark: [Coinbase for Agents launch](https://x.com/coinbase/status/2097763235302662383).

## Run it

```sh
bun install
bun run dev
```

That's it — the app starts in **mock mode** (deterministic demo wallet, balances, and tx hashes; state persists in `localStorage`). No keys or network access required. Use the action chips or type things like:

- `create a wallet`
- `request faucet funds`
- `show balances`
- `send 0.01 ETH to 0x…`
- `swap 0.05 ETH to USDC`

The **Mock / Live** badge in the header shows which mode is active. The reset button (↺) clears demo state.

## Optional: live mode (real CDP wallet on Base Sepolia)

The live path uses [`@coinbase/cdp-sdk`](https://www.npmjs.com/package/@coinbase/cdp-sdk) — the wallet API underneath AgentKit's CDP wallet providers — from a thin local Bun server so secrets never reach the browser.

1. Create a project at [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com), then create a **Secret API Key** and a **Wallet Secret**.
2. Copy `.env.example` to `.env` and fill in:
   - `CDP_API_KEY_ID`
   - `CDP_API_KEY_SECRET`
   - `CDP_WALLET_SECRET`
3. In one terminal: `bun run server` (starts on `http://localhost:8787`).
4. In another: `bun run dev`. The SPA probes `/api/health` on load and switches to **Live** when the server is up with credentials.

Live mode uses a named CDP server account on `base-sepolia` (testnet only — never mainnet, never real funds). Faucet requests hit the real CDP faucet; transfer previews estimate gas against `sepolia.base.org`; swap quotes stay indicative because CDP swap pricing is mainnet-only.

## Production build

Deployed as static assets under `/coinbase-agentkit/` by the monorepo's Cloudflare workflow:

```sh
bunx vite build --base /coinbase-agentkit/
```

The static build ships the mock SPA (live mode is a local-dev nicety only).

## Layout

- `src/lib/agent/` — one `AgentBackend` interface, two implementations: `mock.ts` (browser, deterministic) and `live.ts` (client transport for the local server)
- `src/lib/chat.ts` — chat message model + keyword intent router (stands in for an LLM tool-calling loop)
- `src/components/` — chat UI, rich agent reply cards (shadcn/ui)
- `server/index.ts` — optional live server holding CDP credentials
