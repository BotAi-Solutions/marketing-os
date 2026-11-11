// "Live status": one stacked bar per section showing its status distribution, using the shared status colors.
import { Link } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { sections, statusFieldOf, type Row } from '@/lib/schema'
import { statusTone } from '@/lib/status'
import { cn } from '@/lib/utils'

export function StatusBars({ rows }: { rows: Record<string, Row[]> }) {
  const withStatus = sections.flatMap((section) => {
    const field = statusFieldOf(section)
    return field ? [{ section, field }] : []
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live status</CardTitle>
        <CardDescription>Where every section stands right now. Click a row to open it.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {withStatus.map(({ section, field }) => {
            const list = rows[section.key] ?? []
            const counts = field.options
              .map((option) => ({ option, count: list.filter((r) => r[field.name] === option).length }))
              .filter((c) => c.count > 0)
            const summary = counts.map((c) => `${c.count} ${c.option}`).join(', ') || 'empty'
            return (
              <li key={section.key}>
                <Link
                  to={`/${section.key}`}
                  aria-label={`${section.plural}: ${summary}`}
                  className="-mx-2 block space-y-2 rounded-md px-2 py-3 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                >
                  <div className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="font-medium">{section.plural}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{list.length}</span>
                  </div>
                  <div className="flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-muted" aria-hidden>
                    {counts.map((c) => (
                      <div
                        key={c.option}
                        className={cn('h-full', statusTone(c.option).bar)}
                        style={{ width: `${(c.count / list.length) * 100}%` }}
                        title={`${c.option}: ${c.count}`}
                      />
                    ))}
                  </div>
                  {counts.length > 0 && (
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground" aria-hidden>
                      {counts.map((c) => (
                        <span key={c.option} className="inline-flex items-center gap-1">
                          <span className={cn('size-2 rounded-full', statusTone(c.option).dot)} />
                          {c.option} <span className="tabular-nums">{c.count}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
