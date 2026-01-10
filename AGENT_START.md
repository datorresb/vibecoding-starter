# Vibecoding Starter - Project Setup

**Last Updated:** 2026-01-25
**Version:** 0.2

---

## 🤖 For AI Coding Agents

This file contains **setup instructions** for configuring this project template. You (the AI agent) should execute these steps autonomously.

**Your goal:** Configure the template for a new project, guiding the user through a brief questionnaire to customize their setup.

> **Note:** This is a template repository. Skills are already included in `.claude/skills/`. This runbook helps configure the template for a specific project.

---

## Step 0: Welcome & Introduction

**🎉 CRITICAL: Display this welcome message to the user BEFORE doing anything else:**

> 🚀 Welcome to Vibecoding Starter!
>
> This setup will configure your project for AI-assisted development with pre-built agent skills.
>
> I'll ask you a few questions to customize the installation.
>
> What will be installed:
> - Agent skills for Claude Code and GitHub Copilot
> - AGENTS.md workflow instructions
> - Task management tools (optional)
>
> Estimated time: ~2 minutes

**Wait for user acknowledgment before proceeding.**

---

## Step 0.1: Prerequisites Check

Run these commands and record results:

```bash
# Check git
git --version

# Check curl or wget
curl --version || wget --version

# Check current directory
pwd

# Check if git repo
git status 2>/dev/null && echo "GIT_REPO=true" || echo "GIT_REPO=false"
```

**If git not found:** Tell user to install git first.
**If curl/wget not found:** Use alternative download method.

---

## Step 0.2: DevContainer Detection

**CRITICAL: Check for DevContainer BEFORE any installation.**

```bash
# Check if .devcontainer exists
if [ -d ".devcontainer" ]; then
  echo "DEVCONTAINER=exists"
  ls -la .devcontainer/
elif [ -f ".devcontainer.json" ]; then
  echo "DEVCONTAINER=exists"
else
  echo "DEVCONTAINER=none"
fi

# Check if running inside a container
if [ -f "/.dockerenv" ] || grep -q docker /proc/1/cgroup 2>/dev/null; then
  echo "INSIDE_CONTAINER=true"
else
  echo "INSIDE_CONTAINER=false"
fi
```

### If NO DevContainer exists (DEVCONTAINER=none):

**Ask the user:**

```
📦 No DevContainer detected in this project.

A DevContainer ensures everyone uses the same development environment,
avoiding "works on my machine" issues.

Would you like to set up a DevContainer first?

• Yes, create DevContainer → Skills will be installed inside the container
• No, install locally    → Skills will be installed in current environment
• I'll set it up later   → Continue with local installation for now
```

**If user chooses "Yes, create DevContainer":**

1. Load and execute the `devcontainer-setup` skill from `.claude/skills/devops/devcontainer-setup/SKILL.md`
2. After DevContainer is created, inform user:
   ```
   ✅ DevContainer created!
   
   Please reopen this project in the DevContainer, then run:
   "Read and execute AGENT_START.md"
   
   This ensures all skills are installed inside your development container.
   ```
3. **STOP HERE** - Let user reopen in container before continuing

**If user chooses "No" or "I'll set it up later":**
- Record `[DEVCONTAINER_SETUP]=skipped`
- Continue with local installation

### If DevContainer EXISTS:

**Check if running inside it:**

- If `INSIDE_CONTAINER=true`: Continue with installation ✅
- If `INSIDE_CONTAINER=false`: 
  ```
  📦 DevContainer detected but you're not inside it.
  
  Would you like to:
  • Reopen in container → Recommended for consistent environment
  • Continue locally    → Install skills outside the container
  ```

---

## Step 0.3: Locate Initializer

**Agent Instructions:** Find where the vibecoding-starter initializer is located.

