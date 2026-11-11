// Site-wide constants: name, description and navigation links.
import type { NavItem } from '@/types/nav'

export const siteConfig = {
  name: 'BotAI Console',
  description: 'A Vite + React + shadcn/ui starter built to scale.',
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Todos', href: '/todos' },
    { label: 'Contact', href: '/contact' },
  ] satisfies NavItem[],
}
