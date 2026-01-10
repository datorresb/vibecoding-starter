# Assimilation Skills - Technical Requirements Document

**Version:** 1.0  
**Date:** 2026-01-25  
**Status:** Active  
**Design Doc:** [2026-01-25-assimilation-skills-design-v3.md](./2026-01-25-assimilation-skills-design-v3.md)

---

## Agent Consultation Rule

> **MANDATORY:** Any agent executing assimilation skills MUST read this TRD  
> before acting. Violations of MUST rules are implementation errors.  
> SHOULD rules are recommended but may be overridden with justification.

---

## 1. Functional Requirements

### FR-1: Repository Scanning

| ID | Requirement | Level | Validation |
|----|-------------|-------|------------|
| FR-1.1 | Scanner MUST skip directories matching ignore patterns: `node_modules/`, `.git/`, `vendor/`, `.venv/`, `__pycache__/`, `dist/`, `build/`, `.next/`, `target/`, `coverage/`, `out/` | MUST | Verify scan-report.json has no ignored paths |
| FR-1.2 | Scanner SHOULD skip files >10KB (likely generated/data) | SHOULD | Configurable threshold |
| FR-1.3 | Scanner MUST detect language from config files before inferring from extensions | MUST | Check language field populated |
| FR-1.4 | Scanner MUST detect framework from config files (package.json, pyproject.toml, Cargo.toml, go.mod) | MUST | Check framework field |
| FR-1.5 | Scanner MUST produce `.github/temp/scan-report.json` or FAIL explicitly with error message | MUST | Output file exists or error logged |
| FR-1.6 | Scanner MUST prioritize files in order: config → entry points → README → shallow → source | MUST | Verify processing order in implementation |

### FR-2: Pattern Extraction

| ID | Requirement | Level | Validation |
|----|-------------|-------|------------|
| FR-2.1 | Extractor MUST require ≥2 evidence locations to consider a pattern | MUST | Check `evidence` array length ≥2 |
| FR-2.2 | Confidence score MUST be in 0.0-1.0 range (inclusive) | MUST | Validate numeric bounds |
| FR-2.3 | Each pattern MUST have category from enum: `architecture`, `reliability`, `quality`, `security`, `conventions` | MUST | Validate against enum |
| FR-2.4 | Confidence MUST be calculated as: `frequency×0.30 + consistency×0.30 + documentation×0.20 + external×0.20` | MUST | Verify formula in output |
| FR-2.5 | Extractor MUST produce `.github/temp/patterns.json` | MUST | Output file exists |

### FR-3: Regularization

| ID | Requirement | Level | Validation |
|----|-------------|-------|------------|
| FR-3.1 | Regularizer MUST apply category-specific thresholds: architecture≥0.80, security≥0.80, reliability≥0.75, quality≥0.70, conventions≥0.60 | MUST | Verify filtered patterns respect thresholds |
| FR-3.2 | Regularizer MUST remove repo-specific paths/names from pattern descriptions | MUST | Grep for original repo paths in output |
| FR-3.3 | Regularizer SHOULD deduplicate patterns with similar name+category+keywords | SHOULD | Check for obvious duplicates |
| FR-3.4 | Regularizer SHOULD check against existing registry (`skills-index.json`) | SHOULD | Log registry lookups |
| FR-3.5 | Regularizer MUST produce `.github/temp/filtered-patterns.json` | MUST | Output file exists |

### FR-4: Skill Generation

| ID | Requirement | Level | Validation |
|----|-------------|-------|------------|
| FR-4.1 | Generator MUST NOT include repo-specific paths in "Pattern Structure" section | MUST | Grep for source repo paths in pseudocode |
| FR-4.2 | Generator MUST include `source-repo`, `confidence`, `status`, `category` in SKILL.md frontmatter metadata | MUST | Check YAML frontmatter |
| FR-4.3 | Generator MUST output to BOTH `.github/skills/<category>/` AND `.claude/skills/<category>/` | MUST | Verify both paths exist |
| FR-4.4 | Generated SKILL.md MUST have `name` and `description` in frontmatter (agentskills.io minimum) | MUST | Validate frontmatter fields |
| FR-4.5 | Generator MUST organize skills by category, not by source repo | MUST | Check directory structure |
| FR-4.6 | Examples section MUST reference original locations, not copy code inline | MUST | Check for `See:` references |

### FR-5: Orchestration

