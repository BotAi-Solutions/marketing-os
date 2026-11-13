// App frame: fixed sidebar on desktop, top bar with a slide-out menu on mobile, routed page in the middle.
import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import { BrandMark } from '@/components/layout/BrandMark'
import { Sidebar } from '@/components/layout/Sidebar'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-svh">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 border-r border-sidebar-border md:block">
        <Sidebar />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur-md md:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 gap-0 p-0" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SheetDescription className="sr-only">Sections of the console</SheetDescription>
              <Sidebar onNavigate={() => setMenuOpen(false)} />
            </SheetContent>
          </Sheet>
          <BrandMark />
          <ThemeToggle className="ml-auto" />
        </header>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
