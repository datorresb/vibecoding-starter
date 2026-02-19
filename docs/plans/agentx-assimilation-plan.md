# Plan de Asimilación: Clonar AgentX para Nuestro Sistema

> Análisis usando el pipeline de asimilación (repo-scanner → pattern-extractor → skill-generator)
> aplicado al framework AgentX para reemplazar y potenciar nuestros agentes actuales.

---

## 1. Scan Report: Comparación Actual vs AgentX

### Estado Actual (Nuestro Sistema)

```
  NUESTROS AGENTES (10)                    NUESTRAS SKILLS (39)
  ┌─────────────────────┐                  ┌─────────────────────┐
  │ core/ (4)           │                  │ core/ (18)          │
  │  ├── tech-lead      │                  │ engineering/ (8)    │
  │  ├── architect      │                  │ devops/ (5)         │
  │  ├── developer      │                  │ documentation/ (3)  │
  │  └── tester         │                  │ research/ (3)       │
  │                     │                  │ assimilation/ (4)   │
  │ quality/ (2)        │                  └─────────────────────┘
  │  ├── code-simplifier│
  │  └── review-test    │
  │                     │
  │ tdd/ (4)            │
  │  ├── tdd (orch)     │
  │  ├── red            │
  │  ├── green          │
  │  └── refactor       │
  └─────────────────────┘
```

### Sistema AgentX (Objetivo)

```
  AGENTES AGENTX (8)                      SKILLS AGENTX (41)
  ┌─────────────────────┐                  ┌─────────────────────┐
  │ Agent X (hub)       │                  │ architecture/ (7)   │
  │ Product Manager     │                  │ development/ (20)   │
  │ UX Designer         │                  │ operations/ (4)     │
  │ Solution Architect  │                  │ cloud/ (5)          │
  │ Software Engineer   │                  │ ai-systems/ (4)     │
  │ Code Reviewer       │                  │ design/ (1)         │
  │ DevOps Engineer     │                  └─────────────────────┘
  │ Auto-Fix Reviewer   │
  └─────────────────────┘                  + 30 scripts ejecutables
                                           + 8 templates
                                           + 11 prompts
                                           + CLI (11 subcommands)
                                           + VS Code Extension
```

---

## 2. Gap Analysis: Qué Nos Falta

```
╔════════════════════════════════════════════════════════════════════════════╗
║                      GAP ANALYSIS: NUESTRO vs AGENTX                     ║
╠══════════════════════════╦═══════════════════╦════════════════════════════╣
║ Capacidad                ║ Nosotros          ║ AgentX                    ║
╠══════════════════════════╬═══════════════════╬════════════════════════════╣
║ Product Manager          ║ ❌ No existe       ║ ✅ PRD, descompone epics   ║
║ UX Designer              ║ ❌ No existe       ║ ✅ Wireframes, prototipos  ║
║ Code Reviewer dedicado   ║ ⚠️ review-test     ║ ✅ Review + Security check ║
║ DevOps Engineer          ║ ❌ No existe       ║ ✅ CI/CD, Docker, deploys  ║
║ Hub Coordinator          ║ ⚠️ tech-lead       ║ ✅ Auto-clasifica, enruta  ║
║──────────────────────────║───────────────────║────────────────────────────║
║ Handoff Validation       ║ ❌ No existe       ║ ✅ 5 gates con script      ║
║ Issue Classification     ║ ❌ Manual          ║ ✅ Auto por type: label    ║
║ Status Workflow          ║ ❌ No formal       ║ ✅ 5 estados + transiciones║
║ Templates System         ║ ❌ No existe       ║ ✅ 8 templates dinámicos   ║
║ CLI Tooling              ║ ❌ No existe       ║ ✅ 11 subcomandos          ║
║ Security Model           ║ ❌ No formal       ║ ✅ 4 capas de seguridad    ║
║ Agent Memory             ║ ⚠️ Copilot Memory  ║ ✅ patterns/prefs/errors   ║
║──────────────────────────║───────────────────║────────────────────────────║
║ TDD Cycle                ║ ✅ Red/Green/Ref   ║ ❌ No tiene               ║
║ Code Simplifier          ║ ✅ Dedicado        ║ ❌ No tiene               ║
║ Brainstorming Skill      ║ ✅ Interactivo     ║ ❌ No tiene               ║
║ Assimilation Pipeline    ║ ✅ 4 fases         ║ ❌ No tiene               ║
║ Skills Library           ║ ✅ 39 skills       ║ ✅ 41 skills               ║
╚══════════════════════════╩═══════════════════╩════════════════════════════╝

LEYENDA: ✅ Tiene  ⚠️ Parcial  ❌ No tiene
```

