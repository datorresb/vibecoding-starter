# Análisis Completo de AgentX

> Framework de orquestación multi-agente para desarrollo de software profesional.
> Basado en el análisis de `_reference/AgentX/` v5.1.0

---

## 1. Arquitectura Hub-and-Spoke (Centro y Radios)

AgentX funciona como una "empresa virtual" donde 8 agentes especializados colaboran
siguiendo un flujo de trabajo estructurado. El coordinador central (Agent X) clasifica
cada issue y lo enruta al agente apropiado.

```
                          ┌─────────────────────┐
                          │     AGENT X (HUB)    │
                          │     Coordinador       │
                          │  ▸ Clasifica issues   │
                          │  ▸ Enruta a agentes   │
                          │  ▸ Auto-escala         │
                          └──────────┬────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
    ┌───────▼───────┐       ┌───────▼───────┐       ┌───────▼───────┐
    │  📋 PRODUCT    │       │  🎨 UX         │       │  🏗️ SOLUTION   │
    │    MANAGER     │       │   DESIGNER     │       │   ARCHITECT   │
    │                │       │                │       │                │
    │ ▸ Escribe PRD  │       │ ▸ Wireframes   │       │ ▸ ADR + Spec   │
    │ ▸ Crea issues  │       │ ▸ Prototipos   │       │ ▸ Diagramas    │
    │ ▸ Prioriza     │       │ ▸ HTML/CSS     │       │ ▸ SIN CÓDIGO   │
    └───────┬───────┘       └───────┬───────┘       └───────┬───────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     │
                            ┌────────▼────────┐
                            │  🔧 SOFTWARE     │
                            │    ENGINEER      │
                            │                  │
                            │ ▸ Código + Tests │
                            │ ▸ Coverage ≥80%  │
                            │ ▸ Docs           │
                            └────────┬────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                                  │
           ┌───────▼───────┐                 ┌───────▼───────┐
           │  🔍 CODE       │                 │  ⚙️ DEVOPS     │
           │   REVIEWER     │                 │   ENGINEER    │
           │                │                 │                │
           │ ▸ Review doc   │                 │ ▸ CI/CD pipes  │
           │ ▸ Seguridad    │                 │ ▸ Deploy config│
           │ ▸ Aprueba/     │                 │ ▸ Docker       │
           │   Rechaza      │                 │ ▸ Infra        │
           └───────────────┘                 └───────────────┘
```

### Los 8 Agentes Especializados

| Agente | Trigger | Entregable | Estado Siguiente |
|--------|---------|------------|------------------|
| **Product Manager** | `type:epic` | PRD + Feature/Story issues | → Ready |
| **UX Designer** | `needs:ux` + Status=Ready | Wireframes + HTML/CSS Prototipos | → Ready |
| **Solution Architect** | `type:feature` o Status=Ready | ADR + Tech Spec (SIN CÓDIGO) | → Ready |
| **Software Engineer** | `type:story` o Status=Ready | Código + Tests (≥80%) + Docs | → In Review |
| **Code Reviewer** | Status=In Review | Review Report + Aprobación/Rechazo | → Done |
| **DevOps Engineer** | `type:devops` | CI/CD Pipelines + Deploy Configs | → Done |
| **Auto-Fix Reviewer** (Preview) | Status=In Review (auto-fix mode) | Review + Auto-Fixes seguros | → Done |
| **Agent X** (Hub Coordinador) | Todos los issues | Enruta al agente apropiado | — |

---

## 2. Flujo de Estados (Issue Lifecycle)

Cada issue atraviesa un flujo de estados claro. Los agentes mueven el issue
al siguiente estado solo después de pasar la validación de handoff.

