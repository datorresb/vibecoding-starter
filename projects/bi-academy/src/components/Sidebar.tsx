import { Link, useLocation } from 'react-router-dom';
import { getAllPaths } from '../lib/content';
import { getPathProgress } from '../lib/progress';

const pathAccent: Record<string, string> = {
    'sql-fundamentals': 'bg-blue-500',
    'data-modeling': 'bg-violet-500',
    'power-bi': 'bg-amber-500',
    'etl-pipelines': 'bg-teal-500',
    'ai-productivity': 'bg-indigo-500',
    'company-processes': 'bg-pink-500',
};

export default function Sidebar() {
    const location = useLocation();
    const paths = getAllPaths();

    return (
        <aside className="w-[272px] min-h-screen flex flex-col shrink-0 bg-navy-950 relative overflow-hidden">
            {/* Decorative gradient glow */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-terra-500/8 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Brand */}
            <Link
                to="/"
                className="relative flex items-center gap-3 px-6 h-[72px] border-b border-white/5 no-underline shrink-0 group"
            >
                <div className="w-9 h-9 bg-gradient-to-br from-terra-400 to-terra-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-terra-500/20 group-hover:scale-105 transition-transform">
                    BI
                </div>
                <div>
                    <span className="text-cream-100 font-bold text-[15px] tracking-tight block leading-none">Academy</span>
                    <span className="text-navy-600 text-[10px] font-medium mt-0.5 block">Business Intelligence</span>
                </div>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-5 px-3 relative">
                {/* Home */}
                <Link
                    to="/"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-200 mb-1 ${location.pathname === '/'
                        ? 'bg-white/10 text-white font-semibold shadow-sm'
                        : 'text-cream-400/70 hover:text-cream-200 hover:bg-white/5'
                        }`}
                >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${location.pathname === '/' ? 'bg-terra-500' : 'bg-white/5'}`}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={location.pathname === '/' ? 'text-white' : 'text-cream-400/60'}>
                            <path d="M2 6.5L8 2l6 4.5V13a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    </div>
                    Inicio
                </Link>

                {/* Section label */}
                <div className="mt-7 mb-3 px-4 text-[9px] uppercase tracking-[0.15em] text-navy-600 font-bold select-none">
                    Rutas de aprendizaje
                </div>

                {paths.map((path) => {
                    const isActive = location.pathname.startsWith(`/paths/${path.slug}`);
                    const progress = getPathProgress(path.slug, path.lessons.length);
                    const accent = pathAccent[path.slug] || 'bg-terra-500';
                    return (
                        <Link
                            key={path.slug}
                            to={`/paths/${path.slug}`}
                            className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-200 mb-0.5 relative ${isActive
                                ? 'bg-white/10 text-white font-semibold shadow-sm'
                                : 'text-cream-400/70 hover:text-cream-200 hover:bg-white/5'
                                }`}
                        >
                            {/* Active indicator bar */}
                            {isActive && (
                                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${accent}`} />
                            )}
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${isActive ? accent + ' shadow-sm' : 'bg-white/5'
                                }`}>
                                {isActive ? <span className="text-[13px]">{path.icon}</span> : <span className="text-[13px] opacity-60">{path.icon}</span>}
                            </div>
                            <span className="flex-1 truncate">{path.title}</span>
                            {progress > 0 && (
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isActive ? `${accent} text-white` : 'bg-white/8 text-cream-400/60'
                                    }`}>{progress}%</span>
                            )}
                        </Link>
                    );
                })}

                {/* Resources section */}
                <div className="mt-7 mb-3 px-4 text-[9px] uppercase tracking-[0.15em] text-navy-600 font-bold select-none">
                    Recursos
                </div>
                <Link
                    to="/library"
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] no-underline transition-all duration-200 ${location.pathname === '/library'
                        ? 'bg-white/10 text-white font-semibold shadow-sm'
                        : 'text-cream-400/70 hover:text-cream-200 hover:bg-white/5'
                        }`}
                >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${location.pathname === '/library' ? 'bg-terra-500' : 'bg-white/5'}`}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className={location.pathname === '/library' ? 'text-white' : 'text-cream-400/60'}>
                            <path d="M2 3h4l2 1.5L10 3h4v10h-4l-2 1.5L6 13H2V3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            <path d="M8 4.5V14" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                    </div>
                    Biblioteca
                </Link>
            </nav>

            {/* Footer */}
            <div className="relative px-5 py-4 border-t border-white/5 shrink-0">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-terra-400 to-terra-600 flex items-center justify-center text-white text-[9px] font-bold">
                        BA
                    </div>
                    <div>
                        <p className="text-cream-200 text-[11px] font-medium m-0 leading-none">BI Academy</p>
                        <p className="text-navy-600 text-[9px] m-0 mt-0.5">BI Academy v1.0</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
