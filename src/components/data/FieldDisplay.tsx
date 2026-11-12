// Read-only rendering of any field value for table cells, board cards and formula outputs.
import { Check, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useLookup } from '@/hooks/useRecords'
import { formatCurrency, formatDate, formatFormula, formatNumber, shortUrl } from '@/lib/format'
import type { FieldDef, FieldValue, RelationField } from '@/lib/schema'
import { cn } from '@/lib/utils'

const Empty = () => <span className="text-muted-foreground">—</span>

const isBlank = (v: FieldValue | undefined) =>
  v === null || v === undefined || v === '' || (Array.isArray(v) && v.length === 0)

function Chips({ items, max = 2 }: { items: string[]; max?: number }) {
  const shown = items.slice(0, max)
  const extra = items.length - shown.length
  return (
    <span className="flex min-w-0 flex-wrap items-center gap-1">
      {shown.map((item) => (
        <Badge key={item} variant="secondary" className="h-auto max-w-40 justify-start font-normal whitespace-normal">
          <span className="min-w-0 wrap-break-word">{item}</span>
        </Badge>
      ))}
      {extra > 0 && <span className="text-xs text-muted-foreground">+{extra}</span>}
    </span>
  )
}

// Resolves relation ids to titles via the target section's lookup.
function RelationChips({ field, value }: { field: RelationField; value: FieldValue | undefined }) {
  const { data: lookup = [] } = useLookup(field.section)
  const ids = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []
  const titles = ids.map((id) => lookup.find((item) => item.id === id)?.title).filter((t): t is string => !!t)
  if (titles.length === 0) return <Empty />
  return <Chips items={titles} />
}

export function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of ${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star key={i} className={cn('size-3.5', i < value ? 'fill-current text-foreground' : 'text-muted-foreground/40')} />
      ))}
    </span>
  )
}

export function FieldDisplay({ field, value }: { field: FieldDef; value: FieldValue | undefined }) {
  if (field.type === 'formula') return formatFormula(field.format, value) ?? <Empty />
  if (field.type === 'checkbox') return value ? <Check className="size-4" aria-label="Yes" /> : <Empty />
  if (isBlank(value)) return <Empty />

  switch (field.type) {
    case 'relation':
      return <RelationChips field={field} value={value} />
    case 'multiselect':
      return <Chips items={Array.isArray(value) ? value : []} />
    case 'number':
      return <span className="tabular-nums">{field.format === 'currency' ? formatCurrency(Number(value)) : formatNumber(Number(value))}</span>
    case 'date':
      return <span className="whitespace-nowrap">{formatDate(String(value))}</span>
    case 'rating':
      return <Stars value={Number(value)} max={field.max} />
    case 'url':
      return (
        <a
          href={String(value)}
          target="_blank"
          rel="noreferrer"
          className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {shortUrl(String(value))}
        </a>
      )
    default:
      return <span className="block max-w-64 whitespace-normal wrap-break-word">{String(value)}</span>
  }
}
