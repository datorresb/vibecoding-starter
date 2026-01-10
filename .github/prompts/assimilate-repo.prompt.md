---
description: Analyze any repository and generate skills from its patterns. Clone from URL or use local path.
---

## Assimilate Repository

Analyze a repository to extract patterns and generate reusable skills.

### Target Selection

First, I need to know which repository to assimilate:

**Options:**
1. **Local path**: `/path/to/repo` — Analyze a repo already on disk
2. **GitHub URL**: `https://github.com/owner/repo` — Clone and analyze

**Ask the user:**
> "Which repository would you like to assimilate? Provide a local path or GitHub URL."

---

### Setup

If the user provides a **GitHub URL**:

```bash
# Extract repo name from URL
REPO_URL="<user-provided-url>"
REPO_NAME=$(basename "$REPO_URL" .git)

# Clone to temp directory
mkdir -p .github/temp/repos
git clone --depth 1 "$REPO_URL" ".github/temp/repos/$REPO_NAME"

# Set working directory
TARGET_DIR=".github/temp/repos/$REPO_NAME"
```

If the user provides a **local path**:

```bash
TARGET_DIR="<user-provided-path>"

# Verify it exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "❌ Error: Directory not found: $TARGET_DIR"
    exit 1
fi
```

---

### Execute Pipeline

Navigate to target and invoke the orchestrator:

```bash
cd "$TARGET_DIR"
```

**Launch subagent with orchestrator skill:**

> "Using the assimilation/orchestrator skill, run the complete assimilation pipeline on this repository."

The orchestrator will:
1. **Scan** repository structure → `scan-report.json`
2. **Extract** patterns and conventions → `patterns.json`
3. **Generate** SKILL.md files → `.github/skills/<category>/`
4. **Update** AGENTS.md with skills reference
5. **Cleanup** temporary files

---

### Completion

After the orchestrator finishes, report to the user:

```
✅ Repository assimilated successfully!

Generated <N> skills across <N> categories:
  - architecture/  <list skills>
  - reliability/   <list skills>
  - quality/       <list skills>

Skills are available at:
  .github/skills/<category>/<skill>/SKILL.md
  .claude/skills/<category>/<skill>/SKILL.md

Would you like me to demonstrate one of these skills?
```

---

### Error Recovery

If any phase fails:

```
❌ Assimilation failed at phase <N>

Error: <error-message>

Options:
1. Fix the issue and re-run: "/assimilate-repo"
2. Cleanup partial results: "rm -rf .github/temp"
3. Debug: Check ".github/temp/" for intermediate outputs
```

---

### Demo Offer

After successful assimilation, offer to demonstrate a skill:

> "Want me to demonstrate the `<skill-name>` skill? Just say 'use <skill-name>' to see it in action."
