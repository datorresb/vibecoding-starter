# Assimilation Skills Design v3

**Date:** 2026-01-25  
**Status:** Superseded by TRD  
**Origin:** Brainstorming session - extract agentsmith-cli logic into reusable skills  
**Supersedes:** 2026-01-25-assimilation-skills-design-v2.md  
**Superseded By:** [TRD-assimilation.md](./TRD-assimilation.md) ← **Use this as source of truth**

> ⚠️ **Note:** This document is the design exploration. For verifiable requirements,  
> agents MUST consult [TRD-assimilation.md](./TRD-assimilation.md).

---

## Changes from v2

| Removed | Reason | Replacement |
|---------|--------|-------------|
| `agent.yaml` | Not a standard, no external support | Rich SKILL.md descriptions + AGENTS.md sections |
| `triggers` field | Not in Agent Skills spec | Keywords in `description` field |
| `parent`/`subAgents` hierarchy | Not standardized | Programmatic subagent invocation |
| Skills organized by repo | Overfitting risk | Skills organized by category |

| Added | Purpose |
|-------|---------|
| Regularization layer | Anti-overfitting checks |
| Composite confidence score | Better pattern validation |
| Two-part SKILL.md template | Separate abstract pattern from concrete examples |
| Feedback loop phase | Cross-repo validation |

---

## Objective

Convert agentsmith-cli's TypeScript logic into pure markdown skills following the [Agent Skills open standard](https://agentskills.io) that any AI agent can use to "assimilate" a repository—analyzing its structure, extracting patterns, and generating project-specific skills.

---

## Standards Used