---

## 3. Patrones Extraídos de AgentX (Phase 2: Pattern Extraction)

Aplicando el pattern-extractor a AgentX, estos son los patrones clave:

### Patrón 1: Hub Coordinator (confidence: 0.95)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: HUB COORDINATOR                                   │
  │  Categoría: architecture    Confianza: 0.95                 │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  NUESTRO tech-lead          AGENTX Agent X                  │
  │  ┌──────────────┐           ┌──────────────────┐           │
  │  │ Orquesta     │           │ Orquesta         │           │
  │  │ Delega       │           │ Clasifica auto   │  ← NUEVO  │
  │  │ Revisa       │           │ Enruta auto      │  ← NUEVO  │
  │  │              │           │ Auto-escala      │  ← NUEVO  │
  │  │ NO edita     │           │ NO edita         │           │
  │  └──────────────┘           │ Valida handoffs  │  ← NUEVO  │
  │                             └──────────────────┘           │
  │                                                             │
  │  ACCIÓN: Mejorar tech-lead con clasificación automática    │
  │  y routing basado en type: labels                          │
  └─────────────────────────────────────────────────────────────┘
```

### Patrón 2: Issue Classification Pipeline (confidence: 0.92)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: ISSUE CLASSIFICATION                               │
  │  Categoría: architecture    Confianza: 0.92                 │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Issue entra ──► Clasificar por tipo                        │
  │                      │                                      │
  │       ┌──────────────┼──────────────┐                      │
  │       │              │              │                      │
  │  type:epic      type:feature   type:story                  │
  │       │              │              │                      │
  │       ▼              ▼              ▼                      │
  │   PM Agent     Architect      Engineer                     │
  │   (PRD)        (ADR+Spec)     (Code)                       │
  │                                                             │
  │  type:bug  ──► Engineer (fast-track)                       │
  │  type:devops ──► DevOps Engineer                           │
  │  type:spike ──► Architect (investigación)                  │
  │                                                             │
  │  ACCIÓN: Implementar sistema de labels type:               │
  └─────────────────────────────────────────────────────────────┘
```

### Patrón 3: Handoff Validation Gates (confidence: 0.90)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: VALIDATION GATES                                   │
  │  Categoría: quality    Confianza: 0.90                      │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Agente termina ──► Script valida ──► ¿Pasa?               │
  │                                         │                   │
  │                                    Sí ──┤── No              │
  │                                    │         │              │
  │                              Avanza estado   Bloquea        │
  │                                              + feedback     │
  │                                                             │
  │  Artefactos validados por gate:                             │
  │  ┌────────────┬──────────────────────────────┐             │
  │  │ Gate       │ Valida                       │             │
  │  ├────────────┼──────────────────────────────┤             │
  │  │ PM         │ PRD existe, secciones ok     │             │
  │  │ UX         │ Wireframes, prototipos HTML  │             │
  │  │ Architect  │ ADR + Spec, CERO código      │             │
  │  │ Engineer   │ Code + Tests ≥80%, docs      │             │
  │  │ Reviewer   │ Review doc, security check   │             │
  │  └────────────┴──────────────────────────────┘             │
  │                                                             │
  │  ACCIÓN: Crear validate-handoff.sh para nuestros agentes   │
  └─────────────────────────────────────────────────────────────┘
