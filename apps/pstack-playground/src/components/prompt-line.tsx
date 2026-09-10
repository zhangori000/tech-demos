import { CopyButton } from '@/components/copy-button'

export function PromptLine({ text }: { text: string }) {
  return (
    <div className="flex items-start justify-between gap-2 rounded-md bg-muted/60 px-3 py-2">
      <code className="font-mono text-[13px] leading-relaxed break-words whitespace-pre-wrap">
        {text}
      </code>
      <CopyButton text={text} />
    </div>
  )
}