| Standard | Source | Purpose | Compatibility |
|----------|--------|---------|---------------|
| [SKILL.md](https://agentskills.io/specification) | Anthropic/agentskills | Skill definition | Claude, Copilot, VS Code, +15 tools |
| [AGENTS.md](https://agents.md) | OpenAI/agentsmd | Project-level instructions | Claude, Copilot, Windsurf |
| [.agent.md](https://code.visualstudio.com/docs/copilot/customization/custom-agents) | VS Code/Copilot | Custom agents with handoffs | VS Code Copilot only |
| [.prompt.md](https://code.visualstudio.com/docs/copilot/customization/prompt-files) | VS Code/Copilot | Reusable prompts | VS Code Copilot only |

**Not used:** Custom formats like agent.yaml, triggers.json, or non-standard hierarchies.

---

## Architecture

### File Structure

```
.github/
├── skills/assimilation/
│   ├── repo-scanner/
│   │   └── SKILL.md           # Phase 1: Deep structural scan
│   ├── pattern-extractor/
│   │   └── SKILL.md           # Phase 2: Extract code patterns
│   ├── skill-generator/
│   │   └── SKILL.md           # Phase 3: Generate SKILL.md files
│   └── orchestrator/
│       └── SKILL.md           # Meta-skill: coordinates all phases
├── prompts/
│   └── assimilate-repo.prompt.md  # Entry point (VS Code: /assimilate-repo)
└── agents/                        # Optional: VS Code custom agents
    └── assimilator.agent.md       # Agent with handoffs for workflow
```

> **Note:** `.github/agents/` and `.github/prompts/` are VS Code Copilot specific.  
> Claude Code uses `.claude/skills/` and loads skills via description matching.

> **Dual output mode (MVP):** Skills are generated to BOTH `.github/skills/` and `.claude/skills/`  
> to ensure compatibility with VS Code Copilot and Claude Code without configuration.

### Flow

```
User: "assimilate this repo"
    ↓
prompt: assimilate-repo.prompt.md
    ↓
Launch subagent with skill: assimilation/orchestrator
    ↓
Orchestrator executes in sequence:
    1. repo-scanner        → produces: scan-report.json
    2. pattern-extractor   → produces: patterns.json  
    3. regularization      → produces: filtered-patterns.json
    4. skill-generator     → produces: .github/skills/<category>/
    ↓
Orchestrator reports: "Generated X skills in Y categories"
```

---

## Skill Specifications

### 1. repo-scanner

**Purpose:** Deep scan of repository structure without reading all code.

#### Ignore Patterns (MUST skip these)

```
node_modules/    vendor/         .venv/          __pycache__/
dist/            build/          .next/          target/
coverage/        .git/           out/

# Note existence but don't analyze:
package-lock.json    yarn.lock    pnpm-lock.yaml
Cargo.lock           poetry.lock
```

#### File Prioritization

Read files in this order (most important first):

| Priority | Files | Why |
|----------|-------|-----|
| 1 | Config files | package.json, tsconfig.json, pyproject.toml, Cargo.toml |
| 2 | Entry points | main.ts, index.js, app.py, main.go, lib.rs |
| 3 | README | README.md, README.rst |
| 4 | Shallow files | Files at depth 1-2 |
| 5 | Source files | Skip test files in initial scan |

**Max file size:** 10KB — Skip larger files (likely generated/data)

#### Framework Detection

| Config File | Check For | Framework |
|-------------|-----------|-----------|
| package.json | `dependencies.next` | Next.js |
| package.json | `dependencies.react` | React |
| package.json | `dependencies.vue` | Vue.js |
| package.json | `dependencies.express` | Express.js |
| package.json | `dependencies.fastify` | Fastify |
| package.json | `dependencies.@nestjs/core` | NestJS |
| pyproject.toml | `django` in dependencies | Django |
| pyproject.toml | `fastapi` in dependencies | FastAPI |
| pyproject.toml | `flask` in dependencies | Flask |
| Cargo.toml | `actix-web` | Actix |
| Cargo.toml | `axum` | Axum |
| go.mod | `github.com/gin-gonic/gin` | Gin |

#### Domain Boundary Detection

**Known domain patterns:**
```
api, auth, backend, frontend, core, common, shared,
services, handlers, controllers, models, views, routes,
components, hooks, utils, lib, pkg, internal, cmd
```

**Algorithm:**
1. List all top-level directories
2. Count files in each (excluding tests)
3. Mark as domain if: name matches pattern AND file count > 5

#### Output: `.github/temp/scan-report.json`

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
    { "name": "lib", "path": "lib", "files": 28 }
  ],
  "tools": {
    "test": "npm test",
    "lint": "npm run lint",
    "build": null
  },
  "docs": ["README.md", "Contributing.md"]
}
```

---

### 2. pattern-extractor

**Purpose:** Deep code analysis to extract patterns and conventions.

#### Skill Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `architecture` | Design patterns, structure | Middleware, MVC, Factory |
| `reliability` | Error handling, resilience | Retry, Circuit breaker |
| `quality` | Testing, code quality | TDD, Linting |
| `security` | Auth, validation | RBAC, Input sanitization |
| `conventions` | Project-specific style | Naming, File structure |

#### Pattern Detection

**1. Semantic grep:**
```bash
# Middleware pattern
grep -rn "middleware\|handler\|next()" --include="*.js"

# Factory pattern  
grep -rn "create.*=.*function\|factory" --include="*.js"

# Error handling
grep -rn "try.*catch\|\.catch(\|throw new" --include="*.js"
```

**2. Key file analysis** (max 10KB each, max 20 files)

**3. Confidence Score Calculation:**

```
confidence = (
    frequency    × 0.30 +    # In how many files?
    consistency  × 0.30 +    # Same implementation each time?
    documentation × 0.20 +   # Documented in README/comments?
    external     × 0.20      # Known pattern (GoF, etc)?
)
```

#### Output: `.github/temp/patterns.json`

```json
{
  "patterns": [
    {
      "name": "middleware-chain",
      "category": "architecture",
      "confidence": 0.85,
      "scores": {
        "frequency": 0.9,
        "consistency": 0.8,
        "documentation": 0.7,
        "external": 1.0
      },
      "evidence": ["lib/router/index.js:L45", "lib/application.js:L120"],
      "description": "Request flows through ordered middleware functions"
    }
  ],
  "conventions": {
    "naming": "camelCase",
    "fileStructure": "flat-by-type"
  }
}
```

---

### 3. Regularization Layer (NEW in v3)

**Purpose:** Prevent overfitting by filtering and abstracting patterns.

#### Checks Applied

| Check | Action |
|-------|--------|
| **Abstraction filter** | Remove: specific paths, variable names. Keep: pattern structure |
| **Deduplication** | Cluster similar patterns by name + category + keywords (heuristic match), merge duplicates |
| **Registry lookup** | Check `skills-index.json` or `skills.json` if exists; match by name + tags |
| **Threshold by category** | See table below |

#### Dynamic Thresholds

| Category | Min Confidence | Rationale |
|----------|---------------|-----------|
| architecture | 0.80 | Errors are costly |
| security | 0.80 | High risk |
| reliability | 0.75 | Important |
| quality | 0.70 | Medium risk |
| conventions | 0.60 | Low risk, more experimental OK |

#### Output: `.github/temp/filtered-patterns.json`

Same structure as patterns.json but:
- Only patterns above threshold
- Duplicates merged
- `status` field added: `"validated"` or `"experimental"`

---

### 4. skill-generator

**Purpose:** Transform filtered patterns into SKILL.md files following [Agent Skills spec](https://agentskills.io/specification).

#### SKILL.md Template (Two-Part Structure)

```markdown
---
name: <pattern-name>
description: <WHAT it does>. Use when <WHEN to use - keywords for discovery>.
metadata:
  source-repo: <original-repo>
  confidence: <0.XX>
  status: validated|experimental
  category: architecture|reliability|quality|security|conventions
---

# <Pattern Name>

## Overview

<Abstract description of the pattern - GENERALIZABLE>

## When to Use

Use this skill when:
- <Trigger condition as prose>
- <Another trigger>

## Pattern Structure

<Pseudocode or abstract structure - NOT repo-specific code>

```pseudocode
function middleware(req, res, next) {
    // Process request
    // Call next() to continue chain
    // Or send response to terminate
}
```

## Examples

> These examples are from the source repository and show one implementation.
> Adapt the pattern to your project's conventions.

See: `lib/router/index.js:L45` in expressjs/express

## Conventions

✅ **Do:**
- <Detected convention>

❌ **Don't:**
- <Inferred anti-pattern>

## Related

- [Other related skill](../other-skill/SKILL.md)
```

#### Key Differences from v2

| v2 | v3 |
|----|-----|
| Skills in `.claude/skills/<repo>/` | Skills in `.github/skills/<category>/` |
| Examples copied inline | Examples as references (links) |
| Triggers as explicit field | Triggers embedded in `description` |

#### Output Organization (Dual Mode)

```
# Generated to BOTH locations for compatibility:

.github/skills/              ← VS Code Copilot
├── architecture/
│   ├── middleware-chain/SKILL.md
│   └── factory-pattern/SKILL.md
├── reliability/
│   └── error-first-callback/SKILL.md
└── quality/
    └── mocha-testing/SKILL.md

.claude/skills/              ← Claude Code
└── (same structure)
```

---

### 5. orchestrator

**Purpose:** Coordinate all phases in sequence.

#### Flow

```markdown
## Phase 1: Scan
1. Load skill: assimilation/repo-scanner
2. Apply ignore patterns
3. Detect language, framework, domains
4. Save: `.github/temp/scan-report.json`
5. Report: "Scanned: X files, Y domains, language: Z"

## Phase 2: Extract Patterns  
1. Load skill: assimilation/pattern-extractor
2. Run semantic grep
3. Calculate confidence scores
4. Save: `.github/temp/patterns.json`
5. Report: "Found X patterns across Y categories"

## Phase 3: Regularize (NEW)
1. Apply abstraction filter
2. Deduplicate similar patterns
3. Check against registry
4. Apply category thresholds
5. Save: `.github/temp/filtered-patterns.json`
6. Report: "Filtered to X high-confidence patterns"

## Phase 4: Generate Skills
1. Load skill: assimilation/skill-generator
2. Generate SKILL.md for each filtered pattern
3. Save to `.github/skills/<category>/`
4. Report: "Generated X skills"

## Phase 5: Update Project AGENTS.md (NEW)
1. If AGENTS.md exists: append skills section
2. If not: create minimal AGENTS.md
3. Add section listing generated skills and when to use

## Phase 5b: Generate VS Code Agents (Optional)
1. If VS Code Copilot user: generate .github/agents/<repo>.agent.md
2. Include handoffs for workflow: scan → extract → generate
3. Reference generated skills in agent tools

## Phase 6: Cleanup & Report
1. Delete `.github/temp/`
2. Summary:
   - Skills generated (with categories)
   - How to use: "Ask agent to use <skill-name> when <trigger>"
   - Experimental skills that need review
```

#### Generated AGENTS.md Section

```markdown
## Generated Skills

The following skills were auto-generated from repository analysis:

### Architecture
| Skill | Use When |
|-------|----------|
| [middleware-chain](.github/skills/architecture/middleware-chain/SKILL.md) | Adding request processing, authentication layers |
| [factory-pattern](.github/skills/architecture/factory-pattern/SKILL.md) | Creating new instances, initialization |

### Quality  
| Skill | Use When |
|-------|----------|
| [mocha-testing](.github/skills/quality/mocha-testing/SKILL.md) | Writing tests, TDD |

> Skills marked as `experimental` in their metadata need human review.
```

---

### 6. assimilate-repo.prompt.md

```markdown
---
description: Analyze any repository and generate skills from its patterns
---

## Assimilate Repository

Ask user for target:
- Local path: `/path/to/repo`
- GitHub URL: `https://github.com/owner/repo`

If URL:
1. Clone to `.github/temp/repos/<repo-name>`
2. Set target to cloned path

Launch subagent with skill: `assimilation/orchestrator`

The subagent will:
1. Scan repository structure
2. Extract and classify patterns  
3. Filter for high-confidence patterns (regularization)
4. Generate SKILL.md files in `.github/skills/<category>/`
5. Update AGENTS.md with skills reference
6. Report summary

After completion:
- List generated skills by category
- Highlight any `experimental` skills needing review
- Offer: "Want me to demonstrate the <skill-name> skill?"
```

---

## Feedback Loop (Post-Generation)

### Usage Tracking

```json
// .github/skills-usage.json (append-only, updated by orchestrator only)
{
  "middleware-chain": {
    "invocations": 12,
    "last-used": "2026-01-20",
    "feedback": "positive"
  }
}
```

> **Write rules:** Only the orchestrator writes to this file. Append-only format prevents conflicts.

### Promotion Rules

| Condition | Action |
|-----------|--------|
| `experimental` + invocations > 5 + no negative feedback | Promote to `validated` |
| `validated` + invocations = 0 for 30 days | Mark as `stale` |
| Negative feedback | Flag for human review |

---

## Complete Pipeline Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INPUT                                          │
│                    Repository (local or GitHub URL)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1: REPO-SCANNER                                                      │
│  ───────────────────                                                        │
│  • Ignore: node_modules, .git, dist, coverage                               │
│  • Priority: config → entry → README → shallow                              │
│  • Detect: language, framework, domains                                     │
│  • Output: scan-report.json                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 2: PATTERN-EXTRACTOR                                                 │
│  ─────────────────────────                                                  │
│  • Semantic grep for patterns                                               │
│  • Classify: architecture | reliability | quality | security | conventions  │
│  • Confidence = freq(0.3) + consist(0.3) + doc(0.2) + external(0.2)         │
│  • Output: patterns.json                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 3: REGULARIZATION (anti-overfitting)                                 │
│  ─────────────────────────────────────────                                  │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ 1. Abstraction: Remove paths, var names → Keep pattern structure       │ │
│  │ 2. Deduplication: Heuristic match (name + category + keywords) → Merge   │ │
│  │ 3. Registry check: skills-index.json / skills.json → Enrich if exists   │ │
│  │ 4. Thresholds: architecture(0.8), security(0.8), quality(0.7)          │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│  • Output: filtered-patterns.json                                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 4: SKILL-GENERATOR                                                   │
│  ───────────────────────                                                    │
│  • Two-part template: Pattern (abstract) + Examples (references)            │
│  • Keywords in description (not separate triggers)                          │
│  • Organize by category, not by source repo                                 │
│  • Output: .github/skills/<category>/<pattern>/SKILL.md                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5: UPDATE AGENTS.MD                                                  │
│  ────────────────────────                                                   │
│  • Append "Generated Skills" section                                        │
│  • Table: Skill | Use When                                                  │
│  • Flag experimental skills                                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              OUTPUT                                         │
│                                                                             │
│  .github/                                                                   │
│  ├── skills/                    ← Organized by CATEGORY (VS Code Copilot)  │
│  │   ├── architecture/                                                      │
│  │   │   ├── middleware-chain/SKILL.md                                      │
│  │   │   └── factory-pattern/SKILL.md                                       │
│  │   ├── reliability/                                                       │
│  │   │   └── error-first-callback/SKILL.md                                  │
│  │   └── quality/                                                           │
│  │       └── mocha-testing/SKILL.md                                         │
│  └── skills-usage.json          ← Usage tracking (append-only)              │
│                                                                             │
│  .claude/skills/                ← Same structure (Claude Code)              │
│  └── (mirrors .github/skills/)                                              │
│                                                                             │
│  AGENTS.md                      ← Updated with skills reference             │
│                                                                             │
│  .github/agents/ (VS Code only)                                             │
│  └── <repo>.agent.md            ← Custom agent with handoffs                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Order

1. `repo-scanner/SKILL.md` — Foundation
2. `pattern-extractor/SKILL.md` — With confidence scoring
3. `skill-generator/SKILL.md` — With two-part template
4. `orchestrator/SKILL.md` — Including regularization logic
5. `assimilate-repo.prompt.md` — Entry point

---

## Success Criteria

- [ ] Uses only standard formats: SKILL.md (agentskills.io) + AGENTS.md (agents.md)
- [ ] No agent.yaml or custom hierarchy formats
- [ ] Correctly ignores node_modules, .git, dist, etc.
- [ ] Detects framework from config files
- [ ] Confidence score is composite (4 factors)
- [ ] Regularization layer prevents overfitting
- [ ] Skills organized by category, not source repo
- [ ] Generated skills have abstract patterns + reference examples
- [ ] AGENTS.md updated with skills table
- [ ] Works without npm dependencies (pure agent instructions)
- [ ] Experimental skills flagged for review

---

## Appendix: Why No agent.yaml?

| What v2 proposed | Why removed in v3 |
|------------------|-------------------|
| `agent.yaml` with triggers | Not in any standard (agentskills.io, agents.md) |
| `parent`/`subAgents` hierarchy | Use `.agent.md` handoffs instead (VS Code) or programmatic subagents (Claude) |
| Explicit `triggers` field | Agent Skills spec uses `description` for discovery |

**How v3 achieves the same goals:**

| Goal | v2 Approach | v3 Approach |
|------|-------------|-------------|
| Agent knows when to use skill | `triggers` field | Keywords in `description` |
| Hierarchical agents | `parent`/`subAgents` | `.agent.md` handoffs (VS Code) or runSubagent tool (Claude) |
| Scope restriction | `scope.include/exclude` | Mentioned in SKILL.md body |
| Workflow between agents | Custom hierarchy | `.agent.md` handoffs with `send: true/false` |

This ensures generated skills work with:
- **Claude Code**: Skills loaded via description matching
- **VS Code Copilot**: Skills + custom agents with handoffs
- **Other tools**: Any Agent Skills-compatible tool (Windsurf, etc.)
