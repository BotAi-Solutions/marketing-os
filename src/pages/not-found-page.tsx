// Fallback page for unknown routes.
import { Link } from 'react-router'
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <Container className="space-y-6 py-24">
      <PageHeader title="Page not found" description="The page you're looking for doesn't exist." />
      <Button asChild variant="outline">
        <Link to="/">Back home</Link>
      </Button>
    </Container>
  )
}
