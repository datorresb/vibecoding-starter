# BI Academy — Learning Platform Design

**Date:** 2026-02-19
**Status:** Validated

## Objective

Build an internal learning platform ("BI Academy") for onboarding new employees at a Business Intelligence company. The platform centralizes educational resources, interactive exercises, and AI/productivity tooling knowledge in a single, accessible web app.

**Target audience:** Junior developers with technical background, new to BI, Power BI, and data modeling.
**Team size:** Small (1-20 employees).

## Architecture / Approach

**Approach: Docs-as-Code + Vite React App**

Content lives as MDX files within the repository (version-controlled via Git). A Vite + React frontend renders the content with interactive components (SQL editor, quizzes) and provides navigation, progress tracking, and a resource library.

### Why this approach

- Fastest path to MVP — no backend, no CMS, no database
- Content updates via Git PRs (familiar workflow for the team)
- Interactive components embedded directly in MDX
- Deploys as a static site (Vercel, Netlify, or GitHub Pages — free)
- Easy to extend later (add auth, database, manager dashboard)

### Project Structure

```
bi-academy/
├── src/
│   ├── App.tsx               # Root component with React Router
│   ├── main.tsx              # Vite entry point
│   ├── pages/
│   │   ├── Home.tsx          # Dashboard / learning path overview
│   │   ├── LessonPage.tsx    # Renders a single MDX lesson
│   │   └── Library.tsx       # Resource library with filters
│   ├── components/
│   │   ├── SqlEditor.tsx     # Monaco Editor + sql.js (WASM)
│   │   ├── Quiz.tsx          # Multiple-choice mini-quizzes
│   │   ├── CodeBlock.tsx     # Syntax-highlighted code blocks
│   │   ├── Callout.tsx       # Tips, warnings, notes
│   │   ├── LessonNav.tsx     # Prev/Next lesson navigation
│   │   └── Sidebar.tsx       # Learning path navigation with progress
│   └── lib/
│       ├── content.ts        # MDX loader + meta.json reader
│       └── progress.ts       # localStorage-based progress tracking
├── content/
│   ├── paths/
│   │   ├── sql-fundamentals/
│   │   │   ├── meta.json
│   │   │   ├── 01-intro.mdx
│   │   │   ├── 02-select.mdx
│   │   │   └── 03-joins.mdx
│   │   ├── data-modeling/
│   │   │   └── meta.json
│   │   ├── power-bi/
│   │   │   └── meta.json
│   │   ├── etl-pipelines/
│   │   │   └── meta.json
│   │   ├── ai-productivity/
│   │   │   └── meta.json
│   │   └── company-processes/
│   │       └── meta.json
│   └── resources/
│       └── resources.json
├── public/
│   └── datasets/             # SQL sample data (.sql files)
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Specifications

### Learning Paths

6 structured learning paths, ordered by dependency:

| # | Path | Prerequisite | Key Content |
|---|------|-------------|-------------|
| 1 | **SQL Fundamentals** | None | SELECT, JOINs, aggregations, subqueries, CTEs, window functions |
| 2 | **Data Modeling** | SQL | Star schema, dimensions, facts, semantic model, relationships |
| 3 | **Power BI** | SQL + Data Modeling | Data connections, DAX, Power Query, visualizations, publishing |
| 4 | **ETL / Data Integration** | SQL | Pipelines, transformations, Azure Data Factory, scheduling |
| 5 | **AI & Productivity** | Any | Copilot, prompt engineering, AI agents for BI, automation |
| 6 | **Company Processes** | None | Code standards, naming conventions, workflow, deployment |

### Content Format

Each learning path is a directory in `content/paths/` containing:

- **`meta.json`** — Path metadata (title, description, estimated hours, prerequisites, ordered lesson list)
- **MDX files** — Individual lessons with embedded interactive components

Example `meta.json`:
```json
{
  "title": "SQL Fundamentals",
  "description": "From SELECT to CTEs and window functions",
  "icon": "database",
  "estimatedHours": 8,
  "prerequisites": [],
  "lessons": [
    { "slug": "01-intro", "title": "Introduction to SQL" },
    { "slug": "02-select", "title": "SELECT and Filtering" },
    { "slug": "03-joins", "title": "JOINs Between Tables" }
  ]
}
```

Example lesson MDX:
```mdx
---
title: "JOINs Between Tables"
duration: "20 min"
---