```bash
# Check locations in order of preference
if [ -d "./.references/vibecoding-starter" ]; then
  INITIALIZER_DIR="./.references/vibecoding-starter"
  echo "📁 Initializer found at: $INITIALIZER_DIR (repo references)"
elif [ -d "./vibecoding-starter" ]; then
  INITIALIZER_DIR="./vibecoding-starter"
  echo "📁 Initializer found at: $INITIALIZER_DIR (local)"
elif [ -f "./AGENT_START.md" ] && [ -d "./.claude/skills" ]; then
  INITIALIZER_DIR="$(pwd)"
  echo "📁 Running from inside initializer: $INITIALIZER_DIR"
else
  echo "❌ Initializer not found!"
  echo ""
  echo "Clone it into .references (recommended for DevContainer use):"
  echo "   git clone git@github.com:datorresb/vibecoding-starter.git ./.references/vibecoding-starter"
  echo ""
  echo "Then run this setup again."
  exit 1
fi

# Verify skills exist
if [ ! -d "$INITIALIZER_DIR/.claude/skills" ]; then
  echo "❌ Skills not found in initializer!"
  exit 1
fi

echo "✅ Skills source: $INITIALIZER_DIR/.claude/skills/"
```

> **Tip:** Keeping the initializer in `.references/vibecoding-starter/` makes it available inside DevContainers while staying out of version control.

---

## Step 1: Detect Platform and Ask User

**Agent Instructions:** Determine which AI coding assistant is being used.

### Automatic Detection

Run these checks:

```bash
# Check for Claude Code indicators
if [ -d ".claude" ] || command -v claude &>/dev/null; then
  echo "PLATFORM=claude-code"
fi

# Check for GitHub Copilot indicators
if [ -d ".github" ] || ([ -f ".vscode/settings.json" ] && grep -q "github.copilot" .vscode/settings.json 2>/dev/null); then
  echo "PLATFORM=github-copilot"
fi
```

### Ask User to Confirm

**Present the user with a question:**

"Which AI coding assistant are you using?"
- **Claude Code** (uses `.claude/skills/`)
- **GitHub Copilot** (uses `.claude/skills/`)
- **Other / Not Sure** (will use `.claude/skills/`)

> **Note:** All platforms use `.claude/skills/` as the standard location. GitHub Copilot can read from `.claude/` directories.

**Record answer:** `[PLATFORM]`

---

## Step 2: Git Repository Setup

**Check if git is initialized:**

```bash
git status 2>/dev/null
```

### If NOT a git repository (GIT_REPO=false):

**Ask the user:**

"This directory is not a git repository. Would you like to initialize git?"
- **Yes, initialize new repo** → Run `git init`
- **No, skip git** → Continue without git (skills will still work)

### If IS a git repository:

**Ask the user:**

"Do you want to connect this repository to a remote?"
- **Create new remote on GitHub** → Help create repo with gh CLI
- **Connect to existing remote** → Ask for URL and add remote
- **No remote needed** → Continue with local repo only

#### If "Create new remote on GitHub":

```bash
# Check if gh CLI is available
if command -v gh &>/dev/null; then
  echo "GitHub CLI is available"

  # Ask user for details
  echo "What should the repository be named?"
  # [Get repo name from user]

  echo "Should it be public or private?"
  # [Get visibility from user]

  echo "Which organization/account? (or leave blank for personal)"
  # [Get org from user, optional]

  # Create the repository
  if [ -n "$ORG" ]; then
    gh repo create "$ORG/$REPO_NAME" --$VISIBILITY --source=. --remote=origin
  else
    gh repo create "$REPO_NAME" --$VISIBILITY --source=. --remote=origin
  fi
else
  echo "GitHub CLI not available. Please install gh CLI or add remote manually"
  echo "See: https://cli.github.com/"
fi
```

#### If "Connect to existing remote":

```bash
# Ask user for remote URL
echo "What is the remote repository URL?"
# [Get URL from user]

# Add remote
git remote add origin "$REMOTE_URL"

# Optionally pull if remote has content
echo "Does the remote have existing content you want to pull?"
# If yes: git pull origin main (or appropriate branch)
```

---

## Step 3: Set Skills Directory

**All platforms use the same standard location:**

```bash
SKILLS_DIR=".claude/skills"
mkdir -p "$SKILLS_DIR"
echo "✅ Skills will be installed to: $SKILLS_DIR"
```

> **Note:** `.claude/skills/` is the cross-platform standard. Works with Claude Code, GitHub Copilot, and other AI assistants.

---

## Step 4: Install Task Management Tool

**Ask the user which task management tool to install:**

