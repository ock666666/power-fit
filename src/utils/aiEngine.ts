import { exercisesByMuscle, type Exercise } from '../data/exercises';
import type { WeekPlan, PlanExercise } from '../context/AppContext';

// ── Exercise annotations ──
const exAnnotations: Record<string, { type: 'compound' | 'isolation'; level: 'basic' | 'intermediate' }> = {
  '平板杠铃卧推':{type:'compound',level:'basic'}, '上斜杠铃卧推':{type:'compound',level:'intermediate'},
  '上斜哑铃卧推':{type:'compound',level:'intermediate'}, '上斜哑铃飞鸟':{type:'isolation',level:'intermediate'},
  '低位绳索夹胸':{type:'isolation',level:'intermediate'}, '平板哑铃卧推':{type:'compound',level:'intermediate'},
  '哑铃飞鸟':{type:'isolation',level:'intermediate'}, '器械推胸':{type:'compound',level:'basic'},
  '下斜杠铃卧推':{type:'compound',level:'intermediate'},
  '双杠臂屈伸':{type:'compound',level:'intermediate'}, '高位绳索夹胸':{type:'isolation',level:'intermediate'},
  '俯卧撑':{type:'compound',level:'basic'}, '跪姿俯卧撑':{type:'compound',level:'basic'},
  '哑铃仰卧屈臂上拉':{type:'compound',level:'intermediate'},
  '引体向上':{type:'compound',level:'basic'}, '杠铃耸肩':{type:'isolation',level:'basic'},
  '哑铃耸肩':{type:'isolation',level:'basic'}, '面拉':{type:'isolation',level:'intermediate'},
  '直立划船':{type:'compound',level:'intermediate'}, '高位下拉':{type:'compound',level:'basic'},
  '杠铃划船':{type:'compound',level:'basic'}, '哑铃划船':{type:'compound',level:'intermediate'},
  '坐姿划船':{type:'compound',level:'basic'}, '硬拉':{type:'compound',level:'intermediate'},
  '罗马尼亚硬拉':{type:'compound',level:'intermediate'}, '早安式':{type:'compound',level:'intermediate'},
  '超人式':{type:'isolation',level:'basic'},
  '杠铃深蹲':{type:'compound',level:'basic'}, '腿举':{type:'compound',level:'basic'},
  '箭步蹲':{type:'compound',level:'basic'}, '腿屈伸':{type:'isolation',level:'basic'},
  '腿弯举':{type:'isolation',level:'basic'}, '直腿硬拉':{type:'compound',level:'intermediate'},
  '滑垫弯腿':{type:'isolation',level:'intermediate'}, '站姿提踵':{type:'isolation',level:'basic'},
  '坐姿提踵':{type:'isolation',level:'basic'}, '农夫行走':{type:'compound',level:'basic'},
  '杠铃推举':{type:'compound',level:'basic'}, '哑铃推举':{type:'compound',level:'intermediate'},
  '前平举':{type:'isolation',level:'basic'}, '侧平举':{type:'isolation',level:'basic'},
  '单臂侧平举':{type:'isolation',level:'basic'}, '俯身飞鸟':{type:'isolation',level:'intermediate'},
  '反向蝴蝶机':{type:'isolation',level:'basic'},
  '杠铃弯举':{type:'isolation',level:'basic'}, '锤式弯举':{type:'isolation',level:'basic'},
  '集中弯举':{type:'isolation',level:'basic'}, '斜托弯举':{type:'isolation',level:'basic'},
  '绳索下压':{type:'isolation',level:'basic'}, '窄距卧推':{type:'compound',level:'intermediate'},
  '法式弯举':{type:'isolation',level:'intermediate'}, '臂屈伸':{type:'isolation',level:'intermediate'},
  '腕弯举':{type:'isolation',level:'basic'}, '反向腕弯举':{type:'isolation',level:'basic'},
  '卷腹':{type:'isolation',level:'basic'}, '仰卧抬腿':{type:'isolation',level:'intermediate'},
  '卷腹机':{type:'isolation',level:'basic'}, '俄罗斯转体':{type:'isolation',level:'basic'},
  '侧平板':{type:'isolation',level:'basic'}, '伐木式':{type:'isolation',level:'intermediate'},
  '平板支撑':{type:'isolation',level:'basic'}, '鸟狗式':{type:'isolation',level:'basic'},
  '死虫式':{type:'isolation',level:'basic'}, '健身球卷腹':{type:'isolation',level:'basic'},
  '臀推':{type:'isolation',level:'intermediate'}, '杠铃臀桥':{type:'isolation',level:'basic'},
  '单腿臀桥':{type:'isolation',level:'intermediate'}, '深蹲':{type:'compound',level:'basic'},
  '侧卧抬腿':{type:'isolation',level:'basic'}, '蚌式开合':{type:'isolation',level:'basic'},
  '坐姿髋外展':{type:'isolation',level:'basic'}, '弹力带行走':{type:'isolation',level:'basic'},
  '单腿硬拉':{type:'compound',level:'intermediate'},
  '保加利亚分腿蹲':{type:'compound',level:'intermediate'}, '弓步走':{type:'compound',level:'basic'},
  '箱跳':{type:'compound',level:'intermediate'}, '壶铃摇摆':{type:'compound',level:'intermediate'},
  '臀桥':{type:'isolation',level:'basic'}, '坐姿腿弯举':{type:'isolation',level:'basic'},
};

