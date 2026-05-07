import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import HeroPage from './pages/HeroPage';
import HomePage from './pages/HomePage';
import TrainingPage from './pages/TrainingPage';
import PlanPage from './pages/PlanPage';
import AIPage from './pages/AIPage';
import DietPage from './pages/DietPage';
import LogPage from './pages/LogPage';
import GlobalUI from './components/GlobalUI';
import RefreshGuard from './components/RefreshGuard';

export default function App() {
  return (
    <BrowserRouter basename="/power-fit">
      <AppProvider>
        <RefreshGuard />
        <GlobalUI />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/training/:muscleId" element={<TrainingPage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="/ai" element={<AIPage />} />
            <Route path="/diet" element={<DietPage />} />
            <Route path="/log" element={<LogPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
