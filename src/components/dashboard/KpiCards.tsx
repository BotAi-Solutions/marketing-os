// Headline counts (active campaigns, running experiments, pipeline, proven hooks, inbox ideas) with their section icon.
import { Link } from 'react-router'
import { SectionIcon } from '@/components/shared/SectionIcon'
import { KPIS } from '@/config/dashboard'
import { requireSection, type Row } from '@/lib/schema'

export function KpiCards({ rows }: { rows: Record<string, Row[]> }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {KPIS.map((kpi) => {
        const value = kpi.sections.reduce((sum, key) => {
          const field = requireSection(key).statusField
          return sum + (rows[key] ?? []).filter((r) => kpi.matches(field ? ((r[field] as string | null) ?? null) : null)).length
        }, 0)
        return (
          <li key={kpi.label}>
            <Link
              to={`/${kpi.sections[0]}`}
              title={kpi.hint}
              className="group flex h-full flex-col rounded-xl border bg-card p-4 text-card-foreground shadow-xs transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <SectionIcon name={requireSection(kpi.sections[0]).icon} className="size-4" />
                </span>
              </div>
              <p className="mt-2 font-heading text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{kpi.hint}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
