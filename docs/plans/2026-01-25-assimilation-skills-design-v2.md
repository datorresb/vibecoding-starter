# Assimilation Skills Design v2

**Date:** 2026-01-25  
**Status:** Validated  
**Origin:** Brainstorming session - extract agentsmith-cli logic into reusable skills  
**Supersedes:** 2026-01-25-assimilation-skills-design.md

---

## Objective

Convert agentsmith-cli's TypeScript logic into pure markdown skills that any AI agent can follow to "assimilate" a repository—analyzing its structure, extracting patterns, and generating project-specific skills.

---

## Architecture

### File Structure

```
.claude/skills/assimilation/
├── repo-scanner/
│   └── SKILL.md           # Phase 1: Deep structural scan
├── pattern-extractor/
│   └── SKILL.md           # Phase 2: Extract code patterns
├── skill-generator/
│   └── SKILL.md           # Phase 3: Generate SKILL.md files
├── agent-generator/
│   └── SKILL.md           # Phase 4: Generate agents (optional)
└── orchestrator/
    └── SKILL.md           # Meta-skill: coordinates all phases

.github/prompts/
└── assimilate-repo.prompt.md  # Entry point - invokes orchestrator as subagent
```

### Flow

```
User: "assimilate this repo"
    ↓
prompt: assimilate-repo.prompt.md
    ↓
Launch subagent with skill: assimilation/orchestrator
    ↓
Orchestrator executes in sequence:
    1. repo-scanner      → produces: scan-report.json
    2. pattern-extractor → produces: patterns.json  
    3. skill-generator   → produces: .claude/skills/<repo>/
    4. agent-generator   → produces: .claude/agents/<repo>/ (if applicable)
    ↓
Orchestrator reports: "Generated X skills and Y agents"
```

---

## Skill Specifications

### 1. repo-scanner

**Purpose:** Deep scan of repository structure without reading all code.

#### Ignore Patterns (MUST skip these)

```
# Dependencies
node_modules/
vendor/
.venv/
venv/
__pycache__/

# Build outputs
dist/
build/
.next/
out/
target/
coverage/

# Version control
.git/

# Lock files (don't analyze, but note their existence)
package-lock.json
yarn.lock
pnpm-lock.yaml
Cargo.lock
poetry.lock

# Environment
.env
.env.*
```

#### File Prioritization

Read files in this order (most important first):

1. **Config files** — package.json, tsconfig.json, pyproject.toml, Cargo.toml, go.mod
2. **Entry points** — main.ts, index.js, app.py, main.go, lib.rs
3. **README** — README.md, README.rst
4. **Shallow files** — Files with fewer directory levels (depth 1-2)
5. **Source files** — Skip test files for initial scan

**Max file size:** 10KB — Skip larger files (likely generated/data)

#### Framework Detection

Read the main config file and detect frameworks:

| Config File | Check For | Framework |
|-------------|-----------|-----------|
| package.json | `dependencies.next` | Next.js |
| package.json | `dependencies.react` | React |
| package.json | `dependencies.vue` | Vue.js |
| package.json | `dependencies.express` | Express.js |
| package.json | `dependencies.fastify` | Fastify |
| package.json | `dependencies.@nestjs/core` | NestJS |
| package.json | `dependencies.@angular/core` | Angular |
| pyproject.toml | `[tool.poetry.dependencies].django` | Django |
| pyproject.toml | `[tool.poetry.dependencies].fastapi` | FastAPI |
| pyproject.toml | `[tool.poetry.dependencies].flask` | Flask |
| Cargo.toml | `[dependencies].actix-web` | Actix |
| Cargo.toml | `[dependencies].axum` | Axum |
| go.mod | `github.com/gin-gonic/gin` | Gin |
| go.mod | `github.com/labstack/echo` | Echo |

#### Domain Boundary Detection

Scan top-level directories and identify domains:

**Known domain patterns:**
```
api, auth, backend, frontend, core, common, shared,
services, handlers, controllers, models, views, routes,
components, hooks, utils, lib, pkg, internal, cmd,
client, server, admin, public, private, modules
```

**Algorithm:**
1. List all top-level directories
2. Count files in each (excluding tests)
3. Mark as domain if: name matches pattern AND file count > 5
4. Detect sub-domains: if domain has subdirs that also match patterns

**Example output:**
```json
{
  "domains": [
    { "name": "api", "path": "src/api", "files": 45, "subdomains": ["v1", "v2"] },
    { "name": "auth", "path": "src/auth", "files": 23, "subdomains": ["oauth", "rbac"] },
    { "name": "frontend", "path": "frontend", "files": 120, "subdomains": [] }
  ]
}
```