| ID | Requirement | Level | Validation |
|----|-------------|-------|------------|
| FR-5.1 | Orchestrator MUST execute phases in order: scan → extract → regularize → generate → cleanup | MUST | Verify execution order |
| FR-5.2 | Orchestrator MUST fail fast if any phase produces empty/error output | MUST | Check for early exit on errors |
| FR-5.3 | Orchestrator MUST clean up `.github/temp/` on successful completion | MUST | Verify temp deleted |
| FR-5.4 | Orchestrator MUST produce summary with: skill count, categories, experimental skills | MUST | Check report format |
| FR-5.5 | Orchestrator SHOULD update AGENTS.md with generated skills reference | SHOULD | Check AGENTS.md modification |
| FR-5.6 | Orchestrator MUST be the only writer to `skills-usage.json` (append-only) | MUST | No other phase writes usage |

---

## 2. Non-Functional Requirements

| ID | Requirement | Level | Rationale |
|----|-------------|-------|-----------|
| NFR-1 | All generated skills MUST follow [agentskills.io spec](https://agentskills.io/specification) | MUST | Standard compatibility with Claude, Copilot, +15 tools |
| NFR-2 | Skills MUST NOT depend on external network calls at runtime | MUST | Offline operation |
| NFR-3 | Skills MUST be regenerable: same repo input → same skills output (idempotent) | MUST | Reproducibility |
| NFR-4 | Temp files MUST be in `.github/temp/` (not `.claude/temp/`) | MUST | Single cleanup location |
| NFR-5 | All phases SHOULD complete in <30 seconds for repos <1000 files | SHOULD | Acceptable UX |
| NFR-6 | Errors MUST include actionable context (file, line, reason) | MUST | Debuggability |

---

## 3. Invariants

These conditions MUST be true at all times during and after execution:

| # | Invariant | Check |
|---|-----------|-------|
| I-1 | **No Overfitting:** Generated skills describe PATTERNS, not repo-specific code | Pattern Structure section has no hardcoded paths |
| I-2 | **Standard Compliance:** Every SKILL.md has `name` and `description` in frontmatter | Validate all generated files |
| I-3 | **Dual Output:** Skills exist in both `.github/skills/` AND `.claude/skills/` | Directory parity check |
| I-4 | **Evidence-Based:** Every pattern has ≥2 evidence references | Check all patterns |
| I-5 | **Threshold Respected:** No skill generated below its category threshold | Validate confidence vs threshold |
| I-6 | **Clean State:** No temp files remain after successful completion | `.github/temp/` deleted |

---

## 4. Decision Rationale Log

| Decision | Rationale | Alternatives Considered | Date |
|----------|-----------|------------------------|------|
| Dual output mode (.github + .claude) | Support both VS Code Copilot and Claude Code without user config | Single output with symlinks | 2026-01-25 |
| Heuristic dedup (no embeddings) | MVP simplicity; embeddings add external dependency | Vector similarity, LLM-based | 2026-01-25 |
| `skills-index.json` as registry | Simple file-based, no external dependencies | SQLite, external API | 2026-01-25 |
| Append-only usage tracking | Avoid concurrency issues with parallel subagents | Atomic writes, locking | 2026-01-25 |
| Category-based thresholds | Different risk tolerance by pattern type (security > conventions) | Single global threshold | 2026-01-25 |
| ≥2 evidence (not ≥3) | Balance signal quality vs pattern discovery | ≥1 (too loose), ≥3 (too strict) | 2026-01-25 |
| File size as SHOULD not MUST | Some valid patterns exist in larger files; configurable is better | Hard 10KB limit | 2026-01-25 |

---

## 5. Validation Checklist

Before marking implementation complete, verify:

```markdown
## Scanning
- [ ] Ignored directories are skipped
- [ ] Language detected from config
- [ ] Framework detected from config
- [ ] scan-report.json produced

## Extraction  
- [ ] All patterns have ≥2 evidence
- [ ] Confidence scores in valid range
- [ ] Categories are valid enum values
- [ ] patterns.json produced

## Regularization
- [ ] Patterns below threshold filtered
- [ ] No repo-specific paths in descriptions
- [ ] filtered-patterns.json produced

## Generation
- [ ] SKILL.md has required frontmatter
- [ ] Pattern Structure is abstract (no specific paths)
- [ ] Examples use references, not inline code
- [ ] Output in BOTH .github/skills/ AND .claude/skills/
- [ ] Organized by category, not by repo

## Orchestration
- [ ] Phases execute in order
- [ ] Fails fast on errors
- [ ] Temp cleaned up
- [ ] Summary produced with counts

## Standards
- [ ] All SKILL.md pass agentskills.io minimum spec
- [ ] No network dependencies
- [ ] Regeneration produces same output
```

---

## 6. References

- [Agent Skills Specification](https://agentskills.io/specification)
- [AGENTS.md Standard](https://agents.md)
- [Design Doc v3](./2026-01-25-assimilation-skills-design-v3.md)
- [MayorWest TRD (inspiration)](../../MayorWest/Docs/mayor_west_mode_trd.md)
