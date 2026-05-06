import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  emoji: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ emoji, title, description, action }: Props) {
  return (
    <motion.div
      className="flex flex-col items-center py-16 px-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        className="text-6xl block mb-5 opacity-40"
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.span>
      <h3 className="text-base font-semibold text-foreground/50 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-foreground/30 mb-5 max-w-xs">{description}</p>}
      {action && <div>{action}</div>}
    </motion.div>
  );
}
