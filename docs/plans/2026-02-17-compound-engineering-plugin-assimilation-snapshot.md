# Compound Engineering Plugin — Assimilation Snapshot

**Date:** 2026-02-17  
**Mode:** Exploración rápida (solo lectura)  
**Repository analyzed:** `EveryInc/compound-engineering-plugin` (clonado localmente en `.worktrees/compound-engineering-plugin`)

## Executive Summary
- Repo TypeScript/Bun orientado a CLI de conversión multi-target para plugins de Claude.
- Flujo principal estable: parse plugin Claude → convertir por target → escribir bundle.
- Entradas operativas claras: `install`, `convert`, `list`, `sync`.
- El repositorio prioriza compatibilidad entre herramientas (OpenCode, Codex, Droid, Cursor, Pi, Gemini) con validación fuerte por tests.
- El estado es **ready-for-assimilation** para una fase posterior de skill generation, sin necesidad de re-scan completo.

## 1) Repository Shape (architecture map)

### Claim A1 — CLI central con subcomandos explícitos
- **Evidence:**
  - `src/index.ts` define `convert`, `install`, `list`, `sync` como `subCommands`.
  - `package.json` expone bin `compound-plugin` apuntando a `./src/index.ts`.
- **Confidence:** high
- **Implication:** El entrypoint es único y simplifica trazabilidad de ejecución.

### Claim A2 — Arquitectura por capas (parser → converter → target writer)
- **Evidence:**
  - `src/parsers/claude.ts` construye `ClaudePlugin` desde manifest + assets (agents/commands/skills/hooks/mcp).
  - `src/targets/index.ts` registra handlers por target con contrato `convert` + `write`.
  - `src/targets/*.ts` contiene escritor por plataforma.
- **Confidence:** high
- **Implication:** Separación clara de responsabilidades; habilita agregar nuevos targets con bajo acoplamiento.

### Claim A3 — Plugin canónico de referencia embebido en `plugins/compound-engineering`
- **Evidence:**
  - `plugins/compound-engineering/.claude-plugin/plugin.json` describe metadata, versión y MCPs.
  - Estructura de plugin incluye `agents/`, `commands/`, `skills/`.
- **Confidence:** high
- **Implication:** El repo sirve como marketplace + convertidor + fixture real de referencia.

## 2) Execution Flow (end-to-end)

### Claim F1 — `install` soporta nombre o path; por nombre fuerza fetch de GitHub
- **Evidence:**
  - `src/commands/install.ts` usa `resolvePluginPath`; si no parece path local, llama `resolveGitHubPluginPath`.
  - `resolveGitHubSource()` permite override por `COMPOUND_PLUGIN_GITHUB_SOURCE`.
  - `tests/cli.test.ts` valida instalación desde “GitHub source” y caso de shadow dir local.
- **Confidence:** high
- **Implication:** Reduce ambigüedad local/remoto y favorece reproducibilidad para instalación por nombre.

### Claim F2 — Pipeline runtime común: load → convert → write
- **Evidence:**
  - `src/commands/install.ts` y `src/commands/convert.ts` comparten secuencia:
    1) `loadClaudePlugin(...)`
    2) `targets[target].convert(plugin, options)`
    3) `target.write(outputRoot, bundle)`
  - `src/targets/index.ts` centraliza implementaciones por target.
- **Confidence:** high
- **Implication:** Puntos de extensión bien definidos para nuevas plataformas.

### Claim F3 — `sync` usa fuente distinta (Claude home) y replica skills + MCP
- **Evidence:**
  - `src/commands/sync.ts` carga `~/.claude` vía `loadClaudeHome` y sincroniza a target específico.
  - `tests/sync-cursor.test.ts` valida symlinks de skills y merge de `mcp.json`.
- **Confidence:** high
- **Implication:** Hay dos workflows distintos: conversión de plugin vs sincronización de config personal.

## 3) Convention Inventory (non-trivial, with evidence)

1. **Frontmatter YAML como contrato transversal**  
   - Evidence: `src/utils/frontmatter.ts`, `tests/frontmatter.test.ts`.
   - Confidence: high
   - Implication: Permite transformar metadatos entre toolchains conservando semántica.

2. **Manifiesto Claude en ruta fija `.claude-plugin/plugin.json`**  
   - Evidence: `src/parsers/claude.ts` (`PLUGIN_MANIFEST`), plugin fixture real.
   - Confidence: high
   - Implication: Regla base para descubrimiento y validación de plugin root.

3. **Validación de seguridad en paths custom (stay-within-root)**  
   - Evidence: `resolveWithinRoot(...)` en `src/parsers/claude.ts`.
   - Confidence: high
   - Implication: Mitiga traversal cuando manifest referencia rutas custom.

4. **Gating explícito por target implementado**  
   - Evidence: checks `if (!target.implemented)` en `convert.ts` e `install.ts`.
   - Confidence: high
   - Implication: Evita outputs parciales para targets registrados pero incompletos.

5. **Multiplexing de targets via `--also`**  
   - Evidence: `parseExtraTargets` + loop extra targets en `install.ts`/`convert.ts`; validado en `tests/cli.test.ts`.
   - Confidence: high
   - Implication: Una ejecución puede producir múltiples outputs consistentes.

