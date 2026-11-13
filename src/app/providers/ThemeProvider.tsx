// Applies light/dark/system theme to <html> and persists the choice.
import { useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { ThemeContext } from '@/app/providers/themeContext'
import type { Theme } from '@/types/theme'

const STORAGE_KEY = 'ui-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

// Reads the saved theme, tolerating blocked storage.
function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

// Subscribes to OS dark-mode changes so "system" stays live.
function subscribeToSystem(callback: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)
  const systemDark = useSyncExternalStore(subscribeToSystem, () => window.matchMedia(DARK_QUERY).matches)
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

  // Toggles the .dark class that globals.css keys dark tokens off, pausing transitions for one frame so it swaps cleanly.
  useEffect(() => {
    const root = document.documentElement
    if (root.classList.contains('dark') === (resolvedTheme === 'dark')) return
    root.classList.add('theme-switching')
    root.classList.toggle('dark', resolvedTheme === 'dark')
    const frame = requestAnimationFrame(() => root.classList.remove('theme-switching'))
    return () => {
      cancelAnimationFrame(frame)
      root.classList.remove('theme-switching')
    }
  }, [resolvedTheme])

  // Updates state and saves the choice for the next visit.
  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: theme still applies for this session.
    }
    setThemeState(next)
  }

  return <ThemeContext value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext>
}
