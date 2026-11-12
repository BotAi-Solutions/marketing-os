// Auto-ticking setup checklist: unfinished sections first, each showing count/target and linking to the section.
import { CircleCheck, CircleDashed } from 'lucide-react'
import { Link } from 'react-router'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CHECKLIST } from '@/config/dashboard'
import { requireSection, type Row } from '@/lib/schema'
import { cn } from '@/lib/utils'

export function FillChecklist({ rows }: { rows: Record<string, Row[]> }) {
  const items = CHECKLIST.map(({ section, target }) => {
    const count = rows[section]?.length ?? 0
    return { section: requireSection(section), target, count, done: count >= target }
  }).sort((a, b) => Number(a.done) - Number(b.done))
  const completed = items.filter((i) => i.done).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fill-in checklist</CardTitle>
        <CardDescription>
          <span className="font-semibold text-foreground tabular-nums">{completed}</span> of {items.length} sections
          ready
        </CardDescription>
        <Progress value={(completed / items.length) * 100} aria-label="Checklist progress" className="mt-2" />
      </CardHeader>
      <CardContent>
        <ul className="grid gap-x-4 gap-y-0.5 sm:grid-cols-2">
          {items.map(({ section, target, count, done }) => (
            <li key={section.key}>
              <Link
                to={`/${section.key}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-2 py-2 text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none',
                  !done && 'bg-warning/10',
                )}
              >
                {done ? (
                  <CircleCheck className="size-4 shrink-0 text-success" aria-label="Done" />
                ) : (
                  <CircleDashed className="size-4 shrink-0 text-warning" aria-label="Not done" />
                )}
                <span className={cn('flex-1 truncate', !done && 'font-medium')}>{section.plural}</span>
                {!done && <span className="text-xs text-muted-foreground">{target - count} to go</span>}
                <span className="text-sm text-muted-foreground tabular-nums">
                  <span className={cn(done ? 'text-foreground' : 'font-semibold text-foreground')}>
                    {Math.min(count, target)}
                  </span>
                  /{target}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
