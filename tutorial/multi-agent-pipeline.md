# Tutorial: Multi-Agent Pipelines in VS Code

**Tiempo:** ~15 minutos · **Nivel:** Intermedio · **Requisitos:** VS Code 1.109+ con GitHub Copilot

---

## Qué vas a aprender

Cómo usar **custom agents**, **subagents** y **handoffs** en VS Code para crear un flujo de trabajo donde múltiples agentes colaboran en secuencia — cada uno especializado en una tarea distinta.

Al final de este tutorial tendrás:

- ✅ 4 custom agents que forman un pipeline de desarrollo
- ✅ Un flujo secuencial: **Arquitecto → Tests → Implementación → Revisión**
- ✅ Una CLI de Python construida completamente por agentes
- ✅ Entendimiento práctico de cuándo y cómo usar cada patrón

---

## Conceptos clave

Antes de empezar, estos son los 3 mecanismos que VS Code ofrece para orquestar agentes:

### 1. Custom Agents (`.agent.md`)

Archivos Markdown en `.github/agents/` que definen una **persona** con herramientas e instrucciones específicas. Se seleccionan desde el dropdown de agentes en el Chat.

```
.github/agents/
├── architect.agent.md      ← Diseña la solución
├── red.agent.md            ← Escribe tests que fallan
├── green.agent.md          ← Implementa para pasar tests
└── refactor.agent.md       ← Revisa y refactoriza
```

### 2. Handoffs (Transiciones guiadas)

Botones que aparecen al final de una respuesta del agente para **transicionar al siguiente agente** con contexto pre-llenado. Se definen en el frontmatter YAML:

```yaml
handoffs:
  - label: "▶ Write Failing Tests"
    agent: red
    prompt: "Write failing tests based on the architecture above."
    send: false   # false = el usuario revisa antes de enviar
```

### 3. Subagents (Delegación con aislamiento)

Un agente puede delegar trabajo a otro agente en un **contexto aislado**. El subagent trabaja independientemente y solo devuelve el resultado final. Se invoca automáticamente o a través de prompt files.

```
Main Agent (tech-lead)
  └── delegates to → code-simplifier (subagent)
  └── delegates to → review-test (subagent)
```

### ¿Cuál usar?

| Patrón | Cuándo usarlo | Control del usuario |
|--------|---------------|---------------------|
| **Handoffs** | Flujo secuencial paso a paso con revisión humana entre pasos | ✅ Alto — el usuario aprueba cada paso |
| **Subagents** | Tareas paralelas o delegación autónoma desde un orquestador | ⚡ Bajo — el orquestador decide |
| **Agents manuales** | El usuario selecciona el agente correcto manualmente | ✅ Total — el usuario controla |

---

## Lo que vamos a construir

Un pipeline TDD (Test-Driven Development) con 4 agentes encadenados usando **handoffs**:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Architect   │────▶│     Red      │────▶│    Green     │────▶│   Refactor   │
│              │     │              │     │              │     │              │
│ Diseña la    │     │ Escribe      │     │ Implementa   │     │ Revisa y     │
│ arquitectura │     │ tests que    │     │ el código    │     │ simplifica   │
│ y el spec    │     │ fallen       │     │ que pase     │     │ el resultado │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**El proyecto:** Una CLI en Python que convierte temperaturas (°C ↔ °F ↔ K).

Simple, pero suficiente para demostrar el flujo completo con tests, implementación y refactoring.

---

## Paso 1: Crear los Custom Agents

Crea los 4 archivos de agentes en `.github/agents/`. Puedes pedirle a Copilot que los cree por ti, o copiarlos manualmente.

### Agent 1: Architect (Arquitecto)

Crea `.github/agents/architect.agent.md`:

````markdown
---
name: Architect
description: Designs solution architecture and writes technical specs before any code is written.
tools: ['read', 'search', 'fetch', 'edit']
handoffs:
  - label: "🔴 Write Failing Tests"
    agent: red
    prompt: "Based on the architecture spec above, write failing pytest tests that define the expected behavior. Do NOT write any implementation code yet."
    send: false
---

# Architect Agent

You are a solution architect. Your job is to **design before building**.

## What You Do

1. Analyze the user's request
2. Design the file structure and module boundaries
3. Define the public API (function signatures, input/output)
4. Write a brief architecture spec as a markdown file in `docs/specs/`