"Which task management system would you like to use?"
- **bd (beads)** — CLI tool, works with any editor. Uses `.beads/` directory (SQLite + JSONL). Best for GitHub Copilot and general use.
- **Backlog MCP** — MCP server, uses `backlog/` directory (Markdown files). Best for Claude Code (has native MCP support).
- **Both** — Install both, choose per-project later.
- **Neither** — Skip task management for now.

**Record answer:** `[TASK_TOOL]`

---

### Step 4a: Install bd (beads) — if user chose bd or both

**Check if already installed:**

```bash
which bd && bd --version
```

**If not installed, install now:**

#### macOS/Linux:

```bash
# Method 1: Direct installation script (recommended)
curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash

# Method 2: Using Cargo (if Rust installed)
cargo install beads-cli
```

#### Windows:

```bash
# If Rust/Cargo installed:
cargo install beads-cli

# Otherwise, download binary from:
# https://github.com/steveyegge/beads/releases
```

**Verify installation:**

```bash
bd --version
# Should output: bd version X.Y.Z
```

**If bd not in PATH:**

```bash
# Check common install locations
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

# Add permanently to shell profile
echo 'export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc  # or ~/.zshrc
```

---

### Step 4b: Install Backlog MCP — if user chose Backlog MCP or both

**Backlog MCP is an MCP server that provides task management via MCP tool calls.**

> **Requirement:** Backlog MCP requires an MCP-compatible client (e.g., Claude Code, Claude Desktop).

**Setup:**

1. **Install the Backlog MCP server** (follow the Backlog.md project instructions):
   ```bash
   # Check if npx is available
   npx @backlog-md/mcp --help 2>/dev/null || echo "Install via: npm install -g @backlog-md/mcp"
   ```

2. **Configure MCP in your client:**

   For **Claude Code** — add to `.claude/mcp.json`:
   ```json
   {
     "mcpServers": {
       "backlog": {
         "command": "npx",
         "args": ["@backlog-md/mcp"]
       }
     }
   }
   ```

   For **Claude Desktop** — add to Claude's MCP settings.

3. **Initialize the backlog:**
   ```bash
   mkdir -p backlog
   ```
   The MCP server will create `backlog/BACKLOG.md` on first task creation.

4. **Verify it works** (from your MCP client):
   ```
   task_list(status="To Do", limit=5)
   ```

**Skills to install:** `backlog-workflow` + `git-hygiene` + `subagent`

> **Note:** Backlog MCP uses MCP tool calls (`task_create`, `task_list`, `task_search`, etc.) — these only work inside MCP-compatible clients, not from the terminal.

---

## Step 5: Choose Skills to Install

**Agent Instructions:** Ask the user which skills they need.

**Use this decision tree:**

### Q1: "What type of project is this?"

- **Engineering/Software** → Core + Engineering skills
- **DevOps/Infrastructure** → Core + DevOps skills
- **Documentation/Writing** → Core + Documentation skills
- **Research/Evaluation** → Core + Research skills
- **All of the above** → Install everything

### Q2: "Do you use bd (beads) or Backlog MCP for task management?"

- **bd (beads)** → Install `bd` + `git` + `subagent` skills
- **Backlog MCP** → Install `backlog-workflow` + `git-hygiene` + `subagent` skills
- **Not sure** → Default to bd (easier setup)

### Q3: "Are you a tech lead or individual contributor?"

- **Tech lead** → Install `technical-lead-role` + `task-delegation`
- **Individual** → Skip these, focus on execution skills

**Based on answers, install:**

- **Always:** `creating-skills`, `session-continuation`
- **Conditional:** Based on Q1-Q3 above

---

## Step 6: Check for Existing Skills

**Agent Instructions:** Before copying skills, check for conflicts.

```bash
# Check if skills directory exists
if [ -d "$SKILLS_DIR" ]; then
  echo "⚠️  Existing skills directory found at: $SKILLS_DIR"

  # List existing skills
  ls -la "$SKILLS_DIR"

  # Ask user for action
fi
```

**Ask the user:**

"Skills directory already exists. What would you like to do?"
- **Merge** — Keep existing, add new from catalog (only copy non-existent skills)
- **Replace** — Backup existing, install fresh
- **Skip** — Keep existing, abort installation

