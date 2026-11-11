// Auth context object, kept apart from the provider so fast refresh keeps working.
import { createContext } from 'react'
import type { Session } from '@/lib/auth'

export type AuthContextValue = {
  session: Session | null
  /** True until the first getSession() resolves. */
  loading: boolean
  signIn: (email: string, password: string) => Promise<Session>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
