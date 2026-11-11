// Empty, error and loading placeholders shared by section pages and the dashboard.
import { CircleX, RotateCcw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
      {icon && <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">{icon}</div>}
      <div className="space-y-1">
        <h2 className="font-medium">{title}</h2>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 px-6 py-16 text-center">
      <CircleX className="size-6 text-destructive" aria-hidden />
      <div className="space-y-1">
        <h2 className="font-medium">Something went wrong</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      <Button variant="outline" onClick={onRetry}>
        <RotateCcw />
        Try again
      </Button>
    </div>
  )
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-lg border p-3" role="status" aria-label="Loading">
      <Skeleton className="h-6 w-full" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </div>
  )
}