const isCompound = (n: string) => (exAnnotations[n] || {}).type === 'compound';
const isIsolation = (n: string) => (exAnnotations[n] || {}).type === 'isolation';
const exLevel = (n: string) => (exAnnotations[n] || {}).level || 'basic';

const shuffle = <T>(a: T[]) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ── Goal configs ──
const goalConfig: Record<string, { sets: number; repDisplay: string; rest: string; weekPattern: string[] }> = {
  '增肌': { sets: 4, repDisplay: '6-12次', rest: '90-120秒', weekPattern: ['胸+三头','背+二头','腿+肩','休息','胸+三头','背+二头','腿+肩'] },
  '减脂': { sets: 3, repDisplay: '15-20次', rest: '30-45秒', weekPattern: ['全身','上肢','下肢','全身','休息','全身','休息'] },
  '塑形': { sets: 3, repDisplay: '12-15次', rest: '60秒', weekPattern: ['推','拉','腿','推','拉','腿','休息'] },
};

// ── Day-name → muscle groups ──
const dayMuscleMap: Record<string, { groups: string[]; primary: string }> = {
  '胸+三头': { groups: ['chest','arms'], primary: 'chest' },
  '背+二头': { groups: ['back','arms'], primary: 'back' },
  '腿+肩': { groups: ['legs','shoulders'], primary: 'legs' },
  '全身': { groups: ['chest','back','legs','shoulders','arms','abs','glutes'], primary: 'chest' },
  '上肢': { groups: ['chest','back','shoulders','arms'], primary: 'chest' },
  '下肢': { groups: ['legs','glutes','abs'], primary: 'legs' },
  '推': { groups: ['chest','shoulders','arms'], primary: 'chest' },
  '拉': { groups: ['back','arms'], primary: 'back' },
  '腿': { groups: ['legs','glutes','abs'], primary: 'legs' },
  '臀': { groups: ['glutes'], primary: 'glutes' },
  '臀+腿': { groups: ['glutes','legs'], primary: 'glutes' },
  '臀+核心': { groups: ['glutes','abs'], primary: 'glutes' },
};

const experienceConfig: Record<string, { allowedLevels: string[]; allowedDiff: string[] }> = {
  '新手': { allowedLevels: ['basic'], allowedDiff: ['初级'] },
  '中级': { allowedLevels: ['basic','intermediate'], allowedDiff: ['初级','中级'] },
  '老手': { allowedLevels: ['basic','intermediate'], allowedDiff: ['初级','中级','高级'] },
};

// ── Schedule generation ──
function getWeeklySchedule(goal: string, days: number, selectedDays: number[]): (string | null)[] {
  const pattern = goalConfig[goal].weekPattern.filter((d) => d !== '休息');
  const seq: string[] = [];
  for (let i = 0; i < days; i++) seq.push(pattern[i % pattern.length]);
  const week: (string | null)[] = Array(7).fill(null);
  for (let i = 0; i < selectedDays.length; i++) week[selectedDays[i]] = seq[i];
  return week;
}

function selfCheckSchedule(week: (string | null)[]): (string | null)[] {
  const freq: Record<string, number> = {};
  for (const focus of week) {
    if (!focus) continue;
    const info = dayMuscleMap[focus];
    if (!info) continue;
    for (const g of info.groups) freq[g] = (freq[g] || 0) + 1;
  }
  const overused = Object.entries(freq).filter(([_, c]) => c > 3).map(([g]) => g);
  if (overused.length === 0) return week;
  const allFocuses = Object.keys(dayMuscleMap);
  for (const mg of overused) {
    let fixed = 0;
    for (let d = 0; d < week.length && fixed < 2; d++) {
      if (!week[d]) continue;
      const info = dayMuscleMap[week[d]!];
      if (info && info.groups.includes(mg)) {
        const alt = allFocuses.find((f) => {
          const fi = dayMuscleMap[f];
          return fi && !fi.groups.includes(mg) && fi.primary !== mg && f !== week[d];
        });
        if (alt) { week[d] = alt; fixed++; }
      }
    }
  }
  return week;
}

