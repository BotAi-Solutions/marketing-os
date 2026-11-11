// Fallback for unknown routes and unknown section keys.
import { Link } from 'react-router'
import { EmptyState } from '@/components/shared/States'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="px-4 py-16 sm:px-6">
      <EmptyState
        title="Page not found"
        description="That page doesn’t exist. It may have moved, or the link has a typo."
        action={
          <Button asChild variant="outline">
            <Link to="/">Back to dashboard</Link>
          </Button>
        }
      />
    </div>
  )
}
