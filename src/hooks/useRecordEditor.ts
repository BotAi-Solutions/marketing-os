// Draft state for one record: edits, dirty tracking, live formula preview, partial save and delete.
import { useState } from 'react'
import { useDeleteRow, useSaveRow } from '@/hooks/useRecords'
import { computeFormulas, draftFrom, type Draft, type FieldValue, type Row, type SectionDef } from '@/lib/schema'

const same = (a: FieldValue | undefined, b: FieldValue | undefined) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null)

export function useRecordEditor(section: SectionDef, row: Row | null) {
  const isNew = row === null
  const [baseline, setBaseline] = useState<Draft>(() => draftFrom(section, row))
  const [draft, setDraft] = useState<Draft>(baseline)
  const [titleError, setTitleError] = useState(false)
  const saveMutation = useSaveRow(section.key)
  const deleteMutation = useDeleteRow(section.key)

  const changed = Object.keys(draft).filter((k) => !same(draft[k], baseline[k]))
  const dirty = changed.length > 0

  const set = (name: string, value: FieldValue) => {
    setDraft((d) => ({ ...d, [name]: value }))
    if (name === 'title') setTitleError(false)
  }

  // What the preview renders: saved row + unsaved edits + freshly computed formulas.
  const preview = computeFormulas(section, {
    ...(row ?? { id: 'new', created_at: '', updated_at: '' }),
    ...draft,
    title: String(draft.title ?? ''),
  })

  // Validates, then saves only changed fields (all fields for a new record). Returns null when nothing was saved.
  async function save(): Promise<Row | null> {
    if (!String(draft.title ?? '').trim()) {
      setTitleError(true)
      return null
    }
    if (!isNew && !dirty) return null
    const values = isNew ? draft : Object.fromEntries(changed.map((k) => [k, draft[k]]))
    const saved = await saveMutation.mutateAsync({ id: row?.id ?? null, values })
    setBaseline(draft)
    return saved
  }

  async function remove() {
    if (row) await deleteMutation.mutateAsync(row.id)
  }

  return {
    isNew,
    draft,
    preview,
    dirty,
    set,
    save,
    remove,
    titleError,
    saving: saveMutation.isPending,
    deleting: deleteMutation.isPending,
  }
}

export type RecordEditor = ReturnType<typeof useRecordEditor>
