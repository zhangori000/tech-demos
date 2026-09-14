import { useEffect, useRef, useState } from 'react'
import {
  Bot,
  CircleCheck,
  FlaskConical,
  LoaderCircle,
  Phone,
  PhoneCall,
  RotateCcw,
  TriangleAlert,
  User,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { useCall } from '@/hooks/use-call'
import type { CallSnapshot, CallStage } from '@/lib/call-types'
import { STAGE_LABELS, STAGE_ORDER } from '@/lib/call-types'
import { cn } from '@/lib/utils'

const DEFAULT_PHONE = '+15555550123'
const DEFAULT_TASK =
  "You're Sunny, a friendly assistant calling to confirm tomorrow's 2 PM dentist appointment. Greet the person, check that the time still works for them, and wish them a great day."

function StageTimeline({ snapshot }: { snapshot: CallSnapshot | null }) {
  const stage = snapshot?.stage
  const failed = stage === 'failed'
  const reachedIndex = stage
    ? failed
      ? STAGE_ORDER.indexOf('in_progress')
      : STAGE_ORDER.indexOf(stage)
    : -1

  return (
    <ol className="flex items-center gap-1.5">
      {STAGE_ORDER.map((s: CallStage, i) => {
        const done = reachedIndex > i || stage === 'completed'
        const current = !done && reachedIndex === i && !failed
        return (
          <li key={s} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  'h-px flex-1',
                  i === 0 ? 'bg-transparent' : done || current ? 'bg-primary/60' : 'bg-border',
                )}
              />
              <div
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-full border text-muted-foreground',
                  done && 'border-primary bg-primary text-primary-foreground',
                  current && 'border-primary text-primary',
                )}
              >
                {done ? (
                  <CircleCheck className="size-4" />
                ) : current ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <span className="text-xs">{i + 1}</span>
                )}
              </div>
              <div
                className={cn(
                  'h-px flex-1',
                  i === STAGE_ORDER.length - 1 ? 'bg-transparent' : done ? 'bg-primary/60' : 'bg-border',
                )}
              />
            </div>
            <span
              className={cn(
                'text-xs',
                done || current ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {STAGE_LABELS[s]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

function TranscriptView({ snapshot }: { snapshot: CallSnapshot | null }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const lineCount = snapshot?.transcript.length ?? 0

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [lineCount])

  if (!snapshot || snapshot.transcript.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        {snapshot
          ? 'Waiting for the conversation to start…'
          : 'Place a call to see the transcript here.'}
      </div>
    )
  }

  return (
    <ScrollArea className="h-72 rounded-lg border">
      <div className="flex flex-col gap-3 p-4">
        {snapshot.transcript.map((line) => {
          const isAgent = line.speaker !== 'user'
          return (
            <div
              key={line.id}
              className={cn('flex items-end gap-2', !isAgent && 'flex-row-reverse')}
            >
              <div
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full',
                  isAgent ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                )}
              >
                {isAgent ? <Bot className="size-3.5" /> : <User className="size-3.5" />}
              </div>
              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                  isAgent ? 'bg-primary/10' : 'bg-muted',
                )}
              >
                <span className="mb-0.5 block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {isAgent ? 'Agent' : 'Callee'}
                </span>
                {line.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}

export default function App() {
  const { liveMode, phase, snapshot, startError, placeCall, reset } = useCall()
  const [phone, setPhone] = useState(DEFAULT_PHONE)
  const [task, setTask] = useState(DEFAULT_TASK)
  const [confirmingLive, setConfirmingLive] = useState(false)

  const busy = phase === 'dialing' || phase === 'active'
  const canSubmit = phone.trim().length > 0 && task.trim().length > 0 && !busy

  const handleCallClick = () => {
    if (liveMode && !confirmingLive) {
      setConfirmingLive(true)
      return
    }
    setConfirmingLive(false)
    void placeCall({ phoneNumber: phone.trim(), task: task.trim() })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PhoneCall className="size-5" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-semibold">Bland voice call playground</h1>
              <p className="text-sm text-muted-foreground">
                Place an AI phone call, watch it progress, read the transcript.
              </p>
            </div>
          </div>
          <Badge
            variant={liveMode ? 'destructive' : 'secondary'}
            className="gap-1.5 px-3 py-1 text-sm"
          >
            {liveMode ? <Phone className="size-3.5" /> : <FlaskConical className="size-3.5" />}
            {liveMode ? 'Live mode' : 'Mock mode'}
          </Badge>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Place a call</CardTitle>
              <CardDescription>
                {liveMode
                  ? 'BLAND_API_KEY detected — calls go through api.bland.ai for real.'
                  : 'No API key configured, so calls are simulated. Run the proxy with a key for live dialing.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+15555550123"
                  disabled={busy}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="task">Script / task for the agent</Label>
                <Textarea
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  rows={6}
                  placeholder="Tell the agent who it is, why it's calling, and what to accomplish…"
                  disabled={busy}
                  className="min-h-32"
                />
              </div>

              {liveMode && !confirmingLive && (
                <p className="text-xs text-muted-foreground">
                  Live mode places a <strong>real phone call</strong> to the number above. You'll
                  be asked to confirm.
                </p>
              )}

              {confirmingLive && (
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>This will dial a real phone</AlertTitle>
                  <AlertDescription>
                    Bland will place an actual call to {phone.trim() || 'that number'} and your
                    account will be billed. Continue?
                  </AlertDescription>
                </Alert>
              )}

              {startError && (
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>Call failed to start</AlertTitle>
                  <AlertDescription>{startError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button onClick={handleCallClick} disabled={!canSubmit} className="gap-2">
                {phase === 'dialing' ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <PhoneCall className="size-4" />
                )}
                {confirmingLive
                  ? 'Yes, dial for real'
                  : liveMode
                    ? 'Place live call'
                    : 'Place mock call'}
              </Button>
              {confirmingLive && (
                <Button variant="outline" onClick={() => setConfirmingLive(false)}>
                  Cancel
                </Button>
              )}
              {phase === 'done' && (
                <Button variant="outline" onClick={reset} className="gap-2">
                  <RotateCcw className="size-4" />
                  New call
                </Button>
              )}
            </CardFooter>
          </Card>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Call status</CardTitle>
                {snapshot ? (
                  <CardDescription className="font-mono text-xs">
                    {snapshot.callId}
                  </CardDescription>
                ) : (
                  <CardDescription>No call in flight.</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <StageTimeline snapshot={snapshot} />

                {snapshot?.stage === 'failed' && (
                  <Alert variant="destructive">
                    <TriangleAlert />
                    <AlertTitle>Call ended with status "{snapshot.rawStatus}"</AlertTitle>
                    {snapshot.errorMessage && (
                      <AlertDescription>{snapshot.errorMessage}</AlertDescription>
                    )}
                  </Alert>
                )}

                {snapshot && snapshot.stage !== 'failed' && (
                  <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      Status: <span className="font-medium text-foreground">{snapshot.rawStatus}</span>
                    </span>
                    {snapshot.callLengthMinutes != null && (
                      <span>
                        Length:{' '}
                        <span className="font-medium text-foreground">
                          {snapshot.callLengthMinutes} min
                        </span>
                      </span>
                    )}
                    {snapshot.answeredBy && (
                      <span>
                        Answered by:{' '}
                        <span className="font-medium text-foreground">{snapshot.answeredBy}</span>
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transcript</CardTitle>
                <CardDescription>
                  Streamed from Bland's <code className="font-mono text-xs">transcripts</code>{' '}
                  while polling the call.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <TranscriptView snapshot={snapshot} />
                {snapshot?.summary && (
                  <>
                    <Separator />
                    <div className="text-sm">
                      <p className="mb-1 font-medium">Call summary</p>
                      <p className="text-muted-foreground">{snapshot.summary}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground">
          Demo of Bland's{' '}
          <a
            href="https://docs.bland.ai/api-v1/post/calls"
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            /v1/calls
          </a>{' '}
          API · inspired by{' '}
          <a
            href="https://x.com/mattyp/status/2098155792327381294"
            className="underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            mattyp's Dialbot
          </a>{' '}
          · not affiliated with Bland
        </footer>
      </div>
    </div>
  )
}
