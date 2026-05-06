import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp, type DietRecord } from '../context/AppContext';
import FoodSearchModal from './FoodSearchModal';

const MEALS: { key: keyof DietDay; label: string; emoji: string }[] = [
  { key: 'breakfast', label: '早餐', emoji: '🌅' },
  { key: 'lunch', label: '午餐', emoji: '☀️' },
  { key: 'dinner', label: '晚餐', emoji: '🌙' },
  { key: 'snack', label: '加餐', emoji: '🍪' },
];

interface DietDay { breakfast: DietRecord[]; lunch: DietRecord[]; dinner: DietRecord[]; snack: DietRecord[] }

export default function DietRecordsView() {
  const { dietRecords, updateDietRecord } = useApp();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [foodSearchOpen, setFoodSearchOpen] = useState<keyof DietDay | null>(null);

  const todayKey = date;
  const today: DietDay = dietRecords[todayKey] || { breakfast: [], lunch: [], dinner: [], snack: [] };

  const totals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0;
    for (const meal of Object.values(today)) {
      for (const item of meal) {
        cal += Math.round(item.calories * item.portions);
        p += Math.round(item.protein * item.portions);
        c += Math.round(item.carbs * item.portions);
        f += Math.round(item.fat * item.portions);
      }
    }
    return { cal, p, c, f };
  }, [today]);

  const handleAddFood = (food: DietRecord) => {
    if (!foodSearchOpen) return;
    const current = [...(today[foodSearchOpen] || [])];
    const existing = current.findIndex((r) => r.name === food.name);
    if (existing >= 0) {
      current[existing] = { ...current[existing], portions: current[existing].portions + food.portions };
    } else {
      current.push(food);
    }
    updateDietRecord(todayKey, foodSearchOpen, current);
  };

  const handleRemoveFood = (meal: keyof DietDay, idx: number) => {
    const current = [...(today[meal] || [])];
    current.splice(idx, 1);
    updateDietRecord(todayKey, meal, current);
  };

  return (
    <div>
      {/* Date nav */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button onClick={() => { const d = new Date(date + 'T00:00'); d.setDate(d.getDate() - 1); setDate(d.toISOString().slice(0, 10)); }}
          className="text-lg text-foreground/50 hover:text-foreground">‹</button>
        <span className="text-sm font-medium">{date}</span>
        <button onClick={() => { const d = new Date(date + 'T00:00'); d.setDate(d.getDate() + 1); setDate(d.toISOString().slice(0, 10)); }}
          className="text-lg text-foreground/50 hover:text-foreground">›</button>
      </div>

      {/* Totals */}
      <motion.div className="liquid-glass rounded-xl p-3 grid grid-cols-4 gap-1 text-center mb-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div><p className="text-xs text-foreground/40">热量</p><p className="text-sm font-semibold">{totals.cal}</p></div>
        <div><p className="text-xs text-foreground/40">蛋白质</p><p className="text-sm font-semibold">{totals.p}g</p></div>
        <div><p className="text-xs text-foreground/40">碳水</p><p className="text-sm font-semibold">{totals.c}g</p></div>
        <div><p className="text-xs text-foreground/40">脂肪</p><p className="text-sm font-semibold">{totals.f}g</p></div>
      </motion.div>

      {/* Meals */}
      <div className="space-y-3">
        {MEALS.map((meal) => (
          <div key={meal.key} className="liquid-glass rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{meal.emoji} {meal.label}</span>
              <button onClick={() => setFoodSearchOpen(meal.key)}
                className="text-xs text-accent hover:text-accent/80">+ 添加食物</button>
            </div>
            {(today[meal.key] || []).length === 0 ? (
              <p className="text-xs text-foreground/15 italic">点击 "+ 添加食物" 记录{meal.label}</p>
            ) : (
              <div className="space-y-1.5">
                {(today[meal.key] || []).map((food, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-foreground/70">{food.name} ×{food.portions}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground/30">{Math.round(food.calories * food.portions)}kcal</span>
                      <button onClick={() => handleRemoveFood(meal.key, idx)}
                        className="text-xs text-foreground/20 hover:text-red-400">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <FoodSearchModal
        open={foodSearchOpen !== null}
        onClose={() => setFoodSearchOpen(null)}
        onSelect={handleAddFood}
      />
    </div>
  );
}
