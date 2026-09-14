import type {
  CallDriver,
  CallInput,
  CallSnapshot,
  CallStage,
  TranscriptLine,
} from '@/lib/call-types'

/**
 * Live driver: talks to the local Bun proxy (server.ts) under /api/*, which
 * forwards to api.bland.ai with the server-side BLAND_API_KEY. Relative URLs
 * keep this working behind any base path.
 */

interface BlandTranscriptEntry {
  id: number | string
  text: string
  user: TranscriptLine['speaker']
}

interface BlandCallDetails {
  call_id: string
  queue_status: string | null
  status: string | null
  completed: boolean
  transcripts: BlandTranscriptEntry[] | null
  concatenated_transcript: string | null
  summary: string | null
  call_length: number | null
  answered_by: string | null
  error_message: string | null
}

/** Map Bland's queue_status/status pair onto our four display stages. */
function toStage(details: BlandCallDetails): { stage: CallStage; raw: string } {
  const finalStatus = details.status
  if (finalStatus === 'completed') return { stage: 'completed', raw: finalStatus }
  if (
    finalStatus &&
    ['failed', 'busy', 'no-answer', 'canceled'].includes(finalStatus)
  ) {
    return { stage: 'failed', raw: finalStatus }
  }

  const queue = details.queue_status ?? 'new'
  if (queue === 'complete') return { stage: 'completed', raw: queue }
  if (queue === 'started') return { stage: 'in_progress', raw: queue }
  if (queue === 'allocated') return { stage: 'ringing', raw: queue }
  if (queue.includes('error')) return { stage: 'failed', raw: queue }
  return { stage: 'queued', raw: queue }
}

export async function checkLiveMode(): Promise<boolean> {
  try {
    const res = await fetch('api/health')
    if (!res.ok) return false
    const data = (await res.json()) as { live?: boolean }
    return data.live === true
  } catch {
    return false
  }
}

export function createLiveDriver(): CallDriver {
  return {
    async start(input: CallInput): Promise<string> {
      const res = await fetch('api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: input.phoneNumber,
          task: input.task,
        }),
      })
      const data = (await res.json()) as { call_id?: string; message?: string }
      if (!res.ok || !data.call_id) {
        throw new Error(data.message ?? `Bland call failed (HTTP ${res.status})`)
      }
      return data.call_id
    },

    async poll(callId: string): Promise<CallSnapshot> {
      const res = await fetch(`api/calls/${encodeURIComponent(callId)}`)
      if (!res.ok) {
        throw new Error(`Failed to fetch call details (HTTP ${res.status})`)
      }
      const details = (await res.json()) as BlandCallDetails
      const { stage, raw } = toStage(details)
      return {
        callId,
        stage,
        rawStatus: raw,
        transcript: (details.transcripts ?? []).map((t) => ({
          id: String(t.id),
          speaker: t.user,
          text: t.text,
        })),
        summary: details.summary,
        callLengthMinutes: details.call_length,
        answeredBy: details.answered_by,
        errorMessage: details.error_message,
      }
    },
  }
}
