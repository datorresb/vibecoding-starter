# Getting Started Tutorial — Design

**Date:** 2026-02-06
**Status:** Validated

## Objective

Create a beginner-friendly tutorial (`tutorial/README.md`) that guides a first-time user through using the vibecoding-starter repository to set up an AI-agent-powered development workflow in ~10 minutes.

## Architecture / Approach

**Format:** Single markdown file in `tutorial/README.md`, visible on GitHub.

**Structure:** 3 steps:

1. **Create Your Project** — Template or clone into existing project
2. **Run the Setup** — Agent executes AGENT_START.md automatically
3. **Build Something** — Three "Try This" exercises demonstrating skills in action

**Design Decisions:**

- Maximum 3 main steps to avoid intimidation
- Each step has copy-pasteable commands
- "Try" exercises are optional but show real value
- Cheat sheet for quick reference after setup
- Links to deeper docs (AGENTS.md, SKILL_SELECTOR.md) for next steps

## Specifications

- **Target audience:** Developer with VS Code + GitHub Copilot (or Claude Code), no prior agent experience
- **Time to complete:** ~10 minutes
- **Prerequisites:** git, VS Code, Copilot or Claude Code
- **Outcome:** Working project with 35+ skills, task management, and first feature built via AI collaboration
- **Existing tutorial (PowerPoint):** Preserved at `tutorial/powerpoint.md`

## Implementation Order

1. ~~Rename `tutorial/README.md` → `tutorial/powerpoint.md`~~ ✅
2. ~~Create new `tutorial/README.md` with 3-step structure~~ ✅
3. (Optional) Add screenshots or GIFs for GitHub rendering
4. (Optional) Create additional tutorials in `tutorial/` subdirectories

## Success Criteria

- [x] Tutorial has ≤ 3 main steps
- [x] Each step has copy-pasteable commands
- [x] Works for both template and clone-into-existing workflows
- [x] Links to existing documentation (AGENTS.md, SKILL_SELECTOR.md)
- [x] Previous PowerPoint tutorial preserved and linked
- [ ] Validated by a real user following the steps (manual test)
