// The one place that picks the auth backend; phase 2 swaps this export for Supabase Auth.
import { createMockAuth } from '@/lib/auth/mockAuth'
import type { AuthService } from '@/lib/auth/types'

export type { AuthService, Session, User } from '@/lib/auth/types'
export { DEMO_USER } from '@/lib/auth/mockAuth'

export const auth: AuthService = createMockAuth()