```

### Patrón 4: Template-Driven Documents (confidence: 0.88)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: TEMPLATE SYSTEM                                    │
  │  Categoría: conventions    Confianza: 0.88                  │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Agente necesita crear doc ──► Carga template               │
  │                                     │                       │
  │                              Rellena ${variables}           │
  │                                     │                       │
  │                              Valida frontmatter             │
  │                                     │                       │
  │                              Guarda en docs/<tipo>/         │
  │                                                             │
  │  Templates necesarios:                                      │
  │  ┌──────────────┬──────────────────────┐                   │
  │  │ PRD          │ Product Requirements │                   │
  │  │ ADR          │ Architecture Decision│                   │
  │  │ SPEC         │ Technical Spec       │                   │
  │  │ UX           │ UX Design Doc        │                   │
  │  │ REVIEW       │ Code Review Report   │                   │
  │  │ PROGRESS     │ Session Log          │                   │
  │  └──────────────┴──────────────────────┘                   │
  │                                                             │
  │  ACCIÓN: Crear sistema de templates en .github/templates/  │
  └─────────────────────────────────────────────────────────────┘
```

### Patrón 5: Status State Machine (confidence: 0.92)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: STATUS STATE MACHINE                               │
  │  Categoría: architecture    Confianza: 0.92                 │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Estados:     Backlog → Ready → In Progress →               │
  │                         In Review → Done                    │
  │                                                             │
  │  Reglas:                                                    │
  │  ▸ Solo avanza al SIGUIENTE estado (sin saltos)            │
  │  ▸ Reviewer puede RECHAZAR → regresa a In Progress         │
  │  ▸ Cada transición requiere validation gate                │
  │  ▸ Solo un agente trabaja un issue a la vez                │
  │                                                             │
  │  ACCIÓN: Integrar con bd (beads) backlog system            │
  └─────────────────────────────────────────────────────────────┘
```

### Patrón 6: Security Layered Model (confidence: 0.85)

```
  ┌─────────────────────────────────────────────────────────────┐
  │  PATRÓN: SECURITY LAYERS                                    │
  │  Categoría: security    Confianza: 0.85                     │
  ├─────────────────────────────────────────────────────────────┤
  │                                                             │
  │  Pre-commit hook ──► Analiza comando                        │
  │                          │                                  │
  │                 ┌────────┼────────┐                        │
  │                 │                  │                        │
  │           En allowlist?       Blocked?                      │
  │                 │                  │                        │
  │            Ejecuta            Bloquea + Log                │
  │                 │                                           │
  │            Audit log                                        │
  │                                                             │
  │  ACCIÓN: Crear allowed-commands.json + pre-commit hooks    │
  └─────────────────────────────────────────────────────────────┘
