import { motion } from 'framer-motion';
import type { Exercise } from '../data/exercises';

interface Props {
  exercise: Exercise;
  index: number;
  isFav: boolean;
  onToggleFav: () => void;
  onClick: () => void;
}

export default function ExerciseCard({ exercise, index, isFav, onToggleFav, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      className="liquid-glass rounded-xl p-4 text-left w-full cursor-pointer group flex items-center gap-4"
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.01 }}
    >
      <span className="text-3xl shrink-0">{exercise.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{exercise.name}</h4>
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${
            exercise.difficulty === '初级' ? 'bg-green-500/10 text-green-400' :
            exercise.difficulty === '中级' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-red-500/10 text-red-400'
          }`}>
            {exercise.difficulty}
          </span>
        </div>
        <p className="text-xs text-foreground/40 mt-0.5 line-clamp-1">{exercise.desc}</p>
        <p className="text-xs text-foreground/30 mt-1">{exercise.sets}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
        className={`shrink-0 text-lg transition-colors ${isFav ? 'text-yellow-400' : 'text-foreground/20 hover:text-yellow-400/60'}`}
      >
        ★
      </button>
    </motion.button>
  );
}
