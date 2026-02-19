import { useState } from 'react';

interface Resource {
    title: string;
    url: string;
    type: 'course' | 'reference' | 'video' | 'tool' | 'article';
}

interface ResourceCategory {
    category: string;
    icon: string;
    gradient: string;
    resources: Resource[];
}

const resourceData: ResourceCategory[] = [
    {
        category: 'SQL',
        icon: '🗄️',
        gradient: 'from-blue-500 to-blue-600',
        resources: [
            { title: 'SQLBolt - Learn SQL', url: 'https://sqlbolt.com/', type: 'course' },
            { title: 'W3Schools SQL Tutorial', url: 'https://www.w3schools.com/sql/', type: 'reference' },
            { title: 'Mode Analytics SQL Tutorial', url: 'https://mode.com/sql-tutorial/', type: 'course' },
        ],
    },
    {
        category: 'Power BI',
        icon: '📊',
        gradient: 'from-amber-400 to-orange-500',
        resources: [
            { title: 'Microsoft Learn - Power BI', url: 'https://learn.microsoft.com/en-us/training/powerplatform/power-bi', type: 'course' },
            { title: 'DAX Patterns', url: 'https://daxpatterns.com/', type: 'reference' },
            { title: 'SQLBI - DAX Guide', url: 'https://dax.guide/', type: 'reference' },
        ],
    },
    {
        category: 'Modelamiento de Datos',
        icon: '📐',
        gradient: 'from-violet-500 to-purple-600',
        resources: [
            { title: 'Kimball Group Design Tips', url: 'https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/', type: 'reference' },
            { title: 'Star Schema - The Complete Reference', url: 'https://learn.microsoft.com/en-us/power-bi/guidance/star-schema', type: 'article' },
        ],
    },
    {
        category: 'ETL / Integración',
        icon: '🔄',
        gradient: 'from-teal-400 to-emerald-500',
        resources: [
            { title: 'Azure Data Factory Docs', url: 'https://learn.microsoft.com/en-us/azure/data-factory/', type: 'reference' },
            { title: 'Microsoft Learn - Data Integration', url: 'https://learn.microsoft.com/en-us/training/paths/data-integration-scale-azure-data-factory/', type: 'course' },
        ],
    },
    {
        category: 'IA y Productividad',
        icon: '🤖',
        gradient: 'from-indigo-500 to-blue-600',
        resources: [
            { title: 'GitHub Copilot Docs', url: 'https://docs.github.com/en/copilot', type: 'reference' },
            { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'course' },
        ],
    },
];

const typeBadge: Record<string, { label: string; cls: string }> = {
    course: { label: 'Curso', cls: 'bg-terra-100 text-terra-600' },
    reference: { label: 'Referencia', cls: 'bg-blue-50 text-blue-600' },
    video: { label: 'Video', cls: 'bg-violet-50 text-violet-600' },
    tool: { label: 'Herramienta', cls: 'bg-sage-100 text-sage-600' },
    article: { label: 'Artículo', cls: 'bg-amber-50 text-amber-600' },
};

export default function Library() {
    const [filter, setFilter] = useState<string>('');

    const filtered = filter
        ? resourceData.filter((cat) => cat.category === filter)
        : resourceData;

    const totalResources = resourceData.reduce((sum, cat) => sum + cat.resources.length, 0);

    return (
        <div className="animate-fade-in">
            {/* Hero header */}
            <div className="hero-gradient -mx-10 -mt-10 px-10 pt-12 pb-14 mb-10 rounded-b-3xl relative overflow-hidden">
                <div className="absolute top-4 right-16 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-400/10 to-violet-300/10 blur-3xl" />
                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-cream-200 rounded-full px-4 py-1.5 mb-5">
                        <svg width="14" height="14" fill="none" className="text-terra-500"><path d="M2 3h4l2 1.5L10 3h4v10h-4l-2 1.5L6 13H2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                        <span className="text-xs font-medium text-ink-500">Recursos curados</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-3">
                        <span className="gradient-text">Biblioteca</span>
                    </h1>
                    <p className="text-ink-400 text-base max-w-md leading-relaxed">
                        {totalResources} recursos organizados en {resourceData.length} categorías. Cursos, documentación y herramientas seleccionadas.
                    </p>
                </div>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2 mb-10">
                <button
                    onClick={() => setFilter('')}
                    className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-all font-semibold ${!filter
                        ? 'bg-gradient-to-r from-terra-500 to-terra-600 text-white shadow-md shadow-terra-500/20 scale-105'
                        : 'bg-white border border-cream-200 text-ink-500 hover:border-cream-300 hover:shadow-sm'
                        }`}
                >
                    Todos
                </button>
                {resourceData.map((cat) => (
                    <button
                        key={cat.category}
                        onClick={() => setFilter(cat.category)}
                        className={`px-4 py-2 rounded-xl text-xs cursor-pointer transition-all font-semibold ${filter === cat.category
                            ? `bg-gradient-to-r ${cat.gradient} text-white shadow-md scale-105`
                            : 'bg-white border border-cream-200 text-ink-500 hover:border-cream-300 hover:shadow-sm'
                            }`}
                    >
                        {cat.icon} {cat.category}
                    </button>
                ))}
            </div>

            {/* Resource sections */}
            <div className="space-y-10 stagger-children">
                {filtered.map((cat) => (
                    <section key={cat.category} className="bg-white rounded-2xl border border-cream-200 overflow-hidden card-interactive">
                        {/* Category header with gradient */}
                        <div className={`bg-gradient-to-r ${cat.gradient} px-6 py-4 flex items-center gap-3`}>
                            <span className="text-xl">{cat.icon}</span>
                            <h2 className="text-white font-bold text-sm tracking-wide">{cat.category}</h2>
                            <span className="text-white/60 text-[10px] font-medium ml-auto">{cat.resources.length} recursos</span>
                        </div>

                        {/* Resources */}
                        <div className="divide-y divide-cream-100">
                            {cat.resources.map((res) => {
                                const badge = typeBadge[res.type];
                                return (
                                    <a
                                        key={res.url}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 px-6 py-4 hover:bg-cream-50 transition-colors no-underline"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center group-hover:bg-terra-100 transition-colors shrink-0">
                                            <svg width="14" height="14" fill="none" className="text-ink-300 group-hover:text-terra-500 transition-colors"><path d="M4 12l8-8m0 0H6m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        </div>
                                        <span className="text-sm text-ink-700 font-medium group-hover:text-ink-900 transition-colors flex-1 min-w-0">
                                            {res.title}
                                        </span>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${badge.cls}`}>
                                            {badge.label}
                                        </span>
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