```

---

## 4. Plan de Clonación: Fases de Implementación

### Visión General del Pipeline

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    PIPELINE DE CLONACIÓN AGENTX                         ║
║                                                                         ║
║  Fase 1        Fase 2         Fase 3         Fase 4         Fase 5     ║
║  ┌──────┐     ┌──────┐      ┌──────┐      ┌──────┐      ┌──────┐     ║
║  │NUEVOS│     │ENHANCE│     │INFRA │      │TOOLS │      │INTEGR│     ║
║  │AGENTS│────►│EXISTING────►│STRUCT│─────►│ CLI  │─────►│ TEST │     ║
║  │      │     │AGENTS│      │      │      │      │      │      │     ║
║  └──────┘     └──────┘      └──────┘      └──────┘      └──────┘     ║
║                                                                         ║
║  +3 agentes   Mejorar 4     Templates     CLI local     E2E test      ║
║  nuevos       existentes    Validation    Ready queue   Validar todo  ║
║                             Security      Digest                       ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

### FASE 1: Crear Nuevos Agentes (3 nuevos)

Los 3 roles que nos faltan completamente:

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │  FASE 1: NUEVOS AGENTES                                            │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  1. Product Manager (PM)                                            │
  │     Ubicación: .github/agents/core/product-manager.agent.md        │
  │     ┌────────────────────────────────────────────┐                 │
  │     │ Trigger: type:epic                         │                 │
  │     │ Entrega: PRD + child issues                │                 │
  │     │ Tools: read, search, edit, agent           │                 │
  │     │ Handoff → Architect / Developer            │                 │
  │     │ Template: PRD-TEMPLATE.md                  │                 │
  │     │ Valida: PRD existe, secciones completas    │                 │
  │     └────────────────────────────────────────────┘                 │
  │                                                                     │
  │  2. UX Designer                                                     │
  │     Ubicación: .github/agents/core/ux-designer.agent.md            │
  │     ┌────────────────────────────────────────────┐                 │
  │     │ Trigger: needs:ux + Status=Ready           │                 │
  │     │ Entrega: Wireframes ASCII + HTML prototype │                 │
  │     │ Tools: read, search, edit, create_file     │                 │
  │     │ Handoff → Architect / Developer            │                 │
  │     │ Template: UX-TEMPLATE.md                   │                 │
  │     │ Valida: wireframes existen, accesibilidad  │                 │
  │     └────────────────────────────────────────────┘                 │
  │                                                                     │
  │  3. DevOps Engineer                                                 │
  │     Ubicación: .github/agents/devops/devops-engineer.agent.md      │
  │     ┌────────────────────────────────────────────┐                 │
  │     │ Trigger: type:devops                       │                 │
  │     │ Entrega: CI/CD config, Dockerfile, compose │                 │
  │     │ Tools: read, search, edit, runInTerminal   │                 │
  │     │ Skills: ci-cd, deployment, infrastructure  │                 │
  │     │ Valida: pipelines válidos, no secrets      │                 │
  │     └────────────────────────────────────────────┘                 │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

### FASE 2: Mejorar Agentes Existentes

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │  FASE 2: MEJORAS A AGENTES EXISTENTES                              │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  tech-lead.agent.md (→ Hub Coordinator)                            │
  │  ┌──────────────────────────────────────────────────────────┐     │
  │  │ AGREGAR:                                                  │     │
  │  │  ✚ Clasificación automática por type: label              │     │
  │  │  ✚ Routing a PM/UX/Architect/Engineer/DevOps             │     │
  │  │  ✚ Validación de handoff entre agentes                   │     │
  │  │  ✚ Smart ready queue (prioridad: p0 > p1 > p2)          │     │
  │  │  ✚ Auto-escalamiento cuando agente se bloquea           │     │
  │  │                                                           │     │
  │  │ MANTENER:                                                 │     │
  │  │  ✓ No edita archivos directamente                        │     │
  │  │  ✓ Delega a subagentes                                   │     │
  │  │  ✓ Revisa resultados                                     │     │
  │  └──────────────────────────────────────────────────────────┘     │
  │                                                                     │
  │  architect.agent.md (→ Solution Architect)                         │
  │  ┌──────────────────────────────────────────────────────────┐     │
  │  │ AGREGAR:                                                  │     │
  │  │  ✚ Genera ADR obligatorio (docs/adr/ADR-{id}.md)        │     │
  │  │  ✚ Genera Tech Spec (docs/specs/SPEC-{id}.md)           │     │
  │  │  ✚ Regla estricta: CERO código en specs                 │     │
  │  │  ✚ Incluir diagramas en specs                           │     │
  │  │                                                           │     │
  │  │ MANTENER:                                                 │     │
  │  │  ✓ Diseña antes de codificar                             │     │
  │  │  ✓ Define contratos e interfaces                         │     │
  │  └──────────────────────────────────────────────────────────┘     │
  │                                                                     │
  │  review-test.agent.md (→ Code Reviewer)                            │
  │  ┌──────────────────────────────────────────────────────────┐     │
  │  │ AGREGAR:                                                  │     │
  │  │  ✚ Genera Review doc (docs/reviews/REVIEW-{id}.md)      │     │
  │  │  ✚ Security checklist obligatorio                        │     │
  │  │  ✚ Decisión explícita: Approve / Reject                 │     │
  │  │  ✚ Puede rechazar → regresa a Engineer                  │     │
  │  │                                                           │     │
  │  │ MANTENER:                                                 │     │
  │  │  ✓ Revisa código                                         │     │
  │  │  ✓ Escribe tests                                         │     │
  │  └──────────────────────────────────────────────────────────┘     │
  │                                                                     │
  │  product-developer.agent.md (→ Software Engineer)                  │
  │  ┌──────────────────────────────────────────────────────────┐     │
  │  │ AGREGAR:                                                  │     │
  │  │  ✚ Lee Spec del Architect antes de codificar            │     │
  │  │  ✚ Commits con referencia a issue (#id)                 │     │
  │  │  ✚ Coverage ≥80% obligatorio                            │     │
  │  │  ✚ Actualiza docs después de implementar                │     │
  │  │                                                           │     │
  │  │ MANTENER:                                                 │     │
  │  │  ✓ Implementa features                                   │     │
  │  │  ✓ Escribe tests                                         │     │
  │  └──────────────────────────────────────────────────────────┘     │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

### FASE 3: Infraestructura (Templates + Validation + Security)

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │  FASE 3: INFRAESTRUCTURA                                           │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  A) Sistema de Templates                                            │
  │     .github/templates/                                              │
  │     ├── PRD-TEMPLATE.md         ← Product Requirements Doc         │
  │     ├── ADR-TEMPLATE.md         ← Architecture Decision Record     │
  │     ├── SPEC-TEMPLATE.md        ← Technical Specification          │
  │     ├── SPEC-TEMPLATE-LITE.md   ← Spec simplificado (stories)     │
  │     ├── UX-TEMPLATE.md          ← UX Design Document              │
  │     ├── REVIEW-TEMPLATE.md      ← Code Review Report              │
  │     └── PROGRESS-TEMPLATE.md    ← Session Progress Log            │
  │                                                                     │
  │  B) Script de Validación                                            │
  │     .github/scripts/validate-handoff.sh                            │
  │     ┌────────────────────────────────────────┐                     │
  │     │ Usage: validate-handoff.sh <issue> <role>                    │
  │     │                                        │                     │
  │     │ Roles: pm, ux, architect, engineer,    │                     │
  │     │        reviewer                        │                     │
  │     │                                        │                     │
  │     │ Valida artefactos específicos por rol  │                     │
  │     │ Exit 0 = pasa, Exit 1 = falla          │                     │
  │     └────────────────────────────────────────┘                     │
  │                                                                     │
  │  C) Modelo de Seguridad                                             │
  │     .github/security/                                               │
  │     ├── allowed-commands.json   ← Allowlist de comandos            │
  │     └── audit.log              ← Log de comandos ejecutados        │
  │                                                                     │
  │  D) Estructura de Docs                                              │
  │     docs/                                                           │
  │     ├── prd/         ← PRDs generados                              │
  │     ├── adr/         ← ADRs generados                              │
  │     ├── specs/       ← Tech Specs generados                        │
  │     ├── ux/          ← UX Docs + prototypes/                       │
  │     ├── reviews/     ← Code Review Reports                         │
  │     └── progress/    ← Session Progress Logs                       │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

### FASE 4: CLI y Tooling

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │  FASE 4: CLI LOCAL                                                  │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  Opción A: Extender bd (beads) con subcomandos AgentX              │
  │  ──────────────────────────────────────────────────────────         │
  │  bd ready          ← Issues listos, sin blockers, por prioridad    │
  │  bd state          ← Estado de todos los agentes                   │
  │  bd deps <id>      ← Dependencias de un issue                     │
  │  bd workflow <type>← Pasos del workflow según tipo                 │
  │  bd digest         ← Resumen semanal                               │
  │  bd hook start <agent> <id>  ← Iniciar trabajo                    │
  │  bd hook finish <agent> <id> ← Finalizar + validar                │
  │                                                                     │
  │  Opción B: Script standalone                                        │
  │  ──────────────────────────────────────────────────────────         │
  │  .github/scripts/workflow.sh ready                                  │
  │  .github/scripts/workflow.sh state                                  │
  │  .github/scripts/workflow.sh deps <id>                              │
  │  ...etc                                                             │
  │                                                                     │
  │  RECOMENDACIÓN: Opción A (integrar con bd/beads existente)         │
  │  Razón: Ya tenemos backlog-workflow y bd skills configurados       │
  └─────────────────────────────────────────────────────────────────────┘
```

