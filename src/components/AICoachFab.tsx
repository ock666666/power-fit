import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AICoachPanel from './AICoachPanel';

export default function AICoachFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FAB button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-28 right-5 z-[200] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-accent/20 border border-accent/40"
        style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,184,212,0.35))' }}
        whileHover={{ scale: 1.08, boxShadow: '0 0 24px rgba(0,229,255,0.35)' }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 8px rgba(0,229,255,0.15)', '0 0 20px rgba(0,229,255,0.3)', '0 0 8px rgba(0,229,255,0.15)'] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && <AICoachPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
