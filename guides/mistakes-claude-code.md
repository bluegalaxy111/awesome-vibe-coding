# 5 Mistakes Everyone Makes with Claude Code & Terminal Agents

Terminal agents like Claude Code, OpenCode, and Aider are incredible force-multipliers. However, because they have the literal ability to execute commands on your machine, mistakes here are far more painful than in a GUI editor.

## 1. The API Cost Trap (Running Unmonitored)
**The Mistake:** Terminal agents are recursive. If a test fails, they read the error, rewrite the file, and run the test again. If you trigger an agent on a complex architecture bug and walk away, it can spin into a loop of reading 200,000 tokens of context repeatedly. You return 30 minutes later to a $15 API bill for a single bug.
**The Fix:** Set strict iteration limits. Never authorize a CLI agent to run more than 3 autonomous loops without human intervention. Keep an eye on the token counter printed in the CLI.

## 2. Catastrophic Regex and `sed` Edits
**The Mistake:** Relying on the agent to use `sed` to edit files in place. The AI frequently miscalculates line numbers or regex patterns, accidentally deleting surrounding business logic or breaking bracket matching.
**The Fix:** Provide explicit rules in your `CLAUDE.md` (see our templates). Tell the agent: *"Prefer rewriting small files entirely to avoid regex collision, or use strict search-and-replace syntax."*

## 3. The Context Bloat Matrix
**The Mistake:** You chat with the terminal agent for 40 minutes about 6 different bugs. The agent is now carrying the history of all the executed bash commands, the previous git diffs, and the old errors in its memory. It becomes slow, confused, and prone to hallucination.
**The Fix:** Use the `/compact` command (or the equivalent context-clearing command in your specific tool). Treat terminal chats like disposable scratchpads. Fix the bug, commit the code, clear the context, start fresh.

## 4. Coding Before Testing
**The Mistake:** Telling the agent, *"Add a password reset feature."* The agent will write the feature, but you will have no automated way to know if it actually works without manually clicking through your app.
**The Fix:** Enforce rigorous Test-Driven Development (TDD). Prompt: *"Write the failing Jest test for the password reset feature first. Run it. Once it fails, implement the feature until the test passes."*

## 5. Branch Pollution
**The Mistake:** Turning an autonomous agent loose on your `main` branch. If it hallucinates or deletes core components aggressively, your `main` history gets wrecked.
**The Fix:** Never use terminal agents on `main`. Always create a new branch `git checkout -b ai/password-reset` so you can cleanly diff or `git reset --hard` if the agent totally destroys the implementation logic.
