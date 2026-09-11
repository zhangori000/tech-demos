import { useCallback, useEffect, useRef, useState } from 'react'
import type { CallInput, CallSnapshot } from '@/lib/call-types'
import { isTerminal } from '@/lib/call-types'
import { checkLiveMode } from '@/lib/live-call'
import { createLiveDriver } from '@/lib/live-call'
import { createMockDriver } from '@/lib/mock-call'

const POLL_EVERY_MS = 1200

export type CallPhase = 'idle' | 'dialing' | 'active' | 'done'

export interface UseCallResult {
  liveMode: boolean
  phase: CallPhase
  snapshot: CallSnapshot | null
  startError: string | null
  placeCall: (input: CallInput) => Promise<void>
  reset: () => void
}

export function useCall(): UseCallResult {
  const [liveMode, setLiveMode] = useState(false)
  const [phase, setPhase] = useState<CallPhase>('idle')
  const [snapshot, setSnapshot] = useState<CallSnapshot | null>(null)
  const [startError, setStartError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mockDriver = useRef(createMockDriver())
  const liveDriver = useRef(createLiveDriver())

  useEffect(() => {
    let cancelled = false
    checkLiveMode().then((live) => {
      if (!cancelled) setLiveMode(live)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const stopPolling = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  useEffect(() => stopPolling, [stopPolling])

  const placeCall = useCallback(
    async (input: CallInput) => {
      stopPolling()
      setSnapshot(null)
      setStartError(null)
      setPhase('dialing')
      const driver = liveMode ? liveDriver.current : mockDriver.current

      let callId: string
      try {
        callId = await driver.start(input)
      } catch (err) {
        setStartError(err instanceof Error ? err.message : String(err))
        setPhase('idle')
        return
      }

      setPhase('active')
      let polling = false
      timerRef.current = setInterval(async () => {
        if (polling) return
        polling = true
        try {
          const snap = await driver.poll(callId)
          setSnapshot(snap)
          if (isTerminal(snap.stage)) {
            stopPolling()
            setPhase('done')
          }
        } catch {
          // Transient poll failures: keep trying until a terminal state.
        } finally {
          polling = false
        }
      }, POLL_EVERY_MS)
    },
    [liveMode, stopPolling],
  )

  const reset = useCallback(() => {
    stopPolling()
    setSnapshot(null)
    setStartError(null)
    setPhase('idle')
  }, [stopPolling])

  return { liveMode, phase, snapshot, startError, placeCall, reset }
}