```
  ┌──────────┐     PM/UX/Arch      ┌──────────┐     Engineer      ┌──────────────┐
  │          │     completan        │          │     empieza       │              │
  │ BACKLOG  │ ───────────────────► │  READY   │ ────────────────► │ IN PROGRESS  │
  │          │                      │          │                   │              │
  └──────────┘                      └──────────┘                   └──────┬───────┘
                                                                          │
                                                                   Engineer
                                                                   termina código
                                                                          │
  ┌──────────┐     Reviewer         ┌──────────────┐                     │
  │          │     aprueba          │              │ ◄───────────────────┘
  │   DONE   │ ◄────────────────── │  IN REVIEW   │
  │          │                      │              │
  └──────────┘                      └──────┬───────┘
       ▲                                    │
       │              ┌─────────┐          │ Reviewer
       │              │ RECHAZA │ ◄────────┘ rechaza
       │              └────┬────┘
       │                   │
       │         Regresa a In Progress
       │         Engineer corrige
       └──────────────────────────────────────┘
```

### Clasificación de Issues por Tipo

| Tipo | Agente Responsable | Cuándo Usarlo |
|------|--------------------|---------------|
| `type:epic` | Product Manager | Iniciativa grande, múltiples features |
| `type:feature` | Architect | Capacidad nueva con requisitos de diseño |
| `type:story` | Engineer | Tarea pequeña y específica (≤3 archivos) |
| `type:bug` | Engineer (salta PM/Architect) | Algo roto, corrección rápida |
| `type:spike` | Architect | Investigación/exploración |
| `type:docs` | Engineer | Solo documentación |
| `type:devops` | DevOps Engineer | CI/CD pipelines, release automation |

---

## 3. Pipeline de Trabajo por Tipo de Issue

Dependiendo del tipo de issue, el pipeline varía en complejidad.
Los epics pasan por todos los agentes; los bugs van directo al engineer.

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    TIPO: EPIC (Iniciativa Grande)                       ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  type:epic ──► PM ──► PRD ──► Crea Features ──► Crea Stories           ║
║                │                    │                  │                 ║
║                │                    ▼                  ▼                 ║
║                │              type:feature        type:story            ║
║                │                    │                  │                 ║
║                │                    ▼                  ▼                 ║
║                │              Architect ──►      Engineer ──►           ║
║                │              ADR + Spec         Código + Tests         ║
║                │                    │                  │                 ║
║                │                    ▼                  ▼                 ║
║                │              Engineer ──►       Reviewer ──► ✅        ║
║                └─────────────────────────────────────────────────────── ║
╚══════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════╗
║                    TIPO: FEATURE (Capacidad Nueva)                      ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  type:feature ──► Architect ──► ADR + Spec                             ║
║                        │            │                                   ║
║                        │      (paralelo)                                ║
║                        │            │                                   ║
║                   UX Designer  ◄────┘                                   ║
║                        │                                                ║
║                        ▼                                                ║
║                   Wireframes + Prototipos HTML                          ║
║                        │                                                ║
║                        ▼                                                ║
║                   Engineer ──► Código + Tests ──► Reviewer ──► ✅       ║
╚══════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════╗
║                    TIPO: BUG (Corrección Rápida)                        ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  type:bug ──► Engineer (directo, sin PM ni Architect)                  ║
║                   │                                                     ║
║                   ▼                                                     ║
║              Fix + Tests ──► Reviewer ──► ✅                            ║
║                                                                         ║
║  ⚡ Fast-track: salta las fases de diseño                              ║
╚══════════════════════════════════════════════════════════════════════════╝

╔══════════════════════════════════════════════════════════════════════════╗
║                    TIPO: STORY (Tarea Pequeña ≤3 archivos)             ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  type:story ──► Engineer ──► Código + Tests ──► Reviewer ──► ✅        ║
║                                                                         ║
║  📝 Spec-Lite opcional (plantilla simplificada)                        ║
╚══════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Sistema de Validación (Handoff Gates)

Antes de cada transición de estado, se ejecuta un script de validación
que asegura que los entregables cumplen los requisitos mínimos.

