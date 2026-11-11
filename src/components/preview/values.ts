// Typed accessors for reading loosely-typed Row values inside preview components.
import type { Row } from '@/lib/schema'

export type PreviewProps = { row: Row }

export const str = (row: Row, key: string): string => (typeof row[key] === 'string' ? (row[key] as string) : '')
export const num = (row: Row, key: string): number | null => (typeof row[key] === 'number' ? (row[key] as number) : null)
export const list = (row: Row, key: string): string[] => (Array.isArray(row[key]) ? (row[key] as string[]) : [])

// Rough reading time at ~230 words per minute.
export function readingMinutes(text: string): number {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  return Math.max(1, Math.round(words / 230))
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
