import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { generateAIPlan, getDefaultDays, type AIState } from '../utils/aiEngine';
import AIResult from '../components/AIResult';

const STEPS = ['🎯 目标', '🔄 分化', '📅 频率', '📅 日期', '💪 经验', '🔧 器械'];
const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function AIPage() {
  const navigate = useNavigate();
  const { setWeekPlan, nutritionGoal } = useApp();

  const [step, setStep] = useState(0);
  const [state, setState] = useState<AIState>({
    gender: nutritionGoal?.gender || '',
    goal: '',
    split: 'ppl',
    days: 3,
    selectedDays: getDefaultDays(3),
    experience: '',
    equipment: ['dumbbell', 'barbell', 'cable', 'bodyweight'],
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<ReturnType<typeof generateAIPlan> | null>(null);

  const update = (partial: Partial<AIState>) => setState((s) => ({ ...s, ...partial }));

  const toggleDay = (day: number) => {
    const idx = state.selectedDays.indexOf(day);
    if (idx >= 0) {
      if (state.selectedDays.length <= 1) return;
      setState((s) => ({
        ...s,
        selectedDays: s.selectedDays.filter((d) => d !== day),
      }));
    } else {
      setState((s) => ({
        ...s,
        selectedDays: [...s.selectedDays, day].sort((a, b) => a - b),
      }));
    }
  };

  const toggleEquip = (val: string) => {
    setState((s) => ({
      ...s,
      equipment: s.equipment.includes(val)
        ? s.equipment.filter((e) => e !== val)
        : [...s.equipment, val],
    }));
  };

  const canNext = () => {
    if (step === 0 && (!state.gender || !state.goal)) return false;
    if (step === 3 && state.selectedDays.length !== state.days) return false;
    if (step === 4 && !state.experience) return false;
    if (step === 5 && state.equipment.length === 0) return false;
    return true;
  };

  const handleNext = () => {
    if (step === 5) {
      setLoading(true);
      setTimeout(() => {
        const p = generateAIPlan(state);
        setPlan(p);
        setLoading(false);
      }, 1200);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSave = () => {
    if (plan) {
      setWeekPlan(plan);
      navigate('/plan');
    }
  };

  if (plan) {
    return <AIResult plan={plan} onRegenerate={() => { setPlan(null); setStep(0); }} onSave={handleSave} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
        <p className="mt-6 text-sm text-foreground/50">🤖 AI正在根据你的需求生成训练计划...</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div className="text-center py-4" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h2 className="text-xl font-heading font-semibold">🤖 AI推荐 — 智能训练计划</h2>
      </motion.div>

      {/* Step indicators */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <span
            key={i}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === step ? 'bg-accent/10 border border-accent/40 text-accent' :
              i < step ? 'bg-accent/5 text-accent/60' : 'bg-white/[0.02] text-foreground/20'
            }`}
          >
            {s}
          </span>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="min-h-[300px]"
      >
        {/* Step 0: Gender & Goal */}
        {step === 0 && (
          <div>
            <h3 className="text-base font-semibold mb-3">你的性别？</h3>
            <div className="flex gap-3 mb-6">
              {['男', '女'].map((g) => (
                <OptionBtn key={g} selected={state.gender === g} onClick={() => update({ gender: g })}>
                  {g === '男' ? '👨' : '👩'} {g}
                </OptionBtn>
              ))}
            </div>
            <h3 className="text-base font-semibold mb-3">你的训练目标是什么？</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { v: '增肌', e: '💪' },
                { v: '减脂', e: '🔥' },
                { v: '塑形', e: '🧘' },
              ].map((o) => (
                <OptionBtn key={o.v} selected={state.goal === o.v} onClick={() => update({ goal: o.v })}>
                  {o.e} {o.v}
                </OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Split */}
        {step === 1 && (
          <div>
            <h3 className="text-base font-semibold mb-4">选择训练分化方式</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { v: 'ppl' as const, t: '推拉腿', d: '推/拉/腿循环，适合3-6天', e: '🔄' },
                { v: 'bro' as const, t: '五分化', d: '胸/背/肩/手臂/腿，适合4-5天', e: '🎯' },
              ].map((o) => (
                <button key={o.v}
                  onClick={() => update({ split: o.v })}
                  className={`rounded-xl p-4 text-left border transition-colors ${
                    state.split === o.v ? 'border-accent/40 bg-accent/10' : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                  }`}>
                  <span className="text-2xl block mb-2">{o.e}</span>
                  <p className={`text-sm font-semibold ${state.split === o.v ? 'text-accent' : 'text-foreground'}`}>{o.t}</p>
                  <p className="text-xs text-foreground/40 mt-1">{o.d}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Days */}
        {step === 2 && (
          <div>
            <h3 className="text-base font-semibold mb-4">每周能训练几天？</h3>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-accent">{state.days}</span>
              <span className="text-sm text-foreground/50">天 / 周</span>
              <input
                type="range"
                min={1}
                max={7}
                value={state.days}
                onChange={(e) => update({
                  days: Number(e.target.value),
                  selectedDays: getDefaultDays(Number(e.target.value)),
                })}
                className="flex-1 accent-accent"
              />
            </div>
          </div>
        )}

        {/* Step 3: Select days */}
        {step === 3 && (
          <div>
            <h3 className="text-base font-semibold mb-4">选择训练日</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {DAY_NAMES.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    state.selectedDays.includes(i)
                      ? 'bg-accent/10 border border-accent/40 text-accent'
                      : 'border border-white/5 bg-white/[0.02] text-foreground/40'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className={`text-xs ${state.selectedDays.length === state.days ? 'text-accent' : 'text-red-400'}`}>
              已选 {state.selectedDays.length}/{state.days} 天
            </p>
          </div>
        )}

        {/* Step 4: Experience */}
        {step === 4 && (
          <div>
            <h3 className="text-base font-semibold mb-3">你的训练经验如何？</h3>
            <div className="flex gap-3">
              {[
                { v: '新手', e: '🌱' },
                { v: '中级', e: '🏃' },
                { v: '老手', e: '🏆' },
              ].map((o) => (
                <OptionBtn key={o.v} selected={state.experience === o.v} onClick={() => update({ experience: o.v })}>
                  {o.e} {o.v}
                </OptionBtn>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Equipment */}
        {step === 5 && (
          <div>
            <h3 className="text-base font-semibold mb-3">你有哪些器械可用？</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { v: 'dumbbell', l: '哑铃' },
                { v: 'barbell', l: '杠铃' },
                { v: 'cable', l: '绳索' },
                { v: 'bodyweight', l: '自重' },
              ].map((eq) => (
                <button
                  key={eq.v}
                  onClick={() => toggleEquip(eq.v)}
                  className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                    state.equipment.includes(eq.v)
                      ? 'bg-accent/10 border border-accent/40 text-accent'
                      : 'border border-white/5 bg-white/[0.02] text-foreground/40'
                  }`}
                >
                  {eq.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Nav buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm text-foreground/40 hover:text-foreground disabled:opacity-20 transition-colors"
        >
          ← 上一步
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className="liquid-glass rounded-full px-6 py-3 text-sm font-medium disabled:opacity-20 transition-opacity"
        >
          {step === 5 ? '🚀 生成计划' : '下一步 →'}
        </button>
      </div>
    </div>
  );
}

function OptionBtn({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-3 text-sm font-medium transition-all ${
        selected
          ? 'bg-accent/10 border border-accent/40 text-accent'
          : 'border border-white/5 bg-white/[0.02] text-foreground/50 hover:text-foreground/70'
      }`}
    >
      {children}
    </button>
  );
}
