import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import PitchScreen from './components/PitchScreen';
import DashboardScreen from './components/DashboardScreen';
import CountdownScreen from './components/CountdownScreen';
import FinaleScreen from './components/FinaleScreen';
import './App.css';

const SCREENS = ['splash', 'pitch', 'dashboard', 'countdown', 'finale'];

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const goNext = () => {
    setCurrentScreen((prev) => Math.min(prev + 1, SCREENS.length - 1));
  };

  return (
    <div className="app">
      <div className={`screen ${currentScreen === 0 ? 'active' : ''}`}>
        <SplashScreen onNext={goNext} />
      </div>
      <div className={`screen ${currentScreen === 1 ? 'active' : ''}`}>
        {currentScreen >= 1 && <PitchScreen onNext={goNext} />}
      </div>
      <div className={`screen ${currentScreen === 2 ? 'active' : ''}`}>
        {currentScreen >= 2 && <DashboardScreen onNext={goNext} />}
      </div>
      <div className={`screen ${currentScreen === 3 ? 'active' : ''}`}>
        {currentScreen >= 3 && <CountdownScreen onNext={goNext} />}
      </div>
      <div className={`screen ${currentScreen === 4 ? 'active' : ''}`}>
        {currentScreen >= 4 && <FinaleScreen />}
      </div>
    </div>
  );
}

export default App;