# JOINs Between Tables

JOINs allow you to combine data from multiple tables...

## INNER JOIN

<SqlEditor 
  defaultQuery="SELECT * FROM customers INNER JOIN orders ON customers.id = orders.customer_id"
  expectedColumns={["name", "order_date", "total"]}
/>

## Practice Exercise

<SqlEditor 
  challenge="Find customers with NO orders"
  hint="Use LEFT JOIN and filter where the order is NULL"
  solution="SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL"
/>
```

### Interactive Components

| Component | Purpose | Technology |
|-----------|---------|------------|
| `<SqlEditor>` | Write and execute SQL in the browser | Monaco Editor + sql.js (WebAssembly) |
| `<CodeBlock>` | Syntax-highlighted code with copy button | Shiki or Prism |
| `<Quiz>` | Multiple-choice mini-assessments | React state (no backend) |
| `<Callout>` | Tips, warnings, important notes | Styled div |

### SqlEditor Details

- Uses **sql.js** (SQLite compiled to WebAssembly) — runs entirely in the browser
- **Preloaded datasets:** Sample tables (`customers`, `orders`, `products`) with realistic data
- **Free mode:** Write any query against the sample data
- **Challenge mode:** Exercise with hint, expected result validation, and solution reveal
- **Visual output:** Results displayed as a formatted table

### Resource Library

A `/library` page displays curated links to external resources, organized by category:

```json
[
  {
    "category": "Power BI",
    "resources": [
      { "title": "Microsoft Learn - Power BI", "url": "https://learn.microsoft.com/power-bi/", "type": "course" },
      { "title": "DAX Patterns", "url": "https://daxpatterns.com/", "type": "reference" }
    ]
  }
]
```

Rendered as a searchable, filterable catalog. Content maintained in a JSON file within the repo.

### Progress Tracking

- **Storage:** `localStorage` (no backend for MVP)
- **Tracked:** Lessons completed per path, last visited lesson
- **Display:** Checkmarks on sidebar, progress bar on each learning path card
- **Migration path:** If persistence or multi-device sync is needed later, swap localStorage for a database (Prisma + SQLite/PostgreSQL) with user auth

### Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Build | Vite + React + TypeScript | Fast, lightweight, ideal for POC |
| Content | MDX via `@mdx-js/rollup` | Markdown with embedded React components |
| SQL interactive | Monaco Editor + sql.js | Real SQL execution in the browser |
| Styling | Tailwind CSS | Productive and consistent |
| Routing | React Router v7 | Navigation between paths and lessons |
| Progress | localStorage | No backend for MVP |
| Deploy | Vercel / Netlify / GitHub Pages | Static site, free hosting |

## Implementation Order

| Phase | Scope | Deliverable |
|-------|-------|-------------|
| **1. Scaffold** | Vite + React + Tailwind + React Router | App running with base layout |
| **2. Content system** | MDX loader + `meta.json` reader + navigation | Can render MDX lessons |
| **3. First learning path** | "SQL Fundamentals" with 3-5 real lessons | Navigable path with real content |
| **4. SqlEditor** | Monaco + sql.js with sample dataset | Executable SQL exercises |
| **5. Progress tracking** | localStorage tracking of completed lessons | Checkmarks in sidebar |
| **6. Resource library** | Resources page with category filter | Functional link catalog |

## Success Criteria

- [ ] A new employee can complete the SQL path without external help
- [ ] SqlEditor executes queries and displays correct results in the browser
- [ ] Progress persists between sessions (localStorage)
- [ ] New content is added by creating an MDX file + updating `meta.json`
- [ ] Deploys as a static site (zero backend required)
- [ ] All 6 learning path structures are defined (content can be added incrementally)

## Future Enhancements (Post-MVP)

- SSO authentication (Azure AD)
- Manager dashboard with team progress
- Evaluations and internal certifications
- Database-backed progress (multi-device sync)
- Power BI embedded sandbox
- AI-powered content recommendations
