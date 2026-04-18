# 03. Debugging & Refactoring Prompts

*(Use these prompts when the AI gets stuck in an error-loop, hallucinates bad code, or you need to untangle a massive architectural mess.)*

---

## Recipe: The "Halt and Explain" Protocol
**Why it works:** When an agent (like Claude Code) tries to fix a syntax error 5 times and keeps failing, its reasoning is corrupted. You must stop it and force it to vocalize its understanding.

```text
[GOAL]
Stop modifying files immediately. Explain the current architecture of the bug.

[CONTEXT]
You have failed to resolve the [INSERT ERROR] across the last 3 iterations. 

[CONSTRAINTS]
1. Do NOT write any code fixes or run any bash commands.
2. Read the surrounding 50 lines of code where the error occurs.

[OUTPUT CONTRACT]
1. Explain what the code is *supposed* to do. 
2. Explain what the code is *actually* doing to cause the error.
3. List two distinctly different technical approaches to solve this issue that do not involve what you previously tried.
```

---

## Recipe: The Security Review Gate (DeepMind/Codex Focus)
**Why it works:** AI routinely introduces terrible security vulnerabilities (like raw SQL concatenation or insecure direct object references).

```text
[GOAL]
Perform a hostile security audit on the [INSERT FEATURE/FILE].

[CONTEXT]
Act as a Senior Penetration Tester evaluating the current codebase state.

[CONSTRAINTS]
Focus explicitly on:
1. Logic flaws bypassing authorization (IDOR).
2. Injection vulnerabilities (SQL, NoSQL, XSS, Command Injection).
3. Exposed sensitive data in error logs or responses.

[OUTPUT CONTRACT]
If no vulnerabilities are found, reply "SECURE". 
If vulnerabilities are found, output a markdown table containing:
| Severity | Vulnerability Name | File:Line | How to Exploit | Exact Fix Required |
```

---

## Recipe: The Context Cleanser
**Why it works:** If you have been heavily refactoring using Composer inside Cursor, the AI context window is filled with garbage diffs.

```text
[GOAL]
Synthesize the current state of the application after our latest refactors.

[CONTEXT]
We have finished the complex refactor of [INSERT FEATURE].

[OUTPUT CONTRACT]
Generate a clean summary of how the architecture stands right now. After generating this summary, I will use your tool's `/compact`, `/clear`, or New Chat function and paste your summary in so we can start fresh with low token-overhead.
```
