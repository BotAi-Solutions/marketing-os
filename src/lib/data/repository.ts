// Backend-agnostic data contract; phase 1 uses the mock, phase 2 a Supabase implementation.
import type { Row } from '@/lib/schema'

export type { Row }

export type LookupItem = { id: string; title: string }

export interface Repository {
  /** All records in a section, with formula fields computed. */
  list(sectionKey: string): Promise<Row[]>
  /** Creates when `id` is null, otherwise merges `values` into the existing record (partial saves). */
  save(sectionKey: string, id: string | null, values: Partial<Row>): Promise<Row>
  /** Deletes a record and clears references to it in other sections. */
  remove(sectionKey: string, id: string): Promise<void>
  /** Lightweight id + title list used by relation pickers and chips. */
  lookup(sectionKey: string): Promise<LookupItem[]>
  /** Demo-only: restores seed data. Real backends leave this undefined. */
  resetDemoData?(): Promise<void>
}