### FASE 5: Integración y Testing

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │  FASE 5: VALIDACIÓN END-TO-END                                     │
  ├─────────────────────────────────────────────────────────────────────┤
  │                                                                     │
  │  Test 1: Epic Flow                                                  │
  │  ─────────────────                                                  │
  │  Crear type:epic → PM genera PRD → Features creados →              │
  │  Architect genera ADR/Spec → Engineer implementa →                 │
  │  Reviewer aprueba → Done                                           │
  │                                                                     │
  │  Test 2: Bug Fast-Track                                             │
  │  ─────────────────                                                  │
  │  Crear type:bug → Engineer directo → Fix + Tests →                 │
  │  Reviewer → Done (sin PM ni Architect)                             │
  │                                                                     │
  │  Test 3: Rejection Flow                                             │
  │  ─────────────────                                                  │
  │  Engineer entrega → Reviewer rechaza → Engineer corrige →          │
  │  Reviewer aprueba → Done                                           │
  │                                                                     │
  │  Test 4: Validation Gates                                           │
  │  ─────────────────                                                  │
  │  validate-handoff.sh bloquea cuando faltan artefactos              │
  │  validate-handoff.sh pasa cuando artefactos están completos        │
  │                                                                     │
  │  Test 5: TDD Integration                                            │
  │  ─────────────────                                                  │
  │  type:story → Engineer usa TDD cycle →                             │
  │  Red/Green/Refactor → Reviewer → Done                              │
  │  (Nuestro TDD cycle se integra dentro del flujo AgentX)           │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Arquitectura Final (Post-Clonación)

