// Full-page record view: Edit mode (form + live preview side by side) or Read mode (the content as it ships).
import { ChevronLeft, Eye, LoaderCircle, PencilLine, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useBeforeUnload, useBlocker, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { Backlinks } from '@/components/data/Backlinks'
import { FieldInput } from '@/components/data/FieldInput'
import { RecordPreview } from '@/components/preview/RecordPreview'
import { DetailsPanel } from '@/components/record/DetailsPanel'
import { RecordForm } from '@/components/record/RecordForm'
import { SectionIcon } from '@/components/shared/SectionIcon'
import { EmptyState, ErrorState } from '@/components/shared/States'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { usePersistentState } from '@/hooks/usePersistentState'
import { useRecordEditor } from '@/hooks/useRecordEditor'
import { useRows } from '@/hooks/useRecords'
import { formatDate } from '@/lib/format'
import { getSection, statusFieldOf, type Row, type SectionDef } from '@/lib/schema'
import { cn } from '@/lib/utils'
import { NotFound } from '@/pages/NotFound'

const MODES = ['edit', 'read'] as const
type Mode = (typeof MODES)[number]

// Route entry: resolves section + record id; remounts per record so drafts never leak between records.
export function RecordRoute() {
  const { sectionKey = '', recordId = '' } = useParams()
  const section = getSection(sectionKey)
  if (!section) return <NotFound />
  return <RecordLoader key={`${section.key}/${recordId}`} section={section} recordId={recordId} />
}

function RecordLoader({ section, recordId }: { section: SectionDef; recordId: string }) {
  const isNew = recordId === 'new'
  const { data: rows, isPending, error, refetch } = useRows(section.key)

  if (!isNew && isPending) {
    return (
      <div className="space-y-6 px-4 py-6 sm:px-6" role="status" aria-label="Loading record">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[480px]" />
          <Skeleton className="h-[480px]" />
        </div>
      </div>
    )
  }
  if (!isNew && error) {
    return (
      <div className="px-4 py-6 sm:px-6">
        <ErrorState message={error.message} onRetry={() => void refetch()} />
      </div>
    )
  }
  const row = isNew ? null : rows?.find((r) => r.id === recordId)
  if (!isNew && !row) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <EmptyState
          title={`${section.singular} not found`}
          description="It may have been deleted, or the link is wrong."
          action={
            <Button asChild variant="outline">
              <Link to={`/${section.key}`}>Back to {section.plural}</Link>
            </Button>
          }
        />
      </div>
    )
  }
  return <RecordWorkspace section={section} row={row ?? null} />
}

