// Feed-style preview of a LinkedIn post: author header, "see more" fold, media placeholder and engagement bar.
import { BarChart3, FileText, Image, Images, MessageSquare, Play, Repeat2, Send, ThumbsUp } from 'lucide-react'
import { Fragment, useState } from 'react'
import { initials, list, num, str, type PreviewProps } from '@/components/preview/values'
import { useLookup } from '@/hooks/useRecords'
import { formatDate, formatNumber, isoDay } from '@/lib/format'

const FOLD_CHARS = 210
const FOLD_LINES = 3

const MEDIA = { Image, Carousel: Images, Video: Play, Document: FileText, Poll: BarChart3 } as const

// Splits post text so #hashtags can be emphasised like the real feed.
function PostText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(#[\p{L}\d_]+)/u).map((part, i) =>
        part.startsWith('#') ? (
          <span key={i} className="font-semibold">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

export function LinkedInPreview({ row }: PreviewProps) {
  const [expanded, setExpanded] = useState(false)
  const { data: assets = [] } = useLookup('assets')
  const author = str(row, 'author') || 'Your name'
  const text = [str(row, 'hook_first_lines'), str(row, 'body'), str(row, 'cta')].filter(Boolean).join('\n\n')

  // LinkedIn folds after ~3 lines or ~210 characters, whichever comes first.
  let folded = text.split('\n').slice(0, FOLD_LINES).join('\n')
  if (folded.length > FOLD_CHARS) folded = folded.slice(0, FOLD_CHARS)
  const truncated = folded.length < text.length
  const shown = expanded || !truncated ? text : folded.trimEnd()

  const date = str(row, 'publish_date')
  const when = !date ? 'Draft' : date > isoDay() ? `Scheduled · ${formatDate(date)}` : formatDate(date)
  const format = str(row, 'format')
  const MediaIcon = format in MEDIA ? MEDIA[format as keyof typeof MEDIA] : null
  const firstAsset = assets.find((a) => list(row, 'assets').includes(a.id))?.title
  const reactions = num(row, 'reactions') ?? 0
  const comments = num(row, 'comments') ?? 0
  const reposts = num(row, 'reposts') ?? 0

  return (
    <article className="mx-auto w-full max-w-[555px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-xs">
      <header className="flex items-start gap-3 p-4 pb-2">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {initials(author)}
        </span>
        <div className="min-w-0 text-sm leading-tight">
          <p className="font-semibold">{author}</p>
          <p className="text-xs text-muted-foreground">Botai · Software that ships</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{when}</p>
        </div>
        {str(row, 'variant') && (
          <span className="ml-auto rounded-md border px-1.5 py-0.5 text-xs text-muted-foreground">Variant {str(row, 'variant')}</span>
        )}
      </header>

      <div className="px-4 pb-3 text-sm leading-relaxed whitespace-pre-line">
        {text ? (
          <>
            <PostText text={shown} />
            {truncated && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="ml-1 font-medium text-muted-foreground hover:underline"
              >
                {expanded ? 'show less' : '…see more'}
              </button>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">Start with a hook. The first two lines decide whether anyone clicks “see more”.</span>
        )}
      </div>

      {MediaIcon && (
        <div className="flex aspect-[1.91/1] flex-col items-center justify-center gap-2 border-y bg-muted text-muted-foreground">
          <MediaIcon className="size-8" aria-hidden />
          <span className="px-6 text-center text-xs">{firstAsset ?? `${format} attachment`}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
        <span>{reactions > 0 ? `👍 ${formatNumber(reactions)}` : ''}</span>
        <span>
          {comments > 0 && `${formatNumber(comments)} comments`}
          {comments > 0 && reposts > 0 && ' · '}
          {reposts > 0 && `${formatNumber(reposts)} reposts`}
        </span>
      </div>
      <div className="mx-4 grid grid-cols-4 border-t py-1 text-xs font-medium text-muted-foreground" aria-hidden>
        {[
          [ThumbsUp, 'Like'],
          [MessageSquare, 'Comment'],
          [Repeat2, 'Repost'],
          [Send, 'Send'],
        ].map(([Icon, label]) => {
          const I = Icon as typeof ThumbsUp
          return (
            <span key={label as string} className="flex items-center justify-center gap-1.5 py-2">
              <I className="size-4" />
              <span className="hidden sm:inline">{label as string}</span>
            </span>
          )
        })}
      </div>
    </article>
  )
}
