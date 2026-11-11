// The single status → color mapping used by badges, board columns and dashboard bars (the only place with palette colors).

export type StatusTone = 'gray' | 'amber' | 'purple' | 'green' | 'orange' | 'muted'

const TONE_BY_STATUS: Record<string, StatusTone> = {}
const assign = (tone: StatusTone, statuses: string[]) => statuses.forEach((s) => (TONE_BY_STATUS[s.toLowerCase()] = tone))

assign('gray', ['Idea', 'Draft', 'Inbox', 'New', 'Planned', 'Planning', 'Not checked', 'Not requested', 'Discovered'])
assign('amber', [
  'Brief',
  'Drafting',
  'Testing',
  'Running',
  'Exploring',
  'Validating',
  'In review',
  'Pending',
  'Requested',
  'Company enriched',
  'Contact matched',
  'Email found',
])
assign('purple', ['AI Review', 'Analyzing', 'Measuring', 'Scheduled', 'Reviewed', 'Email verified', 'Researched', 'Anonymize'])
assign('green', [
  'Approved',
  'Published',
  'Active',
  'Proven',
  'Shipped',
  'Concluded',
  'Verified',
  'Received',
  'Done',
  'Completed',
  'Used in content',
  'Approved to publish',
  'Ready for outreach',
])
assign('orange', ['Paused', 'Needs refresh', 'Risky', 'Missing'])
assign('muted', ['Retired', 'Archived', 'Parked', 'Ignored', 'Abandoned', 'Excluded', 'Invalid', 'Not applicable'])

type ToneClasses = { badge: string; dot: string; bar: string }

const TONE_CLASSES: Record<StatusTone, ToneClasses> = {
  gray: {
    badge: 'border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    dot: 'bg-zinc-400 dark:bg-zinc-500',
    bar: 'bg-zinc-400 dark:bg-zinc-500',
  },
  amber: {
    badge: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300',
    dot: 'bg-amber-500 dark:bg-amber-400',
    bar: 'bg-amber-400 dark:bg-amber-500',
  },
  purple: {
    badge:
      'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300',
    dot: 'bg-violet-500 dark:bg-violet-400',
    bar: 'bg-violet-500 dark:bg-violet-400',
  },
  green: {
    badge:
      'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300',
    dot: 'bg-emerald-500 dark:bg-emerald-400',
    bar: 'bg-emerald-500 dark:bg-emerald-400',
  },
  orange: {
    badge:
      'border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300',
    dot: 'bg-orange-500 dark:bg-orange-400',
    bar: 'bg-orange-500 dark:bg-orange-400',
  },
  muted: {
    badge: 'border-border bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground/40',
    bar: 'bg-muted-foreground/25',
  },
}

// Strips pipeline numbering ("3 Contact matched" → "contact matched") before matching.
const normalize = (status: string) => status.replace(/^\d+\s+/, '').trim().toLowerCase()

export function statusTone(status: string | null | undefined): ToneClasses & { tone: StatusTone } {
  const tone = status ? (TONE_BY_STATUS[normalize(status)] ?? 'gray') : 'muted'
  return { tone, ...TONE_CLASSES[tone] }
}
