import { useEffect, useRef, useState } from 'react';
import './FinaleScreen.css';

function HeartFireworks({ active }) {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animFrameRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const colors = ['#ff6b9d', '#ff4081', '#e91e63', '#d4af37', '#f0d060', '#ffc2d1', '#ff1744'];

        function createBurst(x, y) {
            const count = 30 + Math.random() * 20;
            for (let i = 0; i < count; i++) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 2 + Math.random() * 4;
                particlesRef.current.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1,
                    decay: 0.008 + Math.random() * 0.008,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: 3 + Math.random() * 4,
                    isHeart: Math.random() > 0.5,
                });
            }
        }

        function drawHeart(ctx, x, y, size) {
            ctx.beginPath();
            const topCurveHeight = size * 0.3;
            ctx.moveTo(x, y + topCurveHeight);
            ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
            ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size + topCurveHeight) / 1.5, x, y + size);
            ctx.bezierCurveTo(x, y + (size + topCurveHeight) / 1.5, x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
            ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
            ctx.closePath();
            ctx.fill();
        }

        function animate() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
            ctx.fillRect(0, 0, width, height);

            particlesRef.current = particlesRef.current.filter(p => p.life > 0);

            for (const p of particlesRef.current) {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.03;
                p.vx *= 0.99;
                p.life -= p.decay;

                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;

                if (p.isHeart) {
                    drawHeart(ctx, p.x, p.y, p.size);
                } else {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                    ctx.fill();
                }
            }

            ctx.globalAlpha = 1;
            animFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        // Launch fireworks periodically
        const launchInterval = setInterval(() => {
            createBurst(
                width * 0.2 + Math.random() * width * 0.6,
                height * 0.1 + Math.random() * height * 0.4
            );
        }, 600);

        // Initial burst
        createBurst(width / 2, height / 3);
        setTimeout(() => createBurst(width * 0.3, height * 0.25), 300);
        setTimeout(() => createBurst(width * 0.7, height * 0.3), 500);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            clearInterval(launchInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, [active]);

    return <canvas ref={canvasRef} className="fireworks-canvas" />;
}

const roses = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 6,
    size: 1 + Math.random() * 1.5,
}));

export default function FinaleScreen() {
    const [showContract, setShowContract] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContract(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="finale">
            <HeartFireworks active={true} />

            <div className="roses-layer">
                {roses.map((rose) => (
                    <span
                        key={rose.id}
                        className="rose"
                        style={{
                            left: `${rose.left}%`,
                            animationDelay: `${rose.delay}s`,
                            animationDuration: `${rose.duration}s`,
                            fontSize: `${rose.size}rem`,
                        }}
                    >
                        🌹
                    </span>
                ))}
            </div>

            <div className={`finale-content ${showContract ? 'show' : ''}`}>
                <h1 className="finale-deal">DEAL! 🎉</h1>

                <div className="love-contract">
                    <div className="contract-header">
                        <span className="contract-seal">💘</span>
                        <h2>Partnership Agreement</h2>
                    </div>
                    <div className="contract-body">
                        <p className="contract-parties">
                            <strong>Catalina</strong> <span>&amp;</span> <strong>David</strong>
                        </p>
                        <p className="contract-title">Partners for Life</p>
                        <hr className="contract-divider" />
                        <p className="contract-terms">
                            This agreement hereby establishes an irrevocable, lifetime partnership
                            between the aforementioned parties, effective immediately and renewable
                            for all eternity.
                        </p>
                        <div className="contract-details">
                            <p><strong>Effective Date:</strong> February 14, 2026</p>
                            <p><strong>Duration:</strong> Forever ∞</p>
                            <p><strong>Terms:</strong> Unlimited love, support, and laughter</p>
                            <p><strong>ROI:</strong> Guaranteed happiness</p>
                        </div>
                        <div className="contract-signatures">
                            <div className="signature">
                                <span className="sig-name">David</span>
                                <span className="sig-line">CEO &amp; Founder, Us Inc.</span>
                            </div>
                            <div className="signature">
                                <span className="sig-name">Catalina</span>
                                <span className="sig-line">Lead Shark &amp; Investor</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="finale-footer">
                    Happy Valentine&apos;s Day, Catalina 💕<br />
                    <span className="small">Te quiero con todo mi corazón</span>
                </p>
            </div>
        </div>
    );
}
