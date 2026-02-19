export interface LessonMeta {
    slug: string;
    title: string;
}

export interface PathMeta {
    title: string;
    description: string;
    icon: string;
    estimatedHours: number;
    prerequisites: string[];
    lessons: LessonMeta[];
}

// Registry of all learning paths with their metadata
// In the future this could be loaded dynamically from meta.json files
const pathRegistry: Record<string, PathMeta> = {
    'sql-fundamentals': {
        title: 'SQL Fundamentals',
        description: 'Desde SELECT hasta CTEs y window functions',
        icon: '🗄️',
        estimatedHours: 8,
        prerequisites: [],
        lessons: [
            { slug: '01-intro', title: 'Introducción a SQL' },
            { slug: '02-select', title: 'SELECT y Filtrado' },
            { slug: '03-joins', title: 'JOINs entre Tablas' },
        ],
    },
    'data-modeling': {
        title: 'Modelamiento de Datos',
        description: 'Star schema, dimensiones, hechos y modelo semántico',
        icon: '📐',
        estimatedHours: 6,
        prerequisites: ['sql-fundamentals'],
        lessons: [
            { slug: '01-intro', title: 'Intro al Modelamiento Dimensional' },
        ],
    },
    'power-bi': {
        title: 'Power BI',
        description: 'Conexiones, DAX, Power Query y visualizaciones',
        icon: '📊',
        estimatedHours: 10,
        prerequisites: ['sql-fundamentals', 'data-modeling'],
        lessons: [
            { slug: '01-intro', title: 'Introducción a Power BI' },
        ],
    },
    'etl-pipelines': {
        title: 'ETL / Integración de Datos',
        description: 'Pipelines, transformaciones y Azure Data Factory',
        icon: '🔄',
        estimatedHours: 6,
        prerequisites: ['sql-fundamentals'],
        lessons: [
            { slug: '01-intro', title: 'Introducción a ETL' },
        ],
    },
    'ai-productivity': {
        title: 'IA y Productividad',
        description: 'Copilot, prompt engineering y agentes IA para BI',
        icon: '🤖',
        estimatedHours: 4,
        prerequisites: [],
        lessons: [
            { slug: '01-intro', title: 'IA en el Flujo de Trabajo BI' },
        ],
    },
    'company-processes': {
        title: 'Procesos de la Compañía',
        description: 'Estándares, naming conventions y flujo de trabajo',
        icon: '📋',
        estimatedHours: 3,
        prerequisites: [],
        lessons: [
            { slug: '01-intro', title: 'Bienvenida y Estándares' },
        ],
    },
};

export function getAllPaths(): Array<{ slug: string } & PathMeta> {
    return Object.entries(pathRegistry).map(([slug, meta]) => ({
        slug,
        ...meta,
    }));
}

export function getPathMeta(pathSlug: string): PathMeta | undefined {
    return pathRegistry[pathSlug];
}