function RecordWorkspace({ section, row }: { section: SectionDef; row: Row | null }) {
  const editor = useRecordEditor(section, row)
  const navigate = useNavigate()
  const [savedMode, setSavedMode] = usePersistentState<Mode>('botai-console:record-mode', 'edit', MODES)
  const mode: Mode = editor.isNew ? 'edit' : savedMode
  const [confirmDelete, setConfirmDelete] = useState(false)
  const allowLeave = useRef(false)
  const status = statusFieldOf(section)
  const formId = `record-form-${section.key}`
  const listPath = `/${section.key}`

  // Unsaved edits: block in-app navigation (dialog below) and browser reload/close.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      editor.dirty && !allowLeave.current && currentLocation.pathname !== nextLocation.pathname,
  )
  useBeforeUnload((e) => {
    if (editor.dirty) e.preventDefault()
  })

  async function handleSave() {
    try {
      const saved = await editor.save()
      if (!saved) {
        if (editor.titleError || !String(editor.draft.title ?? '').trim()) document.getElementById('record-title')?.focus()
        return
      }
      toast.success(editor.isNew ? `${section.singular} created` : 'Changes saved')
      if (editor.isNew) {
        allowLeave.current = true
        navigate(`${listPath}/${saved.id}`, { replace: true })
      }
    } catch (e) {
      toast.error(`Couldn’t save: ${(e as Error).message}`)
    }
  }

  async function handleDelete() {
    try {
      await editor.remove()
      allowLeave.current = true
      toast.success(`${section.singular} deleted`)
      navigate(listPath, { replace: true })
    } catch (e) {
      toast.error(`Couldn’t delete: ${(e as Error).message}`)
    }
  }

  // ⌘S / Ctrl+S saves from anywhere on the page.
  const saveRef = useRef(handleSave)
  useEffect(() => {
    saveRef.current = handleSave
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        void saveRef.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const backlinks = !editor.isNew && row && section.backlinks?.map((b) => <Backlinks key={b.label} backlink={b} recordId={row.id} />)
  const showDetails = mode === 'read' && (section.preview ?? 'document') !== 'document'

  return (
    <div className="min-h-full">
      {/* Sticky action bar */}
      <div className="sticky top-14 z-20 border-b bg-background/95 backdrop-blur md:top-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-1 items-center gap-1 text-sm">
            <Button asChild variant="ghost" size="sm" className="-ml-2 shrink-0 text-muted-foreground">
              <Link to={listPath}>
                <ChevronLeft />
                <SectionIcon name={section.icon} className="hidden sm:block" />
                {section.plural}
              </Link>
            </Button>
            <span className="text-muted-foreground" aria-hidden>
              /
            </span>
            <span className="truncate font-medium" aria-current="page">
              {String(editor.draft.title || (editor.isNew ? `New ${section.singular}` : 'Untitled'))}
            </span>
            {editor.dirty && <span className="ml-1 hidden shrink-0 text-xs text-muted-foreground sm:inline">· Unsaved</span>}
          </nav>

          <div className="flex items-center gap-2">
            {status && (
              <div className="w-40 sm:w-44">
                <span id="header-status-label" className="sr-only">
                  {status.label}
                </span>
                <FieldInput
                  id="field-status"
                  labelId="header-status-label"
                  field={status}
                  value={editor.draft[status.name]}
                  onChange={(v) => editor.set(status.name, v)}
                />
              </div>
            )}
            {!editor.isNew && (
              <ToggleGroup
                type="single"
                variant="outline"
                value={mode}
                onValueChange={(v) => v && setSavedMode(v as Mode)}
                aria-label="Page mode"
              >
                <ToggleGroupItem value="edit" aria-label="Edit with preview">
                  <PencilLine />
                  <span className="hidden lg:inline">Edit</span>
                </ToggleGroupItem>
                <ToggleGroupItem value="read" aria-label="Read">
                  <Eye />
                  <span className="hidden lg:inline">Read</span>
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            {!editor.isNew && (
              <Button variant="ghost" size="icon" aria-label={`Delete ${section.singular}`} onClick={() => setConfirmDelete(true)} disabled={editor.deleting}>
                <Trash2 />
              </Button>
            )}
            <Button onClick={() => void handleSave()} disabled={editor.saving || (!editor.isNew && !editor.dirty)} title="Save (⌘S)">
              {editor.saving && <LoaderCircle className="animate-spin" />}
              {editor.isNew ? 'Create' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {mode === 'edit' ? (
        <>
          {/* Below lg the preview is hidden in Edit mode; the Read toggle shows it (with unsaved edits). */}
          <div className="grid gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <section aria-label="Editor" className="min-w-0 space-y-8">
              <RecordForm section={section} editor={editor} formId={formId} onSubmit={() => void handleSave()} />
              {backlinks}
            </section>

            <section
              aria-label="Live preview"
              className={cn(
                'hidden min-w-0 rounded-xl bg-muted/50 p-3 sm:p-5 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100svh-7rem)] lg:self-start lg:overflow-y-auto',
              )}
            >
              <p className="mb-3 flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <span className="size-1.5 rounded-full bg-success" aria-hidden />
                Live preview
              </p>
              <RecordPreview section={section} row={editor.preview} />
            </section>
          </div>
        </>
      ) : (
        <div
          className={cn(
            'mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6',
            showDetails && 'xl:grid-cols-[minmax(0,1fr)_300px]',
          )}
        >
          <div className="min-w-0 space-y-8">
            <RecordPreview section={section} row={editor.preview} />
            {backlinks && <div className="mx-auto max-w-3xl">{backlinks}</div>}
          </div>
          {showDetails && (
            <div className="xl:sticky xl:top-24 xl:self-start">
              <DetailsPanel section={section} row={editor.preview} />
            </div>
          )}
        </div>
      )}

      {!editor.isNew && row && (
        <p className="px-4 pb-8 text-center text-xs text-muted-foreground sm:px-6">
          Created {formatDate(row.created_at)} · Last updated {formatDate(row.updated_at)}
        </p>
      )}

      <AlertDialog open={blocker.state === 'blocked'} onOpenChange={(open) => !open && blocker.state === 'blocked' && blocker.reset()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without saving?</AlertDialogTitle>
            <AlertDialogDescription>Your unsaved edits to this {section.singular} will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => blocker.state === 'blocked' && blocker.proceed()}>
              Discard and leave
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{row?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the {section.singular} and clears links to it from other records. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={() => void handleDelete()}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
