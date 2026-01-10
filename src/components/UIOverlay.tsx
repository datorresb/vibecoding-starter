import React from 'react';
import type { TetrisState } from '../hooks/useTetris';
import { TETROMINOES, COLORS } from '../engine/Tetrominoes';

interface UIOverlayProps {
    gameState: TetrisState;
    onRestart: () => void;
    onPause: () => void;
    onMute: () => void;
    onLevelUp: () => void;
    onLevelDown: () => void;
}

const NextPiecePreview: React.FC<{ type: string | null }> = ({ type }) => {
    if (!type) return <div className="next-piece-placeholder">?</div>;

    const shape = TETROMINOES[type];
    const color = COLORS[type];

    return (
        <div className="next-piece-preview" style={{
            display: 'grid',
            gridTemplateRows: `repeat(${shape.length}, 20px)`,
            gridTemplateColumns: `repeat(${shape[0].length}, 20px)`,
            gap: '1px',
            backgroundColor: '#000',
            padding: '5px',
            border: '2px solid #333'
        }}>
            {shape.map((row, y) => (
                row.map((cell, x) => (
                    <div key={`${y}-${x}`} style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: cell ? color : 'transparent'
                    }} />
                ))
            ))}
        </div>
    );
};

export const UIOverlay: React.FC<UIOverlayProps> = ({ gameState, onRestart, onPause, onMute, onLevelUp, onLevelDown }) => {
    return (
        <div className="ui-overlay">
            <div className="stats-panel">
                <div className="stat-box">
                    <h3>Score</h3>
                    <p>{gameState.score}</p>
                </div>
                <div className="stat-box">
                    <h3>Level</h3>
                    <div className="level-controls">
                        <button className="level-btn" onClick={onLevelDown}>-</button>
                        <span className="level-value">{gameState.level}</span>
                        <button className="level-btn" onClick={onLevelUp}>+</button>
                    </div>
                </div>
                <div className="stat-box">
                    <h3>Lines</h3>
                    <p>{gameState.lines}</p>
                </div>
                <div className="stat-box">
                    <h3>Next</h3>
                    <NextPiecePreview type={gameState.nextPiece} />
                </div>
            </div>

            <div className="controls-panel">
                <button onClick={onPause}>
                    {gameState.isPaused ? 'Resume' : 'Pause'} (P)
                </button>
                <button onClick={onMute}>
                    {gameState.isMuted ? 'Unmute' : 'Mute'} (M)
                </button>
                <button onClick={onRestart}>Restart</button>
            </div>

            {(gameState.isGameOver || gameState.isPaused) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {gameState.isGameOver ? (
                            <>
                                <h2>Game Over</h2>
                                <p>Final Score: {gameState.score}</p>
                                <button onClick={onRestart}>Try Again</button>
                            </>
                        ) : (
                            <>
                                <h2>Paused</h2>
                                <button onClick={onPause}>Resume</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