```
                        ┌──────────────────────────────┐
                        │      TECH LEAD (HUB)          │
                        │                                │
                        │  ▸ Clasifica por type: label   │
                        │  ▸ Enruta al agente correcto   │
                        │  ▸ Valida handoffs             │
                        │  ▸ Ready queue priorizada      │
                        │  ▸ NO edita archivos           │
                        └──────────────┬───────────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │                            │                            │
  ┌───────▼───────┐           ┌───────▼───────┐           ┌───────▼───────┐
  │ 📋 PRODUCT     │           │ 🎨 UX          │           │ 🏗️ ARCHITECT   │
  │   MANAGER      │           │   DESIGNER     │           │   (mejorado)  │
  │   ★ NUEVO      │           │   ★ NUEVO      │           │               │
  │                │           │                │           │ ▸ ADR + Spec   │
  │ ▸ PRD          │           │ ▸ Wireframes   │           │ ▸ SIN CÓDIGO   │
  │ ▸ Descompone   │           │ ▸ Prototipos   │           │ ▸ Diagramas    │
  │   epics        │           │ ▸ Accesibilidad│           │               │
  └───────┬───────┘           └───────┬───────┘           └───────┬───────┘
          │                            │                            │
          └────────────────────────────┼────────────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │ 🔧 DEVELOPER     │
                              │   (mejorado)     │
                              │                  │
                              │ ▸ Lee Spec       │
                              │ ▸ Coverage ≥80%  │
                              │ ▸ Commits #id    │
                              └────────┬────────┘
                                       │
                          ┌────────────┼────────────────┐
                          │            │                  │
                 ┌────────▼───┐  ┌────▼───────┐  ┌─────▼──────┐
                 │ 🔍 REVIEWER │  │ ⚙️ DEVOPS   │  │ 🔄 TDD      │
                 │ (mejorado)  │  │  ★ NUEVO    │  │  CYCLE      │
                 │             │  │             │  │ (existente) │
                 │ ▸ Review doc│  │ ▸ CI/CD     │  │             │
                 │ ▸ Security  │  │ ▸ Docker    │  │ ▸ Red       │
                 │ ▸ Approve/  │  │ ▸ Deploy    │  │ ▸ Green     │
                 │   Reject    │  │             │  │ ▸ Refactor  │
                 └─────────────┘  └─────────────┘  └────────────┘

  QUALITY LAYER (transversal):
  ┌────────────────────────────────────────────────────────┐
  │  Code Simplifier  │  Validation Gates  │  Security    │
  │  (existente)      │  (nuevo)           │  (nuevo)     │
  └────────────────────────────────────────────────────────┘
```

