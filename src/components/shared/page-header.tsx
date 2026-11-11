// Reusable page title block with optional description.
import type { ReactNode } from 'react'

type PageHeaderProps = { title: string; description?: ReactNode }

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {description && <p className="max-w-2xl text-muted-foreground">{description}</p>}
    </div>
  )
}
