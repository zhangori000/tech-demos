import type {
  CallDriver,
  CallInput,
  CallSnapshot,
  TranscriptLine,
} from '@/lib/call-types'

/**
 * Deterministic fake Bland backend. Progresses a "call" through
 * queued -> ringing -> in progress -> completed based on wall-clock time
 * since start, streaming a sample transcript line by line. Lets the static
 * (keyless) deploy demo the full UX.
 */

const RING_AT_MS = 1600
const ANSWER_AT_MS = 3400
const LINE_EVERY_MS = 1900

interface MockCall {
  startedAt: number
  input: CallInput
  lines: TranscriptLine[]
}

function firstSentence(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, ' ')
  const match = cleaned.match(/^.*?[.!?](\s|$)/)
  const sentence = match ? match[0].trim() : cleaned
  return sentence.length > 160 ? `${sentence.slice(0, 157)}...` : sentence
}

function buildTranscript(input: CallInput): TranscriptLine[] {
  const opener = input.task.trim()
    ? `Hi there! Quick call for you — here's why I'm ringing: ${firstSentence(input.task)}`
    : 'Hi there! This is the Bland demo agent giving you a quick test call.'
  const texts: Array<[TranscriptLine['speaker'], string]> = [
    ['user', 'Hello?'],
    ['assistant', opener],
    ['user', "Oh, okay — sure. What do you need from me?"],
    [
      'assistant',
      "Nothing complicated, I promise. I just wanted to walk you through it and make sure it works for you.",
    ],
    ['user', "That works. Honestly, you sound surprisingly human."],
    [
      'assistant',
      "I get that a lot! I'm an AI agent made with Bland, so I can handle calls like this end to end.",
    ],
    ['user', "Neat. Alright, I think we're all set then."],
    [
      'assistant',
      'Perfect, that was everything I needed. Thanks for picking up — have a great day!',
    ],
  ]
  return texts.map(([speaker, text], i) => ({
    id: `mock-line-${i}`,
    speaker,
    text,
  }))
}

export function createMockDriver(): CallDriver {
  const calls = new Map<string, MockCall>()

  return {
    async start(input: CallInput): Promise<string> {
      // Simulate the POST /v1/calls round trip.
      await new Promise((r) => setTimeout(r, 500))
      const callId = `mock-${crypto.randomUUID()}`
      calls.set(callId, {
        startedAt: Date.now(),
        input,
        lines: buildTranscript(input),
      })
      return callId
    },

    async poll(callId: string): Promise<CallSnapshot> {
      const call = calls.get(callId)
      if (!call) throw new Error(`Unknown mock call: ${callId}`)
      const elapsed = Date.now() - call.startedAt

      const base: CallSnapshot = {
        callId,
        stage: 'queued',
        rawStatus: 'queued',
        transcript: [],
        summary: null,
        callLengthMinutes: null,
        answeredBy: null,
        errorMessage: null,
      }

      if (elapsed < RING_AT_MS) return base
      if (elapsed < ANSWER_AT_MS) {
        return { ...base, stage: 'ringing', rawStatus: 'started' }
      }

      const linesShown = Math.min(
        call.lines.length,
        1 + Math.floor((elapsed - ANSWER_AT_MS) / LINE_EVERY_MS),
      )
      const transcript = call.lines.slice(0, linesShown)
      const done = linesShown >= call.lines.length

      if (!done) {
        return { ...base, stage: 'in_progress', rawStatus: 'started', transcript }
      }

      const totalMs = ANSWER_AT_MS + call.lines.length * LINE_EVERY_MS
      return {
        ...base,
        stage: 'completed',
        rawStatus: 'completed',
        transcript,
        answeredBy: 'human',
        callLengthMinutes: Math.round((totalMs / 60000) * 100) / 100,
        summary:
          'The agent introduced itself, explained the reason for the call based on the provided script, confirmed the details with the recipient, and ended the call politely. (Sample summary — mock mode.)',
      }
    },
  }
}
