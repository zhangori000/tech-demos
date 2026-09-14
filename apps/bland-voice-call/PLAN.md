# PLAN — bland-voice-call

Source bookmark: https://x.com/mattyp/status/2098155792327381294 (mattyp "Giving Grok Bot a Phone" / Dialbot, built on Bland).

## Goal
A single-user mini playground for the Bland AI voice-calling API: enter a phone number + short script, place a call, watch status progress, and read the returned transcript — with a full mock mode when `BLAND_API_KEY` is absent so the UX always demos (including on the static Cloudflare deploy).

## Single-user MVP
- One page: phone number field, script/task textarea, Call button, live status panel, transcript view.
- **Mock mode by default**: no key, no server → fake call id, staged statuses (`queued` → `ringing` → `in progress` → `completed`), and a sample transcript that streams in line by line. Works on the static build.
- **Live path** (verified against current Bland docs):
  - `POST https://api.bland.ai/v1/calls` with header `Authorization: Bearer <key>` and body `{ phone_number, task }` → `{ call_id }`.
  - Poll `GET https://api.bland.ai/v1/calls/{call_id}` → `queue_status` progresses `new → queued → allocated → started → complete`; final `status` is `completed | failed | busy | no-answer | canceled`; transcript arrives as `concatenated_transcript` + `transcripts[]` (`{ id, created_at, text, user }`), plus `summary`, `call_length`, `error_message`.
  - The key never reaches the client bundle: a thin Bun server (`bun run server`, port 3005) proxies those two endpoints under `/api/*` and exposes `GET /api/health` → `{ live }`. Vite dev-proxies `/api` to it; if the server is down or keyless, the health check fails and the app stays in mock mode.
- Clear **Mock / Live badge** in the header, driven by the health check.
- Safety: banner noting that live mode places a **real phone call**; live dial requires an explicit second confirmation click; mock is always the default.
- README: where to get a key (bland.ai dashboard), `.env.example` with `BLAND_API_KEY`.
- Self-contained under `apps/bland-voice-call/`: `bun install && bun run dev` works from this folder; `vite build --base /bland-voice-call/` must pass (Cloudflare Workers static assets).

## Explicitly out of scope
- Full Dialbot / Grok Bot phone product
- Pathways designer, custom tools, personas, inbound number setup
- Auth, multi-user, webhooks needing a public URL (polling is enough)
- New GitHub repo; Cloudflare workflow edits
- Recording playback UI

## Outcome-oriented tasks
1. Scaffold Vite + React + TS via `bunx create-vite` (skip install), add `bunfig.toml` with `[install] minimumReleaseAge = 259200`, `bun install`, init shadcn/ui (radix base, Vega preset). ✅
2. Write this PLAN.md. ✅
3. Mock call engine + UI: phone/script form, status timeline, streaming transcript view, Mock/Live badge.
4. Live Bun proxy (`server.ts`) gated on `BLAND_API_KEY`; client talks only to `/api/*`.
5. README + `.env.example`.
6. Verify `vite build --base /bland-voice-call/`.
7. One PR with screenshot **and** video of the running app.

## Stack
- **Bun** — repo default runtime / package manager / scripts; also hosts the tiny live proxy
- **Vite + React + TS** — matches sibling apps; one-page utility, no framework-grade routing needed
- **shadcn/ui** (radix-vega, same preset as sibling app) — form, cards, badge, transcript scroll area
- **Bland REST `/v1/calls`** — the bookmarked tech; polling, no webhooks

## Deferred
- Live websocket / mid-call streaming
- SMS / WhatsApp Bland products
- Recording playback, call history persistence
