// Related records as chips that link to their record pages.
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { useLookup } from '@/hooks/useRecords'

export function RelationLinks({ sectionKey, ids }: { sectionKey: string; ids: string[] }) {
  const { data: lookup = [], isPending } = useLookup(sectionKey)
  if (isPending) return <span className="inline-block h-5 w-24 animate-pulse rounded-md bg-muted" aria-label="Loading" />
  const items = ids.map((id) => ({ id, title: lookup.find((l) => l.id === id)?.title })).filter((i) => i.title)
  if (items.length === 0) return <span className="text-muted-foreground">—</span>
  return (
    <span className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item.id} variant="secondary" asChild className="h-auto max-w-full justify-start py-0.5 font-normal">
          <Link to={`/${sectionKey}/${item.id}`} title={item.title}>
            <span className="truncate">{item.title}</span>
          </Link>
        </Badge>
      ))}
    </span>
  )
}
