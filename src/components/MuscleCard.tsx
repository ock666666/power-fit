import { motion } from 'framer-motion';

interface MuscleCardProps {
  name: string;
  emoji: string;
  desc: string;
  count: number;
  onClick: () => void;
  index: number;
}

export default function MuscleCard({ name, emoji, desc, count, onClick, index }: MuscleCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="liquid-glass rounded-2xl p-6 text-left w-full cursor-pointer group"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <span className="text-4xl block mb-3">{emoji}</span>
      <h3 className="text-base font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-foreground/50 leading-relaxed mb-3">{desc}</p>
      <span className="inline-block px-3 py-0.5 rounded-full bg-foreground/5 text-xs text-foreground/40">
        {count} 个动作
      </span>
    </motion.button>
  );
}
