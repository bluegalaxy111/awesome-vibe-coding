# 02. Architecture Scaffolding Prompts

*(Use these prompts when starting a new feature or scaffolding the foundational layers of a codebase.)*

---

## Recipe: The "Plan First, Code Later" Prompt
**Why it works:** Prevents the AI from blindly generating thousands of lines of code with the wrong architecture. Particularly powerful with Google Antigravity or OpenAI Codex.

```text
[GOAL]
Create the architecture and implementation plan for the [INSERT FEATURE NAME] feature.

[CONTEXT]
We are building a [INSERT APP DESCRIPTION]. 
The core stack is [INSERT TECH STACK].

[CONSTRAINTS]
1. Do not write any functional code yet.
2. Rely strictly on best practices for [INSERT TECH STACK].
3. Ensure the design adheres to an early-return style and modular separation of concerns.

[OUTPUT CONTRACT]
Generate an `implementation_plan.md` artifact detailing:
- The exact file tree changes required.
- The data schemas or type definitions needed.
- A step-by-step ordered list of how we will build this feature.

Wait for my explicit approval on this document before acting.
```

---

## Recipe: The Data-First Schema Prompt
**Why it works:** UI is cheap; data is expensive. Forcing the AI to define the data models first ensures the entire app logic flows correctly.

```text
[GOAL]
Define the exact database schemas and types required for the updated implementation plan.

[CONTEXT]
Refer to the current `implementation_plan.md` and the existing files in the `/types/` or `/db/` directories.

[CONSTRAINTS]
1. Use branded types/aliases for all ID fields (e.g., UserId, OrganizationId) to prevent cross-contamination.
2. Explicitly define all relational keys.
3. If applicable, define the schema in the syntax of our chosen ORM/database framework.

[OUTPUT CONTRACT]
Output the exact schema modifications. Briefly explain your indexing choices and any potential performance bottlenecks this schema might cause as data scales to 1M rows.
```
