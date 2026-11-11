# Botai Console

One place to plan, create, test, publish and optimize marketing content.

```
Plan (Campaign) → Create (Hooks + Prompts) → Test (Variants under an Experiment)
  → Publish → Measure (Metrics Log) → Learn (winner feeds the Hook Library)
```

**Phase 1** (this repo today) is the complete UI running on local mock data. **Phase 2** swaps in Supabase without touching UI code.

Stack: Vite, React 19, TypeScript (strict), Tailwind v4, shadcn/ui (Radix, Nova), React Router, TanStack Query, sonner.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run lint       # oxlint
```

You are signed in automatically as a demo user. After signing out, any email plus a 6+ character password signs you back in. Data lives in your browser's `localStorage`. To start over, open the user menu at the bottom of the sidebar and choose **Reset demo data**.

## Architecture

```
            ┌──────────────────────────── UI ─────────────────────────────┐
            │ pages/Dashboard  pages/SectionPage  components/data/*       │
            └──────────────┬───────────────────────────────┬──────────────┘
                 reads the registry               calls hooks only
                           │                               │
  lib/schema/sections.ts ◄─┘           hooks/useRecords.ts (React Query)
  (15 sections, fields,                                    │
   formulas, relations)                     lib/data/index.ts → repository
                           ▲                               │
                           └──────── mockRepository.ts ◄───┘   ← phase 2: supabaseRepository.ts
                                     (localStorage + seed.ts)
```

### 1. Schema registry: the single source of truth

`src/lib/schema/sections.ts` describes every section: its URL key, table name, labels, icon, sidebar group, title label, status field, board flag and fields. The types live in `src/lib/schema/types.ts`.

| Field type | Stored as | Notes |
|---|---|---|
| `text` `url` `email` `date` | `string \| null` | dates are `YYYY-MM-DD` |
| `longtext` | `string \| null` | `monospace` / `copyable` options |
| `number` | `number \| null` | `default`, `format: 'currency'` |
| `checkbox` | `boolean` | |
| `select` / `multiselect` | `string` / `string[]` | `options` |
| `rating` | `number` 1–5 | |
| `relation` (single) | `<name>_id: string \| null` | FK in phase 2 |
| `relation` (many) | `<name>: string[]` of ids | junction table in phase 2 |
| `formula` | **not stored** | computed on read; `sql` holds the matching generated-column expression |

Every record also has `id` (uuid), `title`, `created_at` and `updated_at`.

The sidebar, routes, table columns (`table: true`, at most 5), record-sheet inputs, board columns (the status options) and dashboard bars are all generated from the registry. There are no per-section pages.

### 2. Repository: the swappable backend

```ts
// src/lib/data/repository.ts
interface Repository {
  list(sectionKey): Promise<Row[]>                              // formulas computed
  save(sectionKey, id | null, values: Partial<Row>): Promise<Row> // null = create; partial updates
  remove(sectionKey, id): Promise<void>                          // clears references elsewhere
  lookup(sectionKey): Promise<{ id; title }[]>                   // for relation pickers
  resetDemoData?(): Promise<void>                                // mock only
}
```

`src/lib/data/mockRepository.ts` keeps an in-memory store persisted to `localStorage`. It adds about 150 ms of latency so loading states are real, and it seeds from `seed.ts`. Deleting a record also nulls single relations and strips it from many-relation arrays, mirroring `on delete set null` and junction cascades. `src/lib/data/index.ts` exports the one `repository` the app uses.

### 3. Hooks: the only door into data

`src/hooks/useRecords.ts` provides `useRows`, `useSaveRow` (with optimistic updates and rollback), `useDeleteRow`, `useLookup`, plus `useManyRows` for the dashboard and backlinks. UI components never touch `localStorage` or the repository directly.

### 4. Auth behind an interface

`src/lib/auth/types.ts` defines `AuthService` (`signIn`, `signOut`, `getSession`, `onChange`). `mockAuth.ts` auto-signs-in a demo user. `RequireAuth` guards every route except `/login`, and signing out clears the query cache.

### Record pages: edit with a live preview, or read

Clicking a row or board card opens `/<section>/<id>`; **New** opens `/<section>/new`.

- **Edit** (default): the form on the left and a live preview on the right that updates as you type, including formulas. Below `lg` the preview is hidden in Edit mode, and **Read** shows it.
- **Read**: the content as it will ship, plus a Details sidebar with metadata and linked records.
- The sticky header has a breadcrumb, a status picker, the Edit/Read toggle (remembered), Delete and Save (also ⌘S / Ctrl+S).
- Unsaved edits are guarded on in-app navigation (a confirm dialog) and on browser reload or close.
- Each section's `preview` kind in the registry picks the renderer: `linkedin` (feed post with "see more" fold), `article` (search-result snippet with length checks, then the rendered Markdown `body`), `landing` (browser-framed hero), `caseStudy`, `prompt` (with `{{variables}}` highlighted), or `document` (generic, built from fields).
- Markdown is rendered by a small built-in renderer that never injects HTML.

### Status colors

`src/lib/status.ts` → `statusTone(status)` is the one mapping used by badges, board column headers and dashboard bars. It is the only file that uses palette colors, and it includes dark-mode variants. Everything else uses design tokens from `src/styles/globals.css`.

## Folder layout

```
src/
  app/            App, router, RequireAuth, providers/ (Theme, Auth, QueryClient, Toaster)
  pages/          Dashboard, SectionPage (list for all 15 sections), RecordPage (/:section/:id), Login, NotFound
  components/
    data/         DataTable, KanbanBoard, FieldInput, FieldDisplay, RelationPicker, RelationLinks, StatusBadge, Backlinks
    record/       RecordForm (editor column), DetailsPanel (read-mode sidebar)
    preview/      RecordPreview → LinkedIn / Article / Landing / CaseStudy / Prompt / Document previews, Markdown
    dashboard/    FillChecklist, KpiCards, MetricsSummary, StatusBars
    layout/       AppShell, Sidebar, BrandMark
    shared/       PageHeader, States, SectionIcon, Toaster, FullPageSpinner
    ui/           shadcn/ui primitives (generated)
  config/         dashboard.ts (checklist targets, KPI rules)
  hooks/          useRecords, useRecordEditor, useAuth, useTheme, usePersistentState
  lib/
    schema/       types, field builders, sections registry, helpers
    data/         repository interface, mockRepository, seed, index (the swap point)
    auth/         AuthService interface, mockAuth, index (the swap point)
    status.ts     status → color mapping
    format.ts     number/date/url formatters
  styles/         globals.css design tokens
```

## How to add a field

1. Add it to the section's `fields` in `src/lib/schema/sections.ts` using a builder, e.g. `text('utm_campaign')`, `select('tier', ['A', 'B'])`, `one('owner_id', 'people')`, `many('tags', 'tags')`.
2. Add `{ table: true }` if it should be a table column (at most 5), or `{ group: 'Content' | 'Performance' | 'Links' }` to move it in the record sheet.
3. For a computed value, use `formula(name, 'percent' | 'currency' | 'number', sqlExpression, (row) => …)`.
4. Optionally add sample values in `seed.ts`, then use **Reset demo data**.

That's it. The table, sheet, filters and dashboard pick it up automatically.

## How to add a section

1. Append a `SectionDef` to `sections` with a unique `key` (the URL slug), `table`, labels, `icon` (add the lucide icon to `IconName` in `types.ts` and to `components/shared/SectionIcon.tsx`), `group`, `statusField`, `board`, and optionally a `preview` kind.
2. Add seed rows under the same key in `seed.ts`.
3. Optionally add a checklist target in `src/config/dashboard.ts`.

The sidebar link, routes `/<key>` and `/<key>/<id>`, table, board, record page and dashboard bar appear automatically. For a bespoke preview, add a component in `components/preview/` and a `PreviewKind`.

## Phase 2: Supabase

The `.env` already holds `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (typed in `src/types/env.d.ts`). Only the publishable key may be used in the browser.

1. **Schema.** Generate migrations from the registry. For each section, create a table named `section.table` with `id uuid primary key default gen_random_uuid()`, `title text not null`, and `created_at`/`updated_at timestamptz`.
   - `select` → `text` with a `check (col in (...))` constraint, or an enum
   - `multiselect` → `text[]`
   - single relation → `<name>_id uuid references <target> on delete set null`
   - many relation → junction table `<table>_<name>(<table>_id, <target>_id)` with `on delete cascade`
   - `formula` → `generated always as (<field.sql>) stored`
   - enable RLS on every table and add policies
2. **Repository.** Write `src/lib/data/supabaseRepository.ts` implementing `Repository`:
   - `list`: select the columns and aggregate junction ids back into `string[]`, so rows keep the same shape
   - `save`: insert or update the scalar columns, then sync junction rows for any many-relation in `values`
   - `remove`: delete the row; the FKs and cascades handle the rest
   - `lookup`: `select id, title`
   - leave `resetDemoData` undefined, which hides the menu item
3. **Auth.** Write `src/lib/auth/supabaseAuth.ts` implementing `AuthService` with `signInWithPassword`, `signOut`, `getSession` and `onAuthStateChange`. Remove `DEMO_USER` and the demo hint from `pages/Login.tsx`.
4. **Swap.** Change the single export in `src/lib/data/index.ts` and in `src/lib/auth/index.ts`. Nothing under `components/` or `pages/` changes.

Out of scope for phase 1: real auth, file uploads (assets keep a `link`), Notion import, scheduling and automation, AI generation, multi-user.
