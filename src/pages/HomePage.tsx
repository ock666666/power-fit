import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { muscleGroups } from '../data/exercises';
import MuscleCard from '../components/MuscleCard';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <motion.div
        className="text-center py-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          🏋️ 健身动作指南
        </h1>
        <p className="mt-2 text-sm text-foreground/50">选择目标肌群，查看专业训练动作</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        {muscleGroups.map((mg, i) => (
          <MuscleCard
            key={mg.id}
            {...mg}
            index={i}
            onClick={() => navigate(`/training/${mg.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
