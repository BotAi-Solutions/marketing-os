// Reads the current theme and setter; must be used under ThemeProvider.
import { useContext } from 'react'
import { ThemeContext } from '@/app/providers/themeContext'

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
