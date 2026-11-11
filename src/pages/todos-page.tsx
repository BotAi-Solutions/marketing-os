// Todos route: thin page that composes the todos feature.
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/shared/page-header'
import { TodoList } from '@/features/todos'

export function TodosPage() {
  return (
    <Container className="space-y-8 py-16">
      <PageHeader title="Todos" description="Live data from Supabase." />
      <TodoList />
    </Container>
  )
}
