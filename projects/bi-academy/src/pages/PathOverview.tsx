import { useParams, Link } from 'react-router-dom';
import { getPathMeta } from '../lib/content';
import { isLessonComplete, getPathProgress } from '../lib/progress';

const pathGradients: Record<string, { from: string; to: string; ring: string; light: string }> = {
    'sql-fundamentals': { from: 'from-blue-500', to: 'to-blue-600', ring: '#3B82F6', light: 'bg-blue-50' },
    'data-modeling': { from: 'from-violet-500', to: 'to-purple-600', ring: '#8B5CF6', light: 'bg-violet-50' },
    'power-bi': { from: 'from-amber-400', to: 'to-orange-500', ring: '#F59E0B', light: 'bg-amber-50' },
    'etl-pipelines': { from: 'from-teal-400', to: 'to-emerald-500', ring: '#14B8A6', light: 'bg-teal-50' },
    'ai-productivity': { from: 'from-indigo-500', to: 'to-blue-600', ring: '#6366F1', light: 'bg-indigo-50' },
    'company-processes': { from: 'from-pink-400', to: 'to-rose-500', ring: '#EC4899', light: 'bg-pink-50' },
};

export default function PathOverview() {
    const { pathSlug } = useParams<{ pathSlug: string }>();
    const meta = pathSlug ? getPathMeta(pathSlug) : undefined;

    if (!meta || !pathSlug) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-ink-900">Ruta no encontrada</h1>
                <Link to="/" className="text-terra-500 mt-4 inline-block hover:text-terra-600 text-sm">← Volver al inicio</Link>
            </div>
        );
    }

    const progress = getPathProgress(pathSlug, meta.lessons.length);
    const completedCount = meta.lessons.filter((l) => isLessonComplete(pathSlug, l.slug)).length;
    const colors = pathGradients[pathSlug] || pathGradients['sql-fundamentals'];

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <Link to="/" className="inline-flex items-center gap-1.5 text-ink-400 text-xs font-medium mb-6 hover:text-terra-500 transition-colors no-underline">
                <svg width="14" height="14" fill="none"><path d="M9 11L4 7l5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Todas las rutas
            </Link>

            {/* Hero banner */}
            <div className={`-mx-10 px-10 py-10 mb-10 rounded-2xl bg-gradient-to-br ${colors.from} ${colors.to} relative overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-white/5 translate-y-1/2" />

                <div className="relative flex items-start gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                        {meta.icon}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white tracking-tight leading-tight mb-2">{meta.title}</h1>
                        <p className="text-white/80 text-sm leading-relaxed max-w-lg mb-4">{meta.description}</p>
                        <div className="flex items-center gap-4 text-xs text-white/60 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg width="14" height="14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 4.5V7l2 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                                {meta.estimatedHours}h estimadas
                            </span>
                            <span className="w-px h-3 bg-white/20" />
                            <span>{meta.lessons.length} lecciones</span>
                            {progress > 0 && (
                                <>
                                    <span className="w-px h-3 bg-white/20" />
                                    <span className="text-white font-semibold">{completedCount}/{meta.lessons.length} completadas</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                {progress > 0 && (
                    <div className="relative mt-6">
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Prerequisites */}
            {meta.prerequisites.length > 0 && (
                <div className="flex items-center gap-3 bg-terra-100 border border-terra-300/30 rounded-xl px-5 py-4 mb-8 animate-fade-in-up">
                    <svg width="16" height="16" fill="none" className="text-terra-500 shrink-0"><path d="M8 1v6M8 11v.5M4 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <p className="text-terra-600 text-xs font-medium">
                        <span className="font-semibold">Prerequisitos: </span>
                        {meta.prerequisites.map((p, i) => (
                            <span key={p}>
                                <Link to={`/paths/${p}`} className="text-terra-500 underline hover:text-terra-600">{p}</Link>
                                {i < meta.prerequisites.length - 1 ? ', ' : ''}
                            </span>
                        ))}
                    </p>
                </div>
            )}

            {/* Lesson list — visual timeline */}
            <section>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-5">Lecciones</h2>
                <div className="relative stagger-children">
                    {/* Timeline line */}
                    <div className="absolute left-[23px] top-4 bottom-4 w-px bg-cream-200" />

                    {meta.lessons.map((lesson, index) => {
                        const completed = isLessonComplete(pathSlug, lesson.slug);
                        return (
                            <Link
                                key={lesson.slug}
                                to={`/paths/${pathSlug}/${lesson.slug}`}
                                className="group flex items-center gap-5 pl-2 pr-5 py-4 rounded-xl no-underline transition-all duration-200 hover:bg-white hover:shadow-md relative"
                            >
                                {/* Timeline dot */}
                                <div className={`w-[18px] h-[18px] rounded-full border-[3px] shrink-0 z-10 transition-all ${completed
                                        ? 'bg-sage-500 border-sage-500 shadow-sm shadow-sage-500/30'
                                        : `border-cream-300 bg-cream-50 group-hover:border-terra-400 group-hover:bg-terra-100`
                                    }`}>
                                    {completed && (
                                        <svg width="12" height="12" fill="none" className="text-white" style={{ margin: '-1px 0 0 -1px' }}><path d="M3 6l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    )}
                                </div>

                                {/* Lesson number badge */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all ${completed
                                        ? 'bg-sage-100 text-sage-600'
                                        : `${colors.light} text-ink-500 group-hover:scale-105`
                                    }`}>
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm text-ink-700 font-semibold group-hover:text-ink-900 transition-colors">{lesson.title}</h3>
                                    {completed && <span className="text-[10px] text-sage-500 font-medium mt-0.5 block">Completada</span>}
                                </div>

                                {/* Arrow */}
                                <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center shrink-0 group-hover:bg-terra-100 transition-colors">
                                    <svg width="14" height="14" fill="none" className="text-ink-300 group-hover:text-terra-500 transition-colors"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
