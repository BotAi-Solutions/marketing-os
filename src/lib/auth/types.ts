// Backend-agnostic auth contract; phase 2 implements it with Supabase Auth.

export type User = { id: string; email: string; name: string }

export type Session = { user: User; expires_at: string | null }

export interface AuthService {
  signIn(email: string, password: string): Promise<Session>
  signOut(): Promise<void>
  getSession(): Promise<Session | null>
  /** Subscribes to sign-in/sign-out; returns an unsubscribe function. */
  onChange(callback: (session: Session | null) => void): () => void
}
