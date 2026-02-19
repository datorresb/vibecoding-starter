import { Link } from 'react-router-dom';
import { getAllPaths } from '../lib/content';
import { getPathProgress } from '../lib/progress';

const pathColors: Record<string, { gradient: string; ring: string; bg: string; text: string; badge: string }> = {
    'sql-fundamentals': { gradient: 'from-blue-500 to-blue-600', ring: '#3B82F6', bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
    'data-modeling': { gradient: 'from-violet-500 to-purple-600', ring: '#8B5CF6', bg: 'bg-violet-50', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700' },
    'power-bi': { gradient: 'from-amber-400 to-orange-500', ring: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    'etl-pipelines': { gradient: 'from-teal-400 to-emerald-500', ring: '#14B8A6', bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-100 text-teal-700' },
    'ai-productivity': { gradient: 'from-indigo-500 to-blue-600', ring: '#6366F1', bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
    'company-processes': { gradient: 'from-pink-400 to-rose-500', ring: '#EC4899', bg: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' },
};

function ProgressRing({ progress, color, size = 48 }: { progress: number; color: string; size?: number }) {
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="progress-ring" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-cream-200" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink-700" style={{ transform: 'rotate(0deg)' }}>
                {progress}%
            </span>
        </div>
    );
}

export default function Home() {
    const paths = getAllPaths();
    const started = paths.filter((p) => getPathProgress(p.slug, p.lessons.length) > 0);
    const totalLessons = paths.reduce((sum, p) => sum + p.lessons.length, 0);
    const totalHours = paths.reduce((sum, p) => sum + p.estimatedHours, 0);

    return (
        <div className="animate-fade-in">
            {/* ── Hero with gradient mesh ── */}
            <div className="hero-gradient -mx-10 -mt-10 px-10 pt-12 pb-14 mb-10 rounded-b-3xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-6 right-12 w-64 h-64 rounded-full bg-gradient-to-br from-terra-400/10 to-amber-300/10 blur-3xl" />
                <div className="absolute bottom-0 left-8 w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-400/10 to-violet-300/8 blur-2xl" />

                <div className="relative">
                    <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-cream-200 rounded-full px-4 py-1.5 mb-5">
                        <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
                        <span className="text-xs font-medium text-ink-500">Plataforma de Aprendizaje BI</span>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight leading-[1.15] mb-4 max-w-xl">
                        <span className="gradient-text">Domina Business</span><br />
                        <span className="text-ink-900">Intelligence</span>
                    </h1>

                    <p className="text-ink-400 text-base max-w-md leading-relaxed mb-8">
                        SQL, Power BI, modelamiento de datos y más. Aprende con rutas guiadas, ejercicios y recursos curados.
                    </p>

                    {/* Quick stats */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-cream-200/60">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terra-400 to-terra-500 flex items-center justify-center">
                                <svg width="18" height="18" fill="none" className="text-white"><path d="M3 13V5a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.5" /><path d="M7 7h4M7 10h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-ink-900 leading-none">{paths.length}</p>
                                <p className="text-[10px] text-ink-400 font-medium mt-0.5">Rutas</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-cream-200/60">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-500 flex items-center justify-center">
                                <svg width="18" height="18" fill="none" className="text-white"><path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-ink-900 leading-none">{totalLessons}</p>
                                <p className="text-[10px] text-ink-400 font-medium mt-0.5">Lecciones</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-cream-200/60">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                                <svg width="18" height="18" fill="none" className="text-white"><circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" /><path d="M9 6v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-ink-900 leading-none">{totalHours}h</p>
                                <p className="text-[10px] text-ink-400 font-medium mt-0.5">Contenido</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Continue learning ── */}
            {started.length > 0 && (
                <section className="mb-12 animate-fade-in-up">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-400 mb-4">Continuar aprendiendo</h2>
                    <div className="space-y-3">
                        {started.map((path) => {
                            const progress = getPathProgress(path.slug, path.lessons.length);
                            const colors = pathColors[path.slug] || pathColors['sql-fundamentals'];
                            return (
                                <Link
                                    key={path.slug}
                                    to={`/paths/${path.slug}`}
                                    className="group flex items-center gap-5 bg-white border border-cream-200 rounded-2xl px-6 py-5 no-underline card-interactive"
                                >
                                    <ProgressRing progress={progress} color={colors.ring} />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-ink-900 group-hover:text-terra-500 transition-colors">{path.title}</h3>
                                        <p className="text-xs text-ink-400 mt-1">{path.description}</p>
                                    </div>
                                    <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${colors.badge}`}>
                                        Continuar →
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* ── All paths grid ── */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-400">Rutas de aprendizaje</h2>
                    <span className="text-[11px] text-ink-300">{paths.length} disponibles</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                    {paths.map((path) => {
                        const progress = getPathProgress(path.slug, path.lessons.length);
                        const colors = pathColors[path.slug] || pathColors['sql-fundamentals'];
                        return (
                            <Link
                                key={path.slug}
                                to={`/paths/${path.slug}`}
                                className="group block rounded-2xl overflow-hidden no-underline card-interactive bg-white border border-cream-200"
                            >
                                {/* Colored gradient top stripe */}
                                <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />

                                <div className="p-5">
                                    {/* Icon + badge row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center text-xl`}>
                                            {path.icon}
                                        </div>
                                        {progress > 0 ? (
                                            <ProgressRing progress={progress} color={colors.ring} size={36} />
                                        ) : (
                                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${colors.badge}`}>
                                                {path.estimatedHours}h
                                            </span>
                                        )}
                                    </div>

                                    {/* Title + description */}
                                    <h3 className="text-sm font-bold text-ink-900 group-hover:text-terra-500 transition-colors leading-tight mb-1.5">
                                        {path.title}
                                    </h3>
                                    <p className="text-xs text-ink-400 leading-relaxed line-clamp-2 mb-4">
                                        {path.description}
                                    </p>

                                    {/* Footer meta */}
                                    <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                                        <div className="flex items-center gap-2 text-[11px] text-ink-300 font-medium">
                                            <svg width="12" height="12" fill="none"><path d="M4 2v8l3-2 3 2V2H4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
                                            {path.lessons.length} lecciones
                                        </div>
                                        {path.prerequisites.length > 0 && (
                                            <span className="text-[10px] text-ink-300 bg-cream-100 px-2 py-0.5 rounded-full">
                                                Req: {path.prerequisites.length}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
