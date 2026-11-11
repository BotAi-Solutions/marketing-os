---
name: one-line-comments
description: Commenting convention, with a one-line purpose comment at the top of every file and above non-obvious functions. Use whenever creating or editing any source file in this project.
---

# One-Line Comments

Every hand-written file explains itself in **one line** at the very top. Comments say *why* or *what for*, never restate the code.

## Rules

1. **File header (required).** Line 1 of every `.ts`, `.tsx` and `.css` file is a single comment stating the file's purpose.
   ```tsx
   // Sticky top bar with brand, primary nav and theme toggle.
   ```
   ```css
   /* Design system source of truth: semantic color, radius and font tokens. */
   ```
2. **Function comments (when non-obvious).** Put one line directly above helpers, handlers and effects whose intent is not obvious from the name.
   ```ts
   // Reads the saved theme, tolerating blocked storage.
   function readStoredTheme(): Theme { ... }
   ```
   Skip it for self-explanatory exported components such as `export function SiteFooter()`, where the file header already covers it.
3. **One line only.** If it needs a paragraph, the code needs splitting or renaming instead. No JSDoc blocks unless a public library API demands it.
4. **Explain intent, not mechanics.**
   - ✅ `// Toggles the .dark class that globals.css keys dark tokens off.`
   - ❌ `// Call classList.toggle with dark`
5. **No dead-code or changelog comments.** No commented-out code, `// added by X`, or `// fixed bug`. Git keeps history.
6. **TODOs** use `// TODO(owner): action`, one line, actionable.
7. **Keep them true.** When you change what a file or function does, update its comment in the same edit.

## Exemptions

- `src/components/ui/**` holds shadcn-generated code. Leave it as generated so `shadcn add --overwrite` diffs stay clean.
- Config and JSON files that cannot hold comments (`package.json`, `components.json`).

## Checklist before finishing an edit

- [ ] New file has a line-1 purpose comment
- [ ] Changed behaviour has an updated comment
- [ ] No multi-line comment blocks were introduced
