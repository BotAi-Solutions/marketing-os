// Small builders that keep the section registry terse and labels consistent.
import type {
  CheckboxField,
  FieldGroup,
  FormulaField,
  LongTextField,
  NumberField,
  RatingField,
  RelationField,
  Row,
  SelectField,
  TextField,
} from '@/lib/schema/types'

type Extra = { label?: string; table?: boolean; group?: FieldGroup; help?: string }

// Turns `primary_channels` / `campaign_id` into "Primary channels" / "Campaign".
export function humanize(name: string): string {
  const words = name.replace(/_id$/, '').replace(/_/g, ' ')
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// Applies the label (explicit or derived) and optional flags shared by every builder.
const base = (name: string, extra: Extra) => ({ name, ...extra, label: extra.label ?? humanize(name) })

export const text = (name: string, extra: Extra = {}): TextField => ({ type: 'text', ...base(name, extra) })
export const url = (name: string, extra: Extra = {}): TextField => ({ type: 'url', ...base(name, extra) })
export const email = (name: string, extra: Extra = {}): TextField => ({ type: 'email', ...base(name, extra) })
export const date = (name: string, extra: Extra = {}): TextField => ({ type: 'date', ...base(name, extra) })
export const check = (name: string, extra: Extra = {}): CheckboxField => ({ type: 'checkbox', ...base(name, extra) })

export const long = (
  name: string,
  extra: Extra & { monospace?: boolean; copyable?: boolean; markdown?: boolean } = {},
): LongTextField => ({
  type: 'longtext',
  ...base(name, { group: 'Content', ...extra }),
  monospace: extra.monospace,
  copyable: extra.copyable,
  markdown: extra.markdown,
})

export const num = (name: string, extra: Extra & { default?: number; format?: 'number' | 'currency' } = {}): NumberField => ({
  type: 'number',
  ...base(name, extra),
  default: extra.default,
  format: extra.format,
})

// Performance numbers (impressions, leads…) grouped together in the record sheet.
export const metric = (name: string, extra: Extra & { default?: number; format?: 'number' | 'currency' } = {}): NumberField =>
  num(name, { group: 'Performance', ...extra })

export const select = (name: string, options: readonly string[], extra: Extra = {}): SelectField => ({
  type: 'select',
  options,
  ...base(name, extra),
})

export const multi = (name: string, options: readonly string[], extra: Extra = {}): SelectField => ({
  type: 'multiselect',
  options,
  ...base(name, extra),
})

export const rating = (name: string, extra: Extra = {}): RatingField => ({ type: 'rating', max: 5, ...base(name, extra) })

// Single relation stored as `<name>_id`.
export const one = (name: `${string}_id`, section: string, extra: Extra = {}): RelationField => ({
  type: 'relation',
  section,
  many: false,
  ...base(name, { group: 'Links', ...extra }),
})

// Many relation stored as a string[] of ids (a junction table in phase 2).
export const many = (name: string, section: string, extra: Extra = {}): RelationField => ({
  type: 'relation',
  section,
  many: true,
  ...base(name, { group: 'Links', ...extra }),
})

export const formula = (
  name: string,
  format: FormulaField['format'],
  sql: string,
  compute: FormulaField['compute'],
  extra: Extra = {},
): FormulaField => ({ type: 'formula', format, sql, compute, ...base(name, { group: 'Performance', ...extra }) })

// Reads a numeric column, treating blanks as 0 like Postgres coalesce().
export const n = (row: Row, key: string): number => {
  const v = row[key]
  return typeof v === 'number' && Number.isFinite(v) ? v : 0
}

// Divides and rounds, returning null when the denominator is 0 (mirrors nullif(x, 0)).
export function ratio(numerator: number, denominator: number, digits: number): number | null {
  if (!denominator) return null
  const factor = 10 ** digits
  return Math.round((numerator / denominator) * factor) / factor
}
