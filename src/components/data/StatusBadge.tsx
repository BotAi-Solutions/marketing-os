// Colored status pill driven by the shared statusTone() mapping.
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { statusTone } from '@/lib/status'

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  if (!status) return <span className="text-muted-foreground">—</span>
  const tone = statusTone(status)
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-normal', tone.badge, className)}>
      <span className={cn('size-1.5 rounded-full', tone.dot)} aria-hidden />
      {status}
    </Badge>
  )
}
