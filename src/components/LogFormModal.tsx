import { useState, useMemo, useEffect } from 'react';
import Modal from './Modal';
import { allExercises, type Exercise, getExerciseByKey } from '../data/exercises';
import { useApp, type TrainingLogSet, type TrainingLog } from '../context/AppContext';

const FEELINGS = [
  { v: 1, e: '😫', l: '力竭' },
  { v: 2, e: '😩', l: '很累' },
  { v: 3, e: '😐', l: '一般' },
  { v: 4, e: '💪', l: '不错' },
  { v: 5, e: '🔥', l: '超棒' },
];

interface Props {
  open: boolean;
  onClose: () => void;
  existingLog?: TrainingLog | null;
  onSaved?: () => void;
}

export default function LogFormModal({ open, onClose, existingLog, onSaved }: Props) {
  const { addTrainingLog, updateTrainingLog } = useApp();
  const [search, setSearch] = useState('');
  const [selectedEx, setSelectedEx] = useState<Exercise | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [sets, setSets] = useState<TrainingLogSet[]>([{ weight: 0, reps: 10 }]);
  const [feeling, setFeeling] = useState(4);
  const [notes, setNotes] = useState('');

  const isEdit = !!existingLog;

  // Pre-fill form when editing
  useEffect(() => {
    if (existingLog) {
      const ex = getExerciseByKey('chest', existingLog.exerciseName) ||
        allExercises.find((e) => e.name === existingLog.exerciseName);
      if (ex) setSelectedEx(ex);
      setDate(existingLog.date);
      setSets(existingLog.sets.length > 0 ? existingLog.sets : [{ weight: 0, reps: 10 }]);
      setFeeling(existingLog.feeling);
      setNotes(existingLog.notes);
    }
  }, [existingLog]);

  const filtered = useMemo(() => {
    if (!search.trim()) return allExercises.slice(0, 20);
    return allExercises.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())).slice(0, 20);
  }, [search]);

  const updateSet = (idx: number, field: keyof TrainingLogSet, val: number) => {
    setSets((s) => s.map((set, i) => (i === idx ? { ...set, [field]: val } : set)));
  };

  const addSet = () => setSets((s) => [...s, { weight: sets[sets.length - 1]?.weight || 0, reps: 10 }]);
  const removeSet = (idx: number) => setSets((s) => s.filter((_, i) => i !== idx));

  const handleSave = () => {
    if (!selectedEx) return;
    const logData = {
      exerciseName: selectedEx.name,
      exerciseId: selectedEx.id,
      date,
      sets: sets.filter((s) => s.weight > 0 || s.reps > 0),
      feeling,
      notes,
      mode: (selectedEx.resistanceType === 'bodyweight' ? 'bodyweight' : 'weighted') as 'weighted' | 'bodyweight',
    };

    if (isEdit) {
      updateTrainingLog({ ...logData, id: existingLog!.id });
    } else {
      addTrainingLog({
        ...logData,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      });
    }

    setSelectedEx(null);
    setSearch('');
    setSets([{ weight: 0, reps: 10 }]);
    setFeeling(4);
    setNotes('');
    onClose();
    onSaved?.();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-heading font-semibold mb-4">
        {isEdit ? '✏️ 编辑训练记录' : '📝 添加训练记录'}
      </h3>

      {!isEdit && (
        <>
          <label className="block text-sm text-foreground/60 mb-1">动作</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索动作..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-2" />

          {search && !selectedEx && (
            <div className="max-h-40 overflow-y-auto space-y-0.5 mb-3">
              {filtered.map((ex) => (
                <button key={ex.id} onClick={() => { setSelectedEx(ex); setSearch(''); }}
                  className="w-full text-left rounded-lg p-2 text-sm hover:bg-white/[0.02] flex items-center gap-2">
                  <span>{ex.emoji}</span>
                  <span className="text-foreground/70">{ex.name}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedEx && (
        <div className="rounded-lg bg-accent/5 border border-accent/20 px-3 py-2 text-sm mb-3 flex items-center gap-2">
          <span>{selectedEx.emoji}</span>
          <span className="text-accent">{selectedEx.name}</span>
          <button onClick={() => setSelectedEx(null)} className="ml-auto text-foreground/30 hover:text-foreground">✕</button>
        </div>
      )}

      <label className="block text-sm text-foreground/60 mb-1">日期</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-4" />

      <label className="block text-sm text-foreground/60 mb-2">训练组</label>
      <div className="space-y-2 mb-3">
        {sets.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-foreground/30 w-8">第{i + 1}组</span>
            <input type="number" value={s.weight || ''} onChange={(e) => updateSet(i, 'weight', Number(e.target.value))}
              placeholder="重量" min={0} step={0.5}
              className="w-20 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5 text-sm outline-none focus:border-accent/40" />
            <span className="text-xs text-foreground/30">kg</span>
            <input type="number" value={s.reps || ''} onChange={(e) => updateSet(i, 'reps', Number(e.target.value))}
              placeholder="次数" min={0}
              className="w-16 rounded-lg border border-white/10 bg-white/[0.02] px-2 py-1.5 text-sm outline-none focus:border-accent/40" />
            <span className="text-xs text-foreground/30">次</span>
            {sets.length > 1 && (
              <button onClick={() => removeSet(i)} className="text-xs text-foreground/20 hover:text-red-400">✕</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addSet} className="text-xs text-accent hover:text-accent/80 mb-4">+ 添加一组</button>

      <label className="block text-sm text-foreground/60 mb-2">训练感受</label>
      <div className="flex gap-2 mb-4">
        {FEELINGS.map((f) => (
          <button key={f.v} onClick={() => setFeeling(f.v)}
            className={`flex-1 flex flex-col items-center rounded-lg py-2 text-xs transition-colors ${
              feeling === f.v ? 'bg-accent/10 border border-accent/30' : 'border border-white/5 opacity-50 hover:opacity-80'
            }`}>
            <span className="text-lg">{f.e}</span>
            <span className="text-[10px] text-foreground/40">{f.l}</span>
          </button>
        ))}
      </div>

      <label className="block text-sm text-foreground/60 mb-1">备注</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
        placeholder="记录今天的训练感受..."
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-4 h-20 resize-none" />

      <div className="flex gap-3">
        <button onClick={onClose}
          className="flex-1 rounded-full border border-white/10 py-3 text-sm text-foreground/50 hover:text-foreground">取消</button>
        <button onClick={handleSave} disabled={!selectedEx}
          className="flex-1 liquid-glass rounded-full py-3 text-sm font-medium disabled:opacity-20">
          {isEdit ? '更新记录' : '保存记录'}
        </button>
      </div>
    </Modal>
  );
}
