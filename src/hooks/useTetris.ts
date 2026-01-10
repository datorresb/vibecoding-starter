import { useState, useRef, useCallback, useEffect } from 'react';
import { GameEngine } from '../engine/GameEngine';

export interface TetrisState {
    score: number;
    level: number;
    lines: number;
    nextPiece: string | null;
    isGameOver: boolean;
    isPaused: boolean;
    isMuted: boolean;
}

export const useTetris = () => {
    const [gameState, setGameState] = useState<TetrisState>({
        score: 0,
        level: 1,
        lines: 0,
        nextPiece: null,
        isGameOver: false,
        isPaused: false,
        isMuted: false,
    });

    const engineRef = useRef<GameEngine>(new GameEngine());

    const initGame = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            engineRef.current.setContext(ctx);
            engineRef.current.setStateChangeCallback((newState) => {
                setGameState(prev => ({ ...prev, ...newState }));
            });
            engineRef.current.start();
        }
    }, []);

    const cleanup = useCallback(() => {
        engineRef.current.stop();
    }, []);

    const togglePause = useCallback(() => {
        engineRef.current.togglePause();
    }, []);

    const restart = useCallback(() => {
        engineRef.current.restart();
    }, []);

    const toggleMute = useCallback(() => {
        const muted = engineRef.current.toggleMute();
        setGameState(prev => ({ ...prev, isMuted: muted }));
    }, []);

    const incrementLevel = useCallback(() => {
        engineRef.current.incrementLevel();
    }, []);

    const decrementLevel = useCallback(() => {
        engineRef.current.decrementLevel();
    }, []);

    const setLevel = useCallback((level: number) => {
        engineRef.current.setLevel(level);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameState.isGameOver) {
                if (event.code === 'Enter') {
                    restart();
                }
                return;
            }

            switch (event.code) {
                case 'ArrowLeft':
                    engineRef.current.move(-1, 0);
                    break;
                case 'ArrowRight':
                    engineRef.current.move(1, 0);
                    break;
                case 'ArrowDown':
                    engineRef.current.move(0, 1);
                    break;
                case 'ArrowUp':
                    engineRef.current.rotatePiece();
                    break;
                case 'Space':
                    engineRef.current.hardDrop();
                    break;
                case 'KeyP':
                case 'Escape':
                    engineRef.current.togglePause();
                    break;
                case 'KeyM':
                    toggleMute();
                    break;
                case 'Equal':
                case 'NumpadAdd':
                    incrementLevel();
                    break;
                case 'Minus':
                case 'NumpadSubtract':
                    decrementLevel();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameState.isGameOver, restart, toggleMute, incrementLevel, decrementLevel]);

    return {
        gameState,
        initGame,
        cleanup,
        togglePause,
        toggleMute,
        setLevel,
        incrementLevel,
        decrementLevel,
        restart
    };
};
