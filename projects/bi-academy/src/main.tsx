import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Home from './pages/Home.tsx'
import PathOverview from './pages/PathOverview.tsx'
import LessonPage from './pages/LessonPage.tsx'
import Library from './pages/Library.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="/paths/:pathSlug" element={<PathOverview />} />
          <Route path="/paths/:pathSlug/:lessonSlug" element={<LessonPage />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
