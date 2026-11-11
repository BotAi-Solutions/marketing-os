// Dashboard definitions: fill-in checklist targets and KPI rules, kept out of the components.
import { CONTENT_DONE } from '@/lib/schema'

/** Minimum records per section for the workspace to be "set up". */
export const CHECKLIST: { section: string; target: number }[] = [
  { section: 'pillars', target: 3 },
  { section: 'hooks', target: 10 },
  { section: 'case-studies', target: 1 },
  { section: 'linkedin-posts', target: 4 },
  { section: 'blogs', target: 5 },
  { section: 'ideas', target: 5 },
  { section: 'landing-pages', target: 1 },
  { section: 'website-content', target: 1 },
  { section: 'campaigns', target: 1 },
  { section: 'prompts', target: 3 },
  { section: 'experiments', target: 1 },
  { section: 'metrics', target: 1 },
]

export const CONTENT_SECTIONS = ['linkedin-posts', 'blogs', 'website-content', 'landing-pages'] as const

const done = new Set<string>(CONTENT_DONE)

export type KpiDef = {
  label: string
  /** Sections whose rows are counted; the first one is where the card links. */
  sections: readonly string[]
  /** Which status values count toward this KPI. */
  matches: (status: string | null) => boolean
  hint: string
}

export const KPIS: KpiDef[] = [
  { label: 'Active campaigns', sections: ['campaigns'], matches: (s) => s === 'Active', hint: 'Status is Active' },
  { label: 'Running experiments', sections: ['experiments'], matches: (s) => s === 'Running', hint: 'Status is Running' },
  {
    label: 'Content in pipeline',
    sections: CONTENT_SECTIONS,
    matches: (s) => !s || !done.has(s),
    hint: 'Posts, blogs, pages and landing pages not yet published',
  },
  { label: 'Proven hooks', sections: ['hooks'], matches: (s) => s === 'Proven', hint: 'Hooks that won an experiment' },
  { label: 'Ideas in inbox', sections: ['ideas'], matches: (s) => s === 'Inbox', hint: 'Waiting for triage' },
]

export const METRICS_WINDOW_DAYS = 30
