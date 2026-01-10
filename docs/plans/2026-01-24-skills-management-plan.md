# Skills Management Enhancement Plan

**Created:** 2026-01-24  
**Status:** Draft  
**Reference:** `_reference/Skills-Registry-CLI/` (gitignored)

---

## Objetivo

Agregar capacidades de gestión de skills a vibecoding-starter **sin dependencias externas**. Todo implementado como skills (Markdown) que enseñan al agente qué hacer.

---

## Ideas Extraídas de Skills-Registry-CLI

| Concepto | En el CLI (JS) | En Vibecoding Starter (MD) |
|----------|----------------|---------------------------|
| Registry | `registry.jsonl` | `SKILLS_REGISTRY.md` |
| Generator | `generator.js` + `generate` cmd | `skill-generator` skill |
| Validator | `validator.js` + `validate` cmd | Reglas en `creating-skills` |
| Agent Mapper | `agent-mapper.js` | Futuro: mapeo en AGENTS.md |

---

## Fase 1: Registry de Skills 🔥

**Problema:** No sabemos qué skills están instalados.

### Entregables

1. **`SKILLS_REGISTRY.md`** - Inventario legible en Markdown
2. **`.claude/skills/core/registry-manager/SKILL.md`** - Skill para mantener el registry

### Formato del Registry

```markdown
# Skills Registry

**Last Updated:** 2026-01-24  
**Total Skills:** 15

## Summary by Category

| Category | Count |
|----------|-------|
| Core | 8 |
| DevOps | 3 |
| Engineering | 2 |
| Documentation | 1 |
| Research | 1 |

## Installed Skills

| Name | Category | Description | Source |
|------|----------|-------------|--------|
| bd | core | Task management with beads CLI | local |
| git | core | Git hygiene and workflows | local |
| brainstorming | core | Collaborative ideation | local |
| ... | ... | ... | ... |
```

### Skill: registry-manager

Enseña al agente a:
- Escanear `.claude/skills/` recursivamente
- Leer frontmatter de cada SKILL.md
- Generar/actualizar SKILLS_REGISTRY.md
- Detectar skills huérfanos (en registry pero no en disco)

---

## Fase 2: Skill Generator 🔥

**Problema:** Crear skills manualmente es tedioso.

### Entregables

1. **`.claude/skills/core/skill-generator/SKILL.md`** - Skill para generar skills desde repos

### Lo que el skill enseñará

1. **Análisis de repo:**
   - Buscar `README.md` → extraer descripción
   - Buscar `package.json` → detectar frameworks JS
   - Buscar `pyproject.toml`, `setup.py` → detectar Python
   - Buscar `go.mod` → detectar Go
   - Buscar `Cargo.toml` → detectar Rust

2. **Detección de lenguajes por extensión:**
   ```
   .js/.mjs/.cjs → javascript
   .ts/.mts → typescript
   .py → python
   .go → go
   .rs → rust
   .rb → ruby
   ```

3. **Generación de SKILL.md:**
   - Frontmatter válido (name, description)
   - Body con instrucciones extraídas del README
   - Secciones estándar

### Template de salida

```markdown
---
name: <repo-name-lowercase>
description: <extracted-from-readme-or-package.json>
---

# <Repo Name>

## Overview

<Extracted description>

## When to Use

Use this skill when:
- <inferred use cases>

## Key Concepts

<Extracted from README sections>

## Usage

<Code examples from README>
```

---

## Fase 3: Skill Validator ✅

**Problema:** Skills pueden tener formato incorrecto.

### Opción A: Actualizar `creating-skills`

Agregar sección "Validation Rules" con:

```markdown
## Validation Rules

### Required Frontmatter

- `name`: lowercase, hyphens only, max 64 chars
  - Pattern: `^[a-z0-9]([a-z0-9-]*[a-z0-9])?$`
- `description`: present, max 1024 chars

### Body Requirements

- Must not be empty
- Should have at least one heading
- Should describe when to use the skill

### Before Finalizing

Run mental checklist:
- [ ] Frontmatter has `name` and `description`
- [ ] Name is lowercase with hyphens
- [ ] Description explains what AND when
- [ ] Body has actionable instructions
```

### Opción B: Crear `skill-validator` skill

Skill dedicado que:
- Escanea todos los SKILL.md
- Reporta errores y warnings
- Sugiere correcciones

---

## Fase 4: Agent Mapper 🎁 (Futuro)

**Idea:** Mapear skills a roles en AGENTS.md automáticamente.

- Analizar descripción del agente/rol
- Buscar keywords en skills
- Sugerir skills relevantes
- Actualizar tablas en AGENTS.md

**Para después de Fases 1-3.**

---

## Resumen de Tareas

| # | Tarea | Fase | Prioridad | Estado |
|---|-------|------|-----------|--------|
| 1 | Crear `SKILLS_REGISTRY.md` template | 1 | 🔥 Alta | ⬜ Pending |
| 2 | Crear skill `registry-manager` | 1 | 🔥 Alta | ⬜ Pending |
| 3 | Crear skill `skill-generator` | 2 | 🔥 Alta | ⬜ Pending |
| 4 | Actualizar `creating-skills` con validación | 3 | ✅ Media | ⬜ Pending |
| 5 | (Opcional) Crear `skill-validator` skill | 3 | ✅ Media | ⬜ Pending |
| 6 | (Futuro) Agent Mapper | 4 | 🎁 Bonus | ⬜ Backlog |

---

## Notas

- Todo sin dependencias npm/CLI externas
- Skills son Markdown puro
- El agente ejecuta las instrucciones, no un CLI
- Mantener principio de simplicidad de vibecoding-starter
