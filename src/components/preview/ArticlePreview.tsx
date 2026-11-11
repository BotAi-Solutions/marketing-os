// Blog / website page preview: search-result snippet with length checks, then the article as readers see it.
import { Markdown } from '@/components/preview/Markdown'
import { readingMinutes, str, type PreviewProps } from '@/components/preview/values'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'

const TITLE_LIMIT = 60
const DESCRIPTION_LIMIT = 160

// "https://botai.example/blog/x" → "botai.example › blog › x"
function breadcrumbUrl(value: string) {
  try {
    const u = new URL(value)
    return [u.hostname.replace(/^www\./, ''), ...u.pathname.split('/').filter(Boolean)].join(' › ')
  } catch {
    return ['botai.example', ...value.split('/').filter(Boolean)].join(' › ')
  }
}

function LengthHint({ length, limit }: { length: number; limit: number }) {
  return (
    <span className={cn('tabular-nums', length > limit ? 'font-medium text-destructive' : 'text-muted-foreground')}>
      {length}/{limit}
    </span>
  )
}

export function ArticlePreview({ row }: PreviewProps) {
  const body = str(row, 'body')
  const seoTitle = str(row, 'meta_title') || row.title
  const description = str(row, 'meta_description')
  const url = str(row, 'live_url') || str(row, 'blog_url') || str(row, 'url_slug') || '/blog/untitled'
  const kicker = str(row, 'blog_type') || str(row, 'content_type')
  const author = str(row, 'author') || str(row, 'owner')
  const date = str(row, 'publish_date')

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section aria-label="Search result preview" className="space-y-1 rounded-xl border bg-card p-4 text-card-foreground">
        <p className="flex items-center justify-between gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Search result
          <span className="flex gap-3 font-normal tracking-normal normal-case">
            <span>
              Title <LengthHint length={seoTitle.length} limit={TITLE_LIMIT} />
            </span>
            <span>
              Description <LengthHint length={description.length} limit={DESCRIPTION_LIMIT} />
            </span>
          </span>
        </p>
        <p className="truncate pt-1 text-xs text-muted-foreground">{breadcrumbUrl(url)}</p>
        <p className="line-clamp-1 text-lg font-medium text-foreground underline-offset-4 hover:underline">
          {seoTitle.length > TITLE_LIMIT ? `${seoTitle.slice(0, TITLE_LIMIT - 1)}…` : seoTitle || 'Untitled'}
        </p>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {description || <span className="italic">No meta description. Search engines will pick text from the page.</span>}
        </p>
      </section>

      <article className="rounded-xl border bg-card px-6 py-8 text-card-foreground sm:px-10 sm:py-12">
        <header className="mb-8 space-y-3">
          {kicker && <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{kicker}</p>}
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{row.title || 'Untitled'}</h1>
          <p className="text-sm text-muted-foreground">
            {[author, date && formatDate(date), body && `${readingMinutes(body)} min read`].filter(Boolean).join(' · ') || 'Draft'}
          </p>
        </header>
        {body ? (
          <Markdown source={body} />
        ) : (
          <p className="text-muted-foreground">No body yet. Write it in Markdown in the editor and it renders here.</p>
        )}
      </article>
    </div>
  )
}