## Rules

- **NO implementation code** — only design and specs
- Output a clear spec with: modules, functions, signatures, and examples
- Think about edge cases and error handling
- Keep it simple — KISS principle

## Output Format

Create a file `docs/specs/<feature>.md` with:
- Overview
- Module structure
- Function signatures with type hints
- Example usage
- Edge cases to handle
````

### Agent 2: Red (Tests que fallan)

Crea `.github/agents/red.agent.md`:

````markdown
---
name: Red
description: "TDD Red phase: writes failing tests that define expected behavior before implementation."
tools: ['read', 'search', 'edit', 'terminalLastCommand', 'runInTerminal']
handoffs:
  - label: "🟢 Make Tests Pass"
    agent: green
    prompt: "Now implement the minimum code necessary to make all the failing tests pass. Follow the spec and test expectations exactly."
    send: false
---

# Red Agent — Write Failing Tests

You are in the **Red** phase of TDD. Your job is to write tests that **fail** because the code doesn't exist yet.

## What You Do

1. Read the architecture spec from `docs/specs/`
2. Create test files following pytest conventions
3. Write comprehensive tests covering:
   - Happy path
   - Edge cases
   - Error handling
4. Run the tests to confirm they **fail** (red)

## Rules

- **ONLY write tests** — no implementation code
- Tests must be clear and descriptive (`test_should_convert_celsius_to_fahrenheit`)
- Use the AAA pattern: Arrange, Act, Assert
- Use `@pytest.mark.parametrize` for multiple similar cases
- After writing, run `pytest` to verify tests fail

## Test File Convention

```
tests/
├── test_<module>.py
```
````

### Agent 3: Green (Implementación mínima)

Crea `.github/agents/green.agent.md`:

````markdown
---
name: Green
description: "TDD Green phase: writes minimum code to make failing tests pass."
tools: ['read', 'search', 'edit', 'terminalLastCommand', 'runInTerminal']
handoffs:
  - label: "🔵 Refactor & Review"
    agent: refactor
    prompt: "All tests pass. Now review the implementation for code quality, simplify where possible, and ensure it follows best practices."
    send: false
---

# Green Agent — Make Tests Pass

You are in the **Green** phase of TDD. Your job is to write the **minimum code** to make all failing tests pass.

## What You Do

1. Read the failing tests to understand expected behavior
2. Read the architecture spec for design guidance
3. Implement the minimum code that makes tests pass
4. Run `pytest` to verify all tests pass (green)

## Rules

- **Minimum viable implementation** — don't over-engineer
- Follow the spec's module structure and function signatures exactly
- Handle all edge cases covered by the tests
- Run tests after each significant change
- If a test fails, fix the implementation (not the test)

## Implementation Convention

```
src/
├── <module>.py
```
````

### Agent 4: Refactor (Revisión y simplificación)

Crea `.github/agents/refactor.agent.md`:

````markdown
---
name: Refactor
description: "TDD Refactor phase: reviews, simplifies, and improves code quality while keeping all tests green."
tools: ['read', 'search', 'edit', 'terminalLastCommand', 'runInTerminal']
handoffs:
  - label: "🔴 Next Feature (Red)"
    agent: red
    prompt: "The refactoring is complete. Let's start the next TDD cycle. What feature should we add next?"
    send: false
---

# Refactor Agent — Improve Code Quality

You are in the **Refactor** phase of TDD. All tests pass. Your job is to **improve the code** without breaking anything.

## What You Do

1. Review the implementation for clarity and simplicity
2. Look for:
   - Duplicated code → extract functions
   - Complex logic → simplify
   - Poor naming → rename
   - Missing type hints → add them
   - Unnecessary code → remove it
3. Run `pytest` after every change to ensure tests still pass

## Rules

- **Tests must stay green** — if a refactoring breaks a test, revert it
- Prefer clarity over cleverness
- Follow Python best practices (PEP 8, type hints, docstrings)
- Small, incremental improvements — one refactoring at a time
- Report a summary of all changes made
````

---

## Paso 2: Probar el pipeline

Ahora que los agentes existen, vamos a usarlos para construir la CLI de temperaturas.

### 2.1 — Abrir el Architect Agent

1. Abre **Copilot Chat** (`Ctrl+Alt+I`)
2. En el **dropdown de agentes** (arriba a la izquierda del chat), selecciona **Architect**
3. Escribe:

```
Design a Python CLI tool called "tempconv" that converts temperatures between
Celsius, Fahrenheit and Kelvin.

Requirements:
- A pure function for each conversion (c_to_f, f_to_c, c_to_k, etc.)
- A CLI using argparse: tempconv 100 --from celsius --to fahrenheit
- Handle invalid inputs gracefully
- Support abbreviations: c, f, k
```

4. El Architect generará un spec en `docs/specs/tempconv.md`
5. **Revisa el spec** — ¿Te gusta el diseño? ¿Faltan edge cases?

### 2.2 — Handoff al Red Agent

Al final de la respuesta del Architect, verás un botón:

> 🔴 **Write Failing Tests**

1. **Haz clic en el botón** — se cambiará al agente Red con un prompt pre-llenado
2. Revisa el prompt y presiona Enter
3. El Red agent leerá el spec y creará tests en `tests/test_converter.py`
4. Ejecutará `pytest` y te mostrará que todo falla (¡bien! eso es lo esperado)

### 2.3 — Handoff al Green Agent

Al final de la respuesta del Red agent:

> 🟢 **Make Tests Pass**

1. Haz clic en el botón
2. El Green agent implementará `src/converter.py` y `src/cli.py`
3. Ejecutará `pytest` hasta que todos los tests pasen

### 2.4 — Handoff al Refactor Agent

Al final de la respuesta del Green agent:

> 🔵 **Refactor & Review**

1. Haz clic en el botón
2. El Refactor agent revisará el código, mejorará naming, añadirá docstrings, simplificará
3. Ejecutará `pytest` para confirmar que todo sigue verde
4. Te dará un resumen de cambios

### 2.5 — Ciclo completo 🎉

Al final del Refactor, verás:

> 🔴 **Next Feature (Red)**

Esto te permite comenzar otro ciclo TDD para la siguiente feature. El pipeline es **circular**.

---

## Paso 3: El patrón alternativo — Subagents (Orquestación automática)

Los handoffs requieren que tú hagas clic en cada paso. Pero si quieres que un **agente orquestador** maneje todo el flujo automáticamente, usa subagents.

### Crear un agente TDD orquestador

Crea `.github/agents/tdd.agent.md`:

````markdown
---
name: TDD
description: Orchestrates the full TDD cycle using specialized subagents for each phase.
tools: ['agent', 'read', 'search', 'edit', 'terminalLastCommand', 'runInTerminal']
agents: ['Red', 'Green', 'Refactor']
---

# TDD Orchestrator

You orchestrate the full Red-Green-Refactor cycle using specialized subagents.

## Workflow

For each feature requested:

1. **Design** — Analyze the request and create a brief spec (you do this yourself)
2. **Red** — Run the `Red` agent as a subagent to write failing tests
3. **Review** — Present the tests to the user for approval
4. **Green** — Run the `Green` agent as a subagent to implement the code
5. **Refactor** — Run the `Refactor` agent as a subagent to improve quality
6. **Report** — Summarize what was built, tests passing, and changes made

## Rules

- Always run tests between phases to verify state
- If a phase fails, retry with the same agent before moving forward
- Present a summary after each phase
- Ask the user before starting the next feature
````

### Usarlo

Selecciona **TDD** en el dropdown de agentes y escribe:

```
Build a Python CLI called "tempconv" that converts temperatures between Celsius,
Fahrenheit and Kelvin. Use TDD — write failing tests first, then implementation.
```

El agente TDD delegará automáticamente a Red, Green y Refactor como subagents, cada uno en su propio contexto aislado.

---

## Comparación: Handoffs vs Subagents vs Agent HQ

| | Handoffs | Subagents | Agent HQ (GitHub) |
|---|---|---|---|
| **Dónde** | VS Code Chat | VS Code Chat | GitHub.com / VS Code |
| **Flujo** | Secuencial con botones | Delegación automática | Asignar a issues/PRs |
| **Control** | Usuario aprueba cada paso | Orquestador decide | Asíncrono, revisas después |
| **Contexto** | Se hereda entre agentes | Aislado por subagent | Sesión independiente |
| **Agentes disponibles** | Custom agents locales | Custom agents locales | Copilot, Claude, Codex |
| **Mejor para** | Workflows paso a paso | Tareas complejas autónomas | Trabajo en equipo a escala |

