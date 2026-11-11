# BotAI Console

Scalable website starter: **Vite + React + TypeScript + Tailwind v4 + shadcn/ui + React Router**.

```bash
npm install
npm run dev
```

## Structure

```
.claude/skills/      # design-system, one-line-comments, folder-structure, shadcn-ui
src/
  app/               # root component, router, providers
  pages/             # one thin file per route (lazy-loaded)
  features/          # domain folders with a public index.ts
  components/
    ui/              # shadcn/ui primitives
    layout/          # header, footer, container
    shared/          # reusable app components
  hooks/ lib/ config/ types/
  styles/globals.css # design tokens (light + dark)
```

See `CLAUDE.md` and `.claude/skills/*/SKILL.md` for the conventions.
