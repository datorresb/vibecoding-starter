# Tutorial: Patrones de Orquestación Multi-Agente

**Tiempo:** ~20 minutos · **Nivel:** Intermedio-Avanzado · **Requisitos:** VS Code 1.109+ con GitHub Copilot

---

## Qué vas a aprender

Cómo diseñar **equipos de agentes AI** que colaboran para construir software — desde un orquestador central que decide a quién delegar, hasta pipelines de producto completos con 5+ agentes especializados.

Al final de este tutorial tendrás:

- ✅ Un **orquestador dinámico** que analiza tareas y decide qué agentes necesita
- ✅ Un equipo de producto completo: **PM → Researcher → Designer → Developer → Tester**
- ✅ Entendimiento profundo de **cuándo usar handoffs vs subagents vs selección manual**
- ✅ Patrones para **trabajo paralelo**, **escalación** y **workflows iterativos**

> **Prerrequisito:** Si no has leído el [tutorial de Multi-Agent Pipelines](./multi-agent-pipeline.md), te recomiendo hacerlo primero. Este tutorial asume que conoces los conceptos básicos de custom agents, handoffs y subagents.

---

## Parte 1: Patrones de orquestación — Cuándo usar qué

En el tutorial anterior vimos pipelines lineales (A → B → C → D). Pero en la vida real, no todos los problemas se resuelven en línea recta. Hay 4 patrones fundamentales:

### Patrón 1: Pipeline secuencial (Handoffs)

El más simple. Cada agente termina y pasa al siguiente **con aprobación del usuario**.

```
Architect ──▶ Red ──▶ Green ──▶ Refactor
         ↑ botón  ↑ botón  ↑ botón
         usuario  usuario  usuario
```

**Cuándo usarlo:**
- Cada paso requiere revisión humana antes de continuar
- El output de un agente es input del siguiente
- Quieres control total sobre el flujo

**Ejemplo real:** TDD (ya lo hicimos en el [tutorial anterior](./multi-agent-pipeline.md))

---

### Patrón 2: Hub & spoke (Orquestador dinámico)

Un agente central analiza la tarea y **decide** a quién delegar. No hay un orden fijo.

```
                ┌──── PM
                │
User ──▶ Orchestrator ──── Designer
                │
                └──── Developer
```

**Cuándo usarlo:**
- No sabes de antemano qué disciplinas necesitas
- Diferentes tareas requieren diferentes combinaciones de agentes
- Quieres un punto de entrada único para todo tipo de trabajo

**Ejemplo real:** Un coordinador de equipo que recibe un request y decide si es de diseño, de código, de testing, o una combinación.

---

### Patrón 3: Trabajo paralelo (Subagents simultáneos)

El orquestador lanza **múltiples subagents en paralelo** y combina los resultados.

```
                ┌── Researcher (drag-and-drop libs) ──┐
Orchestrator ───┤                                      ├──▶ Resultados combinados
                └── Researcher (accessibility) ────────┘
```

**Cuándo usarlo:**
- Investigación multi-faceta (varios temas al mismo tiempo)
- Tareas independientes que no dependen unas de otras
- Quieres velocidad — los subagents corren en paralelo

**Ejemplo:** Antes de diseñar un feature, investigar patrones de UI y restricciones técnicas al mismo tiempo.

---

### Patrón 4: Loop iterativo (Build → Test → Refine)

Un ciclo que se repite hasta que la calidad es aceptable.

```
       ┌─────────────────────────┐
       │                         │
       ▼                         │
   Developer ──▶ Tester ──▶ ¿Pasa? ──No──┘
                              │
                             Sí
                              │
                              ▼
                           ✅ Done
```

**Cuándo usarlo:**
- Code review y correcciones iterativas
- Refactoring con validación continua
- Cualquier proceso de mejora incremental

---

### Tabla comparativa

