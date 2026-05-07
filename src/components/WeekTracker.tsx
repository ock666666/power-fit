import { useMemo } from 'react';
import type { WeekPlan } from '../context/AppContext';
import { useApp } from '../context/AppContext';

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

function getMonday(weekOffset: number): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  now.setDate(now.getDate() + diff + weekOffset * 7);
  now.setHours(0, 0, 0, 0);
  return now;
}

function formatDateRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)} - ${fmt(sunday)}`;
}

interface Props {
  weekPlan: WeekPlan;
  weekOffset: number;
}

export default function WeekTracker({ weekPlan, weekOffset }: Props) {
  const { trainingLogs } = useApp();
  const monday = getMonday(weekOffset);

  const doneDays = useMemo(() => {
    const set = new Set<number>();
    trainingLogs.forEach((log) => {
      const logDate = new Date(log.date + 'T00:00:00');
      for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        if (logDate.toDateString() === d.toDateString()) {
          set.add(i);
        }
      }
    });
    return set;
  }, [trainingLogs, monday]);

  const completed = doneDays.size;

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-foreground/70 mb-2">
        {weekOffset === 0 ? '本周训练进度' : weekOffset === 1 ? '下周训练进度' : `${-weekOffset}周前训练进度`}
        <span className="text-xs text-foreground/30 ml-2 font-normal">{formatDateRange(monday)}</span>
      </h3>
      <div className="flex gap-2">
        {DAY_LABELS.map((label, i) => {
          const isTrainingDay = weekPlan.selectedDays.includes(i);
          const isDone = doneDays.has(i);
          return (
            <div key={i} className="flex-1 text-center">
              <div
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                  isDone
                    ? 'bg-accent/20 border border-accent/40 text-accent'
                    : isTrainingDay
                    ? 'border border-dashed border-accent/30 bg-accent/5 text-foreground/50'
                    : 'border border-white/5 bg-white/[0.01] text-foreground/15'
                }`}
              >
                {isDone ? '✓' : label}
              </div>
              <span className="text-[10px] text-foreground/30 mt-1 block">周{label}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-center text-foreground/30 mt-2">
        {weekOffset === 0 ? '本周' : weekOffset === 1 ? '下周' : `${-weekOffset}周前`}已完成 {completed}/7 天
      </p>
    </div>
  );
}
