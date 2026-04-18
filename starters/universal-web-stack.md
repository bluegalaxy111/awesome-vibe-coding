# Starter Kit: Universal Web Stack

This kit perfectly aligns **Cursor / Windsurf** IDEs with strict web standards (TypeScript, Next.js/React, Tailwind), ensuring the AI doesn't hallucinate messy `any` types or deprecated React class components.

## 1. Directory Setup
Use your standard scaffolding tool:
```bash
npx -y create-next-app@latest ./
mkdir -p .cursor/rules
touch .cursor/rules/global.mdc
```

## 2. The Core AI Governor (`.cursor/rules/global.mdc`)
Paste this precisely into the `.mdc` file. It automatically triggers for all `.ts` and `.tsx` files.

```markdown
---
description: Universal TypeScript Constraints
globs: *.ts, *.tsx
---

## 1. Absolute Type Safety
- You may not use `any`. Use `unknown` or strictly type the object.
- You must prefix boolean variable names with `is`, `has`, or `should`.

## 2. Server Components Default
- React Server Components are the default. 
- Only add `"use client"` when standard React hooks (`useState`, `useEffect`) or browser APIs (`window.innerHeight`) are unavoidable. Keep client components as small leaf nodes in the tree.

## 3. Tailwind Constraints
- Do not use inline `style={{}}`. You must use standard Tailwind CSS utility classes.
- Group related classes logically (layout, spacing, typography, colors).
```

## 3. Execute Vibe Workflow
1. Open the project in Cursor.
2. Hit `Cmd+I` (Composer).
3. Type: *"Follow `@global.mdc`. Scaffold a Dashboard layout component with a left-hand navigation sidebar."*
