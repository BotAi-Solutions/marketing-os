// Case study as published: client, headline stat, summary, services, stack and the LinkedIn angle.
import { StatusBadge } from '@/components/data/StatusBadge'
import { Markdown } from '@/components/preview/Markdown'
import { list, str, type PreviewProps } from '@/components/preview/values'
import { Badge } from '@/components/ui/badge'

export function CaseStudyPreview({ row }: PreviewProps) {
  const facts = [
    ['Industry', str(row, 'industry')],
    ['Duration', str(row, 'duration')],
    ['Stack', str(row, 'tech_stack')],
  ].filter(([, v]) => v)

  return (
    <article className="mx-auto w-full max-w-3xl space-y-8 rounded-xl border bg-card px-6 py-8 text-card-foreground sm:px-10 sm:py-12">
      <header className="space-y-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{str(row, 'client') || 'Client'} · Case study</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">{row.title || 'Untitled'}</h1>
        {str(row, 'one_line_summary') && <p className="text-lg text-muted-foreground">{str(row, 'one_line_summary')}</p>}
      </header>

      {str(row, 'key_stat') && (
        <div className="rounded-xl bg-muted px-6 py-8 text-center">
          <p className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{str(row, 'key_stat')}</p>
          <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">Result</p>
        </div>
      )}

      {facts.length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-3">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {list(row, 'service_types').length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {list(row, 'service_types').map((s) => (
            <Badge key={s} variant="secondary" className="font-normal">
              {s}
            </Badge>
          ))}
        </div>
      )}

      {str(row, 'linkedin_angle') && (
        <section className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">LinkedIn angle</h2>
          <Markdown source={`> ${str(row, 'linkedin_angle').replace(/\n/g, '\n> ')}`} />
        </section>
      )}

      <footer className="flex flex-wrap items-center gap-3 border-t pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          Testimonial <StatusBadge status={str(row, 'testimonial_status') || null} />
        </span>
        <span className="flex items-center gap-1.5">
          Client approval <StatusBadge status={str(row, 'client_approval') || null} />
        </span>
      </footer>
    </article>
  )
}
