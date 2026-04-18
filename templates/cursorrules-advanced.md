# Advanced `.cursorrules` Template (TypeScript/React/Next.js)

*(Note: As of early 2026, creating a single massive `.cursorrules` file is considered an anti-pattern for large apps. Instead, utilize the `.cursor/rules/` directory context engine. You can copy-paste the snippet below into a file named `.cursor/rules/global.mdc` to govern core behavior.)*

```markdown
---
description: Global architectural guidelines and coding standards for all TypeScript files
globs: *.ts, *.tsx
---

# Global Architectural Constraints

You are an expert Senior Software Engineer writing robust, production-ready TypeScript code. You must adhere to the following rules absolutely.

## 1. Type Safety & Branding
- Never use `any`. Use `unknown` if the type is truly unknowable.
- Do not pass raw strings as IDs. Use Branded Types to prevent cross-contamination of database IDs.
- **Example:**
  ```typescript
  // GOOD:
  export type UserId = string & { readonly brand: unique symbol };
  export type OrderId = string & { readonly brand: unique symbol };
  ```

## 2. Error Handling (The Result Pattern)
- Do NOT throw raw exceptions in asynchronous business logic. 
- All data-fetching and complex operations must return a `Result` type.
- **Example:**
  ```typescript
  type Success<T> = { success: true; data: T };
  type Failure = { success: false; error: Error };
  type Result<T> = Success<T> | Failure;

  // GOOD:
  async function fetchUser(id: UserId): Promise<Result<User>> {
    try {
      const data = await db.fetch(id);
      return { success: true, data };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e : new Error(String(e)) };
    }
  }
  ```

## 3. Cognitive Load & Early Returns
- Never nest `if` statements more than two levels deep.
- Use early returns/guard clauses at the top of functions to handle edge cases immediately.

## 4. UI/Component Philosophy (React/Next.js)
- Server Components by default. Add `"use client"` only at the absolute leaf nodes of the component tree where interactivity (useState/useEffect) is strictly required.
- Do not use generic names like `data` or `val`. Formulate boolean variable names clearly with `is`, `has`, or `should` (e.g., `isModalOpen`, `hasAdminRights`).

## 5. Review Gate
Before you output code, silently review your proposed changes against points 1-4. If your code violates any point, rewrite it before presenting it to the user.
```
