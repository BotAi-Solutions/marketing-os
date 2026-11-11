// Headline counts (active campaigns, running experiments, pipeline, proven hooks, inbox ideas).
import { Link } from 'react-router'
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
              className="block h-full rounded-xl border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <p className="mt-1 font-heading text-3xl font-semibold tabular-nums">{value}</p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
