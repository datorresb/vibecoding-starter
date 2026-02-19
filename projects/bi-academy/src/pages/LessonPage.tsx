import { useParams, Link } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { getPathMeta } from '../lib/content';
import { markLessonComplete, isLessonComplete, setLastVisited } from '../lib/progress';

// Dynamically import MDX content
const mdxModules = import.meta.glob('../../content/paths/**/*.mdx');

export default function LessonPage() {
    const { pathSlug, lessonSlug } = useParams<{ pathSlug: string; lessonSlug: string }>();
    const meta = pathSlug ? getPathMeta(pathSlug) : undefined;
    const [completed, setCompleted] = useState(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [MdxContent, setMdxContent] = useState<React.ComponentType<any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!pathSlug || !lessonSlug) return;
        setLastVisited(pathSlug, lessonSlug);
        setCompleted(isLessonComplete(pathSlug, lessonSlug));

        const key = `../../content/paths/${pathSlug}/${lessonSlug}.mdx`;
        const loader = mdxModules[key];
        if (loader) {
            setLoading(true);
            setError(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            loader().then((mod: any) => {
                setMdxContent(() => mod.default);
                setLoading(false);
            }).catch(() => {
                setError(true);
                setLoading(false);
            });
        } else {
            setError(true);
            setLoading(false);
        }
    }, [pathSlug, lessonSlug]);

    if (!meta || !pathSlug || !lessonSlug) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-ink-900">Lección no encontrada</h1>
                <Link to="/" className="text-terra-500 mt-4 inline-block hover:text-terra-600 text-sm">← Volver al inicio</Link>
            </div>
        );
    }

    const currentIndex = meta.lessons.findIndex((l) => l.slug === lessonSlug);
    const prevLesson = currentIndex > 0 ? meta.lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < meta.lessons.length - 1 ? meta.lessons[currentIndex + 1] : null;
    const currentLesson = meta.lessons[currentIndex];

    const handleComplete = () => {
        markLessonComplete(pathSlug, lessonSlug);
        setCompleted(true);
    };

    return (
        <div className="animate-fade-in">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-ink-300 font-medium mb-8 flex-wrap">
                <Link to="/" className="hover:text-terra-500 transition-colors no-underline text-ink-400">Rutas</Link>
                <svg width="12" height="12" fill="none" className="shrink-0"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <Link to={`/paths/${pathSlug}`} className="hover:text-terra-500 transition-colors no-underline text-ink-400">{meta.title}</Link>
                <svg width="12" height="12" fill="none" className="shrink-0"><path d="M4.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-ink-700">{currentLesson?.title}</span>
            </nav>

            {/* Lesson progress indicator */}
            <div className="flex items-center gap-1.5 mb-8">
                {meta.lessons.map((l, i) => (
                    <Link
                        key={l.slug}
                        to={`/paths/${pathSlug}/${l.slug}`}
                        className={`h-1.5 rounded-full flex-1 transition-all duration-300 no-underline ${i === currentIndex
                                ? 'bg-terra-500'
                                : isLessonComplete(pathSlug, l.slug)
                                    ? 'bg-sage-400'
                                    : 'bg-cream-200 hover:bg-cream-300'
                            }`}
                        title={l.title}
                    />
                ))}
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-8 h-8 border-2 border-cream-200 border-t-terra-500 rounded-full animate-spin" />
                    <div className="text-ink-300 text-sm">Cargando lección...</div>
                </div>
            )}

            {error && (
                <div className="bg-gradient-to-br from-terra-100 to-cream-100 border border-terra-300/30 rounded-2xl p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-terra-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" fill="none" className="text-terra-500"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                    <h2 className="text-lg font-semibold text-ink-900 mb-2">Contenido próximamente</h2>
                    <p className="text-ink-400 text-sm">
                        La lección <strong className="text-ink-700">"{currentLesson?.title}"</strong> está en desarrollo.
                    </p>
                </div>
            )}

            {MdxContent && !loading && (
                <Suspense fallback={<div className="text-ink-300 text-sm">Cargando...</div>}>
                    <article className="mdx-content animate-fade-in-up">
                        <MdxContent />
                    </article>
                </Suspense>
            )}

            {/* Footer: completion + navigation */}
            <footer className="mt-14 pt-8 border-t border-cream-200">
                {!completed && !error && (
                    <button
                        onClick={handleComplete}
                        className="group mb-8 inline-flex items-center gap-2.5 bg-gradient-to-r from-sage-500 to-sage-600 text-white px-7 py-3 rounded-xl hover:shadow-lg hover:shadow-sage-500/20 hover:-translate-y-0.5 transition-all cursor-pointer text-sm font-semibold"
                    >
                        <svg width="16" height="16" fill="none" className="group-hover:scale-110 transition-transform"><path d="M3 8.5l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        Marcar como completada
                    </button>
                )}
                {completed && (
                    <div className="mb-8 inline-flex items-center gap-2.5 bg-sage-100 text-sage-700 px-5 py-3 rounded-xl text-sm font-semibold">
                        <div className="w-6 h-6 bg-sage-500 text-white rounded-lg flex items-center justify-center">
                            <svg width="14" height="14" fill="none"><path d="M3 7.5l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                        Lección completada
                    </div>
                )}

                <div className="flex justify-between items-center gap-4">
                    {prevLesson ? (
                        <Link
                            to={`/paths/${pathSlug}/${prevLesson.slug}`}
                            className="group inline-flex items-center gap-2.5 text-sm text-ink-400 hover:text-ink-700 transition-colors font-medium no-underline bg-cream-100 hover:bg-cream-200 px-4 py-2.5 rounded-xl"
                        >
                            <svg width="14" height="14" fill="none" className="group-hover:-translate-x-0.5 transition-transform"><path d="M9 3L4 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            {prevLesson.title}
                        </Link>
                    ) : <div />}
                    {nextLesson ? (
                        <Link
                            to={`/paths/${pathSlug}/${nextLesson.slug}`}
                            className="group inline-flex items-center gap-2.5 text-sm text-white font-semibold no-underline bg-gradient-to-r from-terra-500 to-terra-600 hover:shadow-lg hover:shadow-terra-500/20 hover:-translate-y-0.5 transition-all px-5 py-2.5 rounded-xl"
                        >
                            {nextLesson.title}
                            <svg width="14" height="14" fill="none" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                    ) : (
                        <Link
                            to={`/paths/${pathSlug}`}
                            className="group inline-flex items-center gap-2.5 text-sm text-terra-500 hover:text-terra-600 transition-colors font-semibold no-underline bg-terra-100 hover:bg-terra-100 px-5 py-2.5 rounded-xl"
                        >
                            Volver a la ruta
                            <svg width="14" height="14" fill="none" className="group-hover:translate-x-0.5 transition-transform"><path d="M5 3l5 4-5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </Link>
                    )}
                </div>
            </footer>
        </div>
    );
}