**Handle based on user choice.**

---

## Step 7: Copy Skills from Initializer

**Agent Instructions:** Copy skills from the cloned initializer to the project.

> **Context:** The user cloned `vibecoding-starter` inside their project directory.  
> The initializer is at `./vibecoding-starter/` and contains all skills.

### Verify Initializer Exists

```bash
# Check for the initializer directory
if [ -d "./vibecoding-starter" ]; then
  echo "✅ Initializer found at ./vibecoding-starter/"
  INITIALIZER_DIR="./vibecoding-starter"
elif [ -d "../vibecoding-starter" ]; then
  echo "✅ Initializer found at ../vibecoding-starter/"
  INITIALIZER_DIR="../vibecoding-starter"
else
  echo "❌ Initializer not found!"
  echo ""
  echo "Please clone the initializer first:"
  echo "  git clone git@github.com:datorresb/vibecoding-starter.git"
  echo ""
  echo "Then run this setup again."
  exit 1
fi

# Verify skills exist in initializer
if [ ! -d "$INITIALIZER_DIR/.claude/skills" ]; then
  echo "❌ Skills not found in initializer!"
  exit 1
fi

echo "✅ Skills source: $INITIALIZER_DIR/.claude/skills/"
```

### Copy Skills to Project

```bash
# Create destination directory
mkdir -p "$SKILLS_DIR"

# Copy all skills from initializer
echo "Copying skills..."
cp -r "$INITIALIZER_DIR/.claude/skills/"* "$SKILLS_DIR/"
echo "✅ Skills copied to $SKILLS_DIR/"

# Copy AGENTS.md if it doesn't exist
if [ ! -f "./AGENTS.md" ]; then
  cp "$INITIALIZER_DIR/AGENTS.md" ./AGENTS.md
  echo "✅ AGENTS.md copied"
else
  echo "⚠️  AGENTS.md already exists, skipping"
fi
```

> **Note:** The initializer at `.references/vibecoding-starter/` stays in place for future use. No cleanup needed.

---

## Step 8: Generate Skills Registry

**Agent Instructions:** Generate the skills index for efficient skill discovery.

The registry provides a searchable index of all installed skills. This step creates:
- `skills.json` — Full registry with metadata (for tools/validation)
- `skills-index.json` — Compact index optimized for LLMs

### Get rebuild-registry.js

```bash
# Determine skills directory
if [ -d ".claude/skills" ]; then
  SKILLS_BASE=".claude"
else
  echo "⚠️ No skills directory found, skipping registry generation"
  exit 0
fi

# Check if rebuild script exists
if [ ! -f "$SKILLS_BASE/rebuild-registry.js" ]; then
  echo "📥 Getting rebuild-registry.js..."
  
  # Method 1: Copy from local initializer (preferred - works for private repos)
  if [ -f "$INITIALIZER_DIR/.claude/rebuild-registry.js" ]; then
    cp "$INITIALIZER_DIR/.claude/rebuild-registry.js" "$SKILLS_BASE/"
    echo "✅ Copied from initializer"
  
  # Method 2: Use gh CLI (works for private repos when authenticated)
  elif command -v gh &>/dev/null; then
    gh api repos/datorresb/vibecoding-starter/contents/.claude/rebuild-registry.js \
      --jq '.content' | base64 -d > "$SKILLS_BASE/rebuild-registry.js" 2>/dev/null
    
    if [ -s "$SKILLS_BASE/rebuild-registry.js" ]; then
      echo "✅ Downloaded via GitHub CLI"
    else
      rm -f "$SKILLS_BASE/rebuild-registry.js"
      echo "⚠️ gh download failed"
    fi
  
  # Method 3: curl for public repos only
  else
    curl -sL -o "$SKILLS_BASE/rebuild-registry.js" \
      "https://raw.githubusercontent.com/datorresb/vibecoding-starter/main/.claude/rebuild-registry.js" 2>/dev/null
    
    if [ -s "$SKILLS_BASE/rebuild-registry.js" ]; then
      echo "✅ Downloaded from GitHub"
    else
      rm -f "$SKILLS_BASE/rebuild-registry.js"
      echo "⚠️ Download failed (repo may be private)"
      echo "   Copy manually from vibecoding-starter/.claude/rebuild-registry.js"
    fi
  fi
fi
```