#### What repo-scanner Analyzes

| Category | What it looks for |
|----------|-------------------|
| Structure | Main folders, depth, organization (monorepo, flat, etc.) |
| Config files | package.json, tsconfig, pyproject.toml, Cargo.toml, Makefile |
| Language | Primary language by file extension count |
| Framework | Detected from config files (see table above) |
| Documentation | README, CONTRIBUTING, docs/, wikis |
| Tests | Location, framework (jest, pytest, vitest), coverage |
| CI/CD | .github/workflows, Jenkinsfile, .gitlab-ci.yml |
| Dependencies | Main libraries, versions, dev vs prod |
| Domains | Detected boundaries (see algorithm above) |

#### Commands Executed

```bash
# Structure (ignore patterns applied)
find . -type d -maxdepth 2 ! -path '*/node_modules/*' ! -path '*/.git/*'

# File counts by extension
find . -type f -name "*.ts" | wc -l
find . -type f -name "*.py" | wc -l
# etc.

# Git history (change patterns)
git log --oneline -20
git log --format='%s' -50 | grep -oE '^(feat|fix|docs|refactor|test|chore)' | sort | uniq -c
```

#### Output: `.claude/temp/scan-report.json`

```json
{
  "name": "express",
  "type": "library",
  "language": "JavaScript",
  "framework": "Express.js",
  "structure": {
    "type": "flat",
    "depth": 3,
    "mainDirs": ["lib", "test", "examples"],
    "entryPoints": ["lib/express.js"]
  },
  "domains": [
    { "name": "lib", "path": "lib", "files": 28, "subdomains": ["router", "middleware"] }
  ],
  "tools": {
    "test": "npm test",
    "lint": "npm run lint",
    "build": null
  },
  "dependencies": {
    "runtime": ["accepts", "body-parser", "content-type"],
    "dev": ["mocha", "supertest", "eslint"]
  },
  "docs": ["README.md", "Contributing.md", "History.md"],
  "fileStats": {
    "total": 156,
    "byExtension": { ".js": 89, ".md": 12, ".json": 5 },
    "testFiles": 45,
    "configFiles": 8
  }
}
```

---

### 2. pattern-extractor

**Purpose:** Deep code analysis to extract patterns and conventions.

#### Skill Categories

Each pattern found is classified into one of these categories:

| Category | Description | Examples |
|----------|-------------|----------|
| `architecture` | Design patterns, structure | Middleware chain, MVC, Microservices |
| `reliability` | Error handling, resilience | Retry logic, Circuit breaker, Fallbacks |
| `quality` | Testing, code quality | TDD patterns, Linting rules, Formatting |
| `security` | Auth, validation | Input sanitization, RBAC, JWT handling |
| `patterns` | Project-specific conventions | Naming, File structure, API style |

#### Pattern Detection Techniques

**1. Semantic grep** — Search for keywords:

```bash
# Middleware pattern
grep -r "middleware\|handler\|next()" --include="*.js" --include="*.ts"

# Factory pattern  
grep -r "factory\|create.*=.*function\|build.*=.*(" --include="*.js" --include="*.ts"

# Observer pattern
grep -r "subscribe\|emit\|\.on(" --include="*.js" --include="*.ts"

# Error handling
grep -r "try.*catch\|\.catch(\|throw new" --include="*.js" --include="*.ts"
```

**2. Import/dependency analysis:**

```bash
# Find what imports what
grep -r "^import\|^from\|require(" --include="*.js" --include="*.ts" | head -50
```

**3. Read key files** (respecting 10KB limit):

- Entry points identified in scan
- Files with most imports (likely "hub" files)
- Config files for conventions

**4. Test analysis:**

```bash
# What testing patterns?
grep -r "describe\|it(\|test(\|expect" --include="*.test.*" --include="*.spec.*" | head -30
```

#### Trigger Detection

For each pattern, identify keywords that would trigger using that skill:

```
Pattern: "middleware-chain"
Triggers:
  - "add middleware"
  - "request processing"
  - "work on lib/middleware"
  - "authentication layer"
```

**Trigger sources:**
1. Pattern name itself
2. Directory name where pattern is found
3. Common verbs: "add", "create", "modify", "fix", "refactor"
4. File names containing the pattern

#### Output: `.claude/temp/patterns.json`

