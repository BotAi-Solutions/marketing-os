// Landing page showcasing the design system tokens and shadcn components.
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { Container } from '@/components/layout/container'
import { PageHeader } from '@/components/shared/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { siteConfig } from '@/config/site'

const swatches = ['primary', 'secondary', 'accent', 'muted', 'success', 'warning', 'destructive'] as const

const pillars = [
  { title: 'Design system', body: 'Semantic OKLCH tokens in globals.css drive every color, radius and font.' },
  { title: 'shadcn/ui', body: 'Accessible Radix primitives you own, added with one CLI command.' },
  { title: 'Feature folders', body: 'Each feature owns its components, API and types behind an index.ts.' },
]

export function HomePage() {
  return (
    <Container className="space-y-12 py-16">
      <section className="space-y-6">
        <Badge variant="secondary">Vite · React · Tailwind v4 · shadcn/ui</Badge>
        <PageHeader title={siteConfig.name} description={siteConfig.description} />
        <div className="flex gap-3">
          <Button asChild>
            <Link to="/contact">
              Contact us <ArrowRight />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://ui.shadcn.com/docs/components" target="_blank" rel="noreferrer">
              Browse components
            </a>
          </Button>
        </div>
      </section>

      <Separator />

      <section className="grid gap-4 sm:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Color tokens</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map((name) => (
            <div key={name} className="space-y-1.5">
              <div className="h-14 rounded-lg border" style={{ background: `var(--${name})` }} />
              <p className="font-mono text-xs text-muted-foreground">{name}</p>
            </div>
          ))}
        </div>
      </section>
    </Container>
  )
}
