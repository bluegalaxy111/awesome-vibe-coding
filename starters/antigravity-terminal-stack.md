# Starter Kit: Antigravity Terminal Stack

This is the exact configuration structure to use when pairing **Google Antigravity** with a local CLI codebase. Because Antigravity is a profoundly powerful concurrent execution agent, you do not need 30 different `.cursorrules` files. You need a strict "Planning Policy."

## 1. Directory Setup Commands
Run this to scaffold your blank Antigravity environment:
```bash
mkdir my-antigravity-project && cd my-antigravity-project
git init
mkdir .antigravity
touch .antigravity/policy.md
touch STACK.md
```

## 2. Global Constraints (`.antigravity/policy.md`)
Unlike legacy LLMs, Antigravity follows constraints absolutely. Paste this into your policy file:

```markdown
# Antigravity Execution Policy

## 1. Mandatory Planning Mode
- For any user request involving more than 1 file, you MUST enter Planning Mode.
- You must generate an `implementation_plan.md` artifact.
- You must WAIT for explicit user approval before executing `run_command` or `replace_file_content`.

## 2. Concurrent Execution Protocol
- When verifying code, run `npm test` and `npx eslint` concurrently using bash background tasks or array tool calls if permitted.
- Never use `sed`. Always use precise `replace_file_content` via targeted Line Numbers.

## 3. The "Test Sandbox" Rule
- If you encounter a complex bug, create a file in `scratch/*.js`, write a minimal test case, run it in the terminal, and verify the fix works before modifying the main project files.
```

## 3. Execute Vibe Workflow
1. Start Antigravity in your terminal / IDE integration.
2. Prompt: *"I have setup the policy in `.antigravity/policy.md`. Read it. I want to build a [INSERT APP NAME] using [INSERT FRAMEWORK]. Begin the Planning Phase."*
