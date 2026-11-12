// "Live status": per-section stacked bars of status distribution, grouped by workflow stage, using the shared status colors.
import { Link } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SECTION_GROUPS, sectionsInGroup, statusFieldOf, type Row, type SectionDef, type SelectField } from '@/lib/schema'
import { statusLabel, statusTone } from '@/lib/status'
import { cn } from '@/lib/utils'

export function StatusBars({ rows }: { rows: Record<string, Row[]> }) {
  const groups = SECTION_GROUPS.map((group) => ({
    group,
    items: sectionsInGroup(group).flatMap((section) => {
      const field = statusFieldOf(section)
      return field ? [{ section, field }] : []
    }),
  })).filter((g) => g.items.length > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live status</CardTitle>
        <CardDescription>Where every section stands right now. Click a section to open it.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {groups.map(({ group, items }) => (
          <section key={group} aria-labelledby={`status-${group}`} className="space-y-3">
            <h3
              id={`status-${group}`}
              className="border-b pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase"
            >
              {group}
            </h3>
            <ul className="grid gap-3 lg:grid-cols-2">
              {items.map(({ section, field }) => (
                <StatusRow key={section.key} section={section} field={field} list={rows[section.key] ?? []} />
              ))}
            </ul>
          </section>
        ))}
      </CardContent>
    </Card>
  )
}

function StatusRow({ section, field, list }: { section: SectionDef; field: SelectField; list: Row[] }) {
  const counts = field.options
    .map((option) => ({ option, label: statusLabel(option), count: list.filter((r) => r[field.name] === option).length }))
    .filter((c) => c.count > 0)
  const summary = counts.map((c) => `${c.count} ${c.label}`).join(', ') || 'empty'

  return (
    <li>
      <Link
        to={`/${section.key}`}
        aria-label={`${section.plural}: ${summary}`}
        className="block h-full space-y-3 rounded-lg border p-4 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium">{section.plural}</span>
          <span className="text-sm text-muted-foreground tabular-nums">
            <span className="font-semibold text-foreground">{list.length}</span> total
          </span>
        </div>
        <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-muted" aria-hidden>
          {counts.map((c) => (
            <div
              key={c.option}
              className={cn('h-full first:rounded-l-full last:rounded-r-full', statusTone(c.option).bar)}
              style={{ width: `${(c.count / list.length) * 100}%` }}
              title={`${c.label}: ${c.count}`}
            />
          ))}
        </div>
        {counts.length > 0 ? (
          <ul className="flex flex-wrap gap-1.5" aria-hidden>
            {counts.map((c) => (
              <li
                key={c.option}
                className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-0.5 text-xs text-foreground/80"
              >
                <span className={cn('size-2 shrink-0 rounded-full', statusTone(c.option).dot)} />
                {c.label}
                <span className="font-semibold text-foreground tabular-nums">{c.count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-muted-foreground">No records yet</p>
        )}
      </Link>
    </li>
  )
}
