import { useState } from 'react';
import { motion } from 'framer-motion';
import NutritionGoalForm from '../components/NutritionGoal';
import DietRecordsView from '../components/DietRecords';
import DietPlanView from '../components/DietPlan';

const TABS = [
  { key: 'calc', label: '📊 营养目标' },
  { key: 'record', label: '📝 饮食记录' },
  { key: 'plan', label: '📋 我的计划' },
] as const;

export default function DietPage() {
  const [tab, setTab] = useState<string>('calc');

  return (
    <div>
      <motion.div
        className="text-center py-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-xl font-heading font-semibold">🍽️ 饮食计划</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 ${
              tab === t.key
                ? 'border-accent text-accent'
                : 'border-transparent text-foreground/40 hover:text-foreground/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'calc' && <NutritionGoalForm />}
      {tab === 'record' && <DietRecordsView />}
      {tab === 'plan' && <DietPlanView />}
    </div>
  );
}
