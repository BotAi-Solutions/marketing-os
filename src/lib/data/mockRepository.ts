// In-memory Repository persisted to localStorage, with small delays so loading states are real.
import type { LookupItem, Repository } from '@/lib/data/repository'
import { buildSeed } from '@/lib/data/seed'
import { computeFormulas, defaultValue, isEditable, requireSection, sections, type FieldValue, type Row } from '@/lib/schema'

type Db = Record<string, Row[]>

const STORAGE_KEY = 'botai-console:db:v1'
const DELAY_MS = 150

const wait = () => new Promise((resolve) => setTimeout(resolve, DELAY_MS))
const nowIso = () => new Date().toISOString()

// Loads the persisted db, falling back to fresh seed data when storage is empty, corrupt or blocked.
function load(): Db {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Db
  } catch {
    // Ignore and reseed.
  }
  return buildSeed()
}

// Clone on the way out so callers can never mutate the store by reference.
const clone = <T>(value: T): T => structuredClone(value)

// Adds computed formula values, as Postgres generated columns will in phase 2.
const withFormulas = (sectionKey: string, row: Row): Row => computeFormulas(requireSection(sectionKey), row)

// Keeps only known, writable columns so stray keys (or formula values) never get stored.
function sanitize(sectionKey: string, values: Partial<Row>): Record<string, FieldValue> {
  const section = requireSection(sectionKey)
  const out: Record<string, FieldValue> = {}
  if (typeof values.title === 'string') out.title = values.title.trim()
  for (const field of section.fields) {
    if (!isEditable(field) || !(field.name in values)) continue
    out[field.name] = values[field.name] ?? null
  }
  return out
}

export function createMockRepository(): Repository {
  let db = load()

  // Writes through to localStorage; failures keep the session working in memory.
  const persist = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
    } catch {
      // Storage full or blocked.
    }
  }

  const rowsOf = (sectionKey: string): Row[] => {
    requireSection(sectionKey)
    db[sectionKey] ??= []
    return db[sectionKey]
  }

  return {
    async list(sectionKey) {
      await wait()
      return clone(rowsOf(sectionKey)).map((row) => withFormulas(sectionKey, row))
    },

    async save(sectionKey, id, values) {
      await wait()
      const rows = rowsOf(sectionKey)
      const clean = sanitize(sectionKey, values)
      const timestamp = nowIso()

      if (id === null) {
        const defaults = Object.fromEntries(requireSection(sectionKey).fields.filter(isEditable).map((f) => [f.name, defaultValue(f)]))
        const row: Row = {
          ...defaults,
          ...clean,
          id: crypto.randomUUID(),
          title: typeof clean.title === 'string' && clean.title ? clean.title : 'Untitled',
          created_at: timestamp,
          updated_at: timestamp,
        }
        rows.unshift(row)
        persist()
        return withFormulas(sectionKey, clone(row))
      }

      const index = rows.findIndex((r) => r.id === id)
      if (index === -1) throw new Error('Record not found. It may have been deleted.')
      const row: Row = { ...rows[index], ...clean, updated_at: timestamp }
      if (!row.title) row.title = 'Untitled'
      rows[index] = row
      persist()
      return withFormulas(sectionKey, clone(row))
    },

    async remove(sectionKey, id) {
      await wait()
      const rows = rowsOf(sectionKey)
      if (!rows.some((r) => r.id === id)) throw new Error('Record not found. It may have been deleted.')
      db[sectionKey] = rows.filter((r) => r.id !== id)

      // Mirror FK "on delete set null" and junction-table cascades.
      for (const section of sections) {
        for (const field of section.fields) {
          if (field.type !== 'relation' || field.section !== sectionKey) continue
          for (const row of db[section.key] ?? []) {
            const value = row[field.name]
            if (field.many && Array.isArray(value) && value.includes(id)) row[field.name] = value.filter((v) => v !== id)
            if (!field.many && value === id) row[field.name] = null
          }
        }
      }
      persist()
    },

    async lookup(sectionKey): Promise<LookupItem[]> {
      await wait()
      return rowsOf(sectionKey)
        .map((r) => ({ id: r.id, title: r.title }))
        .sort((a, b) => a.title.localeCompare(b.title))
    },

    async resetDemoData() {
      await wait()
      db = buildSeed()
      persist()
    },
  }
}
