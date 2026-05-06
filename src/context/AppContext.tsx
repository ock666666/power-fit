import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ── Types ──
export interface FavoriteItem {
  muscleId: string;
  name: string;
}

export interface WeekPlanDay {
  dayIdx: number;
  focus: string;
  totalSets: number;
  exercises: PlanExercise[];
}

export interface PlanExercise {
  name: string;
  muscleId: string;
  sets: string;
  assignedSets: number;
  emoji?: string;
}

export interface WeekPlan {
  weekPlan: WeekPlanDay[];
  gender: string;
  goal: string;
  daysPerWeek: number;
  experience: string;
  equipment: string[];
  selectedDays: number[];
}

export interface DietRecord {
  name: string;
  portions: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  primaryNutrient: string;
  grams?: number;
}

export interface DietDay {
  breakfast: DietRecord[];
  lunch: DietRecord[];
  dinner: DietRecord[];
  snack: DietRecord[];
}

export interface NutritionGoal {
  gender: string;
  age: number;
  height: number;
  weight: number;
  bodyFat?: number;
  goal: string;
  trainingDays: number;
  tdee?: number;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
}

export interface TrainingLogSet {
  weight: number;
  reps: number;
}

export interface TrainingLog {
  id: string;
  exerciseName: string;
  exerciseId: string;
  date: string;
  sets: TrainingLogSet[];
  feeling: number;
  notes: string;
  mode: 'weighted' | 'bodyweight';
}

// ── Context ──
interface AppState {
  favorites: FavoriteItem[];
  toggleFavorite: (muscleId: string, name: string) => boolean;
  removeFavorite: (muscleId: string, name: string) => void;

  weekPlan: WeekPlan | null;
  setWeekPlan: (plan: WeekPlan | null) => void;

  dietRecords: Record<string, DietDay>;
  setDietRecords: (records: Record<string, DietDay>) => void;
  updateDietRecord: (date: string, meal: keyof DietDay, records: DietRecord[]) => void;

  nutritionGoal: NutritionGoal | null;
  setNutritionGoal: (goal: NutritionGoal | null) => void;

  trainingLogs: TrainingLog[];
  setTrainingLogs: (logs: TrainingLog[]) => void;
  addTrainingLog: (log: TrainingLog) => void;
  removeTrainingLog: (id: string) => void;

  apiKey: string;
  setApiKey: (key: string) => void;

  theme: 'dark' | 'warm';
  setTheme: (theme: 'dark' | 'warm') => void;
}

const AppContext = createContext<AppState | null>(null);

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() =>
    loadJSON<FavoriteItem[]>('fitness_favorites', []),
  );
  const [weekPlan, _setWeekPlan] = useState<WeekPlan | null>(() =>
    loadJSON<WeekPlan | null>('fitness_weekplan', null),
  );
  const [dietRecords, _setDietRecords] = useState<Record<string, DietDay>>(() =>
    loadJSON<Record<string, DietDay>>('diet_records', {}),
  );
  const [nutritionGoal, _setNutritionGoal] = useState<NutritionGoal | null>(() =>
    loadJSON<NutritionGoal | null>('nutrition_goal', null),
  );
  const [trainingLogs, _setTrainingLogs] = useState<TrainingLog[]>(() =>
    loadJSON<TrainingLog[]>('training_logs', []),
  );
  const [apiKey, _setApiKey] = useState<string>(() =>
    localStorage.getItem('deepseek_api_key') || '',
  );
  const [theme, _setTheme] = useState<'dark' | 'warm'>(() =>
    (localStorage.getItem('themePreference') as 'dark' | 'warm') || 'dark',
  );

  // ── Persisted setters ──
  const setWeekPlan = useCallback((plan: WeekPlan | null) => {
    _setWeekPlan(plan);
    if (plan) localStorage.setItem('fitness_weekplan', JSON.stringify(plan));
    else localStorage.removeItem('fitness_weekplan');
  }, []);

  const setDietRecords = useCallback((records: Record<string, DietDay>) => {
    _setDietRecords(records);
    localStorage.setItem('diet_records', JSON.stringify(records));
  }, []);

  const updateDietRecord = useCallback(
    (date: string, meal: keyof DietDay, records: DietRecord[]) => {
      _setDietRecords((prev) => {
        const next = { ...prev };
        if (!next[date]) next[date] = { breakfast: [], lunch: [], dinner: [], snack: [] };
        next[date] = { ...next[date], [meal]: records };
        localStorage.setItem('diet_records', JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const setNutritionGoal = useCallback((goal: NutritionGoal | null) => {
    _setNutritionGoal(goal);
    if (goal) localStorage.setItem('nutrition_goal', JSON.stringify(goal));
    else localStorage.removeItem('nutrition_goal');
  }, []);

  const setTrainingLogs = useCallback((logs: TrainingLog[]) => {
    _setTrainingLogs(logs);
    localStorage.setItem('training_logs', JSON.stringify(logs));
  }, []);

  const addTrainingLog = useCallback((log: TrainingLog) => {
    _setTrainingLogs((prev) => {
      const next = [...prev, log];
      localStorage.setItem('training_logs', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeTrainingLog = useCallback((id: string) => {
    _setTrainingLogs((prev) => {
      const next = prev.filter((l) => l.id !== id);
      localStorage.setItem('training_logs', JSON.stringify(next));
      return next;
    });
  }, []);

  const setApiKey = useCallback((key: string) => {
    _setApiKey(key);
    localStorage.setItem('deepseek_api_key', key);
  }, []);

  const setTheme = useCallback((t: 'dark' | 'warm') => {
    _setTheme(t);
    localStorage.setItem('themePreference', t);
  }, []);

  // ── Favorites helpers ──
  const toggleFavorite = useCallback(
    (muscleId: string, name: string): boolean => {
      let added = false;
      setFavorites((prev) => {
        const idx = prev.findIndex((f) => f.muscleId === muscleId && f.name === name);
        let next: FavoriteItem[];
        if (idx >= 0) {
          next = [...prev];
          next.splice(idx, 1);
        } else {
          next = [...prev, { muscleId, name }];
          added = true;
        }
        localStorage.setItem('fitness_favorites', JSON.stringify(next));
        return next;
      });
      return added;
    },
    [],
  );

  const removeFavorite = useCallback((muscleId: string, name: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => !(f.muscleId === muscleId && f.name === name));
      localStorage.setItem('fitness_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        favorites, toggleFavorite, removeFavorite,
        weekPlan, setWeekPlan,
        dietRecords, setDietRecords, updateDietRecord,
        nutritionGoal, setNutritionGoal,
        trainingLogs, setTrainingLogs, addTrainingLog, removeTrainingLog,
        apiKey, setApiKey,
        theme, setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