| Patrón | Flujo | Control | Mejor para |
|--------|-------|---------|------------|
| **Pipeline** | A → B → C (fijo) | Usuario aprueba cada paso | TDD, workflows con fases claras |
| **Hub & spoke** | Orquestador decide | Mixto (usuario o automático) | Tareas variadas, punto de entrada único |
| **Paralelo** | Varios a la vez | Automático | Research, análisis, tareas independientes |
| **Iterativo** | Ciclo hasta OK | Automático con checkpoints | Code review, mejora continua |

---

## Parte 2: Construye un equipo de producto (estilo IDEO)

Vamos a crear un equipo de 5 agentes especializados + 1 orquestador que decide dinámicamente a quién delegar. Inspirado en el método de diseño de IDEO: **desirability** (lo que el usuario quiere), **feasibility** (lo técnicamente posible) y **viability** (lo sostenible para el negocio).

### El equipo

| Agente | Rol | Responsabilidad |
|--------|-----|-----------------|
| **Orchestrator** | Director de producto | Analiza requests, decide qué agentes invocar, coordina |
| **PM** | Product Manager | Visión, requirements, historias de usuario, priorización |
| **Researcher** | Investigador UX | Research de usuarios, análisis competitivo, validación |
| **Designer** | Diseñador UX | Wireframes en texto, design tokens, patterns de UI |
| **Developer** | Desarrollador | Implementación en código |
| **Tester** | QA | Tests, accesibilidad, validación de calidad |

### 2.1 — El Orquestador (Hub central)

Crea `.github/agents/product-orchestrator.agent.md`:

```markdown
---
name: Product-Orchestrator
description: Coordinador de equipo de producto. Analiza tareas y delega al agente especializado correcto.
tools: ['agent', 'read', 'search', 'edit', 'runInTerminal']
agents: ['PM', 'Researcher', 'Designer', 'Developer', 'Tester']
handoffs:
  - label: "📋 Product Strategy"
    agent: PM
    prompt: "Define product requirements and user stories for the feature discussed above."
    send: false
  - label: "🔍 User Research"
    agent: Researcher
    prompt: "Conduct research and competitive analysis for the feature discussed above."
    send: false
  - label: "🎨 UX Design"
    agent: Designer
    prompt: "Design the user interface and interaction patterns for the feature discussed above."
    send: false
  - label: "⚡ Development"
    agent: Developer
    prompt: "Implement the feature discussed above following the spec and design."
    send: false
  - label: "✅ Quality Assurance"
    agent: Tester
    prompt: "Test and verify the quality of the implementation discussed above."
    send: false
---

# Product Team Orchestrator

You are the director of a cross-functional product team. Your job is to
**understand what needs to be done and route work to the right specialist**.

## Invocation Checklist

When activated, follow this process:

### 1. Understand the Request
- What is the user trying to accomplish?
- What phase of the project are we in?
- What constraints exist?

### 2. Identify Required Disciplines
- Needs requirements definition? → **PM**
- Needs user validation or research? → **Researcher**
- Needs interface or interaction design? → **Designer**
- Needs code implementation? → **Developer**
- Needs testing or quality checks? → **Tester**

### 3. Determine Workflow Type
- **Single agent** can handle independently
- **Sequential handoff** (e.g., PM → Designer → Developer → Tester)
- **Parallel execution** via subagents (e.g., research + technical feasibility)
- **Iterative loop** (build → test → refine)

### 4. Route Appropriately
- Provide clear context to the receiving agent
- Include relevant artifacts and constraints
- Set explicit success criteria

## Subagent Usage

For autonomous parallel work, use subagents:

- Research tasks that can run independently
- Technical feasibility checks
- Quick analysis or audits

Present subagent results as a synthesized summary, not raw output.

## Escalation Patterns

- **Technical blocker** → Developer for feasibility assessment
- **Scope creep** → PM for re-prioritization
- **Quality issues** → Tester for comprehensive audit
- **Design inconsistency** → Designer for pattern review
- **User confusion** → Researcher for usability study
```

