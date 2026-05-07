import { useState, useMemo } from 'react';
import Modal from './Modal';
import { foodDatabase, type Food } from '../data/foods';
import type { DietRecord } from '../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (record: DietRecord) => void;
}

const CATEGORIES = ['全部', '主食类', '肉蛋类', '蔬菜类', '水果类', '奶制品', '零食坚果', '油脂调料'];

export default function FoodSearchModal({ open, onClose, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('全部');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [grams, setGrams] = useState('100');
  const gramsNum = parseInt(grams) || 0;

  const filtered = useMemo(() => {
    let list = foodDatabase;
    if (category !== '全部') list = list.filter((f) => f.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  }, [search, category]);

  const handleConfirm = () => {
    if (!selectedFood) return;
    const portions = gramsNum / 100;
    onSelect({
      name: selectedFood.name,
      portions,
      unit: selectedFood.unit,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      category: selectedFood.category,
      primaryNutrient: selectedFood.primaryNutrient,
      grams: gramsNum,
    });
    setSelectedFood(null);
    setSearch('');
    setGrams('100');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-heading font-semibold mb-4">添加食物</h3>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索食物..."
        className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-3"
        autoFocus
      />

      {/* Category chips */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CATEGORIES.map((cat) => (
          <button key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
              category === cat ? 'bg-accent/10 border border-accent/40 text-accent' : 'border border-white/5 text-foreground/40 hover:text-foreground/60'
            }`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Food list */}
      <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
        {filtered.map((food) => (
          <button key={food.name}
            onClick={() => { setSelectedFood(food); setGrams('100'); }}
            className={`w-full text-left rounded-lg p-2.5 text-sm transition-colors ${
              selectedFood?.name === food.name ? 'bg-accent/10 border border-accent/30' : 'hover:bg-white/[0.02] border border-transparent'
            }`}>
            <span className="text-foreground/80">{food.name}</span>
            <span className="text-xs text-foreground/30 ml-2">{food.unit} · {food.calories}kcal</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="text-xs text-foreground/30 text-center py-6">无匹配结果</p>}
      </div>

      {/* Portion selector */}
      {selectedFood && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-sm font-semibold mb-2">{selectedFood.name} ({selectedFood.unit})</p>
          <div className="flex items-center gap-3 mb-3">
            <input type="text" inputMode="numeric" pattern="[0-9]*" value={grams} onChange={(e) => setGrams(e.target.value.replace(/\D/g, ''))}
              className="w-24 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-center text-lg outline-none focus:border-accent/40" />
            <span className="text-sm text-foreground/50">g</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs mb-4">
            <div className="text-center"><p className="text-foreground/30">热量</p><p>{Math.round(selectedFood.calories * gramsNum / 100)}kcal</p></div>
            <div className="text-center"><p className="text-foreground/30">蛋白质</p><p>{Math.round(selectedFood.protein * gramsNum / 100)}g</p></div>
            <div className="text-center"><p className="text-foreground/30">碳水</p><p>{Math.round(selectedFood.carbs * gramsNum / 100)}g</p></div>
            <div className="text-center"><p className="text-foreground/30">脂肪</p><p>{Math.round(selectedFood.fat * gramsNum / 100)}g</p></div>
          </div>
          <button onClick={handleConfirm}
            className="liquid-glass rounded-full px-6 py-3 text-sm font-medium w-full">
            确认添加
          </button>
        </div>
      )}
    </Modal>
  );
}
