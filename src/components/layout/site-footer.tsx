// Bottom bar with copyright line.
import { Container } from '@/components/layout/container'
import { siteConfig } from '@/config/site'

const YEAR = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="border-t py-6 text-sm text-muted-foreground">
      <Container>
        © {YEAR} {siteConfig.name}
      </Container>
    </footer>
  )
}