> **💡 Private Repos:** If your vibecoding-starter repo is private, ensure you either:
> 1. Have the initializer cloned locally (Step 7), or
> 2. Are authenticated with `gh auth login`

### Run the Registry Generator

```bash
cd "$SKILLS_BASE"
if [ -f "rebuild-registry.js" ]; then
  node rebuild-registry.js
  
  if [ -f "skills-index.json" ]; then
    echo "✅ Skills registry generated successfully"
  else
    echo "⚠️ Registry generation may have failed"
  fi
else
  echo "⚠️ rebuild-registry.js not found, skipping"
fi
cd - > /dev/null
```

**Expected output:**

```
╔════════════════════════════════════╗
║   Skills Registry Rebuild v1.1.0   ║
╚════════════════════════════════════╝

Scanning locations:
  📁 .claude/skills/

  ✓ bd (.claude)
  ✓ git (.claude)
  ...

────────────────────────────────────
✅ Registry updated: 30 skills

📄 Generated files:
   skills.json       19.7KB (full)
   skills-index.json 6.0KB (LLM-optimized)
────────────────────────────────────
```

---

## Step 9: Configure AGENTS.md

**Check if AGENTS.md exists:**

```bash
if [ -f "AGENTS.md" ]; then
  echo "✅ AGENTS.md found"
else
  echo "⚠️  AGENTS.md not found - may need to create or copy"
fi
```

**If AGENTS.md already exists and needs updating:**

1. Backup existing: `mv AGENTS.md AGENTS.md.backup.$(date +%s)`
2. Make updates as needed
3. Inform user: "Your old AGENTS.md is backed up as AGENTS.md.backup.[timestamp]"

---

## Step 10: Initialize Task Management Tool

### If user chose bd (beads):

```bash
cd [project-root]
bd init

# Answer prompts based on detected environment:
# - Project name: [current directory name]
# - Git integration: [yes if git repo exists]
```

**Configure git hooks:**

```bash
# Run bd doctor to check for issues
bd doctor

# Install recommended hooks if suggested
bd doctor --fix
```

**Note:** If bd is already initialized (`.beads/` directory exists), you can skip this step.

**Verify:**

```bash
bd list  # Should return empty list or existing issues
```

---

### If user chose Backlog MCP:

1. **Verify MCP configuration exists:**
   ```bash
   if [ -f ".claude/mcp.json" ]; then
     echo "✅ MCP config exists"
     cat .claude/mcp.json
   else
     echo "⚠️ Create .claude/mcp.json with backlog server config"
   fi
   ```

2. **Initialize backlog directory:**
   ```bash
   mkdir -p backlog
   echo "✅ Backlog directory ready"
   ```

3. **Verify from MCP client:**
   ```
   task_list(status="To Do", limit=5)
   ```
   Should return empty list without errors.

**Note:** Backlog MCP verification requires an MCP-compatible client. It cannot be tested from the terminal.

---

## Step 11: Platform-Specific Configuration

### For Claude Code:

1. Verify skills are in `.claude/skills/`
2. **CRITICAL:** Inform user:
   > ⚠️ **Claude Code must restart to load new skills.**
   >
   > Please **quit and restart** Claude Code now:
   > - macOS: Command+Q then relaunch
   > - Windows/Linux: Close completely and relaunch
3. After user restarts: "Welcome back! Your skills are now active. Run `bd list` to see your tasks."

### For GitHub Copilot:

