// Registry lookups and field helpers shared by the data layer and the UI.
import { sections } from '@/lib/schema/sections'
import type { FieldDef, FieldGroup, FieldValue, Row, SectionDef, SectionGroup, SelectField } from '@/lib/schema/types'

export * from '@/lib/schema/types'
export { sections, CONTENT_FLOW, CONTENT_DONE } from '@/lib/schema/sections'

const byKey = new Map(sections.map((s) => [s.key, s]))

export const SECTION_GROUPS: SectionGroup[] = ['Plan', 'Create', 'Test & Measure', 'Research', 'Pipeline']
export const FIELD_GROUPS: FieldGroup[] = ['Details', 'Content', 'Performance', 'Links']

export function getSection(key: string): SectionDef | undefined {
  return byKey.get(key)
}

// Like getSection but throws, for code paths where the key comes from the registry itself.
export function requireSection(key: string): SectionDef {
  const section = byKey.get(key)
  if (!section) throw new Error(`Unknown section "${key}"`)
  return section
}

export function sectionsInGroup(group: SectionGroup): SectionDef[] {
  return sections.filter((s) => s.group === group)
}

// The select field that drives status badges and board columns, if the section has one.
export function statusFieldOf(section: SectionDef): SelectField | null {
  if (!section.statusField) return null
  const field = section.fields.find((f) => f.name === section.statusField)
  return field && field.type === 'select' ? field : null
}

export function statusOptions(section: SectionDef): readonly string[] {
  return statusFieldOf(section)?.options ?? []
}

// Table columns besides title and status, capped at five.
export function tableFields(section: SectionDef): FieldDef[] {
  return section.fields.filter((f) => f.table && f.name !== section.statusField).slice(0, 5)
}

export function fieldGroup(field: FieldDef): FieldGroup {
  return field.group ?? 'Details'
}

// Initial value for a field on a new record.
export function defaultValue(field: FieldDef): FieldValue {
  switch (field.type) {
    case 'number':
      return field.default ?? null
    case 'checkbox':
      return false
    case 'multiselect':
      return []
    case 'relation':
      return field.many ? [] : null
    default:
      return null
  }
}

// Fields a user can write (formulas are computed, never stored).
export function isEditable(field: FieldDef): boolean {
  return field.type !== 'formula'
}

/** Editable snapshot of a record: title plus every writable field. */
export type Draft = Record<string, FieldValue>

// Adds computed formula values to a row (mirrors Postgres generated columns).
export function computeFormulas(section: SectionDef, row: Row): Row {
  const out: Row = { ...row }
  for (const field of section.fields) {
    if (field.type === 'formula') out[field.name] = field.compute(row)
  }
  return out
}

// Builds the editable draft from a record, or defaults (first status option) for a new one.
export function draftFrom(section: SectionDef, row: Row | null): Draft {
  const draft: Draft = { title: row?.title ?? '' }
  for (const field of section.fields.filter(isEditable)) {
    draft[field.name] = row ? (row[field.name] ?? defaultValue(field)) : defaultValue(field)
  }
  const status = statusFieldOf(section)
  if (!row && status) draft[status.name] = status.options[0]
  return draft
}
