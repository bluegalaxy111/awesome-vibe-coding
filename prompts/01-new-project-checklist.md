# 01. The New Project Checklist

*(If you are starting a new project, run through this markdown checklist immediately. Check these boxes off before you write a single line of code.)*

```markdown
# 🚀 Universal AI Coding Checklist

## Phase 1: The Context Setup
- [ ] **Create the System Prompt:** I have added the appropriate `.cursorrules` or `CLAUDE.md` to the root directory for my selected AI tool.
- [ ] **Define the Stack Explicitly:** I have created a `STACK.md` file listing exactly what languages, frameworks, and specific database/API versions I am using so the AI does not hallucinate outdated docs.
- [ ] **Initialize Git:** `git init`. I have made my first empty commit.

## Phase 2: The Agentic Planning (Crucial for Antigravity & Claude)
- [ ] **Create `implementation_plan.md`:** I have forced the AI to write out the data schema and folder structure *before* generating code.
- [ ] **Human Review Gate:** I have manually read the `implementation_plan.md` and approved the data structures.

## Phase 3: The Execution Loop (The 70/30 Rule)
- [ ] **Atomic Tasks:** I am prompting the AI for exactly ONE feature at a time (e.g., "Build the login UI," not "Build the auth system").
- [ ] **Test Before Proceeding:** I have instructed the agent to run the test suite (or I have manually verified the UI) before requesting the next feature.
- [ ] **Git Checkpoints:** I am committing my code after *every single passed task*. If the AI destroys the codebase in the next step, I can instantly `git reset`.
```
