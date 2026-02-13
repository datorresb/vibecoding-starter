import { useState, useEffect, useCallback } from 'react';
import './CountdownScreen.css';

export default function CountdownScreen({ onNext }) {
    const [countdown, setCountdown] = useState(10);
    const [noBtnPos, setNoBtnPos] = useState({ top: '60%', left: '70%' });
    const [noAttempts, setNoAttempts] = useState(0);
    const [showQuestion, setShowQuestion] = useState(false);

    const noMessages = [
        'No Deal',
        'Are you sure?!',
        'Think again! 😢',
        'You can\'t catch me!',
        'Nice try! 😏',
        'NOPE!',
        '🏃‍♂️💨',
        'Too slow!',
        'Seriously?!',
        '❌ ERROR 404: No not found',
    ];

    useEffect(() => {
        const showTimer = setTimeout(() => setShowQuestion(true), 1000);
        return () => clearTimeout(showTimer);
    }, []);

    useEffect(() => {
        if (!showQuestion) return;

        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showQuestion, countdown]);

    const dodgeNo = useCallback(() => {
        const newTop = Math.random() * 60 + 15;
        const newLeft = Math.random() * 60 + 15;
        setNoBtnPos({ top: `${newTop}%`, left: `${newLeft}%` });
        setNoAttempts((prev) => prev + 1);
    }, []);

    const progress = ((10 - countdown) / 10) * 100;
    const bgHue = 220 - (progress * 2.2); // blue (220) to red (0)

    return (
        <div className="countdown-screen" style={{
            background: `linear-gradient(180deg, hsl(${bgHue}, 60%, 12%) 0%, hsl(${bgHue - 20}, 70%, 8%) 100%)`
        }}>
            {!showQuestion ? (
                <div className="countdown-prelude">
                    <p className="prelude-text">And now...</p>
                    <p className="prelude-text delay">The moment of truth.</p>
                </div>
            ) : (
                <>
                    <div className="countdown-timer-section">
                        <span className="countdown-label">DEAL CLOSES IN</span>
                        <div className="countdown-number" key={countdown}>
                            {countdown > 0 ? countdown : '⏰'}
                        </div>
                        <div className="countdown-bar">
                            <div className="countdown-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="countdown-question">
                        <h2>Catalina,</h2>
                        <p>the question is simple...</p>
                        <h1 className="the-question">Will you accept this deal? 💘</h1>
                    </div>

                    <div className="deal-buttons">
                        <button
                            className="deal-btn yes"
                            onClick={onNext}
                            style={{
                                transform: countdown === 0 ? 'scale(1.3)' : 'scale(1)',
                            }}
                        >
                            💘 DEAL! 💘
                        </button>

                        <button
                            className="deal-btn no"
                            style={{
                                position: 'absolute',
                                top: noBtnPos.top,
                                left: noBtnPos.left,
                                fontSize: Math.max(0.5, 1 - noAttempts * 0.08) + 'rem',
                                opacity: Math.max(0.3, 1 - noAttempts * 0.1),
                            }}
                            onMouseEnter={dodgeNo}
                            onTouchStart={dodgeNo}
                            onClick={dodgeNo}
                        >
                            {noMessages[Math.min(noAttempts, noMessages.length - 1)]}
                        </button>
                    </div>

                    {noAttempts >= 3 && (
                        <p className="no-hint" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                            {noAttempts >= 7
                                ? "The universe has spoken — there IS no 'No' option! 😂"
                                : "That button seems to have a mind of its own... 🤔"}
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
