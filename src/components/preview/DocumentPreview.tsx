// Generic, registry-driven document view for sections without a bespoke preview (campaigns, hooks, ideas, experiments…).
import { FieldDisplay } from '@/components/data/FieldDisplay'
import { RelationLinks } from '@/components/data/RelationLinks'
import { StatusBadge } from '@/components/data/StatusBadge'
import { Markdown } from '@/components/preview/Markdown'
import { SectionIcon } from '@/components/shared/SectionIcon'
import { fieldGroup, statusFieldOf, type FieldDef, type Row, type SectionDef } from '@/lib/schema'

const hasValue = (field: FieldDef, row: Row) => {
  const v = row[field.name]
  if (field.type === 'checkbox') return v === true
  return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
}

export function DocumentPreview({ section, row }: { section: SectionDef; row: Row }) {
  const status = statusFieldOf(section)
  const visible = section.fields.filter((f) => f.name !== section.statusField && hasValue(f, row))
  const facts = visible.filter((f) => f.type !== 'longtext' && f.type !== 'relation' && fieldGroup(f) !== 'Performance')
  const metrics = visible.filter((f) => fieldGroup(f) === 'Performance' && f.type !== 'longtext' && f.type !== 'text')
  const texts = visible.filter((f) => f.type === 'longtext' || (f.type === 'text' && fieldGroup(f) === 'Content'))
  const links = visible.filter((f) => f.type === 'relation')
  const factsOnly = facts.filter((f) => !texts.includes(f))

  return (
    <article className="mx-auto w-full max-w-3xl space-y-8 rounded-xl border bg-card px-6 py-8 text-card-foreground sm:px-10 sm:py-10">
      <header className="space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          <SectionIcon name={section.icon} className="size-3.5" />
          {section.singular}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance">{row.title || 'Untitled'}</h1>
        {status && <StatusBadge status={(row[status.name] as string | null) ?? null} />}
      </header>

      {factsOnly.length > 0 && (
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          {factsOnly.map((f) => (
            <div key={f.name} className="min-w-0 space-y-0.5">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="text-sm">
                <FieldDisplay field={f} value={row[f.name]} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {metrics.length > 0 && (
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map((f) => (
            <div key={f.name} className="rounded-lg bg-muted px-3 py-2">
              <dt className="text-xs text-muted-foreground">{f.label}</dt>
              <dd className="font-heading text-lg font-semibold">
                <FieldDisplay field={f} value={row[f.name]} />
              </dd>
            </div>
          ))}
        </dl>
      )}

      {texts.map((f) => (
        <section key={f.name} className="space-y-2">
          <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{f.label}</h2>
          {f.type === 'longtext' && f.monospace ? (
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs whitespace-pre-wrap">{String(row[f.name])}</pre>
          ) : (
            <Markdown source={String(row[f.name])} />
          )}
        </section>
      ))}

      {links.length > 0 && (
        <dl className="space-y-3 border-t pt-6">
          {links.map((f) =>
            f.type === 'relation' ? (
              <div key={f.name} className="grid gap-1 sm:grid-cols-[140px_1fr]">
                <dt className="text-xs text-muted-foreground sm:pt-1">{f.label}</dt>
                <dd>
                  <RelationLinks sectionKey={f.section} ids={Array.isArray(row[f.name]) ? (row[f.name] as string[]) : [String(row[f.name])]} />
                </dd>
              </div>
            ) : null,
          )}
        </dl>
      )}

      {visible.length === 0 && <p className="text-muted-foreground">Nothing here yet. Fill in the fields and this page builds itself.</p>}
    </article>
  )
}
