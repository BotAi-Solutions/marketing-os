// Read-only list of records in other sections that point at this record (e.g. an experiment's variants).
import { Link } from 'react-router'
import { StatusBadge } from '@/components/data/StatusBadge'
import { Skeleton } from '@/components/ui/skeleton'
import { useManyRows } from '@/hooks/useRecords'
import { requireSection, type Backlink } from '@/lib/schema'

export function Backlinks({ backlink, recordId }: { backlink: Backlink; recordId: string }) {
  const { data, isPending, error } = useManyRows(backlink.sections)

  const items = backlink.sections.flatMap((key) => {
    const section = requireSection(key)
    return data[key].filter((row) => row[backlink.field] === recordId).map((row) => ({ section, row }))
  })

  return (
    <section aria-labelledby="backlinks-heading" className="space-y-3">
      <h3 id="backlinks-heading" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {backlink.label} {!isPending && `(${items.length})`}
      </h3>
      {isPending ? (
        <Skeleton className="h-16 w-full" />
      ) : error ? (
        <p className="text-sm text-destructive">Couldn’t load {backlink.label.toLowerCase()}.</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nothing points here yet. Set this {backlink.field.replace(/_id$/, '')} on a post, blog, page or landing page.
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {items.map(({ section, row }) => (
            <li key={row.id}>
              <Link
                to={`/${section.key}/${row.id}`}
                className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
              >
                {typeof row.variant === 'string' && (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md border text-xs font-medium">
                    {row.variant === 'Control' ? 'C' : row.variant}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{row.title}</span>
                  <span className="text-xs text-muted-foreground">{section.singular}</span>
                </span>
                {section.statusField && <StatusBadge status={row[section.statusField] as string | null} />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
