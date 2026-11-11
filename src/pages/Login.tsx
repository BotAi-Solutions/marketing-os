// Sign-in page backed by the AuthService; redirects back to where the user was headed.
import { LoaderCircle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { BrandMark } from '@/components/layout/BrandMark'
import { FullPageSpinner } from '@/components/shared/FullPageSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { DEMO_USER } from '@/lib/auth'

export function Login() {
  const { session, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'
  const [email, setEmail] = useState(DEMO_USER.email)
  const [password, setPassword] = useState('demo1234')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <FullPageSpinner />
  if (session && !submitting) return <Navigate to={from} replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (e) {
      setError((e as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit} noValidate>
          <CardHeader className="space-y-3">
            <BrandMark />
            <div className="space-y-1">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>Demo mode: any email and a password of 6+ characters works.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <LoaderCircle className="animate-spin" />}
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  )
}