function getFemaleSchedule(days: number, selectedDays: number[]): (string | null)[] {
  const patterns: Record<number, string[]> = {
    1: ['全身'], 2: ['下肢','上肢'], 3: ['下肢','上肢','全身'],
    4: ['下肢','上肢','休息','下肢','上肢','休息','休息'],
    5: ['下肢','上肢','全身','下肢','上肢','休息','休息'],
    6: ['下肢','上肢','全身','下肢','上肢','全身','休息'],
    7: ['下肢','上肢','全身','下肢','上肢','全身','全身'],
  };
  const pattern = patterns[days] || patterns[3];
  const pool = pattern.filter((d) => d !== '休息');
  const seq: string[] = [];
  for (let i = 0; i < days; i++) seq.push(pool[i % pool.length]);
  const week: (string | null)[] = Array(7).fill(null);
  for (let i = 0; i < selectedDays.length; i++) week[selectedDays[i]] = seq[i];
  return week;
}

// ── Build exercise pool ──
function buildPool(equipment: string[], experience: string) {
  const expCfg = experienceConfig[experience];
  const pool: Record<string, Exercise[]> = {};
  for (const mid of Object.keys(exercisesByMuscle)) {
    pool[mid] = (exercisesByMuscle[mid] || []).filter(
      (ex) => equipment.includes(ex.equipment) && expCfg.allowedDiff.includes(ex.difficulty),
    );
  }
  return pool;
}

function getAvailable(mid: string, pool: Record<string, Exercise[]>, expCfg: { allowedLevels: string[] }) {
  return (pool[mid] || []).filter((ex) => expCfg.allowedLevels.includes(exLevel(ex.name)));
}

const pickOne = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

function isFemaleBannedArm(name: string) {
  return name.includes('弯举') || name.includes('下压') || name.includes('腕弯举') || name === '窄距卧推';
}

// ── Main exercise selection ──
function selectExercisesForDay(
  focusName: string, pool: Record<string, Exercise[]>,
  expCfg: { allowedLevels: string[] }, gCfg: { sets: number },
  gender: string,
) {
  const dayInfo = dayMuscleMap[focusName];
  if (!dayInfo) return [];
  const { groups, primary } = dayInfo;
  const selected: (Exercise & { role: string; assignedSets: number })[] = [];
  const used = new Set<string>();

  function avail(mid: string) {
    let arr = getAvailable(mid, pool, expCfg).map((e) => ({ ...e, muscleId: mid }));
    if (gender === '女') {
      const rec = arr.filter((e) => e.femaleRecommended);
      if (rec.length >= 1) arr = rec;
      const o: Record<string, number> = { '初级': 0, '中级': 1, '高级': 2 };
      arr.sort((a, b) => (o[a.difficulty] || 1) - (o[b.difficulty] || 1));
      arr = arr.filter((e) => !isFemaleBannedArm(e.name));
    }
    return arr;
  }

  function pickOneFF<T extends { femaleRecommended?: boolean }>(arr: T[]): T {
    if (gender !== '女' || arr.length === 0) return pickOne(arr);
    const ff = arr.filter((e) => e.femaleRecommended);
    if (ff.length > 0) return pickOne(ff);
    return pickOne(arr);
  }

  function add(ex: Exercise & { muscleId?: string } | undefined, role: string): boolean {
    if (!ex || used.has(ex.name)) return false;
    selected.push({ ...ex, muscleId: ex.muscleId || '', role, assignedSets: gCfg.sets });
    used.add(ex.name);
    return true;
  }

  if (gender === '女') {
    const primCompounds = avail(primary).filter((e) => isCompound(e.name));
    if (primCompounds.length > 0) add(pickOneFF(primCompounds), '主项');
    else { const fb = avail(primary); if (fb.length > 0) add(pickOneFF(fb), '主项'); }

    const auxPool: (Exercise & { muscleId: string })[] = [];
    for (const g of groups) {
      for (const ex of avail(g)) {
        if (!used.has(ex.name) && ex.femaleRecommended) auxPool.push(ex);
      }
    }
    const cableAux = auxPool.filter((e) => e.equipment === 'cable');
    const otherAux = auxPool.filter((e) => e.equipment !== 'cable');
    shuffle(cableAux); shuffle(otherAux);
    const sortedAuxPool = [...cableAux, ...otherAux];
    let auxAdded = 0;
    for (const ex of sortedAuxPool) { if (auxAdded >= 2) break; if (add(ex, '辅助')) auxAdded++; }

    if (!selected.some((e) => e.role === '孤立')) {
      const isoPool: (Exercise & { muscleId: string })[] = [];
      for (const g of groups) {
        for (const ex of avail(g)) {
          if (!used.has(ex.name) && isIsolation(ex.name) && ex.femaleRecommended) isoPool.push(ex);
        }
      }
      if (isoPool.length > 0) add(pickOneFF(isoPool), '孤立');
    }

    if (selected.length < 3) {
      const more = avail(primary).filter((e) => !used.has(e.name));
      shuffle(more);
      for (const ex of more) { if (selected.length >= 3) break; add(ex, '辅助'); }
    }
    return selected;
  }

  // Male logic
  const primCompounds = avail(primary).filter((e) => isCompound(e.name));
  if (primCompounds.length > 0) add(pickOneFF(primCompounds), '主项');
  else { const fallback = avail(primary); if (fallback.length > 0) add(pickOneFF(fallback), '主项'); }

  if (!selected.some((e) => e.role === '孤立')) {
    const isolations: (Exercise & { muscleId: string })[] = [];
    for (const g of groups) isolations.push(...avail(g).filter((e) => isIsolation(e.name) && !used.has(e.name)));
    if (isolations.length > 0) add(pickOneFF(isolations), '孤立');
  }

  const remaining: (Exercise & { muscleId: string })[] = [];
  for (const g of groups) remaining.push(...avail(g).filter((e) => !used.has(e.name)));
  shuffle(remaining);
  const target = Math.min(6, Math.max(4, groups.length + 2));
  for (const ex of remaining) { if (selected.length >= target) break; add(ex, '辅助'); }

  if (selected.length < 4) {
    const more = avail(primary).filter((e) => !used.has(e.name));
    shuffle(more);
    for (const ex of more) { if (selected.length >= 4) break; add(ex, '辅助'); }
  }

  return selected;
}

