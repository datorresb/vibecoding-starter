---
name: Root-Cause Design
description: Trace the data flow to find where a change REALLY belongs before writing code. Use when adding fields, enriching outputs, or threading parameters.
---

- Load the `root-cause-design` skill from `.claude/skills/engineering/root-cause-design/SKILL.md` and follow it exactly.
- Before writing any code, complete the full trace procedure:
  1. Find where the output is **constructed** (not consumed).
  2. Search the pipeline for existing objects that already carry related data.
  3. Decide placement: add to existing model > compute at construction site > pass as parameter (last resort).
  4. Validate: count modified function signatures (target 0–1, smell at 4+).
- Apply the "3 Whys" check and verify against the Quick Checklist before proceeding.
- If you end up threading a parameter through 3+ signatures, stop — you're patching the symptom instead of fixing the root cause. Go back to Step 2.
