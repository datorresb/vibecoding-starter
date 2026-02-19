const STORAGE_KEY = 'bi-academy-progress';

interface ProgressData {
    completedLessons: Record<string, string[]>; // pathSlug -> lessonSlugs[]
    lastVisited?: { path: string; lesson: string };
}

function getProgress(): ProgressData {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) return JSON.parse(data);
    } catch {
        // ignore parse errors
    }
    return { completedLessons: {} };
}

function saveProgress(data: ProgressData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function markLessonComplete(pathSlug: string, lessonSlug: string): void {
    const progress = getProgress();
    if (!progress.completedLessons[pathSlug]) {
        progress.completedLessons[pathSlug] = [];
    }
    if (!progress.completedLessons[pathSlug].includes(lessonSlug)) {
        progress.completedLessons[pathSlug].push(lessonSlug);
    }
    saveProgress(progress);
}

export function isLessonComplete(pathSlug: string, lessonSlug: string): boolean {
    const progress = getProgress();
    return progress.completedLessons[pathSlug]?.includes(lessonSlug) ?? false;
}

export function getPathProgress(pathSlug: string, totalLessons: number): number {
    const progress = getProgress();
    const completed = progress.completedLessons[pathSlug]?.length ?? 0;
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
}

export function setLastVisited(pathSlug: string, lessonSlug: string): void {
    const progress = getProgress();
    progress.lastVisited = { path: pathSlug, lesson: lessonSlug };
    saveProgress(progress);
}

export function getLastVisited(): { path: string; lesson: string } | undefined {
    return getProgress().lastVisited;
}
