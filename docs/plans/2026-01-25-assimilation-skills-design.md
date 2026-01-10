# Assimilation Skills Design

**Date:** 2026-01-25  
**Status:** Validated  
**Origin:** Brainstorming session - extract agentsmith-cli logic into reusable skills

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

**Analyzes:**

| Category | What it looks for |
|----------|-------------------|
| Structure | Main folders, depth, organization (monorepo, flat, etc.) |
| Config files | package.json, tsconfig, pyproject.toml, Cargo.toml, Makefile |
| Documentation | README, CONTRIBUTING, docs/, wikis |
| Tests | Location, framework (jest, pytest, vitest), coverage |
| CI/CD | .github/workflows, Jenkinsfile, .gitlab-ci.yml |
| Dependencies | Main libraries, versions, dev vs prod |
| Code | Languages used, lines by type, entry points |

**Commands executed:**

```bash
# Structure
find . -type f -name "*.json" | head -20
tree -L 2 -d

# Code stats
cloc . --json  # or wc -l alternative

# Git history (change patterns)
git log --oneline -20
```

**Output:** `.claude/temp/scan-report.json`

```json
{
  "name": "express",
  "type": "library",
  "languages": ["javascript"],
  "structure": {
    "type": "flat",
    "mainDirs": ["lib", "test", "examples"],
    "entryPoints": ["lib/express.js"]
  },
  "tools": {
    "test": "npm test",
    "lint": "npm run lint",
    "build": null
  },
  "dependencies": {
    "runtime": ["accepts", "body-parser"],
    "dev": ["mocha", "supertest"]
  },
  "docs": ["README.md", "Contributing.md"],
  "patterns": {
    "detected": ["middleware-chain", "factory-pattern"]
  }
}
```

---

### 2. pattern-extractor

**Purpose:** Deep code analysis to extract patterns and conventions.

**Extracts:**

| Pattern | Detection method |
|---------|------------------|
| Architecture | Layers (controllers, services, models), modules, boundaries |
| Conventions | Naming (camelCase, snake_case), file structure |
| Code patterns | Factory, Singleton, Middleware, Observer, etc. |
| API patterns | REST, GraphQL, RPC, events |
| Error handling | Try/catch, Result types, error boundaries |
| Testing patterns | Unit, integration, e2e, mocks, fixtures |

**Techniques:**

1. **Semantic grep** — Search for keywords:
   - "middleware", "handler", "controller" → Middleware pattern
   - "factory", "create", "build" → Factory pattern
   - "subscribe", "emit", "on(" → Observer/Event pattern

2. **Import analysis** — Who depends on whom:
   - Detect layers (UI → Service → Data)
   - Identify core modules vs utils

3. **Key code reading** — Entry points, main exports:
   - Read 5-10 most important files
   - Understand public API

4. **Test analysis** — What is tested and how:
   - Mock patterns
   - Fixtures and setup

**Output:** `.claude/temp/patterns.json`

```json
{
  "architecture": {
    "style": "layered",
    "layers": ["routes", "middleware", "lib"]
  },
  "conventions": {
    "naming": "camelCase",
    "fileStructure": "flat-by-type"
  },
  "patterns": [
    {
      "name": "middleware-chain",
      "confidence": 0.95,
      "evidence": ["lib/router/index.js:L45", "lib/application.js:L120"],
      "description": "Request flows through ordered middleware functions"
    },
    {
      "name": "factory-function", 
      "confidence": 0.85,
      "evidence": ["lib/express.js:L1"],
      "description": "createApplication() returns configured app instance"
    }
  ],
  "api": {
    "style": "fluent-builder",
    "examples": ["app.use().get().post()"]
  }
}
```

---

### 3. skill-generator

**Purpose:** Transform analysis into SKILL.md files.

**Generation logic:**

| Input | Generated Skill |
|-------|-----------------|
| Pattern with confidence > 0.7 | Skill for that pattern |
| Architecture layer (services, models) | Skill for working in that layer |
| Detected tool (test, lint, build) | Skill for using that tool |
| Strong convention | Project "style guide" skill |

