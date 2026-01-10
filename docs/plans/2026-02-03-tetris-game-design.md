# Tetris Game Design

**Date:** 2026-02-03
**Status:** Validated

## Objective
Build a browser-based Tetris game using React and HTML5 Canvas. The design focuses on a minimalist "classic" aesthetic with high-performance rendering and standard gameplay mechanics (scoring, levels, next piece).

## Architecture / Approach
We will use a **Hybrid React + Game Loop** approach to ensure smooth performance.

-   **Tech Stack:** React, TypeScript, HTML5 Canvas.
-   **Rendering Engine:** `requestAnimationFrame` loop drawing directly to a `<canvas>` element via a Ref. This avoids React render overhead for the 60fps game board.
-   **State Management:**
    -   **Game Logic:** Mutable state held in `useRef` (Board grid, active piece, internal timers). This prevents stale closures in the game loop.
    -   **UI State:** React State (`useState`) for low-frequency updates like Score, Level, Next Piece, and Game Status (Start/Pause/Over).

## Specifications

### 1. Core Components
-   **`TetrisGame` (Container):** Manages the layout and high-level state.
-   **`CanvasBoard`:** A wrapper around `<canvas>` that initializes the drawing context and attaches the game loop.
-   **`UIOverlay`:** HTML/CSS layer on top of the canvas for Score, Next Piece, and Menus.

### 2. Game Logic (The Engine)
-   **Grid:** A 10 (width) x 20 (height) 2D array. `0` = Empty, `1-7` = Color IDs.
-   **Tetrominoes:** Standard 7 shapes (I, J, L, O, S, T, Z) defined as coordinate matrices.
-   **Loop:**
    -   Accumulate `deltaTime`.
    -   If `accumulator > dropInterval`, trigger `drop()`.
    -   On every frame, `draw()`.
-   **Collision:** Check boundaries and non-zero grid cells before every move.
-   **Wall Kicks:** Basic implementation (try move, if blocked, try shift L/R).

### 3. Controls
-   **Keyboard:**
    -   `Left/Right`: Move horizontally.
    -   `Up`: Rotate.
    -   `Down`: Soft Drop (accelerate).
    -   `Space`: Hard Drop (instant lock).
    -   `P` or `Esc`: Pause.

### 4. Scoring & Levels
-   **Lines:** 1=100, 2=300, 3=500, 4=800 (Classic Nintendo scoring style).
-   **Level Up:** Every 10 lines cleared.
-   **Speed:** Drop interval decreases as level increases (e.g., `(0.8 - (level * 0.007)) ^ level`).

## Implementation Order
1.  **Project Setup:** Initialize React + TypeScript + Canvas boilerplate.
2.  **Game Engine Skeleton:** Implement the `requestAnimationFrame` loop and `draw` function (render a static grid).
3.  **Tetromino Logic:** Define shapes and implement spawning and gravity (falling).
4.  **Movement & Collision:** Add keyboard inputs and boundary checks.
5.  **Locking & Clearing:** Implement piece locking and row clearing logic.
6.  **Game State Integration:** Connect Score, Levels, and Game Over states to React UI.
7.  **Polish:** specific colors, smooth animations (optional), and restart functionality.

## Success Criteria
- [ ] Game runs smoothly (60fps) without stutter.
- [ ] Controls are responsive with no noticeable input lag.
- [ ] Lines clear correctly and score updates.
- [ ] Game ends when the stack reaches the top.
- [ ] "Next Piece" preview works correctly.
