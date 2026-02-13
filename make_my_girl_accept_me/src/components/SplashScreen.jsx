import './SplashScreen.css';

export default function SplashScreen({ onNext }) {
    return (
        <div className="splash">
            <div className="spotlight" />
            <div className="splash-content">
                <p className="splash-pre">Tonight on...</p>
                <h1 className="splash-title">
                    <span className="shark">SHARK</span>{' '}
                    <span className="tank">TANK</span>
                </h1>
                <h2 className="splash-subtitle">Valentine&apos;s Edition</h2>
                <div className="splash-hearts">💘</div>
                <p className="splash-shark-intro">Tonight&apos;s Featured Shark:</p>
                <h3 className="splash-shark-name">Catalina</h3>
                <p className="splash-tagline">
                    &ldquo;The most ruthless investor in matters of the heart&rdquo;
                </p>
                <button className="btn-gold pulse" onClick={onNext}>
                    Enter the Tank
                </button>
            </div>
        </div>
    );
}