**SKILL.md template:**

```markdown
---
name: <repo>-<pattern>
description: <Generated from analysis>
---

# <Pattern Name>

## Overview
[Generated from analysis - describes the pattern]

## When to Use
- [Trigger conditions]

## Pattern Structure
[Extracted from code - shows actual pattern]

## Examples from Codebase
[References to real files: lib/router/index.js:L45]

## Do's and Don'ts
✅ Do: [Detected conventions]
❌ Don't: [Inferred anti-patterns]

## Related Skills
- [Links to other generated skills]
```

**Output organization:**

```
.claude/skills/
└── <repo-name>/           # Category = repo name
    ├── middleware/SKILL.md
    ├── routing/SKILL.md
    ├── error-handling/SKILL.md
    └── testing/SKILL.md
```

---

### 4. agent-generator (Optional)

**Purpose:** Generate hierarchical agents for complex repos.

**When to generate:**

| Condition | Generated Agent |
|-----------|-----------------|
| Monorepo with 3+ packages | One agent per package |
| Clear layers (frontend/backend/infra) | One agent per layer |
| Separate business domains | One agent per domain |
| Simple repo | Root agent only (or none) |

**agent.yaml structure:**

```yaml
name: express-core
description: Core Express.js library agent
skills:
  - express/middleware
  - express/routing
  - express/error-handling
triggers:
  - "work on express core"
  - "modify lib/"
subAgents:
  - express-testing
  - express-examples
```

---

### 5. orchestrator

**Purpose:** Coordinate all phases in sequence.

**Flow:**

```markdown
## Phase 1: Scan
1. Load skill `assimilation/repo-scanner`
2. Execute scan of target
3. Save result to `.claude/temp/scan-report.json`
4. Report: "Scanned: X files, Y folders, main language: Z"

## Phase 2: Extract Patterns  
1. Load skill `assimilation/pattern-extractor`
2. Read scan-report.json
3. Analyze key code
4. Save to `.claude/temp/patterns.json`
5. Report: "Detected X high-confidence patterns"

## Phase 3: Generate Skills
1. Load skill `assimilation/skill-generator`
2. Read scan-report + patterns
3. Generate SKILL.md files in `.claude/skills/<repo>/`
4. Update registry with `node rebuild-registry.js`
5. Report: "Generated X skills in <repo> category"

## Phase 4: Generate Agents (if applicable)
1. If complex repo (monorepo, multiple domains):
   - Load skill `assimilation/agent-generator`
   - Generate agent.yaml files
2. If simple repo: skip
3. Report result

## Phase 5: Cleanup & Report
1. Delete `.claude/temp/`
2. Show final summary:
   - Generated skills
   - Generated agents (if any)
   - How to use them
```

---

### 6. assimilate-repo.prompt.md

**Purpose:** User entry point.

```markdown
---
name: assimilate-repo
description: Analyze any repository and generate skills/agents from its patterns
---

- Ask user for target: local path or GitHub URL
- Launch subagent with `assimilation/orchestrator` skill
- Subagent will:
  1. Clone repo if URL (to .claude/temp/repos/)
  2. Run full assimilation pipeline
  3. Generate skills in .claude/skills/<repo-name>/
  4. Update skills registry
  5. Report back with summary
- After completion, offer to demonstrate one of the generated skills
```

---

## Implementation Order

1. `repo-scanner/SKILL.md` — Foundation, most reusable
2. `pattern-extractor/SKILL.md` — Depends on scanner output
3. `skill-generator/SKILL.md` — Depends on patterns output
4. `orchestrator/SKILL.md` — Coordinates 1-3
5. `agent-generator/SKILL.md` — Optional, add later
6. `assimilate-repo.prompt.md` — Entry point

---

## Success Criteria

- [ ] Can assimilate a simple repo (express, lodash) in < 5 minutes
- [ ] Generated skills are useful and follow the SKILL.md standard
- [ ] Orchestrator handles errors gracefully
- [ ] Works without any npm dependencies (pure agent instructions)
- [ ] Registry is updated automatically after generation
