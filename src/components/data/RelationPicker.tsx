// Searchable single/multi relation picker (Popover + Command) with removable chips.
import { ChevronsUpDown, X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useLookup } from '@/hooks/useRecords'
import { requireSection, type FieldValue, type RelationField } from '@/lib/schema'

type Props = {
  id: string
  field: RelationField
  value: FieldValue | undefined
  onChange: (value: string | string[] | null) => void
}

export function RelationPicker({ id, field, value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const { data: items = [], isPending, isError } = useLookup(field.section)
  const target = requireSection(field.section)

  const selected = field.many ? (Array.isArray(value) ? value : []) : typeof value === 'string' ? [value] : []
  const titleOf = (itemId: string) => items.find((i) => i.id === itemId)?.title ?? (isPending ? 'Loading…' : 'Missing record')

  // Adds/removes for many; selects or clears for single (and closes the popover).
  const toggle = (itemId: string) => {
    if (field.many) {
      onChange(selected.includes(itemId) ? selected.filter((s) => s !== itemId) : [...selected, itemId])
    } else {
      onChange(selected[0] === itemId ? null : itemId)
      setOpen(false)
    }
  }

  const remove = (itemId: string) => onChange(field.many ? selected.filter((s) => s !== itemId) : null)

  const triggerText = field.many
    ? `Add ${target.plural}…`
    : selected.length
      ? `Change ${target.singular}…`
      : `Select ${target.singular}…`

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label={`Selected ${field.label}`}>
          {selected.map((itemId) => (
            <li key={itemId}>
              <Badge variant="secondary" className="h-auto max-w-full justify-start gap-1 py-0.5 pr-0.5 font-normal">
                <span className="truncate">{titleOf(itemId)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="size-4 rounded-sm"
                  aria-label={`Remove ${titleOf(itemId)}`}
                  onClick={() => remove(itemId)}
                >
                  <X className="size-3" />
                </Button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal text-muted-foreground"
          >
            {triggerText}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) min-w-64 p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${target.plural}…`} />
            <CommandList>
              <CommandEmpty>{isPending ? 'Loading…' : isError ? 'Could not load records.' : 'No matches.'}</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    keywords={[item.title]}
                    data-checked={selected.includes(item.id)}
                    onSelect={() => toggle(item.id)}
                  >
                    <span className="truncate">{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
