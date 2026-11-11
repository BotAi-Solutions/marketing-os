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
- **Always pair surfaces with their foreground**: `bg-primary text-primary-foreground`.
- **Dark mode is automatic.** Tokens swap under `.dark`, so don't write `dark:` color overrides in feature code.
- **Radius**: use `rounded-sm|md|lg|xl`. They derive from `--radius`, so change `--radius` to restyle globally.
- **Typography**: `font-heading` for headings and `font-sans` (Geist) for body. Scale: `text-sm` (meta), `text-base` (body), `text-xl` (section heading), `text-3xl sm:text-4xl` (page title). Add `tracking-tight` on headings.
- **Spacing**: stick to the Tailwind 4px scale. Use `gap-*` / `space-y-*` between siblings, not margins on children. Page sections use `py-16`, and stacks inside a section use `space-y-4`.
- **Layout width**: wrap page content in `<Container>` (`src/components/layout/container.tsx`), never ad-hoc `max-w-*`.
- **Icons**: `lucide-react` only. Size them via the parent (shadcn sets `size-4`).

## Adding a new token

1. Add the light value under `:root` and the dark value under `.dark` (both are required).
2. Map it in `@theme inline`: `--color-<name>: var(--<name>);`.
3. If it is a surface, add a `<name>-foreground` pair with ≥ 4.5:1 contrast.
4. Add it to the swatch list in `src/pages/home-page.tsx` so it is visible.

## Re-theming

To rebrand, change only the values in `:root` / `.dark`. You can also generate a palette at https://ui.shadcn.com/themes and paste it over those blocks, keeping the `success`/`warning` additions.
