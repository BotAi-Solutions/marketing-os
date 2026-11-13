// Status board: one column per status option, native HTML5 drag and drop, plus a keyboard "Move to" menu.
import { EllipsisVertical } from 'lucide-react'
import { useState, type DragEvent } from 'react'
import { FieldDisplay } from '@/components/data/FieldDisplay'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { statusFieldOf, tableFields, type Row, type SectionDef } from '@/lib/schema'
import { statusTone } from '@/lib/status'
import { cn } from '@/lib/utils'

const NO_STATUS = '__none__'
const DRAG_TYPE = 'application/x-botai-record'

type Props = {
  section: SectionDef
  rows: Row[]
  onOpen: (id: string) => void
  onMove: (id: string, status: string | null) => void
}

export function KanbanBoard({ section, rows, onOpen, onMove }: Props) {
  const [overColumn, setOverColumn] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const status = statusFieldOf(section)
  if (!status) return null

  const statusOf = (row: Row) => {
    const v = row[status.name]
    return typeof v === 'string' && status.options.includes(v) ? v : NO_STATUS
  }
  const hasUnsorted = rows.some((r) => statusOf(r) === NO_STATUS)
  const columns = [...(hasUnsorted ? [NO_STATUS] : []), ...status.options]
  const metaFields = tableFields(section)
  // Up to two table fields that actually have a value, so cards don't fill with dashes.
  const metaFor = (row: Row) =>
    metaFields
      .filter((f) => {
        const v = f.type === 'formula' ? f.compute(row) : row[f.name]
        return v !== null && v !== undefined && v !== '' && v !== false && !(Array.isArray(v) && v.length === 0)
      })
      .slice(0, 2)

  // Moves the dragged card into the column if its status actually changes.
  const drop = (event: DragEvent, column: string) => {
    event.preventDefault()
    setOverColumn(null)
    const id = event.dataTransfer.getData(DRAG_TYPE)
    const row = rows.find((r) => r.id === id)
    if (row && statusOf(row) !== column) onMove(id, column === NO_STATUS ? null : column)
  }

  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
      {columns.map((column) => {
        const cards = rows.filter((r) => statusOf(r) === column)
        const tone = statusTone(column === NO_STATUS ? null : column)
        return (
          <section
            key={column}
            aria-label={`${column === NO_STATUS ? 'No status' : column}, ${cards.length} items`}
            onDragOver={(e) => {
              if (!e.dataTransfer.types.includes(DRAG_TYPE)) return
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
              setOverColumn(column)
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOverColumn(null)
            }}
            onDrop={(e) => drop(e, column)}
            className={cn(
              'flex w-72 shrink-0 snap-start flex-col rounded-xl border bg-muted/40 transition-colors',
              overColumn === column && 'border-ring bg-accent/60',
            )}
          >
            <header className="flex items-center gap-2 px-3 pt-3 pb-2">
              <span className={cn('rounded-md border px-1.5 py-0.5 text-xs font-medium', tone.badge)}>
                {column === NO_STATUS ? 'No status' : column}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums">{cards.length}</span>
            </header>
            <ul className="flex min-h-24 flex-1 flex-col gap-2 p-2 pt-0">
              {cards.map((row) => (
                <li
                  key={row.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData(DRAG_TYPE, row.id)
                    e.dataTransfer.effectAllowed = 'move'
                    setDraggingId(row.id)
                  }}
                  onDragEnd={() => setDraggingId(null)}
                  className={cn(
                    'group relative cursor-grab rounded-lg border bg-card p-3 text-card-foreground shadow-xs transition-[opacity,border-color,box-shadow] hover:border-primary/30 hover:shadow-sm active:cursor-grabbing',
                    draggingId === row.id && 'opacity-50',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onOpen(row.id)}
                    className="block w-full pr-6 text-left text-sm font-medium after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring/50"
                  >
                    {row.title}
                  </button>
                  {metaFor(row).length > 0 && (
                    <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {metaFor(row).map((f) => (
                        <div key={f.name} className="flex items-center gap-2">
                          <dt className="sr-only">{f.label}</dt>
                          <dd className="min-w-0">
                            <FieldDisplay field={f} value={row[f.name]} />
                          </dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                        aria-label={`Move “${row.title}”`}
                      >
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Move to</DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={statusOf(row)}
                        onValueChange={(v) => v !== statusOf(row) && onMove(row.id, v)}
                      >
                        {status.options.map((option) => (
                          <DropdownMenuRadioItem key={option} value={option}>
                            {option}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
              {cards.length === 0 && (
                <li className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
                  Drop here
                </li>
              )}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