### Mapeo Final de Agentes

```
  ┌────────────────────────────────────────────────────────────────────┐
  │  DIRECTORIO FINAL: .github/agents/                                 │
  ├────────────────────────────────────────────────────────────────────┤
  │                                                                    │
  │  core/                                                             │
  │  ├── tech-lead.agent.md          ← MEJORADO (hub coordinator)     │
  │  ├── product-manager.agent.md    ← NUEVO                          │
  │  ├── ux-designer.agent.md        ← NUEVO                          │
  │  ├── architect.agent.md          ← MEJORADO (ADR/Spec obligat.)  │
  │  ├── product-developer.agent.md  ← MEJORADO (lee specs, ≥80%)   │
  │  └── product-tester.agent.md     ← EXISTENTE (sin cambios)       │
  │                                                                    │
  │  quality/                                                          │
  │  ├── code-simplifier.agent.md    ← EXISTENTE (sin cambios)       │
  │  └── review-test.agent.md        ← MEJORADO (review docs, sec)  │
  │                                                                    │
  │  devops/                          ← NUEVO directorio              │
  │  └── devops-engineer.agent.md    ← NUEVO                          │
  │                                                                    │
  │  tdd/                             ← EXISTENTE (sin cambios)       │
  │  ├── tdd.agent.md                                                  │
  │  ├── red.agent.md                                                  │
  │  ├── green.agent.md                                                │
  │  └── refactor.agent.md                                            │
  │                                                                    │
  │  Total: 13 agentes (10 actuales + 3 nuevos)                       │
  └────────────────────────────────────────────────────────────────────┘
```

---

## 6. Lo Que MANTENEMOS (Ventajas Nuestras sobre AgentX)

```
  ┌─────────────────────────────────────────────────────────────────┐
  │  VENTAJAS COMPETITIVAS A PRESERVAR                              │
  ├─────────────────────────────────────────────────────────────────┤
  │                                                                 │
  │  ✅ TDD Cycle (Red/Green/Refactor)                              │
  │     AgentX NO tiene esto. Nuestro ciclo TDD con agentes        │
  │     dedicados es una ventaja significativa. Se integra          │
  │     dentro del workflow: Engineer puede invocar TDD cycle.     │
  │                                                                 │
  │  ✅ Code Simplifier                                             │
  │     Agente dedicado a simplificación. AgentX no tiene          │
  │     equivalente. Lo mantenemos como quality gate.              │
  │                                                                 │
  │  ✅ Brainstorming Skill (interactivo)                           │
  │     Skill de ideación con ask_questions. AgentX no tiene.      │
  │     Valioso para diseño colaborativo.                          │
  │                                                                 │
  │  ✅ Assimilation Pipeline                                       │
  │     4 fases de asimilación de repos. AgentX no tiene.          │
  │     Es lo que estamos usando ahora mismo.                      │
  │                                                                 │
  │  ✅ Skills Library (39 skills)                                  │
  │     Comparable a AgentX (41). Nuestras skills incluyen         │
  │     pptx, pdf, mcp-builder, webapp-testing que AgentX no.     │
  │                                                                 │
  │  ✅ Beads/bd Backlog System                                     │
  │     Sistema de backlog integrado. AgentX tiene CLI separado.   │
  │     Nuestro bd es más natural para el workflow.                │
  │                                                                 │
  └─────────────────────────────────────────────────────────────────┘
```

---

## 7. Roadmap de Implementación

