// The one place that picks the backend; phase 2 swaps this export for a Supabase repository.
import { createMockRepository } from '@/lib/data/mockRepository'
import type { Repository } from '@/lib/data/repository'

export type { LookupItem, Repository, Row } from '@/lib/data/repository'

export const repository: Repository = createMockRepository()
