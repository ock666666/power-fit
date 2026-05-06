import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp, type NutritionGoal } from '../context/AppContext';

export default function NutritionGoalForm() {
  const { nutritionGoal, setNutritionGoal } = useApp();
  const [edit, setEdit] = useState(!nutritionGoal);
  const [form, setForm] = useState<NutritionGoal>(nutritionGoal || {
    gender: '', age: 25, height: 170, weight: 70, bodyFat: undefined, goal: '', trainingDays: 3,
  });

  useEffect(() => { if (nutritionGoal) setForm(nutritionGoal); }, [nutritionGoal]);

  const tdee = form.gender && form.goal
    ? Math.round(
        (form.gender === '男' ? 10 * form.weight + 6.25 * form.height - 5 * form.age + 5 :
        10 * form.weight + 6.25 * form.height - 5 * form.age - 161) * (1.2 + form.trainingDays * 0.1),
      )
    : null;

  const targetCals = tdee
    ? form.goal === '增肌' ? tdee + 300 : form.goal === '减脂' ? tdee - 400 : tdee
    : null;

  const targetProtein = targetCals ? Math.round(form.weight * (form.goal === '增肌' ? 2.2 : 1.8)) : null;
  const targetFat = targetCals ? Math.round((targetCals * 0.25) / 9) : null;
  const targetCarbs = targetCals ? Math.round((targetCals - (targetProtein || 0) * 4 - (targetFat || 0) * 9) / 4) : null;

  const handleSave = () => {
    const goal: NutritionGoal = { ...form, tdee: tdee ?? undefined, targetCalories: targetCals ?? undefined, targetProtein: targetProtein ?? undefined, targetCarbs: targetCarbs ?? undefined, targetFat: targetFat ?? undefined };
    setNutritionGoal(goal);
    setEdit(false);
  };

  const update = (p: Partial<NutritionGoal>) => setForm((f) => ({ ...f, ...p }));

  if (!edit && nutritionGoal) {
    return (
      <div className="liquid-glass rounded-2xl p-6 text-center">
        <h3 className="text-lg font-semibold mb-4">🎯 我的营养目标</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Stat label="每日热量" value={`${nutritionGoal.targetCalories} kcal`} />
          <Stat label="蛋白质" value={`${nutritionGoal.targetProtein}g`} />
          <Stat label="碳水" value={`${nutritionGoal.targetCarbs}g`} />
          <Stat label="脂肪" value={`${nutritionGoal.targetFat}g`} />
        </div>
        <button onClick={() => setEdit(true)} className="mt-4 text-xs text-accent">✏️ 修改设置</button>
      </div>
    );
  }

  return (
    <motion.div className="space-y-4" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
      <p className="text-sm text-foreground/50">填写身体数据，获取个性化营养建议</p>

      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2">
          {['男', '女'].map((g) => (
            <button key={g} onClick={() => update({ gender: g })}
              className={`rounded-lg px-4 py-2 text-sm border ${form.gender === g ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/5 text-foreground/40'}`}>
              {g === '男' ? '👨' : '👩'} {g}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Field label="年龄" value={form.age} onChange={(v) => update({ age: v })} min={10} max={99} />
        <Field label="身高(cm)" value={form.height} onChange={(v) => update({ height: v })} min={100} max={250} />
        <Field label="体重(kg)" value={form.weight} onChange={(v) => update({ weight: v })} min={30} max={200} />
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-2">
          {['增肌', '减脂', '维持'].map((g) => (
            <button key={g} onClick={() => update({ goal: g })}
              className={`rounded-lg px-4 py-2 text-sm border ${form.goal === g ? 'border-accent/40 bg-accent/10 text-accent' : 'border-white/5 text-foreground/40'}`}>
              {g === '增肌' ? '💪' : g === '减脂' ? '🔥' : '⚖️'} {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-foreground/60 mb-1">每周训练天数: {form.trainingDays}</label>
        <input type="range" min={1} max={7} value={form.trainingDays}
          onChange={(e) => update({ trainingDays: Number(e.target.value) })} className="w-full accent-accent" />
      </div>

      {tdee && (
        <motion.div className="liquid-glass rounded-xl p-4 grid grid-cols-2 gap-3 text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Stat label="TDEE" value={`${tdee} kcal`} />
          <Stat label="目标热量" value={`${targetCals} kcal`} />
          <Stat label="蛋白质" value={`${targetProtein}g`} />
          <Stat label="碳水" value={`${targetCarbs}g`} />
          <Stat label="脂肪" value={`${targetFat}g`} />
        </motion.div>
      )}

      <button onClick={handleSave}
        className="liquid-glass rounded-full px-6 py-3 text-sm font-medium w-full">
        💾 保存设置
      </button>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-foreground/40">{label}</p>
      <p className="text-foreground font-semibold">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number }) {
  return (
    <div>
      <label className="block text-xs text-foreground/40 mb-1">{label}</label>
      <input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} min={min} max={max}
        className="w-24 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-foreground outline-none focus:border-accent/40" />
    </div>
  );
}
