import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import GlobalUI from './components/GlobalUI';
import RefreshGuard from './components/RefreshGuard';
import ErrorBoundary from './components/ErrorBoundary';

// Hero stays eager for instant landing page
import HeroPage from './pages/HeroPage';

// Lazy-load app pages to reduce initial bundle
const HomePage = lazy(() => import('./pages/HomePage'));
const TrainingPage = lazy(() => import('./pages/TrainingPage'));
const PlanPage = lazy(() => import('./pages/PlanPage'));
const AIPage = lazy(() => import('./pages/AIPage'));
const DietPage = lazy(() => import('./pages/DietPage'));
const LogPage = lazy(() => import('./pages/LogPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/power-fit">
      <AppProvider>
        <ToastProvider>
          <RefreshGuard />
          <GlobalUI />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </ErrorBoundary>
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
