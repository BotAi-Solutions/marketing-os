// Navigation built from the registry groups, plus the user menu (theme, reset demo data, sign out).
import { ChevronsUpDown, LayoutDashboard, LogOut, Monitor, Moon, RotateCcw, Sun } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { BrandMark } from '@/components/layout/BrandMark'
import { SectionIcon } from '@/components/shared/SectionIcon'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { canResetDemoData, useResetDemoData } from '@/hooks/useRecords'
import { useTheme } from '@/hooks/useTheme'
import { SECTION_GROUPS, sectionsInGroup } from '@/lib/schema'
import { cn } from '@/lib/utils'
import type { Theme } from '@/types/theme'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
    isActive && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
  )

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center px-4">
        <BrandMark />
      </div>
      <nav aria-label="Main" className="flex-1 space-y-5 overflow-y-auto px-3 py-2">
        <NavLink to="/" end className={linkClass} onClick={onNavigate}>
          <LayoutDashboard aria-hidden />
          Dashboard
        </NavLink>
        {SECTION_GROUPS.map((group) => (
          <div key={group} className="space-y-1">
            <h2 className="px-2.5 text-xs font-medium text-sidebar-foreground/50">{group}</h2>
            <ul className="space-y-0.5">
              {sectionsInGroup(group).map((section) => (
                <li key={section.key}>
                  <NavLink to={`/${section.key}`} className={linkClass} onClick={onNavigate}>
                    <SectionIcon name={section.icon} />
                    {section.plural}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <UserMenu />
      </div>
    </div>
  )
}

function UserMenu() {
  const { session, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const reset = useResetDemoData()
  const [confirmReset, setConfirmReset] = useState(false)
  const user = session?.user
  if (!user) return null

  // Signs out, then sends the user to the login page.
  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="flex w-full items-center gap-2.5 rounded-md p-2 text-left hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none data-[state=open]:bg-sidebar-accent">
          <Avatar className="size-8 rounded-lg">
            <AvatarFallback className="rounded-lg text-xs">{initials(user.name)}</AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{user.name}</span>
            <span className="block truncate text-xs text-sidebar-foreground/60">{user.email}</span>
          </span>
          <ChevronsUpDown className="size-4 text-sidebar-foreground/50" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-(--radix-dropdown-menu-trigger-width) min-w-56">
          <DropdownMenuLabel>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <DropdownMenuRadioItem value="light">
              <Sun /> Light
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <Moon /> Dark
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <Monitor /> System
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {canResetDemoData && (
            <DropdownMenuItem onSelect={() => setConfirmReset(true)}>
              <RotateCcw /> Reset demo data
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => void handleSignOut()}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
            <AlertDialogDescription>
              Every record you created or edited is replaced with the original sample data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() =>
                reset.mutate(undefined, {
                  onSuccess: () => toast.success('Demo data restored'),
                  onError: (e) => toast.error(`Reset failed: ${e.message}`),
                })
              }
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
