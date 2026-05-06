import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { allExercises } from '../data/exercises';

// Brzycki formula
function calc1RM(weight: number, reps: number) {
  if (reps <= 0) return 0;
  if (reps === 1) return weight;
  return Math.round(weight * (36 / (37 - reps)));
}

export default function OneRMCalculator() {
  const [search, setSearch] = useState('');
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(10);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    return allExercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 10);
  }, [search]);

  const rm = reps > 0 && weight > 0 ? calc1RM(weight, reps) : 0;

  return (
    <div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 搜索动作（选填）..."
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-4" />

      {search && filtered.length > 0 && (
        <div className="space-y-0.5 mb-3">
          {filtered.map((ex) => (
            <button key={ex.id} onClick={() => setSearch(ex.name)}
              className="w-full text-left rounded-lg p-2 text-sm hover:bg-white/[0.02] text-foreground/70 flex items-center gap-2">
              <span>{ex.emoji}</span><span>{ex.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-sm text-foreground/60 mb-1">重量 (kg)</label>
          <input type="number" value={weight || ''} onChange={(e) => setWeight(Number(e.target.value))}
            placeholder="0" min={0} step={0.5}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-lg text-center outline-none focus:border-accent/40" />
        </div>
        <div>
          <label className="block text-sm text-foreground/60 mb-1">次数 (1-12)</label>
          <input type="number" value={reps || ''} onChange={(e) => setReps(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
            min={1} max={12}
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-lg text-center outline-none focus:border-accent/40" />
        </div>
      </div>

      {rm > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="liquid-glass rounded-2xl p-6 text-center mb-4">
            <p className="text-sm text-foreground/50 mb-1">你的极限重量 (1RM)</p>
            <p className="text-4xl font-bold text-accent">{rm} <span className="text-base text-foreground/30">kg</span></p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '🏋️ 增肌 (8-12次)', range: `${Math.round(rm * 0.7)} - ${Math.round(rm * 0.8)}`, pct: '70-80%' },
              { label: '💪 力量 (1-5次)', range: `${Math.round(rm * 0.85)} - ${Math.round(rm * 0.95)}`, pct: '85-95%' },
              { label: '🏃 耐力 (15-20次)', range: `${Math.round(rm * 0.5)} - ${Math.round(rm * 0.65)}`, pct: '50-65%' },
            ].map((r) => (
              <div key={r.label} className="liquid-glass rounded-xl p-3 text-center">
                <p className="text-xs mb-1">{r.label}</p>
                <p className="text-sm font-semibold text-accent">{r.range} kg</p>
                <p className="text-[10px] text-foreground/30">1RM × {r.pct}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
