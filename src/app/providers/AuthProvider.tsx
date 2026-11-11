// Holds the current session from the AuthService and keeps it in sync with sign-in/out events.
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState, type ReactNode } from 'react'
import { AuthContext } from '@/app/providers/authContext'
import { auth, type Session } from '@/lib/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const queryClient = useQueryClient()

  useEffect(() => {
    let active = true
    void auth.getSession().then((s) => {
      if (!active) return
      setSession(s)
      setLoading(false)
    })
    // Drop cached records on sign-out so the next user never sees the previous user's data.
    const unsubscribe = auth.onChange((next) => {
      if (!next) queryClient.clear()
      setSession(next)
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [queryClient])

  return (
    <AuthContext
      value={{ session, loading, signIn: (email, password) => auth.signIn(email, password), signOut: () => auth.signOut() }}
    >
      {children}
    </AuthContext>
  )
}
