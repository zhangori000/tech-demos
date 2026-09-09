import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { CopyButton } from '@/components/copy-button'
import {
  COMMAND_GROUPS,
  DOORS,
  LIBRARY_PROMPT_COUNT,
  PROMPT_LIBRARY,
  PROMPT_SHAPE,
  REWRITES,
  SHAPE_ASSEMBLED,
  STARTER_PATH,
} from '@/lib/coach-data'

function PromptLine({ text }: { text: string }) {
  return (
    <div className="flex items-start justify-between gap-2 rounded-md bg-muted/60 px-3 py-2">
      <code className="font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
        {text}
      </code>
      <CopyButton text={text} />
    </div>
  )
}

function PromptLibrary() {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PROMPT_LIBRARY.filter((c) => !categoryId || c.id === categoryId)
      .map((c) => ({
        ...c,
        prompts: q
          ? c.prompts.filter((p) =>
              `${p.label} ${p.prompt} ${p.note}`.toLowerCase().includes(q),
            )
          : c.prompts,
      }))
      .filter((c) => c.prompts.length > 0)
  }, [query, categoryId])

  const shownCount = visible.reduce((n, c) => n + c.prompts.length, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>Prompt library</CardTitle>
          <Badge variant="secondary">
            {shownCount === LIBRARY_PROMPT_COUNT
              ? `${LIBRARY_PROMPT_COUNT} prompts`
              : `${shownCount} of ${LIBRARY_PROMPT_COUNT} prompts`}
          </Badge>
        </div>
        <CardDescription>
          Every prompt below is from the official pstack 0.15 guide. Copy one, swap in your own
          paths and goals, paste into a new chat. The recipes are deliberately informal &mdash;
          that&rsquo;s how they get typed in practice, and the skills read intent fine.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={'Search prompts \u2014 try "worktree", "repro", or "/arena"'}
              className="pl-9"
              aria-label="Search prompts"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Button
              variant={categoryId === null ? 'default' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setCategoryId(null)}
            >
              All
            </Button>
            {PROMPT_LIBRARY.map((c) => (
              <Button
                key={c.id}
                variant={categoryId === c.id ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2.5 text-xs"
                onClick={() => setCategoryId(categoryId === c.id ? null : c.id)}
              >
                {c.title}
              </Button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No prompts match &ldquo;{query}&rdquo;. Try a shorter word, or clear the category
            filter.
          </p>
        ) : (
          visible.map((category, i) => (
            <div key={category.id}>
              {i > 0 && <Separator className="mb-5" />}
              <div className="mb-3">
                <h3 className="text-sm font-semibold">{category.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{category.blurb}</p>
              </div>
              <div className="grid gap-3 xl:grid-cols-2">
                {category.prompts.map((p) => (
                  <div key={p.id} className="flex flex-col rounded-lg border p-3">
                    <span className="mb-1.5 text-sm font-medium">{p.label}</span>
                    <PromptLine text={p.prompt} />
                    <p className="mt-1.5 text-xs text-muted-foreground">{p.note}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function DoorHelper() {
  const [doorId, setDoorId] = useState<string | null>(null)
  const door = DOORS.find((d) => d.id === doorId)

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Which door?</CardTitle>
        <CardDescription>
          Pick what you&rsquo;re trying to do &mdash; get the right command and a ready-to-copy
          prompt.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-1.5">
          {DOORS.map((d) => (
            <Button
              key={d.id}
              variant={doorId === d.id ? 'default' : 'outline'}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setDoorId(doorId === d.id ? null : d.id)}
            >
              {d.label}
            </Button>
          ))}
        </div>
        {door ? (
          <div className="rounded-lg border p-3">
            <div className="mb-2 flex flex-wrap items-center gap-2">
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
  )
}

export function PromptCoach() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Start here &mdash; the whole workflow is three commands</CardTitle>
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

      <PromptLibrary />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Shape of a good prompt</CardTitle>
            <CardDescription>
              Goal + done criteria. Everything else is a constraint you add when it earns its
              place.
            </CardDescription>
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
            <Separator className="my-1" />
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                All of it assembled into one prompt:
              </p>
              <PromptLine text={SHAPE_ASSEMBLED} />
            </div>
          </CardContent>
        </Card>

        <DoorHelper />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pitfalls, rewritten</CardTitle>
          <CardDescription>
            The mistakes everyone makes once, from the official guide &mdash; each with the
            prompt that fixes it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-2">
            {REWRITES.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 rounded-lg border p-3">
                <p className="text-sm font-medium">{r.title}</p>
                <div className="rounded-md border border-destructive/25 bg-destructive/5 px-3 py-2">
                  <span className="mb-0.5 block text-[10px] font-semibold tracking-wide text-destructive uppercase">
                    Before
                  </span>
                  <code className="font-mono text-[13px] leading-relaxed break-words text-muted-foreground">
                    {r.bad}
                  </code>
                </div>
                <div className="rounded-md bg-muted/60 px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="mb-0.5 block text-[10px] font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-500">
                        After
                      </span>
                      <code className="font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
                        {r.good}
                      </code>
                    </div>
                    <CopyButton text={r.good} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{r.why}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>The full toolbox &mdash; for later</CardTitle>
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
