# BotAI Console

Vite 8 + React 19 + TypeScript + Tailwind v4 + shadcn/ui (Radix, Nova preset) + React Router.

## Project skills (`.claude/skills/`)

Load the matching skill before working:

- **design-system**: any styling, colors, typography, spacing, theming
- **one-line-comments**: every file created or edited
- **folder-structure**: creating files, pages and features; deciding where code lives
- **shadcn-ui**: adding, using or customizing UI components

## Commands

- `npm run dev` starts the dev server
- `npm run build` type-checks and builds
- `npm run lint` runs oxlint
- `npm run typecheck` runs tsc only
- `npx shadcn@latest add <component>` adds a UI primitive

## Supabase

- Client: `@/lib/supabase` (one shared instance). Env vars are validated in `src/config/env.ts`.
- Copy `.env.example` → `.env`. Only the publishable key belongs in the browser, never the secret/service_role key.
- SQL lives in `supabase/migrations/`. Every table gets RLS enabled plus explicit policies.
- Queries go in `features/<name>/api/`, never inside components.

## Non-negotiables

- Import via `@/…`, never relative `../`.
- Named exports only, kebab-case filenames.
- No hard-coded colors. Use design tokens.
- Line 1 of every hand-written file is a one-line purpose comment.
