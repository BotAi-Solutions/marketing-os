// Sonner toaster themed with the app's tokens and current light/dark mode.
import type { CSSProperties } from 'react'
import { Toaster as Sonner } from 'sonner'
import { useTheme } from '@/hooks/useTheme'

export function Toaster() {
  const { resolvedTheme } = useTheme()
  return (
    <Sonner
      theme={resolvedTheme}
      position="bottom-right"
      closeButton
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as CSSProperties
      }
    />
  )
}
