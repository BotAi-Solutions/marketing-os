// Read-mode sidebar: every filled-in non-content field, related records as links, and timestamps.
import { FieldDisplay } from '@/components/data/FieldDisplay'
import { RelationLinks } from '@/components/data/RelationLinks'
import { StatusBadge } from '@/components/data/StatusBadge'
import { formatDate } from '@/lib/format'
import { statusFieldOf, type Row, type SectionDef } from '@/lib/schema'

export function DetailsPanel({ section, row }: { section: SectionDef; row: Row }) {
  const status = statusFieldOf(section)
  const fields = section.fields.filter((f) => {
    if (f.name === section.statusField || f.type === 'longtext') return false
    const v = row[f.name]
    if (f.type === 'checkbox') return v === true
    return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
  })

  return (
    <aside aria-label="Details" className="space-y-4 rounded-xl border bg-card p-4 text-sm text-card-foreground">
      <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Details</h2>
      <dl className="space-y-3">
        {status && (
          <div className="space-y-1">
            <dt className="text-xs text-muted-foreground">{status.label}</dt>
            <dd>
              <StatusBadge status={(row[status.name] as string | null) ?? null} />
            </dd>
          </div>
        )}
        {fields.map((f) => (
          <div key={f.name} className="min-w-0 space-y-1">
            <dt className="text-xs text-muted-foreground">{f.label}</dt>
            <dd className="min-w-0">
              {f.type === 'relation' ? (
                <RelationLinks sectionKey={f.section} ids={Array.isArray(row[f.name]) ? (row[f.name] as string[]) : [String(row[f.name])]} />
              ) : (
                <FieldDisplay field={f} value={row[f.name]} />
              )}
            </dd>
          </div>
        ))}
      </dl>
      {row.created_at && (
        <p className="border-t pt-3 text-xs text-muted-foreground">
          Created {formatDate(row.created_at)} · Updated {formatDate(row.updated_at)}
        </p>
      )}
    </aside>
  )
}
