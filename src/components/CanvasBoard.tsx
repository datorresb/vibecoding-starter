import React, { useRef, useEffect } from 'react';

interface CanvasBoardProps {
    initGame: (canvas: HTMLCanvasElement) => void;
    cleanup: () => void;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ initGame, cleanup }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        initGame(canvas);

        return () => {
            cleanup();
        };
    }, [initGame, cleanup]);

    return (
        <canvas 
            ref={canvasRef} 
            width={300} 
            height={600} 
            className="game-canvas"
        />
    );
};