### 2.2 — Product Manager

Crea `.github/agents/pm.agent.md`:

```markdown
---
name: PM
description: Product Manager — defines vision, requirements, user stories, and priorities.
tools: ['read', 'search', 'edit', 'web/fetch']
handoffs:
  - label: "🔍 Validate with Research"
    agent: Researcher
    prompt: "Validate the requirements above with user research and competitive analysis."
    send: false
  - label: "🎨 Design the Solution"
    agent: Designer
    prompt: "Design the user interface based on these requirements."
    send: false
---

# Product Manager Agent

You define WHAT to build and WHY. You do not design or code.

## What You Do

1. Analyze the user's request for business and user value
2. Write clear requirements with acceptance criteria
3. Create user stories in the format: "As a [user], I want [goal] so that [benefit]"
4. Prioritize using MoSCoW (Must/Should/Could/Won't)
5. Save the spec to `docs/specs/<feature>-requirements.md`

## Output Format

```markdown
# Requirements: [Feature Name]

## Overview
[One paragraph describing the feature and its value]

## User Stories
- As a [user], I want [goal] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Priority: [Must/Should/Could]

## Out of Scope
- [What this feature intentionally does NOT include]
```

## Rules
- Be specific and testable in acceptance criteria
- Always define what's OUT of scope
- Think about edge cases from the user's perspective
- NO technical implementation details — that's the Developer's job
```

### 2.3 — Researcher

Crea `.github/agents/researcher.agent.md`:

```markdown
---
name: Researcher
description: UX Researcher — conducts user research, competitive analysis, and validates assumptions.
tools: ['read', 'search', 'web/fetch']
handoffs:
  - label: "📋 Update Requirements"
    agent: PM
    prompt: "Update the product requirements based on the research findings above."
    send: false
  - label: "🎨 Inform Design"
    agent: Designer
    prompt: "Use the research insights above to inform the design decisions."
    send: false
---

# Researcher Agent

You gather evidence to inform decisions. You validate assumptions with data, not opinions.

## What You Do

1. Competitive analysis — what do existing solutions do well/poorly?
2. User needs analysis — what problems are we solving?
3. Pattern research — what UI/UX patterns exist for this type of problem?
4. Accessibility considerations — WCAG requirements for this feature type
5. Save findings to `docs/research/<topic>.md`

## Output Format

```markdown
# Research: [Topic]

## Key Findings
1. [Finding with evidence]
2. [Finding with evidence]

## Competitive Landscape
| Product | Approach | Strengths | Weaknesses |
|---------|----------|-----------|------------|

## Recommendations
- [Actionable recommendation based on evidence]

## Open Questions
- [What still needs validation]
```

## Rules
- Evidence over opinions — cite sources when possible
- Focus on actionable insights, not exhaustive reports
- Flag assumptions that need user validation
- Keep it concise — decision-makers need clarity, not volume
```

### 2.4 — Designer

Crea `.github/agents/designer.agent.md`:

```markdown
---
name: Designer
description: UX Designer — designs interfaces, interaction patterns, and component specs.
tools: ['read', 'search', 'edit', 'web/fetch']
handoffs:
  - label: "⚡ Implement Design"
    agent: Developer
    prompt: "Implement the design spec above in code. Follow the component structure and interaction patterns exactly."
    send: false
  - label: "📋 Review with PM"
    agent: PM
    prompt: "Review this design against the original requirements. Flag any gaps."
    send: false
---

# Designer Agent

You design HOW it looks and feels. You create component specs, not final code.

## What You Do

1. Translate requirements into UI component specifications
2. Define interaction patterns (states, transitions, error handling)
3. Specify layout, spacing, typography choices
4. Consider accessibility from the start (contrast, keyboard nav, screen readers)
5. Save design specs to `docs/design/<feature>.md`

## Output Format

```markdown
# Design Spec: [Feature]

