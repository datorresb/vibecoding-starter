import { TETROMINOES, COLORS } from './Tetrominoes';
import { audioEngine } from './AudioEngine';

export class GameEngine {
    private ctx: CanvasRenderingContext2D | null = null;
    private isRunning: boolean = false;
    private isPaused: boolean = false;
    private lastTime: number = 0;
    private animationFrameId: number | null = null;

    private grid: number[][];
    private currentPiece: number[][] | null = null;
    private currentPieceType: string | null = null;
    public nextPieceType: string | null = null;
    public nextPiece: number[][] | null = null;
    private piecePos: { x: number, y: number } = { x: 0, y: 0 };
    private readonly ROWS = 20;
    private readonly COLS = 10;
    private readonly CELL_SIZE = 30;

    // Game State
    public score: number = 0;
    public level: number = 1;
    public lines: number = 0;

    private dropCounter: number = 0;
    private dropInterval: number = 1000;
    private onStateChange: ((state: any) => void) | null = null;

    constructor() {
        this.loop = this.loop.bind(this);
        // Initialize grid 20x10 with 0s
        this.grid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.generateNextPiece();
    }

    public setContext(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public setStateChangeCallback(callback: (state: any) => void) {
        this.onStateChange = callback;
    }

    private broadcastState() {
        if (this.onStateChange) {
            this.onStateChange({
                score: this.score,
                level: this.level,
                lines: this.lines,
                nextPiece: this.nextPieceType,
                isGameOver: !this.isRunning && this.grid.some(row => row.some(cell => cell !== 0)) && !this.currentPiece, // Rough check, better logic below
                isPaused: this.isPaused
            });
        }
    }

    public start() {
        if (this.isRunning && !this.isPaused) return;

        audioEngine.resume();

        if (this.isPaused) {
            this.isPaused = false;
            audioEngine.playResume();
            audioEngine.startMusic();
            this.lastTime = performance.now();
            this.loop(this.lastTime);
            return;
        }

        if (!this.currentPiece) {
            this.spawnPiece();
        }

        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        audioEngine.startMusic();
        this.loop(this.lastTime);
        this.broadcastState();
    }

    public pause() {
        this.isPaused = true;
        audioEngine.playPause();
        audioEngine.stopMusic();
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        this.broadcastState();
    }

    public togglePause() {
        if (this.isPaused) {
            this.start();
        } else {
            this.pause();
        }
    }

    public restart() {
        this.stop();
        this.grid = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.currentPiece = null;
        audioEngine.setLevel(1);
        this.generateNextPiece();
        this.spawnPiece();
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = performance.now();
        audioEngine.startMusic();
        this.loop(this.lastTime);
        this.broadcastState();
    }

    public stop() {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        // Force update game over state
        if (this.onStateChange) {
            this.onStateChange({
                score: this.score,
                level: this.level,
                lines: this.lines,
                nextPiece: this.nextPieceType,
                isGameOver: true,
                isPaused: this.isPaused
            });
        }
    }

    public move(dirX: number, dirY: number) {
        if (!this.currentPiece || this.isPaused || !this.isRunning) return;

        if (this.isValidMove(this.currentPiece, dirX, dirY)) {
            this.piecePos.x += dirX;
            this.piecePos.y += dirY;
            if (dirX !== 0) audioEngine.playMove();
        } else if (dirY > 0) {
            // Collision moving down
            this.lockPiece();
            // Reset drop counter immediately so the new piece doesn't drop instantly if the lag was high
            this.dropCounter = 0;
        }
    }

    public hardDrop() {
        if (!this.currentPiece || this.isPaused || !this.isRunning) return;

        while (this.isValidMove(this.currentPiece, 0, 1)) {
            this.piecePos.y += 1;
            this.score += 2; // Soft drop points (optional, but standard usually gives points for drop)
        }
        audioEngine.playHardDrop();
        this.lockPiece();
        this.dropCounter = 0;
        this.broadcastState();
    }

    private lockPiece() {
        if (!this.currentPiece) return;

        // Stamp piece into grid
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x] !== 0) {
                    const gridY = this.piecePos.y + y;
                    const gridX = this.piecePos.x + x;

                    // Safety check to ensure we are within bounds
                    if (gridY >= 0 && gridY < this.ROWS && gridX >= 0 && gridX < this.COLS) {
                        this.grid[gridY][gridX] = 1; // Mark as occupied
                    }
                }
            }
        }

        // Check for line clears
        this.clearLines();

        // Spawn new piece
        this.spawnPiece();

        // Check for Game Over (collision immediately after spawn)
        if (!this.isValidMove(this.currentPiece, 0, 0)) {
            audioEngine.playGameOver();
            audioEngine.stopMusic();
            this.stop();
        }

        this.broadcastState();
    }

    private clearLines() {
        let linesCleared = 0;

        // Check each row
        for (let y = this.ROWS - 1; y >= 0; y--) {
            // If every cell in the row is not 0 (occupied)
            if (this.grid[y].every(cell => cell !== 0)) {
                // Remove the row
                this.grid.splice(y, 1);
                // Add a new empty row at the top
                this.grid.unshift(Array(this.COLS).fill(0));

                linesCleared++;
                // Check this index again since rows shifted down
                y++;
            }
        }

        if (linesCleared > 0) {
            this.lines += linesCleared;
            audioEngine.playLineClear(linesCleared);

            // Nintendo Scoring System
            const basePoints = [0, 40, 100, 300, 1200];
            this.score += basePoints[linesCleared] * this.level;

            // Level up every 10 lines
            const newLevel = Math.floor(this.lines / 10) + 1;
            if (newLevel > this.level) {
                this.level = newLevel;
                audioEngine.setLevel(this.level);
                audioEngine.playLevelUp();
                // Speed up: reduce drop interval
                // Basic formula: (0.8 - ((Level-1)*0.007))^(Level-1) seconds per frame roughly
                // Or just simple reduction
                this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
            }
        }
    }

    // Audio controls
    public toggleMute(): boolean {
        return audioEngine.toggleMute();
    }

    public isMuted(): boolean {
        return audioEngine.getMuted();
    }

    // Level controls
    public setLevel(newLevel: number) {
        this.level = Math.max(1, Math.min(10, newLevel));
        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        audioEngine.setLevel(this.level);
        this.broadcastState();
    }

    public incrementLevel() {
        this.setLevel(this.level + 1);
    }

    public decrementLevel() {
        this.setLevel(this.level - 1);
    }

    public rotatePiece() {
        if (!this.currentPiece || this.isPaused || !this.isRunning) return;

        // Transpose + Reverse = Rotate 90 degrees clockwise
        const rotated = this.currentPiece[0].map((_, index) =>
            this.currentPiece!.map(row => row[index]).reverse()
        );

        if (this.isValidMove(rotated, 0, 0)) {
            this.currentPiece = rotated;
            audioEngine.playRotate();
        }
    }

    private isValidMove(piece: number[][], offsetX: number, offsetY: number): boolean {
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x] !== 0) {
                    const newX = this.piecePos.x + x + offsetX;
                    const newY = this.piecePos.y + y + offsetY;

                    // Boundary checks
                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) {
                        return false;
                    }

                    // Collision with grid (only check if inside grid vertically)
                    if (newY >= 0 && this.grid[newY][newX] !== 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private generateNextPiece() {
        const shapes = Object.keys(TETROMINOES);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        this.nextPieceType = randomShape;
        this.nextPiece = TETROMINOES[randomShape];
    }

    private spawnPiece() {
        if (!this.nextPieceType) {
            this.generateNextPiece();
        }

        this.currentPieceType = this.nextPieceType;
        this.currentPiece = this.nextPiece;

        this.generateNextPiece();

        // Center the piece roughly
        if (this.currentPiece) {
            this.piecePos = {
                x: Math.floor((this.COLS - this.currentPiece[0].length) / 2),
                y: 0
            };
        }

        // Reset drop counter
        this.dropCounter = 0;
    }

    private loop(time: number) {
        if (!this.isRunning || this.isPaused) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.update(deltaTime);
        this.draw();

        this.animationFrameId = requestAnimationFrame(this.loop);
    }

    private update(deltaTime: number) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.move(0, 1);
            this.dropCounter = 0;
        }
    }

    private draw() {
        if (!this.ctx) return;

        // Clear canvas with dark background
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw grid lines
        this.ctx.strokeStyle = '#222';
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                this.ctx.strokeRect(x * this.CELL_SIZE, y * this.CELL_SIZE, this.CELL_SIZE, this.CELL_SIZE);

                if (this.grid[y][x] !== 0) {
                    this.ctx.fillStyle = '#666';
                    this.ctx.fillRect(x * this.CELL_SIZE + 1, y * this.CELL_SIZE + 1, this.CELL_SIZE - 2, this.CELL_SIZE - 2);
                }
            }
        }

        // Draw current piece
        if (this.currentPiece && this.currentPieceType) {
            this.ctx.fillStyle = COLORS[this.currentPieceType];

            for (let y = 0; y < this.currentPiece.length; y++) {
                for (let x = 0; x < this.currentPiece[y].length; x++) {
                    if (this.currentPiece[y][x] !== 0) {
                        const drawX = (this.piecePos.x + x) * this.CELL_SIZE;
                        const drawY = (this.piecePos.y + y) * this.CELL_SIZE;

                        this.ctx.fillRect(drawX, drawY, this.CELL_SIZE, this.CELL_SIZE);

                        // Optional stroke for grid definition
                        this.ctx.strokeStyle = '#000';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(drawX, drawY, this.CELL_SIZE, this.CELL_SIZE);
                    }
                }
            }
        }
    }
}
