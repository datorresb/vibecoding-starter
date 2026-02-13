import { useState, useEffect } from 'react';
import './PitchScreen.css';

const pitchLines = [
    "Dear Sharks... I mean, dear Catalina,",
    "I'm David — CEO & Founder of 'Us, Inc.'",
    "I'm here seeking your most valuable investment:",
    "Your heart. 💘",
    "",
    "Let me show you why this is a once-in-a-lifetime opportunity..."
];

const stats = [
    { label: 'Laughs Shared', value: '∞', icon: '😂' },
    { label: 'Adventures Had', value: '100+', icon: '🌍' },
    { label: 'Hugs Given', value: '10,000+', icon: '🤗' },
    { label: 'Love Level', value: 'MAX', icon: '❤️‍🔥' },
];

const bulletPoints = [
    '📈 Proven track record of making you smile',
    '🛡️ Fully committed — no other investors',
    '🚀 Exponential growth potential',
    '💎 Rare asset — limited edition (1 of 1)',
    '🤝 Lifetime warranty included',
];

export default function PitchScreen({ onNext }) {
    const [visibleLines, setVisibleLines] = useState(0);
    const [showStats, setShowStats] = useState(false);
    const [showBullets, setShowBullets] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const lineTimer = setInterval(() => {
            setVisibleLines(prev => {
                if (prev >= pitchLines.length) {
                    clearInterval(lineTimer);
                    return prev;
                }
                return prev + 1;
            });
        }, 800);

        const statsTimer = setTimeout(() => setShowStats(true), pitchLines.length * 800 + 500);
        const bulletsTimer = setTimeout(() => setShowBullets(true), pitchLines.length * 800 + 1200);
        const buttonTimer = setTimeout(() => setShowButton(true), pitchLines.length * 800 + 2500);

        return () => {
            clearInterval(lineTimer);
            clearTimeout(statsTimer);
            clearTimeout(bulletsTimer);
            clearTimeout(buttonTimer);
        };
    }, []);

    return (
        <div className="pitch">
            <div className="pitch-layout">
                <div className="founder-card">
                    <div className="founder-avatar">👨‍💼</div>
                    <h3 className="founder-name">David</h3>
                    <p className="founder-title">CEO &amp; Founder</p>
                    <p className="founder-company">&ldquo;Us, Inc.&rdquo;</p>
                    <div className="founder-badge">SEEKING DEAL</div>
                </div>

                <div className="pitch-content">
                    <h2 className="pitch-header">The Pitch</h2>
                    <div className="pitch-text">
                        {pitchLines.slice(0, visibleLines).map((line, i) => (
                            <p key={i} className="pitch-line" style={{ animationDelay: '0s' }}>
                                {line || <br />}
                            </p>
                        ))}
                    </div>

                    {showStats && (
                        <div className="pitch-stats">
                            {stats.map((stat, i) => (
                                <div key={i} className="stat-card" style={{ animationDelay: `${i * 0.15}s` }}>
                                    <span className="stat-icon">{stat.icon}</span>
                                    <span className="stat-value">{stat.value}</span>
                                    <span className="stat-label">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {showBullets && (
                        <div className="pitch-bullets">
                            <h3>Why You Should Invest:</h3>
                            <ul>
                                {bulletPoints.map((point, i) => (
                                    <li key={i} style={{ animationDelay: `${i * 0.2}s` }}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {showButton && (
                        <button className="btn-gold" onClick={onNext} style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
                            Show Me the Numbers →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
