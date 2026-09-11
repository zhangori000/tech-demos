# bland-voice-call

A tiny single-user playground for the [Bland AI](https://www.bland.ai) voice-calling API: enter a phone number and a short script, place a call, watch its status progress, and read the transcript as it comes back.

Inspired by [mattyp's "Giving Grok Bot a Phone" / Dialbot](https://x.com/mattyp/status/2098155792327381294), which is built on Bland.

## Run it

```sh
bun install
bun run dev
```

Open http://localhost:5173. Without an API key the app runs in **mock mode**: a fake call id, staged statuses (queued → ringing → in progress → completed), and a sample transcript that streams in — the full UX with no key and no real phone call.

## Live mode (real phone calls)

1. Get an API key from the [Bland dashboard](https://app.bland.ai) (Settings → API Keys). See the [docs](https://docs.bland.ai/api-v1/post/calls).
2. Copy `.env.example` to `.env` and set `BLAND_API_KEY`, or export it in your shell.
3. In a second terminal, start the proxy: `bun run server` (port 3005).
4. Reload the app — the header badge flips to **Live mode**.

The key stays on the Bun proxy (`server.ts`); the client only talks to `/api/*`:

- `POST /api/calls` → `POST https://api.bland.ai/v1/calls` (`{ phone_number, task }`)
- `GET /api/calls/:id` → `GET https://api.bland.ai/v1/calls/{call_id}` (status + transcripts, polled every ~1.2s)

**Live mode places a real phone call** to the number you enter and bills your Bland account. The UI asks for an explicit confirmation before dialing, and mock mode is always the default.

## Static build (Cloudflare Workers assets)

```sh
bunx vite build --base /bland-voice-call/
```

The static build has no proxy, so the health check fails and the deployed page always demos in mock mode.

## Out of scope

Pathways, personas, inbound numbers, webhooks, recordings, auth — see `PLAN.md`.