```
  SEMANA 1                    SEMANA 2                    SEMANA 3
  ────────────────────        ────────────────────        ────────────────────
  ┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
  │ FASE 1 + FASE 3A │       │ FASE 2 + FASE 3B │       │ FASE 4 + FASE 5  │
  │                  │       │                  │       │                  │
  │ ▸ PM agent       │       │ ▸ Mejorar tech-  │       │ ▸ CLI workflow   │
  │ ▸ UX agent       │       │   lead (hub)     │       │   commands       │
  │ ▸ DevOps agent   │       │ ▸ Mejorar arch   │       │ ▸ E2E tests      │
  │ ▸ Templates      │       │ ▸ Mejorar review │       │ ▸ Validar flujos │
  │   (7 templates)  │       │ ▸ Mejorar dev    │       │ ▸ Docs finales   │
  │                  │       │ ▸ validate-      │       │                  │
  │                  │       │   handoff.sh     │       │                  │
  │                  │       │ ▸ Security model │       │                  │
  └──────────────────┘       └──────────────────┘       └──────────────────┘

  ENTREGABLES:                ENTREGABLES:                ENTREGABLES:
  ▸ 3 nuevos .agent.md       ▸ 4 agents mejorados       ▸ workflow.sh CLI
  ▸ 7 templates              ▸ validate-handoff.sh      ▸ 5 E2E tests pass
  ▸ docs/ estructura         ▸ allowed-commands.json     ▸ Docs actualizados
                             ▸ AGENTS.md actualizado     ▸ AGENTS.md final
```

---

## 8. Decisiones Pendientes

| # | Decisión | Opciones | Impacto |
|---|----------|----------|---------|
| 1 | ¿Modo de operación? | Local (bd) vs GitHub Projects | Workflow completo |
| 2 | ¿CLI integrado en bd o standalone? | Extender bd vs nuevo script | Tooling |
| 3 | ¿Coverage obligatorio? | 80% (AgentX) vs flexible | Quality gates |
| 4 | ¿UX prototipos HTML obligatorios? | Sí (AgentX) vs ASCII wireframes | Diseño |
| 5 | ¿Auto-Fix Reviewer? | Incluir (experimental) vs skip | Scope |
| 6 | ¿Agent Memory system? | .agentx/memory/ vs Copilot Memory | Persistencia |

---

## 9. Resumen Ejecutivo

```
  ┌──────────────────────────────────────────────────────────────┐
  │                    RESULTADO FINAL                            │
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │  ANTES (10 agentes)              DESPUÉS (13 agentes)       │
  │  ───────────────────             ─────────────────────      │
  │  • Sin PM                        • PM con PRDs              │
  │  • Sin UX                        • UX con prototipos        │
  │  • Sin DevOps                    • DevOps con CI/CD         │
  │  • Sin validation gates          • 5 validation gates       │
  │  • Sin templates                 • 7 templates              │
  │  • Sin security model            • 4 capas de seguridad     │
  │  • Sin status workflow           • 5 estados formales       │
  │  • Sin issue classification      • Auto-clasificación       │
  │                                                              │
  │  PRESERVADO:                                                 │
  │  • TDD cycle (Red/Green/Refactor) ← Ventaja única          │
  │  • Code Simplifier ← Ventaja única                          │
  │  • 39 skills + assimilation ← Comparable a AgentX          │
  │  • Brainstorming interactivo ← Ventaja única               │
  │  • Beads/bd backlog ← Ya integrado                          │
  │                                                              │
  │  MÉTRICAS OBJETIVO:                                          │
  │  • 13 agentes operativos                                    │
  │  • 7 templates estandarizados                               │
  │  • 5 validation gates activos                               │
  │  • 39+ skills disponibles                                   │
  │  • Coverage ≥80% enforced                                   │
  │  • Security model de 4 capas                                │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘
```

> **Filosofía**: No estamos reemplazando nuestro sistema — lo estamos **potenciando**
> con los mejores patrones de AgentX mientras preservamos nuestras ventajas únicas
> (TDD cycle, Code Simplifier, Brainstorming, Assimilation Pipeline).
