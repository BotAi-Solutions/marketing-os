// Composes all global providers so app.tsx stays a single wrapper.
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/app/providers/theme-provider'

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
