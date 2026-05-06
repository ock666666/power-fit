import { motion } from 'framer-motion';
import type { WeekPlan } from '../context/AppContext';
import { getExerciseByKey } from '../data/exercises';

const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function PlanSchedule({ weekPlan }: { weekPlan: WeekPlan }) {
  if (!weekPlan || !weekPlan.weekPlan) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-base font-heading font-semibold">本周安排</h3>
      {weekPlan.weekPlan.map((day, i) => (
        <motion.div
          key={i}
          className="liquid-glass rounded-xl p-4"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">
              {DAY_NAMES[day.dayIdx]} · {day.focus}
            </h4>
            <span className="text-xs text-foreground/30">{day.totalSets} 组</span>
          </div>
          <div className="space-y-2">
            {day.exercises.map((ex, j) => {
              const fullEx = getExerciseByKey(ex.muscleId, ex.name);
              return (
                <div key={j} className="flex items-center gap-2 text-sm">
                  <span className="text-base">{fullEx?.emoji || '🏋️'}</span>
                  <span className="text-foreground/70 flex-1">{ex.name}</span>
                  <span className="text-xs text-foreground/30">{ex.sets || `${ex.assignedSets} 组`}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
