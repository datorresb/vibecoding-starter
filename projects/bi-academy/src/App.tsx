import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <main className="mx-auto max-w-[960px] px-10 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
