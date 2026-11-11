# Botai Console

Marketing OS UI. Stack: Vite 8, React 19, TypeScript (strict), Tailwind v4, shadcn/ui (Radix, Nova preset), React Router, TanStack Query, sonner. Phase 1 runs on mock data; phase 2 adds Supabase (see README).

## Project skills (`.claude/skills/`)

Load the matching skill before working:

- **design-system**: any styling, colors, typography, spacing, theming
- **one-line-comments**: every file created or edited
- **folder-structure**: creating files, adding sections/fields/pages, deciding where code lives
- **shadcn-ui**: adding, using or customizing UI components
- **supabase** / **supabase-postgres-best-practices**: phase 2 backend work

## Commands

- `npm run dev` starts the dev server
- `npm run build` type-checks and builds
- `npm run lint` runs oxlint
- `npm run typecheck` runs tsc only
- `npx shadcn@latest add <component>` adds a UI primitive

## Non-negotiables

- The registry (`src/lib/schema/sections.ts`) is the source of truth. Add fields/sections there, never as one-off pages.
- UI talks to data only through `src/hooks/useRecords.ts`. Never import `repository` or touch `localStorage` for records in components.
- The backend swap points are `src/lib/data/index.ts` and `src/lib/auth/index.ts`, and nothing else.
- Status colors come only from `statusTone()` in `src/lib/status.ts`. No other hard-coded colors.
- Import via `@/…`, never relative `../`. Named exports only.
- Line 1 of every hand-written file is a one-line purpose comment.
- Only the Supabase publishable key may be used in the browser.
