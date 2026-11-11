// Editable control for any registry field type; labels are rendered by the caller.
import { Copy, Star } from 'lucide-react'
import { toast } from 'sonner'
import { RelationPicker } from '@/components/data/RelationPicker'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatFormula } from '@/lib/format'
import type { FieldDef, FieldValue } from '@/lib/schema'
import { cn } from '@/lib/utils'

const NONE = '__none__'

type Props = {
  id: string
  /** id of the visible label, for grouped controls (chips, rating) that can't use htmlFor. */
  labelId: string
  field: FieldDef
  value: FieldValue | undefined
  onChange: (value: FieldValue) => void
}

const asString = (v: FieldValue | undefined) => (typeof v === 'string' ? v : '')

// Copies text to the clipboard and reports the result.
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  } catch {
    toast.error('Could not copy. Select the text and copy manually.')
  }
}

export function FieldInput({ id, labelId, field, value, onChange }: Props) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
    case 'date':
      return (
        <Input
          id={id}
          type={field.type === 'text' ? 'text' : field.type}
          value={asString(value)}
          placeholder={field.type === 'url' ? 'https://' : undefined}
          onChange={(e) => onChange(e.target.value || null)}
        />
      )

    case 'number':
      return (
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          value={typeof value === 'number' ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      )

    case 'longtext':
      return (
        <div className="relative">
          <Textarea
            id={id}
            rows={field.markdown ? 16 : field.monospace ? 8 : 4}
            value={asString(value)}
            className={cn(
              (field.monospace || field.markdown) && 'font-mono text-xs leading-relaxed',
              field.markdown && 'min-h-72',
              field.copyable && 'pr-10',
            )}
            onChange={(e) => onChange(e.target.value || null)}
          />
          {field.copyable && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute top-1.5 right-1.5"
              aria-label={`Copy ${field.label.toLowerCase()}`}
              disabled={!asString(value)}
              onClick={() => void copy(asString(value))}
            >
              <Copy />
            </Button>
          )}
        </div>
      )

    case 'checkbox':
      return <Checkbox id={id} checked={value === true} onCheckedChange={(checked) => onChange(checked === true)} />

    case 'select':
      return (
        <Select value={asString(value) || NONE} onValueChange={(v) => onChange(v === NONE ? null : v)}>
          <SelectTrigger id={id} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value={NONE} className="text-muted-foreground">
              None
            </SelectItem>
            {field.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case 'multiselect': {
      const selected = Array.isArray(value) ? value : []
      return (
        <div id={id} role="group" aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
          {field.options.map((option) => {
            const on = selected.includes(option)
            return (
              <Button
                key={option}
                type="button"
                size="xs"
                variant={on ? 'default' : 'outline'}
                aria-pressed={on}
                onClick={() => onChange(on ? selected.filter((s) => s !== option) : [...selected, option])}
              >
                {option}
              </Button>
            )
          })}
        </div>
      )
    }

    case 'rating': {
      const current = typeof value === 'number' ? value : 0
      return (
        <div id={id} role="radiogroup" aria-labelledby={labelId} className="flex items-center gap-0.5">
          {Array.from({ length: field.max }, (_, i) => i + 1).map((n) => (
            <Button
              key={n}
              type="button"
              variant="ghost"
              size="icon-sm"
              role="radio"
              aria-checked={current === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onClick={() => onChange(current === n ? null : n)}
            >
              <Star className={cn(n <= current ? 'fill-current text-foreground' : 'text-muted-foreground/50')} />
            </Button>
          ))}
          {current > 0 && <span className="ml-1 text-xs text-muted-foreground">{current}/{field.max}</span>}
        </div>
      )
    }

    case 'relation':
      return <RelationPicker id={id} field={field} value={value} onChange={onChange} />

    case 'formula':
      return (
        <div id={id} className="flex h-8 items-center rounded-lg border border-dashed px-2.5 text-sm tabular-nums">
          {formatFormula(field.format, value) ?? <span className="text-muted-foreground">Not enough data yet</span>}
        </div>
      )
  }
}
