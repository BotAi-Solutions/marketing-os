// Route guard: waits for the session, then renders the app or redirects to /login.
import { Navigate, Outlet, useLocation } from 'react-router'
import { FullPageSpinner } from '@/components/shared/FullPageSpinner'
import { useAuth } from '@/hooks/useAuth'

export function RequireAuth() {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  return <Outlet />
}
