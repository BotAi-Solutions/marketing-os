// Mock AuthService: auto-signs-in a demo user on first visit and accepts any valid-looking credentials.
import type { AuthService, Session, User } from '@/lib/auth/types'

const STORAGE_KEY = 'botai-console:session'
const SIGNED_OUT = 'signed-out'

export const DEMO_USER: User = { id: 'demo-user', email: 'demo@botai.example', name: 'Demo Marketer' }

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

// Derives a display name from the email's local part ("priya.nair" → "Priya Nair").
const nameFromEmail = (email: string) =>
  email
    .split('@')[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

function read(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function write(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage blocked: the session lives in memory only.
  }
}

export function createMockAuth(): AuthService {
  const listeners = new Set<(session: Session | null) => void>()
  let current: Session | null = null

  const emit = (session: Session | null) => {
    current = session
    listeners.forEach((cb) => cb(session))
  }

  return {
    async getSession() {
      await wait(100)
      if (current) return current
      const stored = read()
      if (stored === SIGNED_OUT) return null
      if (stored) {
        try {
          current = JSON.parse(stored) as Session
          return current
        } catch {
          // Fall through to auto sign-in.
        }
      }
      // First visit: auto sign-in the demo user so the app opens straight to the dashboard.
      current = { user: DEMO_USER, expires_at: null }
      write(JSON.stringify(current))
      return current
    },

    async signIn(email, password) {
      await wait()
      const cleanEmail = email.trim().toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) throw new Error('Enter a valid email address.')
      if (password.length < 6) throw new Error('Password must be at least 6 characters.')
      const user: User =
        cleanEmail === DEMO_USER.email ? DEMO_USER : { id: `user-${cleanEmail}`, email: cleanEmail, name: nameFromEmail(cleanEmail) }
      const session: Session = { user, expires_at: null }
      write(JSON.stringify(session))
      emit(session)
      return session
    },

    async signOut() {
      await wait(100)
      write(SIGNED_OUT)
      emit(null)
    },

    onChange(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
  }
}