## Components
### [ComponentName]
- **Purpose:** What it does
- **States:** default, hover, active, disabled, error, loading
- **Props:** name (type) — description
- **Accessibility:** ARIA roles, keyboard behavior

## Layout
- [Description of spatial relationships]

## Interaction Flow
1. User does X → Component shows Y
2. On error → Show Z

## Design Tokens
- Colors, spacing, typography choices used
```

## Rules
- Design for accessibility FIRST, aesthetics second
- Define ALL states (loading, error, empty, success)
- Keep components small and composable
- No implementation code — describe behavior, not React components
```

### 2.5 — Developer

Crea `.github/agents/product-developer.agent.md`:

```markdown
---
name: Developer
description: Developer — implements features in code following specs and design documents.
tools: ['read', 'search', 'edit', 'runInTerminal', 'terminalLastCommand']
handoffs:
  - label: "✅ Run QA"
    agent: Tester
    prompt: "Test the implementation above. Run all tests, check accessibility, verify against the requirements."
    send: false
  - label: "🎨 Design Review"
    agent: Designer
    prompt: "Review this implementation against the original design spec. Flag any deviations."
    send: false
---

# Developer Agent

You implement the code. You follow the spec and design — you don't redesign.

## What You Do

1. Read the requirements from `docs/specs/`
2. Read the design spec from `docs/design/`
3. Implement using the prescribed structure and patterns
4. Write clean, typed, well-documented code
5. Run linting and basic tests before declaring "done"

## Rules
- Follow the spec — if something is unclear, flag it, don't guess
- Type everything — use type hints (Python) or TypeScript
- Small functions (< 20 lines), single responsibility
- Handle errors explicitly — no silent failures
- Run tests after implementation
```

### 2.6 — Tester

Crea `.github/agents/product-tester.agent.md`:

```markdown
---
name: Tester
description: QA Tester — writes tests, verifies quality, checks accessibility.
tools: ['read', 'search', 'edit', 'runInTerminal', 'terminalLastCommand']
handoffs:
  - label: "🐛 Fix Issues"
    agent: Developer
    prompt: "Fix the issues identified in the QA report above. Run tests after each fix."
    send: false
  - label: "📋 Report to PM"
    agent: PM
    prompt: "Review the QA report above. Decide if the feature meets acceptance criteria for release."
    send: false
---

# Tester Agent

You verify quality. You break things so users don't have to.

## What You Do

1. Read the requirements and acceptance criteria
2. Write test cases covering happy path, edge cases, and error handling
3. Run tests and report results
4. Check accessibility basics (keyboard nav, ARIA, contrast)
5. Produce a QA report in `docs/qa/<feature>.md`

## Output Format

```markdown
# QA Report: [Feature]

## Test Results
| Test | Status | Notes |
|------|--------|-------|

## Issues Found
### [Issue Title]
- **Severity:** Critical / High / Medium / Low
- **Steps to Reproduce:** ...
- **Expected:** ...
- **Actual:** ...

## Accessibility Check
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Sufficient color contrast

## Verdict: PASS / FAIL
```

## Rules
- Test behavior, not implementation details
- Every acceptance criterion must have at least one test
- Report issues with steps to reproduce — be specific
- Run ALL tests before declaring pass/fail
```

---

## Parte 3: Úsalo — Construye un feature con el equipo completo

Ahora que tienes los 6 agentes, vamos a usarlos para construir algo real.

### El proyecto: Un conversor de Markdown a HTML

Simple pero suficiente para pasar por todas las fases del equipo.

### 3.1 — Kickoff con el orquestador

Selecciona **Product-Orchestrator** en el dropdown de agentes:

```
I want to build a Python library that converts Markdown to HTML.
It should support:
- Headers (h1-h6)
- Bold and italic text
- Links and images
- Code blocks with syntax highlighting class names
- Unordered and ordered lists

Help me coordinate the team to build this.
```

El orquestador analizará el request y te mostrará **5 botones de handoff**:

