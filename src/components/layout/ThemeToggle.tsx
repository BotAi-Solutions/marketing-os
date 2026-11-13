// One-click light/dark switch shown in the sidebar, mobile top bar and login page (System lives in the user menu).
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const next = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={cn('relative text-muted-foreground hover:text-foreground', className)}
    >
      <Sun className="scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:-rotate-90" data-theme-icon aria-hidden />
      <Moon
        className="absolute scale-0 rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
        data-theme-icon
        aria-hidden
      />
    </Button>
  )
}
