import { useEffect, useRef } from 'react';
import { supabase, getUserId } from '../lib/supabase';

/**
 * One-time migration + background upload on first mount.
 * Does NOT reload the page — just ensures cloud has the latest data.
 */
export function useSupabaseSync() {
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    (async () => {
      const uid = await getUserId();
      if (!uid) return;

      try {
        // Upload favorites
        const favs = JSON.parse(localStorage.getItem('fitness_favorites') || '[]');
        for (const f of favs) {
          await supabase.from('user_favorites').upsert({
            action_name: f.name,
            category: f.muscleId,
          }, { onConflict: 'action_name' }).select();
        }

        // Upload week plan
        const plan = localStorage.getItem('fitness_weekplan');
        if (plan) {
          await supabase.from('workout_plans').upsert({
            id: 1,
            plan_data: JSON.parse(plan),
          });
        }

        // Upload nutrition goal
        const goal = localStorage.getItem('nutrition_goal');
        if (goal) {
          await supabase.from('nutrition_goals').upsert({
            id: 1,
            goal_data: JSON.parse(goal),
          });
        }

        // Upload diet records (one per date/meal)
        const dietRecs = JSON.parse(localStorage.getItem('diet_records') || '{}');
        for (const [date, meals] of Object.entries(dietRecs)) {
          for (const [meal, items] of Object.entries(meals as Record<string, any[]>)) {
            for (const item of items) {
              await supabase.from('diet_records').upsert({
                date,
                meal,
                food_name: item.name,
                portions: item.portions || 1,
                unit: item.unit || '',
                calories: item.calories || 0,
                protein: item.protein || 0,
                carbs: item.carbs || 0,
                fat: item.fat || 0,
                category: item.category || '',
                primary_nutrient: item.primaryNutrient || 'protein',
              });
            }
          }
        }
      } catch (e) {
        console.warn('Supabase 数据同步失败', e);
      }
    })();
  }, []);
}
