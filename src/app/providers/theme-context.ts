// Theme context object, kept separate so provider files only export components.
import { createContext } from 'react'
import type { Theme } from '@/types/theme'

export type ThemeContextValue = { theme: Theme; setTheme: (theme: Theme) => void }

export const ThemeContext = createContext<ThemeContextValue | null>(null)