```
  ┌─────────────────────────────────────────────────────────────────┐
  │              VALIDATION GATES (Puertas de Calidad)              │
  └─────────────────────────────────────────────────────────────────┘

  PM ──────────────►│ GATE 1 │──────────────► Ready
                    │        │
                    │ ✓ PRD existe (docs/prd/PRD-{id}.md)
                    │ ✓ Child issues creados
                    │ ✓ Secciones requeridas completas
                    │ ✗ FALLA → No avanza

  UX ──────────────►│ GATE 2 │──────────────► Ready
                    │        │
                    │ ✓ Wireframes existen
                    │ ✓ Prototipos HTML/CSS en docs/ux/prototypes/
                    │ ✓ Accesibilidad considerada
                    │ ✗ FALLA → No avanza

  Architect ───────►│ GATE 3 │──────────────► Ready
                    │        │
                    │ ✓ ADR existe (docs/adr/ADR-{id}.md)
                    │ ✓ Tech Spec existe (docs/specs/SPEC-{id}.md)
                    │ ✓ CERO código (¡hard rule!)
                    │ ✓ Diagramas incluidos
                    │ ✗ FALLA → No avanza

  Engineer ────────►│ GATE 4 │──────────────► In Review
                    │        │
                    │ ✓ Código committed con ref #issue
                    │ ✓ Tests ≥80% coverage
                    │ ✓ Docs actualizados
                    │ ✓ Sin warnings ni lint errors
                    │ ✗ FALLA → No avanza

  Reviewer ────────►│ GATE 5 │──────────────► Done
                    │        │
                    │ ✓ Review doc (docs/reviews/REVIEW-{id}.md)
                    │ ✓ Decisión: Approve/Reject
                    │ ✓ Security checklist pasado
                    │ ✗ FALLA → Regresa al Engineer

  Script: .github/scripts/validate-handoff.sh <issue> <role>
```

---

## 5. Modelo de Seguridad (4 Capas)

AgentX implementa un modelo de seguridad en profundidad con 4 capas
que protegen contra comandos destructivos y accesos no autorizados.

```
  ╔═══════════════════════════════════════════════════════════╗
  ║              CAPA 4: AUDITORÍA                           ║
  ║  ▸ Log de todos los comandos con timestamp               ║
  ║  ▸ Trazabilidad completa                                 ║
  ╠═══════════════════════════════════════════════════════════╣
  ║              CAPA 3: ALLOWLIST (Lista Blanca)            ║
  ║  ▸ Pre-execution hook valida cada comando                ║
  ║  ✓ git, dotnet, npm, gh, python, read/write seguro      ║
  ║  ✗ rm -rf, git reset --hard, DROP DATABASE, push --force ║
  ╠═══════════════════════════════════════════════════════════╣
  ║              CAPA 2: FILESYSTEM                          ║
  ║  ▸ Restricción de paths (solo directorio del proyecto)   ║
  ║  ▸ No puede salir del workspace                          ║
  ╠═══════════════════════════════════════════════════════════╣
  ║              CAPA 1: SANDBOX                             ║
  ║  ▸ Aislamiento a nivel de OS                             ║
  ║  ▸ Container/VM recomendado                              ║
  ╚═══════════════════════════════════════════════════════════╝
```

### Reglas de Seguridad Clave

- **Comandos permitidos**: git, dotnet, npm, gh, python, filesystem (read/safe write)
- **Comandos bloqueados**: `rm -rf`, `git reset --hard`, `DROP DATABASE`, `git push --force`
- **Pre-commit hooks**: secrets scanning, blocked command detection, issue reference validation
- **SQL**: Siempre parameterizado (NUNCA concatenar queries)
- **Secrets**: Solo env vars/Key Vault (NUNCA hardcoded)

---

## 6. Estructura de Skills (41 Skills con Progressive Disclosure)

Las skills se cargan bajo demanda con un modelo de 3 niveles
para optimizar el uso de tokens del contexto del agente.

