interface CalloutProps {
    type?: 'info' | 'tip' | 'warning';
    children: React.ReactNode;
}

const styles = {
    info: { bg: 'bg-gradient-to-r from-blue-50 to-cream-100', border: 'border-blue-200', icon: 'bg-blue-500', text: 'text-ink-700' },
    tip: { bg: 'bg-gradient-to-r from-sage-100 to-cream-100', border: 'border-sage-300/40', icon: 'bg-sage-500', text: 'text-sage-700' },
    warning: { bg: 'bg-gradient-to-r from-terra-100 to-cream-100', border: 'border-terra-300/40', icon: 'bg-terra-500', text: 'text-terra-700' },
};

const icons = {
    info: (
        <svg width="14" height="14" fill="none" className="text-white"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" /><path d="M7 5v.5M7 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
    tip: (
        <svg width="14" height="14" fill="none" className="text-white"><path d="M7 1.5C4.5 1.5 3 3.5 3 5.5c0 1.2.5 2 1.5 2.5V10a1 1 0 001 1h3a1 1 0 001-1V8c1-.5 1.5-1.3 1.5-2.5 0-2-1.5-4-4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M5.5 12.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
    ),
    warning: (
        <svg width="14" height="14" fill="none" className="text-white"><path d="M7 1.5L1 12.5h12L7 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M7 6v3M7 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
    ),
};

export default function Callout({ type = 'info', children }: CalloutProps) {
    const s = styles[type];
    return (
        <div className={`${s.bg} border ${s.border} rounded-2xl px-5 py-4 my-6 text-sm leading-relaxed ${s.text} flex items-start gap-3`}>
            <div className={`w-6 h-6 rounded-lg ${s.icon} flex items-center justify-center shrink-0 mt-0.5`}>
                {icons[type]}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}