```json
{
  "architecture": {
    "style": "layered",
    "layers": ["routes", "middleware", "lib"]
  },
  "conventions": {
    "naming": "camelCase",
    "fileStructure": "flat-by-type",
    "exports": "named"
  },
  "patterns": [
    {
      "name": "middleware-chain",
      "category": "architecture",
      "confidence": 0.95,
      "evidence": ["lib/router/index.js:L45", "lib/application.js:L120"],
      "description": "Request flows through ordered middleware functions",
      "triggers": ["add middleware", "request processing", "work on lib/"]
    },
    {
      "name": "factory-function", 
      "category": "architecture",
      "confidence": 0.85,
      "evidence": ["lib/express.js:L1"],
      "description": "createApplication() returns configured app instance",
      "triggers": ["create app", "initialize express", "new application"]
    },
    {
      "name": "error-first-callback",
      "category": "reliability",
      "confidence": 0.80,
      "evidence": ["lib/router/route.js:L89"],
      "description": "Callbacks receive (err, result) pattern",
      "triggers": ["error handling", "callback pattern", "async error"]
    }
  ],
  "api": {
    "style": "fluent-builder",
    "examples": ["app.use().get().post()"]
  },
  "testing": {
    "framework": "mocha",
    "style": "BDD",
    "patterns": ["describe/it blocks", "supertest for HTTP"]
  }
}
```

---

### 3. skill-generator

**Purpose:** Transform analysis into SKILL.md files.

#### Generation Logic

| Input | Generated Skill | Category |
|-------|-----------------|----------|
| Pattern with confidence > 0.7 | Skill for that pattern | From pattern |
| Architecture layer | Skill for working in that layer | architecture |
| Detected test framework | Testing skill | quality |
| Detected tool (lint, format) | Tool usage skill | quality |
| Security patterns found | Security skill | security |
| Strong naming convention | Style guide skill | patterns |

#### SKILL.md Template

```markdown
---
name: <repo>-<pattern>
description: <Generated from pattern.description>. Use when <triggers as prose>.
---

# <Pattern Name> in <Repo Name>

## Overview

<Generated from analysis - describes the pattern>

## When to Use

Use this skill when:
<Each trigger becomes a bullet point>

## Category

`<category>` — <category description>

## Pattern Structure

<Extracted from evidence files - shows actual code pattern>

## Examples from Codebase

<References to real files with line numbers>

## Conventions

✅ **Do:**
<Detected conventions as bullets>

❌ **Don't:**
<Inferred anti-patterns>

## Related Skills

<Links to other generated skills in same repo category>
```

#### Output Organization

```
.claude/skills/
└── <repo-name>/           # Category = repo name
    ├── middleware/SKILL.md
    ├── routing/SKILL.md
    ├── error-handling/SKILL.md
    └── testing/SKILL.md
```

#### Registry Update

After generating skills, run:

```bash
node .claude/rebuild-registry.js
```

This updates `skills.json` and `skills-index.json` with the new skills.

---

### 4. agent-generator (Optional)

**Purpose:** Generate hierarchical agents for complex repos.

#### When to Generate Agents

| Condition | Action |
|-----------|--------|
| Simple repo (1 domain, < 50 files) | Skip — skills are enough |
| Medium repo (2-3 domains) | Generate 1 root + domain agents |
| Complex repo (4+ domains or monorepo) | Generate full hierarchy |

#### Multi-Level Hierarchy

For complex repos, support nested agents:

```
root-agent
├── api-agent
│   ├── api-v1-agent
│   └── api-graphql-agent
├── auth-agent
│   ├── auth-oauth-agent
│   └── auth-rbac-agent
└── frontend-agent
    ├── frontend-components-agent
    └── frontend-pages-agent
```

#### agent.yaml Structure

```yaml
name: <domain>-agent
description: <Domain description from analysis>
parent: <parent-agent-name or null for root>
skills:
  - <repo>/<skill-1>
  - <repo>/<skill-2>
triggers:
  - "work on <domain>"
  - "modify <domain-path>/"
  - "<domain-specific keywords>"
subAgents:
  - <child-agent-1>
  - <child-agent-2>
```

#### Output Organization

```
.claude/agents/
└── <repo-name>/
    ├── root/agent.yaml
    ├── api/agent.yaml
    ├── api-v1/agent.yaml
    ├── auth/agent.yaml
    └── frontend/agent.yaml
```

---

### 5. orchestrator

**Purpose:** Coordinate all phases in sequence.

#### Flow

