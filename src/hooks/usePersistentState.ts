// useState that remembers its value in localStorage (per-viewer UI preferences only).
import { useState } from 'react'

export function usePersistentState<T extends string>(key: string, fallback: T, allowed: readonly T[]) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key) as T | null
      return stored && allowed.includes(stored) ? stored : fallback
    } catch {
      return fallback
    }
  })

  // Saves alongside the state update; storage failures only lose the preference.
  const set = (next: T) => {
    try {
      localStorage.setItem(key, next)
    } catch {
      // Ignore.
    }
    setValue(next)
  }

  return [value, set] as const
}
