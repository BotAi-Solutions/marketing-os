// Page title block with optional icon, description and right-aligned actions.
import type { ReactNode } from 'react'

type PageHeaderProps = { title: string; description?: ReactNode; icon?: ReactNode; actions?: ReactNode }

export function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight">
          {icon}
          {title}
        </h1>
        {description && <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
