// One list page for all 15 sections: header, search/filter toolbar, and table or board view; records open as full pages.
import { Columns3, Plus, Search, TableProperties } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { DataTable } from '@/components/data/DataTable'
import { KanbanBoard } from '@/components/data/KanbanBoard'
import { PageHeader } from '@/components/shared/PageHeader'
import { SectionIcon } from '@/components/shared/SectionIcon'
import { EmptyState, ErrorState, TableSkeleton } from '@/components/shared/States'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePersistentState } from '@/hooks/usePersistentState'
import { useRows, useSaveRow } from '@/hooks/useRecords'
import { getSection, statusFieldOf, type SectionDef } from '@/lib/schema'
import { NotFound } from '@/pages/NotFound'

const ALL = '__all__'
const VIEWS = ['table', 'board'] as const

// Route entry: resolves the registry entry and remounts the page when the section changes.
export function SectionRoute() {
  const { sectionKey = '' } = useParams()
  const section = getSection(sectionKey)
  if (!section) return <NotFound />
  return <SectionPage key={section.key} section={section} />
}

function SectionPage({ section }: { section: SectionDef }) {
  const { data: rows, isPending, error, refetch } = useRows(section.key)
  const save = useSaveRow(section.key)
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [view, setView] = usePersistentState(`botai-console:view:${section.key}`, 'table', VIEWS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL)

  const status = statusFieldOf(section)
  const activeView = section.board && status ? view : 'table'
  // Old drawer links (?record=<id>) redirect to the record page.
  const legacyRecord = params.get('record')

  const query = search.trim().toLowerCase()
  const filtered = (rows ?? []).filter(
    (row) =>
      (!query || row.title.toLowerCase().includes(query)) &&
      (activeView === 'board' || !status || statusFilter === ALL || row[status.name] === statusFilter),
  )
  const filtersActive = Boolean(query) || (activeView === 'table' && statusFilter !== ALL)

  const openRecord = (id: string) => navigate(`/${section.key}/${id}`)

  // Board drop: optimistic status change, toast only if it fails.
  const moveRow = (id: string, next: string | null) => {
    if (!status) return
    save.mutate(
      { id, values: { [status.name]: next } },
      { onError: (e) => toast.error(`Couldn’t move card: ${e.message}`) },
    )
  }

  if (legacyRecord) return <Navigate to={`/${section.key}/${legacyRecord}`} replace />

  const newButton = (
    <Button onClick={() => openRecord('new')}>
      <Plus />
      New {section.singular}
    </Button>
  )

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:py-8">
      <PageHeader
        title={section.plural}
        description={section.description}
        icon={<SectionIcon name={section.icon} />}
        actions={newButton}
      />

      {rows && rows.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${section.plural}…`}
              aria-label={`Search ${section.plural} by ${section.titleLabel}`}
              className="bg-card pl-8"
            />
          </div>
          {status && activeView === 'table' && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-card" aria-label={`Filter by ${status.label.toLowerCase()}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={ALL}>All statuses</SelectItem>
                {status.options.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <span className="text-sm text-muted-foreground tabular-nums">
            {filtered.length} of {rows.length}
          </span>
          {section.board && status && (
            <ToggleGroup
              type="single"
              variant="outline"
              value={activeView}
              onValueChange={(v) => v && setView(v as (typeof VIEWS)[number])}
              className="ml-auto"
              aria-label="View"
            >
              <ToggleGroupItem value="table" aria-label="Table view">
                <TableProperties />
                <span className="hidden sm:inline">Table</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="board" aria-label="Board view">
                <Columns3 />
                <span className="hidden sm:inline">Board</span>
              </ToggleGroupItem>
            </ToggleGroup>
          )}
        </div>
      )}

      {isPending ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<SectionIcon name={section.icon} className="size-5" />}
          title={`No ${section.plural} yet`}
          description={section.description}
          action={
            <Button onClick={() => openRecord('new')}>
              <Plus />
              Create the first one
            </Button>
          }
        />
      ) : filtered.length === 0 && filtersActive ? (
        <EmptyState
          icon={<Search className="size-5" />}
          title="No matches"
          description="Try a different search or status."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch('')
                setStatusFilter(ALL)
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : activeView === 'board' ? (
        <KanbanBoard section={section} rows={filtered} onOpen={openRecord} onMove={moveRow} />
      ) : (
        <DataTable section={section} rows={filtered} onOpen={openRecord} />
      )}

    </div>
  )
}
