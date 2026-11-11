// Prompt as the team uses it: model/version header, prompt text with {{variables}} highlighted, copy button, inputs and notes.
import { Copy } from 'lucide-react'
import { Fragment } from 'react'
import { toast } from 'sonner'
import { Stars } from '@/components/data/FieldDisplay'
import { Markdown } from '@/components/preview/Markdown'
import { num, str, type PreviewProps } from '@/components/preview/values'
import { Button } from '@/components/ui/button'

// Highlights {{placeholders}} so missing inputs stand out.
function PromptText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{\{[^}]+\}\})/).map((part, i) =>
        part.startsWith('{{') ? (
          <mark key={i} className="rounded bg-warning/25 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function PromptPreview({ row }: PreviewProps) {
  const prompt = str(row, 'prompt')
  const variables = [...new Set(prompt.match(/\{\{[^}]+\}\}/g) ?? [])]
  const meta = [str(row, 'use_case'), str(row, 'tool_model'), num(row, 'version') !== null && `v${num(row, 'version')}`].filter(Boolean)

  // Copies the raw prompt text.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      toast.success('Prompt copied')
    } catch {
      toast.error('Could not copy. Select the text and copy manually.')
    }
  }

  return (
    <article className="mx-auto w-full max-w-3xl space-y-6 rounded-xl border bg-card px-6 py-8 text-card-foreground sm:px-8">
      <header className="space-y-2">
        <p className="text-xs text-muted-foreground">{meta.join(' · ') || 'Prompt'}</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">{row.title || 'Untitled prompt'}</h1>
        {num(row, 'quality_rating') !== null && <Stars value={num(row, 'quality_rating') ?? 0} />}
      </header>

      <div className="relative">
        <pre className="max-h-[480px] overflow-auto rounded-lg bg-muted p-4 pr-12 font-mono text-xs leading-relaxed whitespace-pre-wrap">
          {prompt ? <PromptText text={prompt} /> : <span className="text-muted-foreground">No prompt text yet.</span>}
        </pre>
        <Button variant="ghost" size="icon-sm" className="absolute top-2 right-2" aria-label="Copy prompt" disabled={!prompt} onClick={() => void copy()}>
          <Copy />
        </Button>
      </div>

      {variables.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Variables to fill: {variables.map((v) => <code key={v} className="mr-1 rounded bg-muted px-1 font-mono">{v}</code>)}
        </p>
      )}

      {str(row, 'inputs_needed') && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Inputs needed</h2>
          <Markdown source={str(row, 'inputs_needed')} className="text-sm leading-6" />
        </section>
      )}
      {str(row, 'notes') && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Notes</h2>
          <Markdown source={str(row, 'notes')} className="text-sm leading-6" />
        </section>
      )}
    </article>
  )
}
