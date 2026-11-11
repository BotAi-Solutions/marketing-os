---
name: design-system
description: Rules for colors, typography, spacing, radius and theming in this project. Use whenever building or styling UI, adding a color, changing the theme, or reviewing visual consistency.
---

# Design System

The design system lives in **one file**: `src/styles/globals.css`. Every visual decision flows from its CSS variables.

## Token layers

1. **Raw values**: `:root` (light) and `.dark` (dark) define OKLCH values such as `--primary: oklch(0.205 0 0)`.
2. **Tailwind mapping**: `@theme inline` exposes them as utilities (`--color-primary` → `bg-primary`, `text-primary`).
3. **Components** use only the semantic utilities, never raw values.

## Semantic color tokens

| Token | Use for |
|---|---|
| `background` / `foreground` | Page surface and body text |
| `card`, `popover` (+ `-foreground`) | Raised surfaces |
| `primary` (+ `-foreground`) | Main call to action, one per view |
| `secondary` (+ `-foreground`) | Secondary actions, chips |
| `muted` / `muted-foreground` | Subtle fills, helper text |
| `accent` (+ `-foreground`) | Hover and selected states |
| `success`, `warning`, `destructive` | Status feedback |
| `border`, `input`, `ring` | Lines, field borders, focus rings |

## Rules

- **Never hard-code colors.** Don't use `bg-blue-500`, `#fff`, or `rgb()` in components. If a token is missing, add it (below).
- **One exception: status colors.** `src/lib/status.ts` → `statusTone(status)` maps every status to a tone (gray, amber, purple, green, orange, muted) with light and dark classes. Badges, board column headers and dashboard bars must use it. To color a new status, add it to that file, never inline.
- **Always pair surfaces with their foreground**: `bg-primary text-primary-foreground`.
- **Dark mode is automatic.** Tokens swap under `.dark`, so don't write `dark:` color overrides in feature code.
- **Radius**: use `rounded-sm|md|lg|xl`. They derive from `--radius`, so change `--radius` to restyle globally.
- **Typography**: `font-heading` for headings and `font-sans` (Geist) for body. Scale: `text-xs` (labels, legends), `text-sm` (body in app UI), `text-xl` (sheet title), `text-2xl` (page title via `<PageHeader>`). Add `tracking-tight` on headings and `tabular-nums` on numbers.
- **Spacing**: stick to the Tailwind 4px scale. Use `gap-*` / `space-y-*` between siblings, not margins on children. Pages use `space-y-6 px-4 py-6 sm:px-6 lg:py-8`, cards inside use `gap-3`–`gap-6`.
- **Layout**: pages render inside `AppShell` (sidebar on `md+`, top bar + slide-out menu below). Start every page with `<PageHeader>`. Sidebar surfaces use the `sidebar-*` tokens. Every page must fit a 390px-wide viewport without horizontal page scroll; wide tables and boards scroll inside their own container.
- **Icons**: `lucide-react` only. Size them via the parent (shadcn sets `size-4`).

## Adding a new token

1. Add the light value under `:root` and the dark value under `.dark` (both are required).
2. Map it in `@theme inline`: `--color-<name>: var(--<name>);`.
3. If it is a surface, add a `<name>-foreground` pair with ≥ 4.5:1 contrast.
4. Check it in both themes (user menu → Theme).

## Re-theming

To rebrand, change only the values in `:root` / `.dark`. You can also generate a palette at https://ui.shadcn.com/themes and paste it over those blocks, keeping the `success`/`warning` additions.
