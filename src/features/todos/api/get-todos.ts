// Fetches all todos from Supabase, throwing on query errors.
import { supabase } from '@/lib/supabase'
import type { Todo } from '@/features/todos/types'

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase.from('todos').select('id, name').order('id')
  if (error) throw new Error(error.message)
  return data
}