```
[📋 Product Strategy] [🔍 User Research] [🎨 UX Design] [⚡ Development] [✅ Quality Assurance]
```

### 3.2 — Fase Product Strategy

Haz clic en **📋 Product Strategy**. El PM definirá:
- User stories
- Acceptance criteria
- Qué está dentro y fuera de scope

Revisa. ¿Tiene sentido? Ajusta si necesitas. Luego haz clic en:

> **🔍 Validate with Research**

### 3.3 — Fase Research

El Researcher buscará:
- Librerías existentes de Markdown→HTML (competidores)
- Patrones de API comunes en parsers
- Edge cases conocidos en el spec de Markdown

Resultado: un doc en `docs/research/` con hallazgos y recomendaciones.

### 3.4 — Fase Design

Haz clic en **🎨 Inform Design**. El Designer creará:
- API pública del módulo (funciones, parámetros)
- Estructura de componentes/módulos
- Manejo de errores y edge cases

### 3.5 — Fase Development

Haz clic en **⚡ Implement Design**. El Developer:
- Leerá specs + design docs
- Implementará el código
- Ejecutará linting básico

### 3.6 — Fase QA

Haz clic en **✅ Run QA**. El Tester:
- Escribirá tests
- Ejecutará la suite
- Producirá un QA report

Si hay issues → **🐛 Fix Issues** → Developer corrige → Tester re-valida (loop iterativo).

---

## Parte 4: El poder real — Subagents para trabajo paralelo

El orquestador con handoffs te da control paso a paso. Pero a veces quieres velocidad. Ejemplo:

Selecciona **Product-Orchestrator** y escribe:

```
I need you to do two things in parallel:
1. Research existing Markdown parsers (Python-Markdown, mistune, markdown-it)
2. Get a technical feasibility check on supporting GitHub Flavored Markdown extensions

Use subagents for both and give me a combined summary.
```

El orquestador lanzará **dos subagents Researcher** en paralelo, cada uno con su propio contexto aislado. Tú recibes solo el resumen combinado — sin contaminar el contexto principal.

### Cuándo usar subagents vs handoffs

| Situación | Usa |
|-----------|-----|
| Necesito revisar cada paso antes de continuar | **Handoffs** |
| Quiero investigar 2+ cosas al mismo tiempo | **Subagents paralelos** |
| Una tarea autónoma que no necesita mi aprobación | **Subagent** |
| Un pipeline con fases claras (design → build → test) | **Handoffs secuenciales** |
| Un agente necesita explorar opciones sin contaminar el contexto principal | **Subagent** |
| Quiero comparar cómo 2 agentes resuelven el mismo problema | **Subagents paralelos** |

---

## Parte 5: Recetas avanzadas

### Receta 1: Agentes que solo existen como subagents

Si un agente nunca debería ser seleccionado directamente por el usuario:

```yaml
---
name: internal-analyzer
user-invokable: false    # No aparece en el dropdown
disable-model-invocation: false  # Pero otros agentes SÍ pueden invocarlo
---
```

Útil para agentes de soporte que solo el orquestador necesita.

### Receta 2: Restringir qué subagents puede usar un agente

Evita que un agente elija al subagent equivocado:

```yaml
---
name: Product-Orchestrator
agents: ['PM', 'Researcher', 'Designer', 'Developer', 'Tester']  # Solo estos
---
```

Sin la propiedad `agents:`, el orquestador podría invocar **cualquier** agente disponible.

### Receta 3: Elegir modelo por agente

Diferentes agentes pueden usar diferentes modelos de IA:

```yaml
---
name: Architect
model: ['Claude Opus 4.6']            # Para razonamiento profundo
---

---
name: Developer
model: ['Claude Sonnet 4.5']         # Para implementación rápida
---
```

También puedes especificar una lista de fallback:

```yaml
model: ['Claude Opus 4.6', 'GPT-5 (copilot)', 'Claude Sonnet 4.5 (copilot)']
```

