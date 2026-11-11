// Dashboard: KPIs, last-30-day metrics, fill-in checklist and live status across every section.
import { FillChecklist } from '@/components/dashboard/FillChecklist'
import { KpiCards } from '@/components/dashboard/KpiCards'
import { MetricsSummary } from '@/components/dashboard/MetricsSummary'
import { StatusBars } from '@/components/dashboard/StatusBars'
import { PageHeader } from '@/components/shared/PageHeader'
import { ErrorState } from '@/components/shared/States'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useManyRows } from '@/hooks/useRecords'
import { sections } from '@/lib/schema'

const ALL_KEYS = sections.map((s) => s.key)

export function Dashboard() {
  const { session } = useAuth()
  const { data, isPending, error, refetch } = useManyRows(ALL_KEYS)
  const firstName = session?.user.name.split(' ')[0]

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : 'Dashboard'}
        description="Plan → Create → Test → Publish → Measure → Learn. Here’s where everything stands."
      />

      {error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : isPending ? (
        <div className="space-y-6" role="status" aria-label="Loading dashboard">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      ) : (
        <>
          <KpiCards rows={data} />
          <div className="grid gap-6 lg:grid-cols-2">
            <MetricsSummary rows={data.metrics} />
            <FillChecklist rows={data} />
          </div>
          <StatusBars rows={data} />
        </>
      )}
    </div>
  )
}