```
  ┌─────────────────────────────────────────────────┐
  │              SKILLS LIBRARY (41)                 │
  └───────────────────────┬─────────────────────────┘
                          │
     ┌────────────────────┼───────────────────────┐
     │                    │                       │
     ▼                    ▼                       ▼
  ┌──────────┐     ┌──────────┐            ┌──────────┐
  │ TIER 1   │     │ TIER 2   │            │ TIER 3   │
  │ Core     │     │ Details  │            │ Deep     │
  │ SKILL.md │────►│ Inline   │───────────►│ Refs/    │
  │          │     │ en body  │            │ Scripts  │
  │ <500 lín │     │ Expandido│            │ Archivos │
  │ 3-10K tok│     │          │            │ externos │
  └──────────┘     └──────────┘            └──────────┘

  Categorías:
  ┌──────────────────────────────────────────────────────┐
  │ 🏗️  Architecture (7)  │  Testing, Security, API...   │
  │ 💻 Development  (20)  │  C#, Python, TS, React...   │
  │ ⚙️  Operations   (4)  │  GitHub Actions, CI/CD...   │
  │ ☁️  Cloud        (5)  │  Azure, Docker, K8s...      │
  │ 🤖 AI Systems   (4)  │  Agents, RAG, Prompts...    │
  │ 🎨 Design       (1)  │  UX/UI, Wireframes          │
  └──────────────────────────────────────────────────────┘
```

### Detalle de Skills por Categoría

**Architecture (7)**: Core Principles (SOLID, DRY, KISS), Security (OWASP Top 10),
Performance (async, caching), Database (migrations, indexing), Scalability,
Code Organization, API Design (REST, versioning, rate limiting)

**Development (20)**: Testing, Error Handling, Configuration, Documentation,
Version Control, Type Safety, Dependencies, Logging & Monitoring, Code Review,
C#, Python, TypeScript, React, Blazor, PostgreSQL, SQL Server, MCP Server, Data Analysis, Go, Rust

**Operations (4)**: GitHub Actions, YAML Pipelines, Release Management, Remote Git

**Cloud (5)**: Azure, Containerization (Docker, K8s), Fabric Analytics, Fabric Data Agent, Fabric Forecasting

**AI Systems (4)**: AI Agent Development, Prompt Engineering, Cognitive Architecture (RAG), Skill Creator

**Design (1)**: UX/UI Design (wireframing, HTML prototypes, accessibility)

### Scripts Ejecutables (30 total)

| Script | Propósito |
|--------|-----------|
| `scaffold-project.py` | Genera proyecto Python (pyproject.toml, ruff, mypy) |
| `scaffold-solution.ps1` | Genera solución .NET con capas API/Core/Infra |
| `scaffold-agent.py` | Scaffold de AI agent con tracing, evaluation, MCP |
| `scaffold-cognitive.py` | Pipeline RAG + Memory con tests |
| `scaffold-playwright.py` | Tests E2E con Page Object Model |
| `scaffold-openapi.py` | Genera OpenAPI 3.1 spec desde código |
| `scaffold-prompt.py` | Template de prompt con evaluation checklist |
| `check-coverage.ps1/sh` | Valida ≥80% coverage |
| `check-test-pyramid.ps1` | Valida ratios 70/20/10 test files |
| `scan-secrets.ps1/sh` | Detecta private keys, tokens, high-entropy strings |
| `scan-security.ps1` | SQL injection, hardcoded secrets, insecure patterns |
| `version-bump.ps1` | SemVer bumping para Node/.NET/Python |
| `validate-frontmatter.ps1` | 130 checks de validación de frontmatter |
| `run-benchmark.ps1` | Benchmarks con baseline comparison |
| `generate-dockerfile.ps1` | Docker images multi-stage, non-root |
| `generate-compose.ps1` | Docker Compose scaffolding |

---

## 7. Sistema de Templates (8 Templates)

AgentX incluye plantillas con variables dinámicas (`${variable}`)
para estandarizar todos los documentos del proyecto.