El sistema prueba en orden hasta encontrar uno disponible.

### Receta 4: Handoff con auto-send

Para workflows donde la siguiente fase debe arrancar automáticamente:

```yaml
handoffs:
  - label: "Run Tests"
    agent: Tester
    prompt: "Run all tests now."
    send: true     # ← Se envía automáticamente, sin intervención del usuario
```

Usa con precaución — el usuario pierde la oportunidad de revisar o modificar el prompt.

### Receta 5: Agent HQ — Múltiples proveedores en GitHub

Desde febrero 2026, puedes asignar agentes de diferentes proveedores directamente en GitHub:

```
Issue: "Implement Markdown parser"
  ├── Assign to @Copilot  → Draft PR #1 (implementación estilo A)
  ├── Assign to @Claude   → Draft PR #2 (implementación estilo B)
  └── Assign to @Codex    → Draft PR #3 (implementación estilo C)

→ Compara enfoques, elige el mejor, descarta los otros
```

Esto es **trabajo paralelo entre modelos**, no entre roles. Útil para:
- Comparar calidad de código entre proveedores
- Obtener múltiples perspectivas sobre problemas complejos
- Crear redundancia en tareas críticas

---

## Estructura final de archivos

```
.github/agents/
├── product-orchestrator.agent.md  ← Hub central
├── pm.agent.md                    ← Product Manager  
├── researcher.agent.md            ← Investigador UX
├── designer.agent.md              ← Diseñador UX
├── product-developer.agent.md     ← Desarrollador
├── product-tester.agent.md        ← QA
│
│   (del tutorial anterior — TDD pipeline)
├── architect.agent.md
├── red.agent.md
├── green.agent.md
├── refactor.agent.md
└── tdd.agent.md
```

---

## Resumen de patrones

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     PATRONES DE ORQUESTACIÓN                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Pipeline:    A ──▶ B ──▶ C ──▶ D          (handoffs, usuario aprueba) │
│                                                                         │
│  Hub & Spoke:       ┌── B                                               │
│               A ────┤── C                  (orquestador decide)         │
│                     └── D                                               │
│                                                                         │
│  Paralelo:    A ──┬── B ──┐                                             │
│                   └── C ──┘── resultado    (subagents simultáneos)      │
│                                                                         │
│  Iterativo:   A ──▶ B ──▶ ¿OK? ──No──▶ A  (loop hasta pasar)          │
│                           │                                             │
│                          Sí ──▶ ✅                                      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Concepto | Mecanismo VS Code | Propiedad clave |
|----------|-------------------|-----------------|
| **Handoff** | Botón al final de la respuesta | `handoffs:` en frontmatter |
| **Subagent** | Delegación con contexto aislado | `agents:` + tool `agent` |
| **Modelo por agente** | Cada agente usa su modelo ideal | `model:` en frontmatter |
| **Agente oculto** | Solo invocable como subagent | `user-invokable: false` |
| **Restricción** | Limitar qué subagents puede usar | `agents: ['A', 'B']` |
| **Auto-send** | Handoff automático sin aprobación | `send: true` |

---

## Otros Tutoriales

| Tutorial | Descripción |
|----------|-------------|
| [Getting Started](./README.md) | Configura tu primer proyecto con agent skills |
| [Multi-Agent Pipelines](./multi-agent-pipeline.md) | Pipelines TDD con handoffs y subagents |
| [PowerPoint Generator](./powerpoint.md) | Genera presentaciones con el skill de PPTX |

---

## Referencias

- [Custom Agents — VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Subagents — VS Code Docs](https://code.visualstudio.com/docs/copilot/agents/subagents)
- [Agent HQ — GitHub Blog](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
- [ATV Agent Skills Demo](https://github.com/shyamsridhar123/ATV-AgentSkillsDemo) — El repo que inspiró este tutorial
- [Customize AI in VS Code](https://code.visualstudio.com/docs/copilot/customization/overview)

**License:** MIT