6. **Normalización/adaptación semántica por plataforma**  
   - Evidence: tests de `converter.test.ts`, `codex-converter.test.ts` (transformación de Task calls, slash commands, model aliases).
   - Confidence: high
   - Implication: Conversión no es copia literal; hay transliteración de convenciones.

7. **Límites de plataforma codificados en transformación**  
   - Evidence: truncado de descripción a 1024 para Codex en `tests/codex-converter.test.ts`.
   - Confidence: high
   - Implication: El sistema absorbe constraints de destino para evitar fallas downstream.

8. **Política explícita de permisos configurable**  
   - Evidence: `permissions` (`none|broad|from-commands`) en comandos + assertions en `tests/converter.test.ts`.
   - Confidence: high
   - Implication: Permite balancear seguridad vs conveniencia en output generado.

9. **Compatibilidad MCP como primer ciudadano**  
   - Evidence: parse/merge MCP en parser y sync, pruebas de merge en cursor sync.
   - Confidence: high
   - Implication: El valor del plugin incluye transportar tooling ecosystem, no solo prompts/skills.

10. **Cobertura de compatibilidad por target con suites dedicadas**  
    - Evidence: `tests/*-converter.test.ts`, `tests/*-writer.test.ts`, `tests/sync-*.test.ts`.
    - Confidence: high
    - Implication: El repo prioriza estabilidad multi-ecosistema por pruebas específicas.

## 4) Risks, Contradictions, Unknowns

### R1 — Inconsistencia de versionado de CLI metadata
- **Evidence:** `src/index.ts` expone `version: "0.1.0"`, mientras `package.json` está en `0.7.0`.
- **Confidence:** high
- **Implication:** Riesgo de observabilidad/confusión al reportar versión en runtime.

### R2 — Defaults de output difieren entre comandos y targets
- **Evidence:**
  - `install` default OpenCode en `~/.config/opencode`.
  - `convert` default base en `process.cwd()`.
  - Cursor/Gemini escriben en directorios de proyecto (`.cursor`, `.gemini`) con lógica especial.
- **Confidence:** high
- **Implication:** Puede sorprender a usuarios; requiere documentación clara por comando/target.

### R3 — Superficie de “sync” parcial por target
- **Evidence:** `sync` acepta `opencode|codex|pi|droid|cursor`; no incluye `gemini`.
- **Confidence:** high
- **Implication:** Cobertura funcional no homogénea entre convert y sync.

### U1 — Estrategia de backward compatibility de formatos externos
- **Evidence:** README declara targets experimentales y formatos en evolución.
- **Confidence:** medium
- **Implication:** Conviene observar churn en converters/writers y versionado de esquemas.

## 5) Candidate Skills (hypotheses, not generated)

1. **target-onboarding-playbook** — Cómo agregar un nuevo target siguiendo contrato `convert/write` + tests.
2. **converter-semantic-rewrites** — Patrones de reescritura semántica entre ecosistemas (Task, slash commands, models).
3. **safe-plugin-parsing** — Reglas de parse seguro (root resolution, path constraints, manifest handling).
4. **multi-target-output-strategy** — Estrategia de outputs por target y UX de defaults.
5. **sync-mcp-and-symlinks** — Convenciones para sync de skills + MCP con merge seguro.

## 6) Follow-up Backlog (targeted probes)

1. Confirmar matriz de compatibilidad por versión de cada target (Codex/Cursor/Pi/Droid/Gemini).
2. Revisar historial de cambios en converters para detectar reglas inestables.
3. Determinar si la discrepancia de versión (`index.ts` vs `package.json`) es intencional.
4. Definir contrato documental único para defaults de output por comando/target.

## Ready-for-Assimilation Checklist
- [x] Arquitectura resumible en 5–8 bullets estables.
- [x] 6–10 convenciones no triviales con evidencia.
- [x] Incertidumbres reducidas a probes puntuales.

## Evidence Index (files inspected)
- `.worktrees/compound-engineering-plugin/README.md`
- `.worktrees/compound-engineering-plugin/package.json`
- `.worktrees/compound-engineering-plugin/src/index.ts`
- `.worktrees/compound-engineering-plugin/src/commands/install.ts`
- `.worktrees/compound-engineering-plugin/src/commands/convert.ts`
- `.worktrees/compound-engineering-plugin/src/commands/sync.ts`
- `.worktrees/compound-engineering-plugin/src/commands/list.ts`
- `.worktrees/compound-engineering-plugin/src/parsers/claude.ts`
- `.worktrees/compound-engineering-plugin/src/targets/index.ts`
- `.worktrees/compound-engineering-plugin/src/utils/frontmatter.ts`
- `.worktrees/compound-engineering-plugin/tests/cli.test.ts`
- `.worktrees/compound-engineering-plugin/tests/frontmatter.test.ts`
- `.worktrees/compound-engineering-plugin/tests/converter.test.ts`
- `.worktrees/compound-engineering-plugin/tests/codex-converter.test.ts`
- `.worktrees/compound-engineering-plugin/tests/sync-cursor.test.ts`
- `.worktrees/compound-engineering-plugin/plugins/compound-engineering/.claude-plugin/plugin.json`