| Template | Ubicación | Variables Clave |
|----------|-----------|-----------------|
| **PRD** | `.github/templates/PRD-TEMPLATE.md` | epic_title, issue_number, priority, author, date |
| **ADR** | `.github/templates/ADR-TEMPLATE.md` | decision_id, decision_title, issue_number, date, status |
| **Tech Spec** | `.github/templates/SPEC-TEMPLATE.md` | feature_name, issue_number, acceptance_criteria |
| **Spec-Lite** | `.github/templates/SPEC-TEMPLATE-LITE.md` | Spec simplificado para features pequeños |
| **UX Design** | `.github/templates/UX-TEMPLATE.md` | feature_name, issue_number, designer |
| **Code Review** | `.github/templates/REVIEW-TEMPLATE.md` | story_title, issue_number, engineer, commit_sha |
| **Progress Log** | `.github/templates/PROGRESS-TEMPLATE.md` | Session notes, blockers, next steps |

Características:
- YAML frontmatter con declaraciones `inputs:`
- Campos required/optional con enforcement
- Default values (e.g., `${current_date}`)
- Tokens especiales: `${current_year}`, `${user}`

---

## 8. Modos de Operación

AgentX soporta dos modos de operación según las necesidades del equipo.

```
  ┌─────────────────────────────────┐     ┌─────────────────────────────────┐
  │       MODO LOCAL (Default)      │     │       MODO GITHUB (Opt-in)      │
  ├─────────────────────────────────┤     ├─────────────────────────────────┤
  │                                 │     │                                 │
  │  ▸ Zero prompts en instalación  │     │  ▸ GitHub Projects V2 board     │
  │  ▸ Issues en .agentx/issues/   │     │  ▸ Issues reales en GitHub      │
  │  ▸ Sin GitHub necesario         │     │  ▸ GitHub Actions CI/CD         │
  │  ▸ Tracking por JSON local      │     │  ▸ PRs con auto-labels          │
  │  ▸ Ideal para ofensiva rápida   │     │  ▸ MCP Server para API directa  │
  │                                 │     │  ▸ Ideal para equipos           │
  │  ./install.sh --local           │     │  ./install.sh --mode github     │
  │                                 │     │                                 │
  │  .agentx/                       │     │  GitHub Projects V2             │
  │  ├── issues/                    │     │  ├── Backlog column             │
  │  │   ├── 1.json                 │     │  ├── Ready column               │
  │  │   └── 2.json                 │     │  ├── In Progress column         │
  │  ├── state/                     │     │  ├── In Review column           │
  │  │   └── agent-status.json      │     │  └── Done column                │
  │  └── digests/                   │     │                                 │
  └─────────────────────────────────┘     └─────────────────────────────────┘
```

### Instalación

```bash
# Modo local (default - zero prompts!)
./install.sh --local

# Modo GitHub (interactivo, pide repo/project)
./install.sh --mode github

# Con perfil específico
./install.sh --profile python    # opciones: full, minimal, python, dotnet, react

# Reinstalar (sobreescribe existente)
./install.sh --force
```

---

## 9. CLI y Extensión VS Code

```
  ┌──────────────────────────────────────────────────────────────────┐
  │                    INTERFACES DE AGENTX                          │
  ├──────────────────────┬───────────────────────────────────────────┤
  │                      │                                           │
  │    CLI (Terminal)     │        VS Code Extension                  │
  │                      │                                           │
  │  .agentx.sh ready    │   Sidebar: Agents, Queue, Workflows      │
  │  .agentx.sh state    │   @agentx ready  (en Copilot Chat)       │
  │  .agentx.sh deps 42  │   @agentx workflow feature               │
  │  .agentx.sh workflow │   @agentx status                         │
  │  .agentx.sh digest   │   @agentx deps 42                        │
  │  .agentx.sh hook ... │   @agentx digest                         │
  │  .agentx.sh create   │                                           │
  │  .agentx.sh list     │   Cmd Palette:                            │
  │  .agentx.sh update   │   ▸ AgentX: Initialize Project           │
  │  .agentx.sh close    │   ▸ AgentX: Show Agent Status            │
  │  .agentx.sh version  │   ▸ AgentX: Show Ready Queue             │
  │  .agentx.sh help     │   ▸ AgentX: Run Workflow                 │
  │                      │   ▸ AgentX: Generate Weekly Digest        │
  └──────────────────────┴───────────────────────────────────────────┘
```

