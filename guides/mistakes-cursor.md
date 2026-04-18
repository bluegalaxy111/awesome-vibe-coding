# 5 Mistakes Everyone Makes with Cursor (and How to Fix Them)

Cursor is powerful, but throwing messy code at it guarantees messy results. Here are the top 5 mistakes developers make and the workflows to fix them.

## 1. Context Pollution (The "Too Many Tabs" Problem)
**The Mistake:** Opening 15 files and then asking Composer to "refactor the API." The AI tries to synthesize all 15 files into its context window, leading to hallucinated dependencies and bloated rewrites.
**The Fix:** Be ruthless with context. Close all tabs before pinging Composer. Use `@mentions` (e.g., `@src/api/auth.ts`) to actively control exactly what the AI reads. 

## 2. The "One-Shot App" Prompt
**The Mistake:** Entering a prompt like, *"Build a full e-commerce backend with Stripe, Postgres, and auth."* The AI will start strong, realize it's out of output tokens, and leave you with half-finished functions and missing imports.
**The Fix:** Think in atomic Git commits. 
- Prompt 1: "Define the Prisma schema for the e-commerce app." (Verify it)
- Prompt 2: "Write the Stripe webhook handler based on `@schema.prisma`." (Verify it)
- Prompt 3: "Add the Next.js API route to expose the Stripe handler."

## 3. Ignoring the Review Gate (`Cmd+Enter` Blindness)
**The Mistake:** Composer generates 300 lines of diffs. It looks generally green. You mash `Command+Enter` to accept all. Two days later, you realize it hallucinated a null-check away and introduced a race condition.
**The Fix:** AI is a junior developer; you are the senior reviewer. You must read the diffs. If the logic looks tangled, hit reject and prompt: *"This is too complex. Break this down and rewrite it using early returns."*

## 4. Ditching the CLI for Magic
**The Mistake:** Assuming Cursor will automatically fix integration issues without running the actual code.
**The Fix:** Cursor has a built-in terminal for a reason. Do not assign the next task until you have actually run `npm run test` or `npm run typecheck`. If it fails, copy the terminal output, `@mention` the failing file, and say: *"Fix the exact type error in the terminal."*

## 5. Working Without `.cursor/rules/`
**The Mistake:** Letting Cursor guess your coding standards every time you open a new chat. Your codebase ends up with 4 different styles of React components.
**The Fix:** Install a strict rules file. (See our `templates/cursorrules-advanced.md`). This forces the AI to strictly adhere to your architecture instantly.
