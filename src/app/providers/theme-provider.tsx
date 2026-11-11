// Applies light/dark/system theme to <html> and persists the choice.
import { useEffect, useState, type ReactNode } from 'react'
import { ThemeContext } from '@/app/providers/theme-context'
import type { Theme } from '@/types/theme'

const STORAGE_KEY = 'ui-theme'

// Reads the saved theme, tolerating blocked storage.
function readStoredTheme(): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system'
  } catch {
    return 'system'
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(readStoredTheme)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    // Toggles the .dark class that globals.css keys dark tokens off.
    const apply = () => {
      const isDark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.classList.toggle('dark', isDark)
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  // Updates state and saves the choice for the next visit.
  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Storage unavailable: theme still applies for this session.
    }
    setThemeState(next)
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}
