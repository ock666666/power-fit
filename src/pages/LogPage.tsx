import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TrainingLog } from '../context/AppContext';
import { useApp } from '../context/AppContext';
import LogFormModal from '../components/LogFormModal';
import StrengthChart from '../components/StrengthChart';
import OneRMCalculator from '../components/OneRMCalculator';
import EmptyState from '../components/EmptyState';

const TABS = [
  { key: 'records', label: '训练记录' },
  { key: 'chart', label: '力量曲线' },
  { key: '1rm', label: '1RM计算' },
] as const;

export default function LogPage() {
  const { trainingLogs, removeTrainingLog } = useApp();
  const [tab, setTab] = useState<string>('records');
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<TrainingLog | null>(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [pageSize, setPageSize] = useState(20);
  const [celebrate, setCelebrate] = useState(false);

  const filtered = trainingLogs
    .filter((l) => {
      if (search && !l.exerciseName.toLowerCase().includes(search.toLowerCase())) return false;
      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  const displayed = filtered.slice(0, pageSize);
  const hasMore = filtered.length > pageSize;

  // Stats
  const totalWorkouts = trainingLogs.length;
  const totalVolume = trainingLogs.reduce((s, l) => s + l.sets.reduce((ss, set) => ss + set.weight * set.reps, 0), 0);

  // Streak: count consecutive days with at least one log, working backwards from today
  const streak = (() => {
    let count = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = new Set(trainingLogs.map((l) => l.date));
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      if (dates.has(key)) count++;
      else break;
    }
    return count;
  })();

  return (
    <div>
      <motion.div className="text-center py-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-xl font-heading font-semibold">📝 训练记录</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-white/5">
        {TABS.map((t) => (
          <button key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 ${
              tab === t.key ? 'border-accent text-accent' : 'border-transparent text-foreground/40 hover:text-foreground/60'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'records' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-accent">{totalWorkouts}</p>
              <p className="text-xs text-foreground/40">总训练次数</p>
            </div>
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-accent">{Math.round(totalVolume).toLocaleString()}</p>
              <p className="text-xs text-foreground/40">总容量(kg)</p>
            </div>
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-accent">{streak}</p>
              <p className="text-xs text-foreground/40">连续打卡</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPageSize(20); }}
              placeholder="🔍 搜索动作..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40" />
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPageSize(20); }}
              className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-2 text-xs outline-none focus:border-accent/40 w-32" />
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPageSize(20); }}
              className="rounded-lg border border-white/10 bg-white/[0.02] px-2 py-2 text-xs outline-none focus:border-accent/40 w-32" />
          </div>

          {displayed.length === 0 ? (
            <EmptyState
              emoji="📝"
              title="暂无训练记录"
              description="记录每次训练的组数和重量，追踪你的力量进步"
              action={
                <button onClick={() => setLogModalOpen(true)}
                  className="liquid-glass rounded-full px-5 py-2.5 text-sm font-medium">
                  + 添加第一条记录
                </button>
              }
            />
          ) : (
            <div className="space-y-2">
              {displayed.map((log) => (
                <div key={log.id} className="liquid-glass rounded-xl p-4 group relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{log.exerciseName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-foreground/30">{log.date}</span>
                      <button
                        onClick={() => { setEditingLog(log); setLogModalOpen(true); }}
                        className="text-xs text-foreground/10 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => removeTrainingLog(log.id)}
                        className="text-xs text-foreground/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {log.sets.map((s, i) => (
                      <span key={i} className="text-xs bg-foreground/[0.03] rounded px-2 py-0.5 text-foreground/50">
                        {s.weight}kg × {s.reps}
                      </span>
                    ))}
                  </div>
                  {log.notes && <p className="text-xs text-foreground/30 mt-2">{log.notes}</p>}
                </div>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center mt-4">
              <button
                onClick={() => setPageSize((p) => p + 20)}
                className="text-sm text-foreground/40 hover:text-foreground transition-colors"
              >
                显示更多（已显示 {pageSize}/{filtered.length}）
              </button>
            </div>
          )}
          <button onClick={() => { setEditingLog(null); setLogModalOpen(true); }}
            className="liquid-glass rounded-full px-6 py-3 text-sm font-medium w-full mt-4 sticky bottom-20">
            + 添加训练
          </button>

          <LogFormModal
            open={logModalOpen}
            onClose={() => { setLogModalOpen(false); setEditingLog(null); }}
            existingLog={editingLog}
            onSaved={() => setCelebrate(true)}
          />

          {/* Celebration */}
          {celebrate && (
            <div className="fixed inset-0 z-[250] pointer-events-none flex items-center justify-center"
              onClick={() => setCelebrate(false)}>
              {['🎉','💪','🔥','🏆','⭐','🎯'].map((e, i) => (
                <motion.span
                  key={i}
                  className="absolute text-3xl"
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0.5, 1.5, 1],
                    x: (i - 2.5) * 60 + Math.random() * 40 - 20,
                    y: -120 - Math.random() * 60,
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  onAnimationComplete={() => { if (i === 5) setCelebrate(false); }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'chart' && <StrengthChart />}
      {tab === '1rm' && <OneRMCalculator />}
    </div>
  );
}
