export type CallStage =
  | 'queued'
  | 'ringing'
  | 'in_progress'
  | 'completed'
  | 'failed'

export interface CallInput {
  phoneNumber: string
  task: string
}

export interface TranscriptLine {
  id: string
  speaker: 'user' | 'assistant' | 'robot' | 'agent-action'
  text: string
}

export interface CallSnapshot {
  callId: string
  stage: CallStage
  /** Raw status text from the backend (Bland queue_status / status) */
  rawStatus: string
  transcript: TranscriptLine[]
  summary: string | null
  callLengthMinutes: number | null
  answeredBy: string | null
  errorMessage: string | null
}

export interface CallDriver {
  /** Kick off the call and return its call id. */
  start(input: CallInput): Promise<string>
  /** Fetch the current state of a call started by this driver. */
  poll(callId: string): Promise<CallSnapshot>
}

export const STAGE_ORDER: CallStage[] = [
  'queued',
  'ringing',
  'in_progress',
  'completed',
]

export const STAGE_LABELS: Record<CallStage, string> = {
  queued: 'Queued',
  ringing: 'Ringing',
  in_progress: 'In progress',
  completed: 'Completed',
  failed: 'Failed',
}

export function isTerminal(stage: CallStage): boolean {
  return stage === 'completed' || stage === 'failed'
}
