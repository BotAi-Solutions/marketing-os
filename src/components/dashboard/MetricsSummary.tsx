// Last-30-days totals from the Metrics Log with derived CTR and cost per lead.
import { Link } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { METRICS_WINDOW_DAYS } from '@/config/dashboard'
import { formatCompact, formatCurrency, formatDate, formatNumber, formatPercent, isoDay } from '@/lib/format'
import type { Row } from '@/lib/schema'

const sum = (rows: Row[], key: string) => rows.reduce((total, r) => total + (typeof r[key] === 'number' ? (r[key] as number) : 0), 0)

export function MetricsSummary({ rows }: { rows: Row[] }) {
  const since = isoDay(-METRICS_WINDOW_DAYS)
  const recent = rows.filter((r) => typeof r.period_start === 'string' && r.period_start >= since)
  const impressions = sum(recent, 'impressions')
  const clicks = sum(recent, 'clicks')
  const leads = sum(recent, 'leads')
  const spend = sum(recent, 'spend')

  const stats = [
    { label: 'Impressions', value: formatCompact(impressions) },
    { label: 'Clicks', value: formatNumber(clicks) },
    { label: 'Leads', value: formatNumber(leads) },
    { label: 'Spend', value: formatCurrency(spend) },
    { label: 'CTR', value: impressions ? formatPercent(clicks / impressions) : '—' },
    { label: 'Cost per lead', value: leads ? formatCurrency(spend / leads) : '—' },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div className="space-y-1.5">
          <CardTitle>Last {METRICS_WINDOW_DAYS} days</CardTitle>
          <CardDescription>
            {recent.length} Metrics Log {recent.length === 1 ? 'entry' : 'entries'} since {formatDate(since)}
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link to="/metrics">View log</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="font-heading text-xl font-semibold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
