---
name: folder-structure
description: Where code goes and how the project scales, covering the schema registry, data/auth swap points, import rules, naming and when to extract. Use when creating files, adding a section, field or page, moving code, or deciding where something belongs.
---

# Folder Structure & Scaling

This app is **registry-driven**. All 15 sections share one generic page. New data shapes go in the registry, not in new pages.

```
src/
├── app/                    # Wiring only: App.tsx, router.tsx, RequireAuth.tsx
│   └── providers/          # ThemeProvider, AuthProvider (+ *Context.ts), index.tsx composes them + QueryClient + Toaster
├── pages/                  # Route components: Dashboard, SectionPage (list), RecordPage (/:section/:id, edit + live preview / read), Login, NotFound
├── components/
│   ├── data/               # Generic record UI driven by the registry: DataTable, KanbanBoard, FieldInput, FieldDisplay, RelationPicker, RelationLinks, StatusBadge
│   ├── record/             # Record page pieces: RecordForm (editor), DetailsPanel (read sidebar)
│   ├── preview/            # Live/read previews per registry `preview` kind + safe Markdown renderer
│   ├── dashboard/          # Dashboard widgets
│   ├── layout/             # AppShell, Sidebar, BrandMark
│   ├── shared/             # Small reusable pieces: PageHeader, States, SectionIcon, Toaster
│   └── ui/                 # shadcn/ui primitives (generated, see shadcn-ui skill)
├── config/                 # Static product config (dashboard checklist targets, KPI rules)
├── hooks/                  # useRecords (the ONLY data access for UI), useRecordEditor (draft/dirty/save), useAuth, useTheme, usePersistentState
├── lib/
│   ├── schema/             # Registry: types.ts, fields.ts (builders), sections.ts, index.ts (helpers)
│   ├── data/               # Repository interface, mockRepository, seed; index.ts = backend swap point
│   ├── auth/               # AuthService interface, mockAuth; index.ts = auth swap point
│   ├── status.ts           # statusTone(): the only status → color mapping
│   ├── format.ts           # Number/date/url formatters
│   └── utils.ts            # cn()
├── types/                  # Global ambient/shared types (env.d.ts, theme.ts)
└── styles/globals.css      # Design tokens (see design-system skill)
```

## Dependency direction (enforced by convention)

```
app → pages → components/{data,dashboard,layout,shared} → components/ui
                          ↓
                    hooks/useRecords → lib/data (repository) → lib/schema
```

- **UI never imports `@/lib/data` or `@/lib/auth` implementations.** Components use `hooks/useRecords.ts` and `hooks/useAuth.ts`. Types from `@/lib/schema` are fine everywhere.
- `lib/` never imports React components. `lib/schema` stays free of React (icons are names, mapped in `SectionIcon`).
- `components/ui` never imports app code.
- The backend swaps only in `lib/data/index.ts` and `lib/auth/index.ts`.

## Naming

- React components: `PascalCase.tsx` with **named** exports (`DataTable.tsx` → `export function DataTable`).
- Hooks: `useThing.ts` exporting `useThing`.
- Other modules: `camelCase.ts` (`mockRepository.ts`, `authContext.ts`).
- `components/ui/*` keeps shadcn's kebab-case filenames.
- Imports: always the `@/` alias, never `../../`.

## Adding things

| Need | Do this |
|---|---|
| New field | Add a builder call to the section in `lib/schema/sections.ts` (`text()`, `select()`, `one()`, `many()`, `formula()`…). Add sample values in `seed.ts` |
| New section | Append a `SectionDef` to `sections`, add its icon to `IconName` + `SectionIcon`, and seed rows under the same key. The route, sidebar and dashboard update automatically |
| New preview layout | Add a `PreviewKind` in `types.ts`, a component in `components/preview/`, a case in `RecordPreview.tsx`, then set `preview` on the section |
| New field type | Extend `FieldDef` in `types.ts`, then handle it in `FieldInput`, `FieldDisplay`, `DataTable.sortValue` and `defaultValue()` |
| Bespoke page (not a section) | `pages/<Name>.tsx` plus a lazy route in `app/router.tsx` *above* the `:sectionKey` route |
| New UI primitive | `npx shadcn@latest add <component>` (see shadcn-ui skill) |
| Global provider | `app/providers/<Name>Provider.tsx` + `<name>Context.ts`, composed in `app/providers/index.tsx` |

## Scaling rules

- **Generic first.** If a need applies to more than one section, express it in the registry (e.g. `backlinks`) and handle it once in `components/data`.
- **Rule of two.** Code lives next to its single user until a second user needs it, then it moves down to `shared/`, `hooks/` or `lib/`.
- A file over ~250 lines or doing two jobs gets split.
- Context object and provider live in separate files so fast refresh keeps working.
- Every route is `lazy` so pages code-split.
