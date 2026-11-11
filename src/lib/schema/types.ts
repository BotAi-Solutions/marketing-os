// Schema registry types: describe every section and field so UI and data layers stay generic.

/** A single stored or computed value on a record. */
export type FieldValue = string | number | boolean | string[] | null

/** A generic record; known columns are typed, section fields are looked up via the registry. */
export type Row = {
  id: string
  title: string
  created_at: string
  updated_at: string
  [field: string]: FieldValue | undefined
}

/** Where a field appears in the record sheet. */
export type FieldGroup = 'Details' | 'Content' | 'Performance' | 'Links'

type BaseField = {
  name: string
  label: string
  /** Show as a column in the table view (keep to 5 per section). */
  table?: boolean
  group?: FieldGroup
  help?: string
}

export type TextField = BaseField & { type: 'text' | 'url' | 'email' | 'date' }
export type LongTextField = BaseField & { type: 'longtext'; monospace?: boolean; copyable?: boolean; markdown?: boolean }
export type NumberField = BaseField & { type: 'number'; default?: number; format?: 'number' | 'currency' }
export type CheckboxField = BaseField & { type: 'checkbox' }
export type SelectField = BaseField & { type: 'select' | 'multiselect'; options: readonly string[] }
export type RatingField = BaseField & { type: 'rating'; max: number }
/** Single relations are stored as `<name>_id`; many relations as a `string[]` of ids. */
export type RelationField = BaseField & { type: 'relation'; section: string; many: boolean }
/** Computed on read; `sql` documents the matching Postgres generated column for phase 2. */
export type FormulaField = BaseField & {
  type: 'formula'
  format: 'percent' | 'currency' | 'number'
  sql: string
  compute: (row: Row) => number | null
}

export type FieldDef =
  | TextField
  | LongTextField
  | NumberField
  | CheckboxField
  | SelectField
  | RatingField
  | RelationField
  | FormulaField

export type FieldType = FieldDef['type']

export type SectionGroup = 'Plan' | 'Create' | 'Test & Measure' | 'Research' | 'Pipeline'

/** lucide-react icon names used by sections; mapped to components in the UI layer. */
export type IconName =
  | 'Megaphone'
  | 'Target'
  | 'Magnet'
  | 'Lightbulb'
  | 'MessageSquareText'
  | 'Newspaper'
  | 'Globe'
  | 'PanelsTopLeft'
  | 'Trophy'
  | 'Images'
  | 'SquareTerminal'
  | 'FlaskConical'
  | 'ChartLine'
  | 'Telescope'
  | 'Building'

/** How a record is rendered in the live preview / read view; mapped to a component in the UI layer. */
export type PreviewKind = 'document' | 'linkedin' | 'article' | 'landing' | 'caseStudy' | 'prompt'

/** Read-only list of records in other sections that point at this one (e.g. experiment variants). */
export type Backlink = { label: string; field: string; sections: readonly string[] }

export type SectionDef = {
  /** URL slug and the key used by the repository and hooks. */
  key: string
  /** Database table name (phase 2). */
  table: string
  singular: string
  plural: string
  icon: IconName
  group: SectionGroup
  description: string
  /** Label shown for the `title` column. */
  titleLabel: string
  /** Name of the select field that drives badges, filters and the board; null when the section has no status. */
  statusField: string | null
  board: boolean
  fields: FieldDef[]
  backlinks?: Backlink[]
  /** Preview layout; defaults to 'document'. */
  preview?: PreviewKind
}
