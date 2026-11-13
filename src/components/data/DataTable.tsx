// Registry-driven table: title, status and up to five flagged fields, with sortable headers.
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FieldDisplay } from '@/components/data/FieldDisplay'
import { StatusBadge } from '@/components/data/StatusBadge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { statusFieldOf, tableFields, type FieldDef, type Row, type SectionDef } from '@/lib/schema'
import { cn } from '@/lib/utils'

type Sort = { key: string; dir: 'asc' | 'desc' }
type SortValue = string | number | null

// Comparable value for a cell; select/status sort by option order, relations aren't sortable.
function sortValue(row: Row, key: string, field: FieldDef | undefined): SortValue {
  const v = key === 'title' ? row.title : row[key]
  if (v === null || v === undefined || v === '') return null
  if (field?.type === 'select') return field.options.indexOf(String(v))
  if (field?.type === 'formula') return field.compute(row)
  if (typeof v === 'number') return v
  if (typeof v === 'boolean') return v ? 1 : 0
  if (Array.isArray(v)) return v.length ? v.join(', ').toLowerCase() : null
  return String(v).toLowerCase()
}

// Blanks always sort last regardless of direction.
function compare(a: SortValue, b: SortValue, dir: Sort['dir']) {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  const result = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
  return dir === 'asc' ? result : -result
}

type Props = { section: SectionDef; rows: Row[]; onOpen: (id: string) => void }

export function DataTable({ section, rows, onOpen }: Props) {
  const [sort, setSort] = useState<Sort>({ key: 'updated_at', dir: 'desc' })
  const status = statusFieldOf(section)
  const fields = tableFields(section)
  const fieldByName = useMemo(() => new Map(section.fields.map((f) => [f.name, f])), [section])

  const sorted = useMemo(
    () =>
      [...rows].sort((a, b) => {
        const field = fieldByName.get(sort.key)
        return compare(sortValue(a, sort.key, field), sortValue(b, sort.key, field), sort.dir)
      }),
    [rows, sort, fieldByName],
  )

  // Click cycles asc → desc → back to default (recently updated first).
  const toggleSort = (key: string) =>
    setSort((s) =>
      s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : { key: 'updated_at', dir: 'desc' },
    )

  const header = (key: string, label: string, sortable: boolean, className?: string) => {
    const active = sort.key === key
    const Icon = !active ? ArrowUpDown : sort.dir === 'asc' ? ArrowUp : ArrowDown
    return (
      <TableHead
        key={key}
        className={className}
        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}
      >
        {sortable ? (
          <button
            type="button"
            onClick={() => toggleSort(key)}
            className="-mx-1 inline-flex items-center gap-1 rounded px-1 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            {label}
            <Icon className={cn('size-3.5', !active && 'opacity-40')} aria-hidden />
          </button>
        ) : (
          label
        )}
      </TableHead>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            {header('title', section.titleLabel, true, 'min-w-56')}
            {status && header(status.name, status.label, true)}
            {fields.map((f) => header(f.name, f.label, f.type !== 'relation'))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row) => (
            <TableRow key={row.id} className="cursor-pointer" onClick={() => onOpen(row.id)}>
              <TableCell className="max-w-80 font-medium whitespace-normal">
                <button
                  type="button"
                  className="block max-w-full text-left wrap-break-word hover:underline focus-visible:underline focus-visible:outline-none"
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpen(row.id)
                  }}
                >
                  {row.title}
                </button>
              </TableCell>
              {status && (
                <TableCell>
                  <StatusBadge status={row[status.name] as string | null} />
                </TableCell>
              )}
              {fields.map((f) => (
                <TableCell key={f.name} className="max-w-64">
                  <FieldDisplay field={f} value={row[f.name]} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
