// Editor column: big title input plus every registry field, grouped, laid out by available width.
import { FieldInput } from '@/components/data/FieldInput'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { RecordEditor } from '@/hooks/useRecordEditor'
import { FIELD_GROUPS, fieldGroup, type FieldDef, type SectionDef } from '@/lib/schema'
import { cn } from '@/lib/utils'

// Wide controls get the full row when the form shows two columns.
const isWide = (f: FieldDef) =>
  f.type === 'longtext' || f.type === 'multiselect' || (f.type === 'relation' && f.many)

export function RecordForm({ section, editor, formId, onSubmit }: { section: SectionDef; editor: RecordEditor; formId: string; onSubmit: () => void }) {
  const fields = section.fields.filter((f) => f.name !== section.statusField)

  return (
    <form
      id={formId}
      className="@container space-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <div className="space-y-1">
        <Label htmlFor="record-title" className="text-muted-foreground">
          {section.titleLabel}
        </Label>
        <Input
          id="record-title"
          autoFocus={editor.isNew}
          value={String(editor.draft.title ?? '')}
          placeholder={`${section.titleLabel}…`}
          aria-invalid={editor.titleError || undefined}
          aria-describedby={editor.titleError ? 'record-title-error' : undefined}
          onChange={(e) => editor.set('title', e.target.value)}
          className="h-auto py-2 font-heading text-xl font-semibold tracking-tight md:text-xl"
        />
        {editor.titleError && (
          <p id="record-title-error" className="text-sm text-destructive">
            {section.titleLabel} is required.
          </p>
        )}
      </div>

      {FIELD_GROUPS.map((group) => {
        const inGroup = fields.filter((f) => fieldGroup(f) === group)
        if (inGroup.length === 0) return null
        return (
          <fieldset key={group} className="space-y-4">
            <legend className="mb-4 text-xs font-medium tracking-wide text-muted-foreground uppercase">{group}</legend>
            <div className="grid gap-4 @lg:grid-cols-2">
              {inGroup.map((field) => {
                const id = `field-${field.name}`
                const input = (
                  <FieldInput
                    id={id}
                    labelId={`${id}-label`}
                    field={field}
                    value={field.type === 'formula' ? editor.preview[field.name] : editor.draft[field.name]}
                    onChange={(v) => editor.set(field.name, v)}
                  />
                )
                if (field.type === 'checkbox') {
                  return (
                    <div key={field.name} className="flex items-center gap-2 self-end pb-2">
                      {input}
                      <Label htmlFor={id} id={`${id}-label`}>
                        {field.label}
                      </Label>
                    </div>
                  )
                }
                return (
                  <div key={field.name} className={cn('min-w-0 space-y-1.5', isWide(field) && '@lg:col-span-2')}>
                    <Label htmlFor={id} id={`${id}-label`}>
                      {field.label}
                      {field.type === 'formula' && <span className="font-normal text-muted-foreground">(calculated)</span>}
                    </Label>
                    {input}
                    {field.help && <p className="text-xs text-muted-foreground">{field.help}</p>}
                  </div>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </form>
  )
}
