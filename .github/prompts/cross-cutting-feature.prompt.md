---
name: Cross-Cutting Feature
description: Implement a feature that spans multiple layers (model, logic, adapter, state, tools, config, tests) without missing steps.
---

- If the feature adds data to an existing output or enriches a result, run the `root-cause-design` prompt first to determine WHERE the data belongs.
- Load the `cross-cutting-feature` skill from `.claude/skills/engineering/cross-cutting-feature/SKILL.md` and follow it exactly.
- Execute every step in order — do not skip:
  0. **Discover** — Map codebase layers (models, domain logic, adapters, state, tools, config, tests). Read key files before writing anything.
  1. **Model** — Define the data shape with validation and defaults. Resolve derived values in the model validator.
  2. **Pure Functions** — Write stateless, testable transformations if needed.
  3. **Adapter** — Map external format to internal model. Don't duplicate model logic.
  4. **State** — Add to state schema if persistence is needed.
  5. **Tools/API** — Create the user-facing interface. Wire into list, clear, and run functions.
  6. **Config/Prompts** — Update system prompts and tool descriptions so the LLM knows the feature exists.
  7. **Tests** — Unit tests for model + functions. Integration tests for end-to-end behavior.
  8. **Verify** — Run full test suite. Count files touched (expect 7–9). Count signatures modified (target ≤ 3).
- Run tests after each layer, not only at the end.