### Comandos CLI Detallados

```bash
# Cola de trabajo (priorizada, sin bloqueos)
.agentx.sh ready

# Estado de agentes
.agentx.sh state                        # Ver todos los estados
.agentx.sh state engineer working 42    # Actualizar estado

# Dependencias entre issues
.agentx.sh deps 42                      # Verificar dependencias del issue 42

# Flujos de trabajo
.agentx.sh workflow -Type feature       # Ver pasos del workflow de feature

# Reportes
.agentx.sh digest                       # Generar resumen semanal

# Ciclo de vida del trabajo
.agentx.sh hook start engineer 42       # Iniciar trabajo en issue 42
.agentx.sh hook finish engineer 42      # Finalizar trabajo (auto-valida)

# Gestión de issues (modo local)
.agentx.sh create "[Story] Add logout" "descripción" "type:story"
.agentx.sh list
.agentx.sh update 1 "In Progress"
.agentx.sh close 1
```

---

## 10. Quality Gates (Puertas de Calidad)

```
  ┌───────────────────────────────────────────────────────────┐
  │                 QUALITY ENFORCEMENT                        │
  ├───────────────────────────────────────────────────────────┤
  │                                                            │
  │  Coverage: ≥80% obligatorio                                │
  │  ┌────────────────────────────────────────────┐           │
  │  │ ██████████████████████████████████░░░░░░░░ │ 80%      │
  │  └────────────────────────────────────────────┘           │
  │                                                            │
  │  Test Pyramid:                                             │
  │  ┌──────┐                                                  │
  │  │ E2E  │ 10%  ← Pocos, costosos                          │
  │  ├──────┴──────┐                                           │
  │  │ Integration │ 20%  ← Moderados                          │
  │  ├─────────────┴─────────┐                                 │
  │  │      Unit Tests       │ 70%  ← Muchos, rápidos          │
  │  └───────────────────────┘                                 │
  │                                                            │
  │  Pre-commit Hooks:                                         │
  │  ✓ Secrets scanning                                        │
  │  ✓ Blocked command detection                               │
  │  ✓ Issue reference en commit msg                           │
  │  ✓ Sin compiler warnings                                   │
  │  ✓ Sin linter errors                                       │
  │  ✓ XML docs en APIs públicas                               │
  └───────────────────────────────────────────────────────────┘
```

---

## 11. Features Avanzados

### Session Persistence & Auto-Resume

Para tareas largas (>200K tokens), AgentX persiste el progreso en 3 niveles:

```
  Tier 1: GitHub Issues (Status field, checkboxes)
      ↓
  Tier 2: Progress logs (docs/progress/ISSUE-{id}-log.md)
      ↓
  Tier 3: Git commits (código con referencias #123)
```

Cuando el contexto supera el 80%, lee automáticamente el progress log y commits recientes.

### Agent Memory System

Almacenado en `.agentx/memory/`:

| Archivo | Contenido |
|---------|-----------|
| `patterns.json` | Patrones de código observados |
| `preferences.json` | Preferencias del usuario/equipo |
| `errors.json` | Errores comunes a evitar |
| `libraries.json` | Librerías/herramientas preferidas |

### Cross-Repository Orchestration

```json
{
  "repos": [
    { "name": "frontend", "repo": "app-frontend", "labels": ["component:frontend"] },
    { "name": "backend", "repo": "app-backend", "labels": ["component:api"] }
  ]
}
```

