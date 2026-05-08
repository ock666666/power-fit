import { motion } from 'framer-motion';
import { exercisesByMuscle } from '../data/exercises';
import type { WeekPlan } from '../context/AppContext';

const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

interface Props {
  plan: WeekPlan;
  onUpdatePlan: (plan: WeekPlan) => void;
  onRegenerate: () => void;
  onSave: () => void;
  onBackToWizard: () => void;
}

export default function AIResult({ plan, onUpdatePlan, onRegenerate, onSave, onBackToWizard }: Props) {
  const replaceExercise = (dayIdx: number, exIdx: number) => {
    const day = plan.weekPlan.find((d) => d.dayIdx === dayIdx);
    if (!day) return;
    const oldEx = day.exercises[exIdx];
    if (!oldEx) return;

    const pool = exercisesByMuscle[oldEx.muscleId] || [];
    const usedNames = new Set(day.exercises.map((e) => e.name));
    const candidates = pool.filter((e) => !usedNames.has(e.name) && e.name !== oldEx.name);
    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    const newPlan = { ...plan, weekPlan: plan.weekPlan.map((d) => {
      if (d.dayIdx !== dayIdx) return d;
      const exs = [...d.exercises];
      exs[exIdx] = { ...exs[exIdx], name: pick.name, muscleId: pick.muscleId, emoji: pick.emoji };
      return { ...d, exercises: exs };
    })};
    onUpdatePlan(newPlan);
  };

  const moveExercise = (dayIdx: number, exIdx: number, dir: -1 | 1) => {
    const newIdx = exIdx + dir;
    const newPlan = { ...plan, weekPlan: plan.weekPlan.map((d) => {
      if (d.dayIdx !== dayIdx) return d;
      const exs = [...d.exercises];
      if (newIdx < 0 || newIdx >= exs.length) return d;
      [exs[exIdx], exs[newIdx]] = [exs[newIdx], exs[exIdx]];
      return { ...d, exercises: exs };
    })};
    onUpdatePlan(newPlan);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-heading font-semibold mb-1">📋 你的专属训练计划</h2>
      <p className="text-sm text-foreground/50 mb-6">
        {plan.gender} · {plan.goal} · 每周{plan.daysPerWeek}天 · {plan.experience}
      </p>

      {/* Week grid */}
      <div className="grid grid-cols-7 gap-1 mb-6 text-center">
        {DAY_NAMES.map((dn) => (
          <div key={dn} className="text-xs text-foreground/30 font-medium py-1">{dn}</div>
        ))}
        {plan.weekPlan.map((day, i) =>
          day.focus ? (
            <div key={i} className="rounded-lg bg-accent/5 border border-accent/20 p-1.5 min-h-[80px]">
              <div className="text-[10px] font-semibold text-accent mb-1">{day.focus}</div>
              {day.exercises.slice(0, 3).map((ex, j) => (
                <div key={j} className="text-[9px] text-foreground/50 truncate">
                  {ex.emoji || ''} {ex.name}
                </div>
              ))}
              {day.exercises.length > 3 && (
                <div className="text-[9px] text-foreground/20">+{day.exercises.length - 3} 更多</div>
              )}
            </div>
          ) : (
            <div key={i} className="rounded-lg bg-white/[0.01] border border-white/5 p-1.5 min-h-[80px] flex items-center justify-center">
              <span className="text-[10px] text-foreground/15">休息</span>
            </div>
          ),
        )}
      </div>

      {/* Day detail with reorder controls */}
      <div className="space-y-4 mb-8">
        {plan.weekPlan.filter((d) => d.focus).map((day, i) => (
          <motion.div
            key={i}
            className="liquid-glass rounded-xl p-4"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">{DAY_NAMES[day.dayIdx]} · {day.focus}</h4>
              <span className="text-xs text-foreground/30">共 {day.totalSets} 组</span>
            </div>
            <div className="space-y-1">
              {day.exercises.map((ex, j) => (
                <div key={j} className="flex items-center gap-1.5 text-sm group py-0.5">
                  <div className="flex flex-col leading-none">
                    <button
                      onClick={() => moveExercise(day.dayIdx, j, -1)}
                      disabled={j === 0}
                      className="text-[10px] text-foreground/10 hover:text-foreground/50 disabled:opacity-0 leading-none"
                    >▲</button>
                    <button
                      onClick={() => moveExercise(day.dayIdx, j, 1)}
                      disabled={j === day.exercises.length - 1}
                      className="text-[10px] text-foreground/10 hover:text-foreground/50 disabled:opacity-0 leading-none"
                    >▼</button>
                  </div>
                  <span className="text-base">{ex.emoji || '🏋️'}</span>
                  <span className="text-foreground/70 flex-1">{ex.name}</span>
                  <span className="text-xs text-foreground/30">{ex.sets}</span>
                  <button
                    onClick={() => replaceExercise(day.dayIdx, j)}
                    className="text-xs text-foreground/10 hover:text-accent opacity-0 group-hover:opacity-100 transition-all"
                    title="换一个动作"
                  >🔄</button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button onClick={onSave} className="liquid-glass rounded-full px-5 py-3 text-sm font-medium">
          💾 保存为我的计划
        </button>
        <button onClick={onBackToWizard} className="rounded-full border border-white/10 px-5 py-3 text-sm text-foreground/50 hover:text-foreground transition-colors">
          ← 返回修改
        </button>
        <button onClick={onRegenerate} className="rounded-full border border-white/10 px-5 py-3 text-sm text-foreground/50 hover:text-foreground transition-colors">
          🔄 换一批
        </button>
      </div>
    </motion.div>
  );
}
