import { useNavigate, useParams } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { muscleGroups, exercisesByMuscle, type Exercise } from '../data/exercises';
import { useApp } from '../context/AppContext';
import ExerciseCard from '../components/ExerciseCard';
import ExerciseModal from '../components/ExerciseModal';

export default function TrainingPage() {
  const { muscleId } = useParams<{ muscleId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useApp();

  const muscle = muscleGroups.find((m) => m.id === muscleId);
  const exercises = exercisesByMuscle[muscleId || ''] || [];

  const subCategories = useMemo(
    () => [...new Set(exercises.map((e) => e.subCategory))],
    [exercises],
  );

  const [subFilter, setSubFilter] = useState<string>('all');
  const [diffFilter, setDiffFilter] = useState<string>('all');
  const [equipFilter, setEquipFilter] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = useMemo(() => {
    return exercises.filter((e) => {
      if (subFilter !== 'all' && e.subCategory !== subFilter) return false;
      if (diffFilter !== 'all' && e.difficulty !== diffFilter) return false;
      if (equipFilter !== 'all' && e.equipment !== equipFilter) return false;
      return true;
    });
  }, [exercises, subFilter, diffFilter, equipFilter]);

  if (!muscle) {
    return (
      <div className="text-center py-20">
        <p className="text-foreground/50">肌群未找到</p>
        <button onClick={() => navigate('/home')} className="mt-4 text-sm text-accent">
          ← 返回首页
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 py-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <button onClick={() => navigate('/home')} className="text-foreground/50 hover:text-foreground text-lg">
          ←
        </button>
        <span className="text-3xl">{muscle.emoji}</span>
        <div>
          <h2 className="text-xl font-heading font-semibold">{muscle.name}</h2>
          <p className="text-sm text-foreground/50">{muscle.desc}</p>
        </div>
      </motion.div>

      {/* Sub-category filters */}
      {subCategories.length > 1 && (
        <div className="flex flex-wrap gap-2 py-3">
          <FilterChip active={subFilter === 'all'} onClick={() => setSubFilter('all')}>
            全部
          </FilterChip>
          {subCategories.map((sc) => (
            <FilterChip key={sc} active={subFilter === sc} onClick={() => setSubFilter(sc)}>
              {sc}
            </FilterChip>
          ))}
        </div>
      )}

      {/* Difficulty & Equipment */}
      <div className="flex flex-wrap gap-2 py-2 mb-2">
        {['all', '初级', '中级', '高级'].map((d) => (
          <FilterChip key={d} active={diffFilter === d} onClick={() => setDiffFilter(d)} small>
            {d === 'all' ? '全部难度' : d}
          </FilterChip>
        ))}
        <span className="w-full h-0" />
        {[
          { v: 'all', l: '全部器械' },
          { v: 'dumbbell', l: '哑铃' },
          { v: 'barbell', l: '杠铃' },
          { v: 'cable', l: '绳索' },
          { v: 'bodyweight', l: '自重' },
        ].map((eq) => (
          <FilterChip
            key={eq.v}
            active={equipFilter === eq.v}
            onClick={() => setEquipFilter(eq.v)}
            small
          >
            {eq.l}
          </FilterChip>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            index={i}
            isFav={favorites.some((f) => f.muscleId === ex.muscleId && f.name === ex.name)}
            onToggleFav={() => toggleFavorite(ex.muscleId, ex.name)}
            onClick={() => setSelectedExercise(ex)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-12 text-foreground/40">没有匹配的动作</p>
      )}

      {/* Exercise Modal */}
      <ExerciseModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
  small,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border transition-all ${
        active
          ? 'border-accent/40 bg-accent/10 text-accent'
          : 'border-white/5 bg-white/[0.02] text-foreground/50 hover:text-foreground/80'
      } ${small ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-sm'}`}
    >
      {children}
    </button>
  );
}
