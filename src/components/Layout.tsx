import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import BottomNav from './BottomNav';

export default function Layout() {
  const { theme } = useApp();
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-background text-foreground" data-theme={theme}>
      <div className="mx-auto max-w-4xl px-4 pb-24 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}
