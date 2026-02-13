import { useState, useEffect, useRef } from 'react';
import './DashboardScreen.css';

const gauges = [
    { label: 'Compatibility', target: 99.9, color: '#ff6b9d', icon: '💕' },
    { label: 'Happiness', target: 97, color: '#d4af37', icon: '😊' },
    { label: 'Trust Index', target: 100, color: '#4ecdc4', icon: '🤝' },
    { label: 'Future Potential', target: 999, color: '#ff6b9d', icon: '🚀', overflow: true },
];

const bars = [
    { label: 'Inside Jokes', target: 92, color: '#d4af37' },
    { label: 'Adventure Score', target: 88, color: '#ff6b9d' },
    { label: 'Cuddle Rating', target: 95, color: '#4ecdc4' },
    { label: 'Support Level', target: 100, color: '#f0d060' },
];

const tickerItems = [
    '💹 LOVE FUTURES UP 500%',
    '📈 CUTENESS INDEX AT ALL-TIME HIGH',
    '🚀 HUG STOCKS SOARING +300%',
    '💎 CATALINA RATED "BEST SHARK" BY FORBES HEARTS',
    '📊 DAVID\'S COMMITMENT SCORE: INFINITE',
    '🔥 RELATIONSHIP MARKET CAP: PRICELESS',
    '⚡ KISS DERIVATIVES TRADING AT PREMIUM',
    '🌟 PARTNERSHIP OUTLOOK: EXTREMELY BULLISH',
];

function AnimatedNumber({ target, duration = 2000, overflow }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const start = performance.now();
        const displayTarget = overflow ? 100 : target;

        function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(eased * displayTarget);
            if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, [target, duration, overflow]);

    if (overflow) {
        return value >= 99 ? '∞' : value.toFixed(1) + '%';
    }
    return value.toFixed(1) + '%';
}

function Gauge({ label, target, color, icon, overflow, delay }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    const displayPercent = overflow ? 100 : Math.min(target, 100);
    const angle = animated ? (displayPercent / 100) * 360 : 0;

    return (
        <div className="gauge-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="gauge-circle" style={{
                background: `conic-gradient(${color} ${angle}deg, rgba(255,255,255,0.08) ${angle}deg)`
            }}>
                <div className="gauge-inner">
                    <span className="gauge-icon">{icon}</span>
                    <span className="gauge-value">
                        {animated ? <AnimatedNumber target={target} overflow={overflow} /> : '0%'}
                    </span>
                </div>
            </div>
            <span className="gauge-label">{label}</span>
        </div>
    );
}

function BarChart({ label, target, color, delay }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(target), delay);
        return () => clearTimeout(timer);
    }, [target, delay]);

    return (
        <div className="bar-item" style={{ animationDelay: `${delay}ms` }}>
            <div className="bar-header">
                <span className="bar-label">{label}</span>
                <span className="bar-value">{width > 0 ? `${target}%` : '0%'}</span>
            </div>
            <div className="bar-track">
                <div
                    className="bar-fill"
                    style={{ width: `${width}%`, backgroundColor: color, transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </div>
        </div>
    );
}

export default function DashboardScreen({ onNext }) {
    const tickerRef = useRef(null);

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <span className="live-badge">● LIVE</span>
                <h2>Love Metrics Dashboard</h2>
                <span className="dashboard-tagline">Real-Time Relationship Analytics</span>
            </div>

            <div className="dashboard-grid">
                <div className="gauges-section">
                    <h3>Key Performance Indicators</h3>
                    <div className="gauges-row">
                        {gauges.map((g, i) => (
                            <Gauge key={i} {...g} delay={i * 300 + 200} />
                        ))}
                    </div>
                </div>

                <div className="bars-section">
                    <h3>Performance Metrics</h3>
                    {bars.map((b, i) => (
                        <BarChart key={i} {...b} delay={i * 200 + 1500} />
                    ))}
                </div>
            </div>

            <div className="ticker-wrap">
                <div className="ticker" ref={tickerRef}>
                    {[...tickerItems, ...tickerItems].map((item, i) => (
                        <span key={i} className="ticker-item">{item}</span>
                    ))}
                </div>
            </div>

            <button className="btn-gold pulse" onClick={onNext} style={{ animation: 'fadeInUp 1s ease-out 3s both, pulse 1.5s ease-in-out 4s infinite' }}>
                See the Deal →
            </button>
        </div>
    );
}
