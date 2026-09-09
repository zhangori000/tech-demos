import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CopyButton } from '@/components/copy-button'
import {
  COMMAND_GROUPS,
  DOORS,
  PITFALLS,
  PROMPT_SHAPE,
  STARTER_PATH,
  STARTER_PROMPTS,
} from '@/lib/coach-data'

function PromptLine({ text }: { text: string }) {
  return (
    <div className="flex items-start justify-between gap-2 rounded-md bg-muted/60 px-3 py-2">
      <code className="font-mono text-[13px] leading-relaxed break-words">{text}</code>
      <CopyButton text={text} />
    </div>
  )
}

export function PromptCoach() {
  const [doorId, setDoorId] = useState<string | null>(null)
  const door = DOORS.find((d) => d.id === doorId)

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Start here — the whole workflow is three commands</CardTitle>
          <CardDescription>
            Don&rsquo;t memorize 23 skills and 22 playbooks. Most of the time{' '}
            <code className="font-mono text-foreground">/poteto-mode</code> is enough.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {STARTER_PATH.map((step, i) => (
              <div key={step.command} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
                <div className="mt-3">
                  <PromptLine text={step.command} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{step.detail}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Starter prompts</CardTitle>
            <CardDescription>
              Copy one, swap in your own goal, paste into a new chat.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {STARTER_PROMPTS.map((p) => (
              <div key={p.label}>
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium">{p.label}</span>
                </div>
                <PromptLine text={p.prompt} />
                <p className="mt-1.5 text-xs text-muted-foreground">{p.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shape of a good prompt</CardTitle>
              <CardDescription>Goal + done criteria. Everything else is optional.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              {PROMPT_SHAPE.map((ing) => (
                <div key={ing.name} className="flex items-start gap-2 text-sm">
                  <Badge
                    variant={ing.required ? 'default' : 'outline'}
                    className="mt-0.5 shrink-0 font-normal"
                  >
                    {ing.required ? 'always' : 'optional'}
                  </Badge>
                  <div className="min-w-0">
                    <span className="font-medium">{ing.name}</span>
                    <p className="font-mono text-xs text-muted-foreground">{ing.example}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Which door?</CardTitle>
              <CardDescription>Pick what you&rsquo;re trying to do.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                {DOORS.map((d) => (
                  <Button
                    key={d.id}
                    variant={doorId === d.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDoorId(d.id)}
                  >
                    {d.label}
                  </Button>
                ))}
              </div>
              {door ? (
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge className="font-mono">{door.command}</Badge>
                    <span className="text-xs text-muted-foreground">{door.why}</span>
                  </div>
                  <PromptLine text={door.samplePrompt} />
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  A recommended command and a ready-to-copy prompt will show up here.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Common pitfalls</CardTitle>
              <CardDescription>From the official guide.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {PITFALLS.map((p, i) => (
                <div key={p.title}>
                  {i > 0 && <Separator className="mb-3" />}
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The full toolbox — for later</CardTitle>
          <CardDescription>
            You rarely call these directly; the playbook does. Skim once so the names ring a
            bell.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {COMMAND_GROUPS.map((group) => (
              <AccordionItem key={group.id} value={group.id}>
                <AccordionTrigger className="text-sm">
                  <span className="flex items-center gap-2">
                    {group.title}
                    <span className="font-normal text-muted-foreground">{group.tagline}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-2">
                    {group.commands.map((c) => (
                      <div key={c.command} className="flex items-baseline gap-3 text-sm">
                        <code className="shrink-0 font-mono text-[13px] font-medium">
                          {c.command}
                        </code>
                        <span className="text-muted-foreground">{c.whenToUse}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
