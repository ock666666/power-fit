import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getExerciseByKey, exercisesByMuscle } from '../data/exercises';
import WeekTracker from '../components/WeekTracker';
import PlanSchedule from '../components/PlanSchedule';
import EmptyState from '../components/EmptyState';

export default function PlanPage() {
  const navigate = useNavigate();
  const { weekPlan, setWeekPlan, favorites, removeFavorite } = useApp();

  const handleReplaceExercise = (dayIdx: number, exIdx: number) => {
    if (!weekPlan) return;
    const day = weekPlan.weekPlan[dayIdx];
    if (!day) return;
    const oldEx = day.exercises[exIdx];
    if (!oldEx) return;

    // Get alternatives from same muscle group
    const pool = exercisesByMuscle[oldEx.muscleId] || [];
    const usedNames = new Set(day.exercises.map((e) => e.name));
    const candidates = pool.filter((e) => !usedNames.has(e.name) && e.name !== oldEx.name);

    if (candidates.length === 0) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];

    const newPlan = { ...weekPlan };
    const newDay = { ...day };
    const newExercises = [...day.exercises];
    newExercises[exIdx] = {
      name: pick.name,
      muscleId: pick.muscleId,
      sets: `${oldEx.assignedSets}组×15-20次`,
      assignedSets: oldEx.assignedSets,
      emoji: pick.emoji,
    };
    newDay.exercises = newExercises;
    newPlan.weekPlan = [...newPlan.weekPlan];
    newPlan.weekPlan[dayIdx] = newDay;
    setWeekPlan(newPlan);
  };

  return (
    <div>
      <motion.div
        className="text-center py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-xl font-heading font-semibold">📋 我的训练计划</h1>
      </motion.div>

      {weekPlan ? (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => { if (confirm('确定要清空训练计划吗？')) setWeekPlan(null); }}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              🗑️ 清空计划
            </button>
          </div>
          <WeekTracker weekPlan={weekPlan} />
          <PlanSchedule weekPlan={weekPlan} onReplaceExercise={handleReplaceExercise} />

          <div className="mt-8">
            <h3 className="text-base font-heading font-semibold mb-3">⭐ 我的收藏</h3>
            {favorites.length === 0 ? (
              <EmptyState emoji="⭐" title="暂无收藏的动作" description="在训练页面点击 ★ 可以收藏动作，方便快速查看" />
            ) : (
              <div className="space-y-2">
                {favorites.map((f) => {
                  const ex = getExerciseByKey(f.muscleId, f.name);
                  if (!ex) return null;
                  return (
                    <button
                      key={`${f.muscleId}-${f.name}`}
                      onClick={() => navigate(`/training/${f.muscleId}`)}
                      className="liquid-glass rounded-xl p-3 flex items-center gap-3 w-full text-left group"
                    >
                      <span className="text-2xl">{ex.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{ex.name}</p>
                        <p className="text-xs text-foreground/40">{ex.sets}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFavorite(f.muscleId, f.name); }}
                        className="text-xs text-foreground/20 hover:text-red-400 transition-colors"
                      >
                        取消收藏
                      </button>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          emoji="📋"
          title="还没有训练计划"
          description="让 AI 根据你的目标和器械，生成一份专属的每周训练安排"
          action={
            <button
              onClick={() => navigate('/ai')}
              className="liquid-glass rounded-full px-6 py-3 text-sm font-medium"
            >
              🤖 AI 生成专属计划
            </button>
          }
        />
      )}
    </div>
  );
}