Enruta issues a repos específicos via labels `component:*`.

### Smart Ready Queue

`agentx ready` devuelve issues con Status=Ready + sin blockers abiertos,
ordenados por prioridad: `p0 > p1 > p2 > p3 > (sin prioridad)`

---

## 12. Cómo Usar AgentX para Desarrollar Software

### Escenario: Construir una API REST

```
  PASO 1: Instalación
  ─────────────────────────────────────────────────
  ./install.sh --local          # Modo local, 0 prompts
  # O: ./install.sh --mode github  # Con GitHub

  PASO 2: Crear un Epic
  ─────────────────────────────────────────────────
  .agentx.sh create "[Epic] API de Usuarios" \
    "Crear API REST completa para gestión de usuarios" \
    "type:epic"

  PASO 3: PM descompone el Epic
  ─────────────────────────────────────────────────
  PM Agent:
    ├── Escribe PRD → docs/prd/PRD-1.md
    ├── Crea Features:
    │   ├── [Feature] Autenticación JWT
    │   ├── [Feature] CRUD de usuarios
    │   └── [Feature] Permisos y roles
    └── Crea Stories por cada Feature:
        ├── [Story] Endpoint POST /users
        ├── [Story] Endpoint GET /users/:id
        ├── [Story] Middleware de auth
        └── ...

  PASO 4: Architect diseña cada Feature
  ─────────────────────────────────────────────────
  Architect Agent:
    ├── ADR → docs/adr/ADR-2.md  (decisiones: JWT vs OAuth)
    ├── Spec → docs/specs/SPEC-2.md (contratos, diagramas)
    └── ⚠️  SIN CÓDIGO (regla estricta)

  PASO 5: Engineer implementa cada Story
  ─────────────────────────────────────────────────
  Engineer Agent:
    ├── Lee Spec del Architect
    ├── Implementa código
    ├── Escribe tests (≥80% coverage)
    ├── Actualiza docs
    └── Commit con "feat: add POST /users endpoint #5"

  PASO 6: Reviewer aprueba o rechaza
  ─────────────────────────────────────────────────
  Reviewer Agent:
    ├── Review → docs/reviews/REVIEW-5.md
    ├── Security checklist ✓
    ├── Performance check ✓
    └── Decisión: ✅ Approve → Issue cerrado
                  ❌ Reject → Regresa al Engineer

  PASO 7: DevOps configura deployment
  ─────────────────────────────────────────────────
  DevOps Agent:
    ├── Dockerfile (multi-stage, non-root)
    ├── docker-compose.yml
    ├── GitHub Actions CI/CD
    └── Monitoring config
```

### Flujo Diario de Trabajo

```
  ┌─────────────────── INICIO DEL DÍA ───────────────────┐
  │                                                        │
  │  1. .agentx.sh ready     ← Ver trabajo disponible     │
  │     ┌──────────────────────────────────┐              │
  │     │ #5 [Story] POST /users   (p0)   │              │
  │     │ #7 [Story] GET /users    (p1)   │              │
  │     │ #8 [Bug] Fix login error  (p1)  │              │
  │     └──────────────────────────────────┘              │
  │                                                        │
  │  2. .agentx.sh hook start engineer 5  ← Iniciar      │
  │                                                        │
  │  3. Trabajo: código + tests + docs                     │
  │                                                        │
  │  4. .agentx.sh hook finish engineer 5  ← Terminar    │
  │     (auto-valida: coverage, lint, commits)            │
  │                                                        │
  │  5. Issue → In Review automáticamente                  │
  │                                                        │
  │  6. .agentx.sh ready    ← Siguiente tarea             │
  │                                                        │
  └───────────────── FIN DEL DÍA ─────────────────────────┘
  │                                                        │
  │  .agentx.sh digest      ← Resumen semanal             │
  │                                                        │
  └────────────────────────────────────────────────────────┘
```

---

## 13. Estructura del Proyecto AgentX