// ── Main generate function ──
export interface AIState {
  gender: string;
  goal: string;
  days: number;
  selectedDays: number[];
  experience: string;
  equipment: string[];
}

export function getDefaultDays(count: number): number[] {
  if (count === 1) return [3];
  if (count === 7) return [0, 1, 2, 3, 4, 5, 6];
  const step = 7 / count;
  const result: number[] = [];
  for (let i = 0; i < count; i++) result.push(Math.round(i * step));
  return result;
}

export function generateAIPlan(state: AIState): WeekPlan {
  const { goal, days, gender } = state;
  const gCfg = goalConfig[goal];
  const adjCfg = gender === '女' ? { ...gCfg, sets: 3, repDisplay: '12-15次', rest: '60-90秒' } : gCfg;
  const expCfg = experienceConfig[state.experience];
  const pool = buildPool(state.equipment, state.experience);

  let schedule = gender === '女'
    ? getFemaleSchedule(days, state.selectedDays)
    : getWeeklySchedule(goal, days, state.selectedDays);
  schedule = gender === '女' ? schedule : selfCheckSchedule(schedule);

  const weekPlan = schedule.map((focus, dayIdx) => {
    if (!focus) return { dayIdx, focus: '', totalSets: 0, exercises: [] as PlanExercise[] };
    const exercises = selectExercisesForDay(focus, pool, expCfg, adjCfg, gender);
    const totalSets = exercises.reduce((s, e) => s + e.assignedSets, 0);
    return {
      dayIdx,
      focus,
      totalSets,
      exercises: exercises.map((e) => ({
        name: e.name,
        muscleId: e.muscleId,
        sets: `${e.assignedSets}组×${adjCfg.repDisplay}`,
        assignedSets: e.assignedSets,
        emoji: e.emoji,
      })),
    };
  });

  // Pad days with fewer than target
  for (const day of weekPlan) {
    if (!day.focus) continue;
    const dayInfo = dayMuscleMap[day.focus];
    if (!dayInfo) continue;
    const dayMin = gender === '女' && dayInfo.primary === 'chest' ? 2 : gender === '女' ? 3 : 4;
    if (day.exercises.length >= dayMin) continue;
    const used = new Set(day.exercises.map((e) => e.name));
    const extras: (Exercise & { muscleId: string })[] = [];
    for (const g of dayInfo.groups) {
      let pe = pool[g] || [];
      if (gender === '女') { pe = pe.filter((e) => e.femaleRecommended).filter((e) => !isFemaleBannedArm(e.name)); }
      extras.push(...pe.filter((e) => !used.has(e.name)).map((e) => ({ ...e, muscleId: g })));
    }
    shuffle(extras);
    while (day.exercises.length < dayMin && extras.length > 0) {
      const ex = extras.shift()!;
      day.exercises.push({ name: ex.name, muscleId: ex.muscleId, sets: `${adjCfg.sets}组×${adjCfg.repDisplay}`, assignedSets: adjCfg.sets, emoji: ex.emoji });
    }
    day.totalSets = day.exercises.reduce((s, e) => s + e.assignedSets, 0);
  }

  return {
    weekPlan,
    gender,
    goal,
    daysPerWeek: days,
    experience: state.experience,
    equipment: state.equipment,
    selectedDays: state.selectedDays,
  };
}
