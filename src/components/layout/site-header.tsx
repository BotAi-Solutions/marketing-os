// Sticky top bar with brand, primary nav and theme toggle.
import { NavLink } from 'react-router'
import { Container } from '@/components/layout/container'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center gap-6">
        <NavLink to="/" className="font-heading font-semibold tracking-tight">
          {siteConfig.name}
        </NavLink>
        <nav className="flex items-center gap-4 text-sm">
          {siteConfig.nav.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end
              className={({ isActive }) =>
                cn('text-muted-foreground transition-colors hover:text-foreground', isActive && 'text-foreground')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </Container>
    </header>
  )
}