1. Verify skills are in `.claude/skills/`
2. **Important:** Inform user:
   > ✅ **Skills installed for GitHub Copilot!**
   >
   > GitHub Copilot will automatically load skills from `$SKILLS_DIR` directory.
   >
   > **Note:** Agent Skills require:
   > - GitHub Copilot Chat or Copilot CLI
   > - VS Code or GitHub.com (Skills are loaded when relevant)
   >
   > See: [GitHub Copilot Agent Skills Documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
3. Recommend: "Reload VSCode window (Ctrl+Shift+P / Cmd+Shift+P → 'Developer: Reload Window')"

### For Other:

1. Verify skills are in `.claude/skills/`
2. Inform user: "Skills installed in `.claude/skills/`. Refer to AGENTS.md for usage instructions."
3. Recommend: "Restart your editor/agent to load skills"

---

## Step 12: Git Commit (if git repository)

**If git repository exists:**

```bash
# Stage skills and AGENTS.md
git add "$SKILLS_DIR" AGENTS.md .gitignore 2>/dev/null || true

# Check if there are changes to commit
if ! git diff --cached --quiet; then
  echo "Creating commit for project setup..."

  git commit -m "Configure project with Vibecoding Starter

Set up agent skills for AI coding assistants.

Skills directory: $SKILLS_DIR
Platform: $PLATFORM

Skills configured:
- Core: creating-skills, session-continuation, agent-runbook, etc.
- DevOps: devcontainer-setup, ci-cd, etc.
- [List other categories as relevant]

🤖 Created with Vibecoding Starter"

  echo "✅ Changes committed to git"

  # If remote exists, ask about pushing
  if git remote | grep -q origin; then
    # Ask user
    echo "Push changes to remote?"
    # If yes: git push origin [current-branch]
  fi
fi
```

---

## Step 13: Verification

**Run verification checks:**

```bash
# 1. Check skills installed
echo "Checking skills..."
ls -la "$SKILLS_DIR"

# 2. Check bd working (if installed)
if command -v bd &>/dev/null; then
  echo "Checking bd..."
  bd --version
fi

# 3. Check AGENTS.md exists
echo "Checking AGENTS.md..."
[ -f "AGENTS.md" ] && echo "✅ AGENTS.md found" || echo "❌ AGENTS.md missing"

# 4. Check git status
if [ "$GIT_REPO" = "true" ]; then
  echo "Checking git..."
  git status
fi

# 5. Try creating a test task (if bd installed)
if command -v bd &>/dev/null; then
  echo "Testing bd functionality..."
  bd create "Test task - setup verification" || true
  bd list || true
fi
```

**Success criteria:**

- ✅ Skills directory exists with skills
- ✅ `AGENTS.md` exists
- ✅ `bd` command works (if installed)
- ✅ Platform-specific setup complete

**If all checks pass:** Installation successful! 🎉

---

## Step 14: Next Steps

**Inform user:**

✅ **Setup Complete!**

**Your skills are installed in:** `$SKILLS_DIR`

**Platform:** `$PLATFORM`

**Getting started:**

1. **Read AGENTS.md** to understand the workflow
2. **Create your first task:** `bd create "Your first task"` (if using bd)
3. **Review available skills:** `ls $SKILLS_DIR/*/`

**Workflow patterns:**

- **Tech Leads:** Use `technical-lead-role` skill, delegate tasks
- **Individual Contributors:** Use `subagent` skill, execute tasks directly
- **Everyone:** Use `bd` for backlog management (if installed), `git` for version control

**Next task ideas:**

- `bd create "Set up CI/CD pipeline"` → Use `ci-cd` skill
- `bd create "Write project README"` → Use `technical-writing` skill
- `bd create "Refactor X module"` → Use `refactoring` skill
- `bd create "Add tests for Y feature"` → Use `tdd` skill

---

## Troubleshooting

### Issue: `bd: command not found` after installation

**Solution:**

```bash
# macOS/Linux: Add to PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Add permanently to shell profile:
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc

# Verify
which bd
bd --version
```

### Issue: Skills not loading in editor

**Claude Code:**
- Verify skills in `.claude/skills/`
- Quit completely (Command+Q) and restart
- Try clearing cache: `rm -rf .claude/.cache`

**GitHub Copilot:**
- Verify skills in `.claude/skills/`
- Reload VSCode: Cmd/Ctrl+Shift+P → "Developer: Reload Window"
- Check Copilot is enabled in settings
- See: [GitHub Copilot Agent Skills Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)

### Issue: Git remote setup failed

**Solution:**

```bash
# Manual remote setup
git remote add origin <your-remote-url>

# Or use GitHub CLI
gh repo create <name> --public --source=. --remote=origin

# Verify
git remote -v
```

### Issue: Permission denied downloading skills

**Solution:**

```bash
# Fix permissions
chmod -R u+w "$SKILLS_DIR"

# If GitHub rate limited, authenticate:
# Install GitHub CLI: https://cli.github.com/
gh auth login
```

---

## Reference

**GitHub Copilot Agent Skills:** https://docs.github.com/en/copilot/concepts/agents/about-agent-skills

**Included Skills:**

- **Core:** bd, git, subagent, technical-lead-role, task-delegation, creating-skills, session-continuation, backlog-workflow, git-hygiene, agent-runbook
- **Engineering:** refactoring, tdd, architecture-review, performance-optimization
- **DevOps:** ci-cd, deployment, infrastructure, monitoring, devcontainer-setup
- **Documentation:** technical-writing, api-documentation, adr
- **Research:** technical-research, evaluation, proof-of-concept

**Need more skills?**

- Create your own using the `creating-skills` skill
- Use `agent-runbook` skill to create executable runbooks

---

## Support

**Questions?** Read AGENTS.md for workflow guidance and best practices.

---

## 🔄 Updating Skills

**When you want to update to the latest skills from vibecoding-starter:**

### Quick Update Command

Tell your AI agent:

```
Update my vibecoding-starter skills to the latest version
```

### What the Agent Should Do:

```bash
# 1. Update the global initializer
INITIALIZER_DIR="./.references/vibecoding-starter"

if [ -d "$INITIALIZER_DIR" ]; then
  echo "📥 Updating global initializer..."
  cd "$INITIALIZER_DIR" && git pull && cd -
else
  echo "📥 Cloning initializer..."
  git clone git@github.com:datorresb/vibecoding-starter.git "$INITIALIZER_DIR"
fi

# 2. Backup current skills
if [ -d ".claude/skills" ]; then
  BACKUP_DIR=".claude/skills-backup-$(date +%Y%m%d-%H%M%S)"
  cp -r .claude/skills "$BACKUP_DIR"
  echo "📦 Current skills backed up to: $BACKUP_DIR"
fi

# 3. Check for new/updated skills
echo "🔍 Comparing skills..."
diff -rq .claude/skills "$INITIALIZER_DIR/.claude/skills" 2>/dev/null || true

# 4. Ask user what to update
echo ""
echo "How would you like to update?"
echo "  • Merge - Add new skills, keep existing customizations"
echo "  • Replace - Full refresh with latest skills"
echo "  • Selective - Choose specific skills to update"
```

### Merge Update (Recommended):

```bash
# Copy only new skills (won't overwrite existing)
rsync -av --ignore-existing "$INITIALIZER_DIR/.claude/skills/" ".claude/skills/"

# Regenerate registry
cd .claude && node rebuild-registry.js && cd -

echo "✅ New skills added. Your customizations preserved."
```

### Full Replace:

```bash
# Remove old skills (backup already created)
rm -rf .claude/skills

# Copy all new skills
cp -r "$INITIALIZER_DIR/.claude/skills" .claude/

# Regenerate registry  
cd .claude && node rebuild-registry.js && cd -

echo "✅ Skills fully updated to latest version."
echo "📦 Old skills backed up at: $BACKUP_DIR"
```

### Check for Updates Without Installing:

```bash
# Quick version check
echo "Current version:"
grep -m1 "Version:" AGENTS.md 2>/dev/null || echo "Unknown"

# Check remote version (requires gh CLI for private repos)
if command -v gh &>/dev/null; then
  echo "Remote version:"
  gh api repos/datorresb/vibecoding-starter/contents/AGENTS.md \
    --jq '.content' | base64 -d | grep -m1 "Version:" || echo "Could not check remote version"
else
  echo "Install gh CLI to check remote version: https://cli.github.com/"
fi
```

---

**Congratulations!** Your project is now configured and ready for vibe coding! 🎉

**Remember:** Always refer to AGENTS.md for workflow guidance and best practices.

**Sources:**
- [About Agent Skills - GitHub Docs](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [Use Agent Skills in VS Code](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [GitHub Copilot Agent Skills Announcement](https://github.blog/changelog/2025-12-18-github-copilot-now-supports-agent-skills/)