```markdown
## Phase 1: Scan
1. Load skill `assimilation/repo-scanner`
2. Apply ignore patterns
3. Prioritize files for analysis
4. Detect language, framework, domains
5. Save result to `.claude/temp/scan-report.json`
6. Report: "Scanned: X files, Y domains, language: Z, framework: W"

## Phase 2: Extract Patterns  
1. Load skill `assimilation/pattern-extractor`
2. Read scan-report.json
3. Run semantic grep for each pattern type
4. Read key files (max 10KB each, max 20 files)
5. Classify patterns by category
6. Generate triggers for each pattern
7. Save to `.claude/temp/patterns.json`
8. Report: "Detected X patterns: Y architecture, Z reliability, W quality"

## Phase 3: Generate Skills
1. Load skill `assimilation/skill-generator`
2. Read scan-report + patterns
3. Filter patterns with confidence > 0.7
4. Generate SKILL.md for each
5. Save to `.claude/skills/<repo>/`
6. Run `node .claude/rebuild-registry.js`
7. Report: "Generated X skills in <repo> category"

## Phase 4: Generate Agents (if applicable)
1. Check complexity:
   - If domains.length < 2: skip
   - If domains.length >= 2: proceed
2. Load skill `assimilation/agent-generator`
3. Generate agent hierarchy based on domains
4. Save to `.claude/agents/<repo>/`
5. Report: "Generated X agents with Y sub-agents"

## Phase 5: Cleanup & Report
1. Delete `.claude/temp/`
2. Show final summary:
   - Skills generated (with paths)
   - Agents generated (if any)
   - How to use: "Load skill <repo>/<name> when..."
   - Suggest: "Try asking me to <sample trigger>"
```

#### Error Handling

| Error | Action |
|-------|--------|
| No config file found | Warn, continue with extension-based detection |
| Framework not detected | Warn, continue with generic patterns |
| No patterns found | Error, ask user if repo is too small/empty |
| File read fails | Skip file, continue |
| Registry update fails | Warn, skills still usable |

---

### 6. assimilate-repo.prompt.md

**Purpose:** User entry point.

```markdown
---
name: assimilate-repo
description: Analyze any repository and generate skills/agents from its patterns
---

- Ask user for target: local path or GitHub URL
- If URL:
  - Clone to `.claude/temp/repos/<repo-name>`
  - Set target to cloned path
- Launch subagent with `assimilation/orchestrator` skill
- Subagent will:
  1. Scan repo structure (respecting ignore patterns)
  2. Detect language, framework, domains
  3. Extract patterns and conventions
  4. Generate skills in .claude/skills/<repo-name>/
  5. Generate agents if complex (optional)
  6. Update skills registry
  7. Cleanup temp files
  8. Report back with summary
- After completion:
  - List generated skills
  - Offer to demonstrate one: "Want me to show you how to use the <skill> skill?"
```

---

## Implementation Order

1. `repo-scanner/SKILL.md` — Foundation, includes ignore patterns, file prioritization, framework detection
2. `pattern-extractor/SKILL.md` — Depends on scanner, includes category classification
3. `skill-generator/SKILL.md` — Depends on patterns, includes trigger generation
4. `orchestrator/SKILL.md` — Coordinates 1-3
5. `agent-generator/SKILL.md` — Optional, add after core works
6. `assimilate-repo.prompt.md` — Entry point

---

## Success Criteria

- [ ] Can assimilate a simple repo (express, lodash) in < 5 minutes
- [ ] Correctly ignores node_modules, .git, dist, etc.
- [ ] Detects framework from package.json/pyproject.toml
- [ ] Identifies domain boundaries for agent generation
- [ ] Prioritizes important files (config > entry > shallow)
- [ ] Respects 10KB file size limit
- [ ] Generated skills have useful triggers
- [ ] Skills are categorized (architecture, reliability, quality, security, patterns)
- [ ] Orchestrator handles errors gracefully
- [ ] Works without any npm dependencies (pure agent instructions)
- [ ] Registry is updated automatically after generation

---

## Differences from v1

| Added | Description |
|-------|-------------|
| Ignore patterns | Explicit list of dirs/files to skip |
| File prioritization | Order of importance for reading files |
| Framework detection | Table of config → framework mappings |
| Domain boundary algorithm | How to detect domains from folder structure |
| Skill categories | 5 categories with descriptions |
| Trigger detection | How to generate triggers for each skill |
| Max file size | 10KB limit |
| Multi-level agents | Support for nested sub-agents |
| Error handling | Table of errors and actions |
