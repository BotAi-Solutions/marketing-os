---
name: shadcn-ui
description: How to add, use, compose and customize shadcn/ui components (Radix base, Nova preset, Tailwind v4) in this project. Use whenever building UI, needing a button/dialog/form/table/etc., or editing files in src/components/ui.
---

# shadcn/ui

shadcn/ui is **copied into the repo**, not installed as a library. The components live in `src/components/ui/` and belong to us.

Config is in `components.json`: style `radix-nova`, base color `neutral`, icons `lucide`, CSS `src/styles/globals.css`.

## Adding components

```bash
npx shadcn@latest add dialog            # one
npx shadcn@latest add dropdown-menu sheet tabs   # several
npm run ui:add -- tooltip               # same, via script
```

Check `src/components/ui/` before adding. If a component already exists, reuse it. Browse the catalogue at https://ui.shadcn.com/docs/components.

## Using components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Button variant="outline" size="sm">Cancel</Button>
<Button asChild><Link to="/contact">Contact</Link></Button>   // asChild renders the child element
```

- Pick an existing `variant` / `size` before writing custom classes. Button variants: `default | outline | secondary | ghost | destructive | link`.
- Use `asChild` to give router links or anchors button styling. Never nest `<a>` inside `<button>`.
- Merge classes with `cn()` from `@/lib/utils`. A caller's `className` wins over defaults.
- Icons go inside as children (`<Button><ArrowRight /> Next</Button>`). The component sizes them.

## Customizing

| Want | Do |
|---|---|
| Different look everywhere | Change tokens in `globals.css` (see design-system skill) |
| New variant used app-wide | Add it to the component's `cva` `variants` in `src/components/ui/<x>.tsx` |
| One-off tweak | Pass `className` at the call site |
| App-specific composite (e.g. `PageHeader`, `ThemeToggle`) | Build it in `src/components/shared/` **from** ui primitives. Don't put it in `ui/` |

## Rules

- `src/components/ui/` contains only shadcn primitives. App logic, data fetching and feature imports never go there.
- Keep the generated code style intact (no reformatting, no header comments), so `npx shadcn add <x> --overwrite` produces readable diffs when upgrading.
- Never hard-code colors in variants. Use token utilities (`bg-primary`, `text-muted-foreground`).
- Keep accessibility: keep Radix props, `aria-*` and `sr-only` labels. Icon-only buttons need `aria-label`.
- Forms: use `Input`, `Label`, `Field` etc. from ui. For complex validation, add `npx shadcn add form` (react-hook-form + zod).
- Lint: `src/components/ui/**` has `react/only-export-components` disabled in `.oxlintrc.json`, because shadcn co-exports `cva` variants.
