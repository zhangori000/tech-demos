import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptLine } from '@/components/prompt-line'
import { GUIDE_PARTS, type GuideChapter, type GuidePart } from '@/lib/poteto-guide-data'

const promptCount = (part: GuidePart) =>
  part.chapters.reduce((n, c) => n + (c.prompts?.length ?? 0), 0)

function PartHeader({ part }: { part: GuidePart }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle>{part.title}</CardTitle>
          <Badge variant="secondary">
            {part.chapters.length} chapters &middot; {promptCount(part)} copyable prompts
          </Badge>
        </div>
        <CardDescription>{part.thesis}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm" className="w-fit">
          <a href={part.sourceUrl} target="_blank" rel="noreferrer">
            Read the original on X
            <ExternalLink />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

function ChapterCard({ chapter, index }: { chapter: GuideChapter; index: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {index + 1}
          </span>
          {chapter.title}
        </CardTitle>
        {chapter.kicker && <CardDescription className="pl-7">{chapter.kicker}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2.5">
          {chapter.paragraphs.map((text) => (
            <p key={text} className="text-sm leading-relaxed text-muted-foreground">
              {text}
            </p>
          ))}
        </div>
        {chapter.points && (
          <div className="grid gap-3 sm:grid-cols-2">
            {chapter.points.map((point) => (
              <div key={point.title} className="rounded-lg border p-3">
                <p className="text-sm font-medium">{point.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{point.detail}</p>
              </div>
            ))}
          </div>
        )}
        {chapter.prompts && (
          <div className="flex flex-col gap-3">
            {chapter.prompts.map((p) => (
              <div key={p.id} className="flex flex-col rounded-lg border p-3">
                <span className="mb-1.5 text-sm font-medium">{p.label}</span>
                <PromptLine text={p.prompt} />
                {p.note && <p className="mt-1.5 text-xs text-muted-foreground">{p.note}</p>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function PotetoGuide() {
  return (
    <Tabs defaultValue="part1">
      <TabsList className="mb-2">
        {GUIDE_PARTS.map((part) => (
          <TabsTrigger key={part.id} value={part.id}>
            {part.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {GUIDE_PARTS.map((part) => (
        <TabsContent key={part.id} value={part.id} className="flex flex-col gap-6">
          <PartHeader part={part} />
          {part.chapters.map((chapter, i) => (
            <ChapterCard key={chapter.id} chapter={chapter} index={i} />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  )
}
