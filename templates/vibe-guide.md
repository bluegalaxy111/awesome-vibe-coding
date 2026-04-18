# The Internal Team "Vibe Guide"

*(As AI coding adoption skyrockets, engineering managers must establish team-wide rules on how and when to use AI. Copy and paste this template into an internal Notion/Confluence page to standardize your team's AI workflow.)*

---

# 🤖 Engineering Policy: Using AI Coding Tools

To ensure our codebase remains maintainable, secure, and understandable by humans, all developers must adhere to the following guidelines when using AI tools (Cursor, Copilot, OpenCode, etc.).

## 1. The Rule of Understanding
**You are strictly forbidden from committing code that you cannot explain.**
If an AI agent generates a 300-line PR and you do not understand the underlying logic, you cannot push it to `main`. You are the engineer; the AI is the typist. You own the bugs.

## 2. When to Use Which Tool
- **Initial Prototyping & Boilerplate:** Use App Builders (v0 for UI components) to speed up scaffolding. Do not push un-refactored generated components directly to production without wiring them into our design system tokens.
- **Complex Refactoring & Architecture:** Use our approved IDE (Cursor) using the "Composer" feature. Ensure the AI strictly references our `.cursor/rules/global.mdc` architecture guidelines.

## 3. Reviewing AI Pull Requests
Code Review standards remain exactly the same. Do not give a "LGTM" to an AI-heavy PR simply because "the AI wrote it so it's probably fine." AI frequently introduces subtle race conditions or ignores edge-case null checks. Review the logic manually.

## 4. Data Privacy
- **Never** paste production database dumps, customer PII (Personally Identifiable Information), or `.env` production secrets into an AI chat window or an AI Cloud builder.
- Ensure your IDE is logged into the Enterprise tier to enforce our zero-data-retention (SOC 2) data agreements with the AI provider.

## 5. Required File Checks
When assigning a large task to a Terminal Agent (like Claude Code or OpenHands), you must require it to run the automated test suite and standard linter before it submits the PR.
