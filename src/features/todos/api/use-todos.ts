// Loads todos on mount and exposes data, loading and error state.
import { useEffect, useState } from 'react'
import { getTodos } from '@/features/todos/api/get-todos'
import type { Todo } from '@/features/todos/types'

type State = { todos: Todo[]; loading: boolean; error: string | null }

export function useTodos() {
  const [state, setState] = useState<State>({ todos: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    getTodos()
      .then((todos) => !cancelled && setState({ todos, loading: false, error: null }))
      .catch((e: Error) => !cancelled && setState({ todos: [], loading: false, error: e.message }))
    // Ignores a late response if the component unmounted first.
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
