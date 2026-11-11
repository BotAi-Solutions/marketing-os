// Centered spinner for whole-page loading (session check, lazy routes).
import { LoaderCircle } from 'lucide-react'

export function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center" role="status" aria-label="Loading">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
