import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';

export default function StrengthChart() {
  const { trainingLogs } = useApp();
  const [search, setSearch] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const exerciseNames = useMemo(
    () => [...new Set(trainingLogs.map((l) => l.exerciseName))],
    [trainingLogs],
  );

  const filteredNames = useMemo(
    () => search ? exerciseNames.filter((n) => n.toLowerCase().includes(search.toLowerCase())) : exerciseNames.slice(0, 15),
    [exerciseNames, search],
  );

  const chartData = useMemo(() => {
    if (!selectedName) return [];
    const logs = trainingLogs
      .filter((l) => l.exerciseName === selectedName)
      .sort((a, b) => a.date.localeCompare(b.date));

    return logs.map((l) => {
      const maxWeight = Math.max(...l.sets.map((s) => s.weight), 0);
      const totalVolume = l.sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
      return { date: l.date.slice(5), maxWeight, totalVolume, label: l.date };
    });
  }, [trainingLogs, selectedName]);

  const best = chartData.length > 0 ? Math.max(...chartData.map((d) => d.maxWeight)) : 0;
  const recent = chartData.length > 0 ? chartData[chartData.length - 1].maxWeight : 0;
  const progress = chartData.length >= 2
    ? Math.round(((recent - chartData[0].maxWeight) / Math.max(1, chartData[0].maxWeight)) * 100)
    : 0;

  return (
    <div>
      <div className="relative mb-4">
        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setSelectedName(''); }}
          placeholder="🔍 搜索动作..."
          className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40" />
        {search && !selectedName && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-[#12121a] border border-white/10 rounded-lg max-h-40 overflow-y-auto">
            {filteredNames.length === 0 ? (
              <p className="text-xs text-foreground/30 p-3">无匹配</p>
            ) : (
              filteredNames.map((name) => (
                <button key={name} onClick={() => { setSelectedName(name); setSearch(name); }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-white/[0.02] text-foreground/70">
                  {name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {selectedName && chartData.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-xs text-foreground/40">最好成绩</p>
              <p className="text-lg font-semibold">{best}kg</p>
            </div>
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-xs text-foreground/40">最近</p>
              <p className="text-lg font-semibold">{recent}kg</p>
            </div>
            <div className="liquid-glass rounded-xl p-3 text-center">
              <p className="text-xs text-foreground/40">进步</p>
              <p className={`text-lg font-semibold ${progress >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {progress >= 0 ? '+' : ''}{progress}%
              </p>
            </div>
          </div>

          <div className="liquid-glass rounded-xl p-4">
            <h4 className="text-sm font-semibold mb-4">{selectedName} - 最大重量趋势</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
                <Tooltip
                  contentStyle={{ background: '#12121a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                />
                <Line type="monotone" dataKey="maxWeight" stroke="#00e5ff" strokeWidth={2} dot={{ r: 3, fill: '#00e5ff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      ) : selectedName ? (
        <p className="text-center text-foreground/30 py-12 text-sm">暂无该动作的训练数据</p>
      ) : (
        <p className="text-center text-foreground/30 py-12 text-sm">搜索并选择一个动作查看力量曲线</p>
      )}
    </div>
  );
}
