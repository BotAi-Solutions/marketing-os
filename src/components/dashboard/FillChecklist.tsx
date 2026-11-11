// Auto-ticking setup checklist: each section shows count/target and links to the section.
import { CircleCheck, Circle } from 'lucide-react'
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
  })
  const completed = items.filter((i) => i.done).length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fill-in checklist</CardTitle>
        <CardDescription>
          {completed} of {items.length} sections ready
        </CardDescription>
        <Progress value={(completed / items.length) * 100} aria-label="Checklist progress" className="mt-2" />
      </CardHeader>
      <CardContent>
        <ul className="grid gap-1 sm:grid-cols-2">
          {items.map(({ section, target, count, done }) => (
            <li key={section.key}>
              <Link
                to={`/${section.key}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              >
                {done ? (
                  <CircleCheck className="size-4 text-success" aria-label="Done" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" aria-label="Not done" />
                )}
                <span className={cn('flex-1 truncate', done && 'text-muted-foreground')}>
                  {section.plural} ≥ {target}
                </span>
                <span className={cn('text-xs tabular-nums', done ? 'text-muted-foreground' : 'font-medium')}>
                  {Math.min(count, target)}/{target}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
