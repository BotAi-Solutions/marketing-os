// Landing page preview inside a browser frame: hero, offer, CTA and proof from linked case studies.
import { RelationLinks } from '@/components/data/RelationLinks'
import { list, str, type PreviewProps } from '@/components/preview/values'
import { shortUrl } from '@/lib/format'

export function LandingPreview({ row }: PreviewProps) {
  const url = str(row, 'live_url')
  const variant = str(row, 'variant')
  const caseStudies = list(row, 'case_studies')

  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
      <div className="flex items-center gap-3 border-b bg-muted/60 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-muted-foreground/30" />
          ))}
        </span>
        <span className="min-w-0 flex-1 rounded-md break-all bg-background px-3 py-1 text-xs text-muted-foreground">
          {url ? shortUrl(url, 60) : 'botai.example/lp/…'}
        </span>
        {variant && <span className="text-xs text-muted-foreground">Variant {variant}</span>}
      </div>

      <section className="space-y-6 px-6 py-14 text-center sm:px-12 sm:py-20">
        {str(row, 'offer') && (
          <p className="mx-auto w-fit rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">{str(row, 'offer')}</p>
        )}
        <h1 className="mx-auto max-w-xl font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          {str(row, 'headline') || <span className="text-muted-foreground">Your headline</span>}
        </h1>
        <p className="mx-auto max-w-lg text-base text-muted-foreground sm:text-lg">
          {str(row, 'subheadline') || 'Add a subheadline that explains the promise in one sentence.'}
        </p>
        <span className="inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground">
          {str(row, 'cta_text') || 'Call to action'}
        </span>
      </section>

      {caseStudies.length > 0 && (
        <section className="space-y-3 border-t bg-muted/30 px-6 py-6 text-center">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Proof on the page</p>
          <div className="flex justify-center">
            <RelationLinks sectionKey="case-studies" ids={caseStudies} />
          </div>
        </section>
      )}
    </div>
  )
}
