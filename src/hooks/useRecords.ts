// React Query hooks: the only way UI code reads or writes records.
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { repository, type Row } from '@/lib/data'

const keys = {
  rows: (sectionKey: string) => ['rows', sectionKey] as const,
  lookup: (sectionKey: string) => ['lookup', sectionKey] as const,
}

export type SaveInput = { id: string | null; values: Partial<Row> }

export function useRows(sectionKey: string) {
  return useQuery({ queryKey: keys.rows(sectionKey), queryFn: () => repository.list(sectionKey) })
}

// Rows for several sections at once (dashboard, backlinks); `isPending` is true until all have loaded.
export function useManyRows(sectionKeys: readonly string[]) {
  return useQueries({
    queries: sectionKeys.map((key) => ({ queryKey: keys.rows(key), queryFn: () => repository.list(key) })),
    combine: (results) => ({
      data: Object.fromEntries(sectionKeys.map((key, i) => [key, results[i].data ?? []])) as Record<string, Row[]>,
      isPending: results.some((r) => r.isPending),
      error: results.find((r) => r.error)?.error ?? null,
      refetch: () => results.forEach((r) => void r.refetch()),
    }),
  })
}

export function useLookup(sectionKey: string) {
  return useQuery({ queryKey: keys.lookup(sectionKey), queryFn: () => repository.lookup(sectionKey) })
}

// Create or partially update a record; existing rows update optimistically and roll back on error.
export function useSaveRow(sectionKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, values }: SaveInput) => repository.save(sectionKey, id, values),
    onMutate: async ({ id, values }) => {
      if (!id) return { previous: undefined }
      await qc.cancelQueries({ queryKey: keys.rows(sectionKey) })
      const previous = qc.getQueryData<Row[]>(keys.rows(sectionKey))
      qc.setQueryData<Row[]>(keys.rows(sectionKey), (rows) => rows?.map((r) => (r.id === id ? { ...r, ...values } : r)))
      return { previous }
    },
    onError: (_error, _input, context) => {
      if (context?.previous) qc.setQueryData(keys.rows(sectionKey), context.previous)
    },
    // Put the saved row (with fresh formulas) in the cache right away so a new record can open immediately.
    onSuccess: (saved) => {
      qc.setQueryData<Row[]>(keys.rows(sectionKey), (rows = []) =>
        rows.some((r) => r.id === saved.id) ? rows.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...rows],
      )
    },
    onSettled: () =>
      Promise.all([
        qc.invalidateQueries({ queryKey: keys.rows(sectionKey) }),
        qc.invalidateQueries({ queryKey: keys.lookup(sectionKey) }),
      ]),
  })
}

// Deleting can clear references in other sections, so everything is refetched.
export function useDeleteRow(sectionKey: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => repository.remove(sectionKey, id),
    // Not awaited: the caller closes the sheet first, then lists refetch in the background.
    onSettled: () => void qc.invalidateQueries(),
  })
}

export const canResetDemoData = typeof repository.resetDemoData === 'function'

// Restores seed data (mock backend only) and refetches everything.
export function useResetDemoData() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await repository.resetDemoData?.()
    },
    onSuccess: () => qc.resetQueries(),
  })
}
