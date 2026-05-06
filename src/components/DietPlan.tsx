import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';

export default function DietPlanView() {
  const { nutritionGoal } = useApp();

  return (
    <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-4">
      {nutritionGoal && (
        <div className="liquid-glass rounded-2xl p-4">
          <h3 className="text-base font-semibold mb-3">🎯 今日营养目标</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-foreground/40">热量</span> <span className="font-semibold">{nutritionGoal.targetCalories} kcal</span></div>
            <div><span className="text-foreground/40">蛋白质</span> <span className="font-semibold">{nutritionGoal.targetProtein}g</span></div>
            <div><span className="text-foreground/40">碳水</span> <span className="font-semibold">{nutritionGoal.targetCarbs}g</span></div>
            <div><span className="text-foreground/40">脂肪</span> <span className="font-semibold">{nutritionGoal.targetFat}g</span></div>
          </div>
        </div>
      )}

      <div className="liquid-glass rounded-2xl p-4">
        <h3 className="text-base font-semibold mb-3">📖 饮食原则</h3>
        <ul className="space-y-2.5 text-sm text-foreground/60">
          <li>🥩 每餐一掌蛋白质（肉/蛋/鱼/豆）</li>
          <li>🍚 每餐一拳主食（米/面/薯/全麦）</li>
          <li>🥬 每餐一捧蔬菜（深色蔬菜占一半）</li>
          <li>🥜 每天一把坚果或2勺油</li>
          <li>⏱️ 训练后30分钟内补充蛋白质+碳水</li>
        </ul>
      </div>

      <p className="text-xs text-foreground/30 text-center">
        💡 不知道怎么吃？点右下角AI教练，拍照或描述你吃的，我来帮你算
      </p>
    </motion.div>
  );
}
