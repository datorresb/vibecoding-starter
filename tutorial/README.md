# Tutorial: Build Your First AI-Powered App with Vibecoding Starter

**Time:** ~10 minutes · **Level:** Beginner · **Requirements:** VS Code + GitHub Copilot (or Claude Code)

---

## What You'll Build

A fully configured project with **AI agent skills** — ready to plan, code, test, and document with your AI assistant acting as a real team member, not just autocomplete.

By the end of this tutorial you'll have:

- ✅ A project with 35+ agent skills installed
- ✅ Task management (backlog) ready to track work
- ✅ An orchestrator agent that plans and delegates work
- ✅ Specialized sub-agents for code review, refactoring, and testing
- ✅ Your first feature built entirely through AI collaboration

---

## Before You Start

You need **one** of these:

| Tool | How to Get It |
|------|---------------|
| **VS Code + GitHub Copilot** | [Install Copilot](https://docs.github.com/en/copilot/getting-started) (free for students & open source) |
| **Claude Code** | [Install Claude Code](https://docs.anthropic.com/en/docs/claude-code) |

And **git** installed (`git --version` to check).

---

## Step 1: Create Your Project

Choose **one** of these methods:

### Option A: Use as GitHub Template (Recommended)

1. Go to [**github.com/datorresb/vibecoding-starter**](https://github.com/datorresb/vibecoding-starter)
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your repo (e.g., `my-awesome-app`) and create it
4. Clone your new repo:

```bash
git clone git@github.com:YOUR_USERNAME/my-awesome-app.git
cd my-awesome-app
```

### Option B: Clone Into an Existing Project

If you already have a project and want to add agent skills:

```bash
cd /path/to/your-project
git clone git@github.com:datorresb/vibecoding-starter.git .references/vibecoding-starter
```

---

## Step 2: Run the Setup

Open the project in **VS Code** and open **Copilot Chat** (or Claude Code).

### If you used Option A (template):

Paste this into chat:

```
Read and execute AGENT_START.md
```

### If you used Option B (cloned into existing project):

Paste this into chat:

```
Read and execute .references/vibecoding-starter/AGENT_START.md
```

**The agent will ask you a few questions:**

| Question | What to Choose |
|----------|---------------|
| Platform? | **GitHub Copilot** or **Claude Code** — whichever you're using |
| Task management? | **bd (beads)** — simplest to start with |
| Skills? | **All** — you can always remove what you don't need |
| Tech lead or individual? | **Individual** — unless you want the orchestrator pattern |

> ☕ Grab a coffee. The agent handles everything: copying skills, initializing task management, configuring git.

When it's done, you'll see:

```
✅ Setup Complete!

Your skills are installed in: .claude/skills/
Platform: github-copilot
```

---

## Step 3: Build Something!

Now the fun part. Your AI assistant has **superpowers**. Here are 3 things to try:

### 🎯 Try A: Plan a Feature (Brainstorming Skill)

Ask your agent:

```
Use the brainstorming skill to help me design a REST API for a todo app
```

The agent will ask you questions one at a time, explore approaches, and produce a **design document** saved to `docs/plans/`. No code yet — just a solid plan.

### 🎯 Try B: Create Tasks and Track Work

```
Create a task: "Set up Express.js server with health check endpoint"
```

Then check your backlog:

```
Show me all my tasks
```

### 🎯 Try C: Build with the Full Workflow

This is the real power — tell the agent what you want, and it orchestrates everything:

```
I want to build a simple REST API with Express.js that has:
- GET /health — returns { status: "ok" }
- GET /api/todos — returns a list of todos
- POST /api/todos — creates a new todo

Use TDD. Create tasks for each endpoint. Build them one by one.
```

The agent will:
1. **Create tasks** in your backlog
2. **Write tests first** (TDD skill)
3. **Implement each endpoint**
4. **Run tests** to verify
5. **Commit** with clean git messages

---

## What's Happening Under the Hood?

```
You: "Build a REST API with TDD"
  │
  ▼
Agent reads AGENTS.md → understands the workflow
  │
  ▼
Agent loads skills → tdd, git, subagent
  │
  ▼
Agent creates tasks → tracked in backlog
  │
  ▼
Agent writes tests → RED (failing)
  │
  ▼
Agent writes code → GREEN (passing)
  │
  ▼
Agent commits → clean git history
  │
  ▼
You: review and iterate ✨
```

---

## Cheat Sheet: Useful Commands

| What You Want | What to Say |
|---------------|-------------|
| Plan a feature | `Use the brainstorming skill to design [feature]` |
| Create a task | `Create a task: "[description]"` |
| See all tasks | `Show me my backlog` |
| Write tests first | `Use TDD to implement [feature]` |
| Review code | `Use the code-review skill to review [file]` |
| Refactor code | `Use the refactoring skill on [file]` |
| Write documentation | `Use the technical-writing skill to document [topic]` |
| Set up CI/CD | `Use the ci-cd skill to create a GitHub Actions pipeline` |
| Create a DevContainer | `Use the devcontainer-setup skill` |

---

## Next Steps

- 📖 Read [AGENTS.md](../AGENTS.md) to understand the full workflow
- 🔧 Read [SKILL_SELECTOR.md](../SKILL_SELECTOR.md) to find the right skill for any task
- 🎨 Create your own skills: ask `"Use the creating-skills skill to make a skill for [your use case]"`
- 📊 Try the [PowerPoint tutorial](./powerpoint.md) — generate slide decks with an agent skill

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Skills not loading | Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window" |
| `bd: command not found` | Run: `export PATH="$HOME/.cargo/bin:$PATH"` |
| Agent doesn't follow skills | Make sure AGENTS.md is in your project root |
| Setup script not found | Check you're in the right directory: `ls AGENT_START.md` |

---

## Other Tutorials

| Tutorial | Description |
|----------|-------------|
| [Multi-Agent Pipelines](./multi-agent-pipeline.md) | Build workflows with custom agents, handoffs, and subagents |
| [Agent Orchestration Patterns](./agent-orchestration-patterns.md) | Patrones avanzados: orquestadores, equipos de producto, trabajo paralelo |
| [PowerPoint Generator](./powerpoint.md) | Generate slide decks using the PPTX agent skill |

---

**Questions?** Open an issue at [github.com/datorresb/vibecoding-starter](https://github.com/datorresb/vibecoding-starter/issues)

**License:** MIT
