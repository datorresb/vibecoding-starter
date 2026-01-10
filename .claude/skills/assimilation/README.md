# Assimilation Skills

Skills for extracting patterns from repositories and generating reusable AI agent skills.

## Overview

The assimilation pipeline transforms any repository into structured skills that AI agents can discover and use.

```
Repository → Scan → Extract → Generate → Skills
              │       │          │
              ▼       ▼          ▼
         scan-report  patterns   SKILL.md files
```

## Skills in This Category

| Skill | Phase | Purpose |
|-------|-------|---------|
| [repo-scanner](repo-scanner/SKILL.md) | 1 | Scan repository structure, detect language/framework |
| [pattern-extractor](pattern-extractor/SKILL.md) | 2 | Extract patterns with confidence scoring |
| [skill-generator](skill-generator/SKILL.md) | 3 | Regularize and generate SKILL.md files |
| [orchestrator](orchestrator/SKILL.md) | - | Coordinate all phases in sequence |

## Quick Start

### Using the Prompt

```
/assimilate-repo https://github.com/expressjs/express
```

Or for a local repo:

```
/assimilate-repo ./path/to/repo
```

### Manual Execution

```bash
# Phase 1: Scan
# Load: .claude/skills/assimilation/repo-scanner/SKILL.md

# Phase 2: Extract  
# Load: .claude/skills/assimilation/pattern-extractor/SKILL.md

# Phase 3: Generate
# Load: .claude/skills/assimilation/skill-generator/SKILL.md

# Or use orchestrator for all phases:
# Load: .claude/skills/assimilation/orchestrator/SKILL.md
```

## Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     ASSIMILATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: REPO-SCANNER                                           │
│ • Apply ignore patterns (node_modules, .git, etc.)              │
│ • Detect language from config files                             │
│ • Identify framework and domains                                │
│ • Output: .github/temp/scan-report.json                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2: PATTERN-EXTRACTOR                                      │
│ • Semantic grep for patterns by category                        │
│ • Calculate confidence: freq×0.30 + consist×0.30 + doc×0.20     │
│ • Require ≥2 evidence locations                                 │
│ • Output: .github/temp/patterns.json                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 3: SKILL-GENERATOR                                        │
│ • Apply category thresholds (arch≥0.80, security≥0.80, etc.)    │
│ • Regularize: remove repo-specific paths                        │
│ • Apply YAML safety escaping                                    │
│ • Generate SKILL.md with frontmatter                            │
│ • Output: .claude/skills/<category>/<pattern>/SKILL.md          │
└─────────────────────────────────────────────────────────────────┘
```

## Category Thresholds

| Category | Min Confidence | Rationale |
|----------|---------------|-----------|
| `architecture` | 0.80 | Errors are costly |
| `security` | 0.80 | High risk |
| `reliability` | 0.75 | Important |
| `quality` | 0.70 | Medium risk |
| `conventions` | 0.60 | Low risk, experimental OK |

## Confidence Formula

```
composite = frequency × 0.30 
          + consistency × 0.30 
          + documentation × 0.20 
          + external_validation × 0.20
```

## E2E Validated Repos

| Repository | Skills Generated | Status |
|------------|------------------|--------|
| expressjs/express | 7 | ✅ Pass |
| agentsmith-cli | 8 | ✅ Pass |

## Related

- [TRD-assimilation.md](../../docs/plans/TRD-assimilation.md) - Technical requirements
- [assimilate-repo.prompt.md](../../.github/prompts/assimilate-repo.prompt.md) - VS Code prompt