### Agent HQ — Múltiples proveedores

Desde febrero 2026, GitHub permite usar Copilot, Claude (Anthropic) y Codex (OpenAI) directamente en GitHub:

```
Issue: "Implement user authentication"
  ├── Assign to @Copilot  → Draft PR #1
  ├── Assign to @Claude   → Draft PR #2
  └── Assign to @Codex    → Draft PR #3
  
→ Compare approaches, pick the best one
```

Esto es útil para **comparar enfoques** de diferentes modelos para el mismo problema.

---

## Mejores prácticas

### 1. Diseña agentes con responsabilidad única

Cada agente debe hacer **una cosa bien**. No crees un "super-agente" que hace todo.

```
❌ "General Agent" — code, test, review, deploy
✅ "Red Agent" — SOLO escribe tests que fallan
```

### 2. Limita las herramientas por agente

Un agente de planning no necesita `edit`. Un agente de revisión no necesita `runInTerminal`.

```yaml
# Planning agent — solo lectura
tools: ['read', 'search', 'fetch']

# Implementation agent — puede editar y ejecutar
tools: ['read', 'search', 'edit', 'runInTerminal']
```

### 3. Usa `send: false` en handoffs

Esto le da al usuario la oportunidad de **revisar y modificar** el prompt antes de enviarlo:

```yaml
handoffs:
  - label: "Next Step"
    agent: next-agent
    prompt: "Do the thing"
    send: false    # ← El usuario revisa primero
```

### 4. Restringe subagents con `agents:`

Evita que un orquestador elija el agente equivocado:

```yaml
agents: ['Red', 'Green', 'Refactor']  # Solo estos 3
```

### 5. Incluye verificación en cada fase

Cada agente debe **ejecutar tests** al final de su trabajo para garantizar el estado correcto.

### 6. Agentes como subagents-only

Si un agente solo debe invocarse como subagent (no directamente por el usuario):

```yaml
user-invokable: false  # No aparece en dropdown
```

---

## Estructura final del proyecto

```
your-project/
├── .github/
│   └── agents/
│       ├── architect.agent.md    ← Diseña specs
│       ├── red.agent.md          ← Tests que fallan
│       ├── green.agent.md        ← Implementación mínima
│       ├── refactor.agent.md     ← Simplifica código
│       └── tdd.agent.md          ← Orquestador (subagents)
├── docs/
│   └── specs/
│       └── tempconv.md           ← Spec del arquitecto
├── src/
│   ├── converter.py              ← Funciones de conversión
│   └── cli.py                    ← CLI con argparse
└── tests/
    └── test_converter.py         ← Tests con pytest
```

---

## Resumen

| Concepto | Qué es | Archivo |
|----------|--------|---------|
| **Custom Agent** | Persona AI con tools e instrucciones específicas | `.github/agents/*.agent.md` |
| **Handoff** | Botón que transiciona al siguiente agente con prompt | Campo `handoffs:` en el frontmatter |
| **Subagent** | Agente delegado con contexto aislado | Campo `agents:` + herramienta `agent` |
| **Agent HQ** | Plataforma GitHub para agentes multi-proveedor | GitHub.com → Agents tab |

El poder real está en **combinar estos patrones**: usa handoffs para flujos donde quieres control paso a paso, subagents para delegación autónoma, y Agent HQ cuando necesitas comparar resultados de diferentes modelos o trabajar a escala.

---

## Otros Tutoriales

| Tutorial | Descripción |
|----------|-------------|
| [Getting Started](./README.md) | Configura tu primer proyecto con agent skills |
| [Agent Orchestration Patterns](./agent-orchestration-patterns.md) | Orquestadores dinámicos, equipos de producto, trabajo paralelo |
| [PowerPoint Generator](./powerpoint.md) | Genera presentaciones con el skill de PPTX |

---

## Referencias

- [Custom Agents — VS Code Docs](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Subagents — VS Code Docs](https://code.visualstudio.com/docs/copilot/agents/subagents)
- [Agent HQ — GitHub Blog](https://github.blog/news-insights/company-news/pick-your-agent-use-claude-and-codex-on-agent-hq/)
- [Customize AI in VS Code](https://code.visualstudio.com/docs/copilot/customization/overview)

**License:** MIT
