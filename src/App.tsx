import { CanvasBoard } from './components/CanvasBoard';
import { UIOverlay } from './components/UIOverlay';
import { useTetris } from './hooks/useTetris';
import './App.css';

function App() {
  const { gameState, initGame, cleanup, togglePause, toggleMute, incrementLevel, decrementLevel, restart } = useTetris();

  return (
    <div className="app-container">
      <h1>Tetris</h1>
      <div className="game-layout">
        <div className="game-board-wrapper">
          <CanvasBoard initGame={initGame} cleanup={cleanup} />
          <UIOverlay
            gameState={gameState}
            onRestart={restart}
            onPause={togglePause}
            onMute={toggleMute}
            onLevelUp={incrementLevel}
            onLevelDown={decrementLevel}
          />
        </div>
      </div>
      <div className="instructions">
        <p>Arrows to Move • Up to Rotate • Space to Drop • P to Pause • M to Mute • +/- Level</p>
      </div>
    </div>
  );
}

export default App;
