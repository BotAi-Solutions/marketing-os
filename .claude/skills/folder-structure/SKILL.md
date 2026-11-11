---
name: folder-structure
description: Where code goes and how the project scales, covering feature folders, import rules, naming and when to extract. Use when creating files, adding a page or feature, moving code, or deciding where something belongs.
---

# Folder Structure & Scaling

```
src/
├── app/                  # App wiring only: root component, router, providers
│   ├── app.tsx
│   ├── router.tsx        # Every route, each page lazy-loaded
│   └── providers/        # Global context providers (theme, query client, auth…)
├── pages/                # One file per route; thin, composes features + layout
├── features/             # Business domains, one folder each
│   └── <feature>/
│       ├── components/   # UI used only by this feature
│       ├── api/          # Network calls for this feature
│       ├── hooks/        # Feature-specific hooks (optional)
│       ├── types.ts      # Feature-owned types
│       └── index.ts      # Public API: the ONLY import entry for other code
├── components/
│   ├── ui/               # shadcn/ui primitives (generated, see shadcn-ui skill)
│   ├── layout/           # Page shell: header, footer, container, sidebar
│   └── shared/           # App-specific reusable pieces used by 2+ features
├── hooks/                # Cross-feature hooks
├── lib/                  # Framework-agnostic helpers (cn, formatters, fetch client)
├── config/               # Static config: site metadata, nav, env parsing
├── types/                # Types shared across features
└── styles/globals.css    # Design tokens (see design-system skill)
```

## Dependency direction (enforced by convention)

```
app → pages → features → components/shared → components/ui → lib
                    ↘ hooks, config, types ↙
```

- Lower layers **never** import from higher ones: `components/ui` never imports a feature, and `lib` never imports React components.
- **Features never import from other features' internals.** Use `@/features/<name>` (its `index.ts`) only. If two features need the same thing, move it down to `components/shared`, `hooks` or `lib`.
- Pages hold no business logic. They lay out features inside `<Container>`.

## Naming

- Files and folders: `kebab-case` (`contact-form.tsx`, `use-theme.ts`).
- Components: `PascalCase` **named** exports (no default exports, so renames stay greppable).
- Hooks: `use-*.ts` exporting `useX`.
- Pages: `<name>-page.tsx` exporting `<Name>Page`.
- Imports: always the `@/` alias, never `../../`.

## Adding things

| Need | Do this |
|---|---|
| New page | `src/pages/<name>-page.tsx` → add a lazy route in `app/router.tsx` → add a nav link in `config/site.ts` if public |
| New feature | `src/features/<name>/` with `components/`, `index.ts`, and `api/` / `types.ts` as needed |
| New UI primitive | `npx shadcn add <component>` (see shadcn-ui skill) |
| Global state/provider | `app/providers/<name>-provider.tsx`, then compose it in `app/providers/index.tsx` |

## When to extract (scaling rules)

- **Rule of two**: code lives in its feature until a *second* feature needs it, then it moves to `components/shared` / `hooks` / `lib`.
- A file over ~200 lines or doing two jobs gets split.
- A feature with more than ~10 components gets sub-folders by sub-domain (`features/billing/invoices/…`).
- Context object and provider live in separate files (`theme-context.ts` + `theme-provider.tsx`) so fast refresh keeps working.
- Code-split by route: every route in `router.tsx` uses `lazy`, so features only ship to pages that use them.
- For server data at scale, add TanStack Query in `app/providers` and keep query hooks in `features/<name>/api/`.