```
AgentX/
├── 📄 README.md                        # Overview & quick start
├── 📄 AGENTS.md                        # Workflow & agent roles
├── 📄 Skills.md                        # 41 skills index
├── 📄 CONTRIBUTING.md                  # Contributor guide
├── 📄 CHANGELOG.md                     # Release history
├── 📄 LICENSE (MIT)
│
├── 📁 .github/
│   ├── 📁 agents/                     # 8 agent definitions (.agent.md)
│   ├── 📁 hooks/                       # Pre-commit + commit-msg hooks
│   ├── 📁 scripts/                     # Validation & metrics scripts
│   ├── 📁 security/                    # Command allowlist, audit log
│   ├── 📁 templates/                   # 8 templates (PRD, ADR, Spec, etc.)
│   ├── 📁 prompts/                     # 11 reusable prompts
│   ├── 📁 workflows/                   # GitHub Actions (CI/CD, scanning)
│   ├── 📁 skills/                      # 41 skill folders
│   ├── 📁 instructions/                # 12 language/IaC guides
│   └── 📁 schemas/                     # JSON schema validation
│
├── 📁 .agentx/                         # Runtime
│   ├── 📄 agentx.ps1                   # PowerShell CLI
│   ├── 📄 agentx.sh                    # Bash CLI
│   ├── 📁 workflows/                   # 7 TOML workflow templates
│   ├── 📁 state/                       # Agent status tracking
│   ├── 📁 issues/                      # Local mode issue storage
│   ├── 📁 digests/                     # Weekly digests
│   └── 📁 memory/                      # Agent memory system
│
├── 📁 vscode-extension/                # VS Code Extension
│   ├── 📄 package.json                 # Extension manifest
│   └── 📁 src/
│       ├── extension.ts                # Activation
│       ├── agentxContext.ts            # Shared context
│       ├── 📁 chat/                    # ChatParticipant
│       ├── 📁 commands/                # 7 commands
│       ├── 📁 views/                   # 3 tree providers
│       └── 📁 utils/                   # Shell, file ops
│
├── 📁 scripts/                         # Install, validate, test
└── 📁 docs/                            # Examples & guides
    ├── 📄 QUICKSTART.md
    ├── 📄 SETUP.md
    ├── 📄 FEATURES.md
    └── 📄 TROUBLESHOOTING.md
```

---

## 14. Resumen Ejecutivo

| Aspecto | Detalle |
|---------|---------|
| **Qué es** | Framework de orquestación multi-agente para desarrollo de software |
| **Modelo** | Hub-and-spoke: 1 coordinador + 7 agentes especializados |
| **Flujo** | PM → UX → Architect → Engineer → Reviewer → Done |
| **Calidad** | 5 validation gates, 80% coverage obligatorio, security checklist |
| **Skills** | 41 skills con progressive disclosure + 30 scripts ejecutables |
| **Seguridad** | 4 capas: sandbox, filesystem, allowlist, auditoría |
| **Modos** | Local (zero-config) o GitHub (full integration) |
| **Interfaces** | CLI (11 comandos) + VS Code Extension + @agentx chat |
| **Templates** | 8 plantillas estandarizadas con variables dinámicas |
| **Filosofía** | Cada agente tiene un rol claro, nunca se sale de su responsabilidad |

### Estadísticas Clave (v5.1.0)

| Métrica | Cantidad |
|---------|----------|
| Agentes | 8 (estables) |
| Skills | 41 production-grade |
| Scripts Ejecutables | 30 |
| Instruction Files | 12 |
| Prompt Files | 11 |
| Templates | 8 |
| TOML Workflows | 7 |
| GitHub Actions | 4 |
| Self-Test Assertions | 80+ |
| CLI Subcommands | 11 |

---

> **Conclusión**: La clave de AgentX es que **fuerza disciplina de ingeniería profesional**:
> ningún código se escribe sin spec, ningún código se mergea sin review,
> y todo queda documentado con trazabilidad completa.
