// Renders todos from Supabase with loading, error and empty states.
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTodos } from '@/features/todos/api/use-todos'

export function TodoList() {
  const { todos, loading, error } = useTodos()

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Todos</CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {error && <p className="text-destructive">Couldn't load todos: {error}</p>}
        {!loading && !error && todos.length === 0 && <p className="text-muted-foreground">No todos yet.</p>}
        {todos.length > 0 && (
          <ul className="divide-y">
            {todos.map((todo) => (
              <li key={todo.id} className="py-2">
                {todo.name}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
