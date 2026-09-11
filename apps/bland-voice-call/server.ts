/**
 * Thin Bland proxy so BLAND_API_KEY never reaches the client bundle.
 *
 * Run with: BLAND_API_KEY=sk-... bun run server
 * The Vite dev server proxies /api/* here (see vite.config.ts). Without a key
 * the health check reports live=false and the UI stays in mock mode.
 */

const BLAND_API = 'https://api.bland.ai/v1'
const PORT = 3005

const apiKey = process.env.BLAND_API_KEY

function blandHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
}

function passThrough(upstream: Response): Promise<Response> {
  return upstream.text().then(
    (body) =>
      new Response(body, {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      }),
  )
}

Bun.serve({
  port: PORT,
  routes: {
    '/api/health': () => Response.json({ live: Boolean(apiKey) }),

    '/api/calls': {
      POST: async (req) => {
        if (!apiKey) {
          return Response.json(
            { message: 'BLAND_API_KEY is not set on the server.' },
            { status: 503 },
          )
        }
        const body = (await req.json()) as { phone_number?: string; task?: string }
        if (!body.phone_number || !body.task) {
          return Response.json(
            { message: 'phone_number and task are required.' },
            { status: 400 },
          )
        }
        const upstream = await fetch(`${BLAND_API}/calls`, {
          method: 'POST',
          headers: blandHeaders(),
          body: JSON.stringify({
            phone_number: body.phone_number,
            task: body.task,
          }),
        })
        return passThrough(upstream)
      },
    },

    '/api/calls/:id': async (req) => {
      if (!apiKey) {
        return Response.json(
          { message: 'BLAND_API_KEY is not set on the server.' },
          { status: 503 },
        )
      }
      const upstream = await fetch(
        `${BLAND_API}/calls/${encodeURIComponent(req.params.id)}`,
        { headers: blandHeaders() },
      )
      return passThrough(upstream)
    },
  },
  fetch() {
    return Response.json({ message: 'Not found' }, { status: 404 })
  },
})

console.log(
  `Bland proxy listening on http://localhost:${PORT} — mode: ${apiKey ? 'LIVE (key set)' : 'mock (no BLAND_API_KEY)'}`,
)
