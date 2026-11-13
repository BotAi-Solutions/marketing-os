// Product logo mark and name, used in the sidebar, mobile top bar and login.
import { Sparkles } from 'lucide-react'

export function BrandMark() {
  return (
    <span className="flex items-center gap-2 font-heading font-semibold tracking-tight">
      <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <Sparkles className="size-4" aria-hidden />
      </span>
      Botai Console
    </span>
  )
}
