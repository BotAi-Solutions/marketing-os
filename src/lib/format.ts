// Display formatters for numbers, money, percentages, dates and URLs.

const numberFmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
const compactFmt = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })
const currencyWholeFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const percentFmt = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 2 })
const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatNumber = (v: number) => numberFmt.format(v)
export const formatCompact = (v: number) => compactFmt.format(v)
export const formatPercent = (v: number) => percentFmt.format(v)
// Whole dollars for large amounts, cents for small ones like cost per lead.
export const formatCurrency = (v: number) => (Math.abs(v) >= 1000 ? currencyWholeFmt : currencyFmt).format(v)

// Formats a YYYY-MM-DD date in local time (avoids the UTC off-by-one of new Date('YYYY-MM-DD')).
export function formatDate(value: string): string {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return value
  return dateFmt.format(new Date(y, m - 1, d))
}

// "https://www.example.com/blog/a-very-long-path" → "example.com/blog/a-very-lo…"
export function shortUrl(value: string, max = 32): string {
  try {
    const u = new URL(value)
    const text = (u.hostname.replace(/^www\./, '') + u.pathname).replace(/\/$/, '')
    return text.length > max ? `${text.slice(0, max - 1)}…` : text
  } catch {
    return value.length > max ? `${value.slice(0, max - 1)}…` : value
  }
}

// Today's local date as YYYY-MM-DD, offset by `days`.
export function isoDay(days = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Formats a computed formula value; null when the formula is blank (e.g. divide by zero).
export function formatFormula(format: 'percent' | 'currency' | 'number', value: unknown): string | null {
  if (typeof value !== 'number') return null
  if (format === 'percent') return formatPercent(value)
  if (format === 'currency') return formatCurrency(value)
  return formatNumber(value)
}
