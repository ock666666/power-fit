import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WelcomeOverlay() {
  const [visible, setVisible] = useState(() => {
    return !localStorage.getItem('welcomeDone');
  });

  const dismiss = () => {
    localStorage.setItem('welcomeDone', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-background/90 backdrop-blur-md px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="liquid-glass rounded-3xl p-8 max-w-sm w-full text-center"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-5xl block mb-4">💪</span>
            <h2 className="text-xl font-heading font-semibold mb-2">欢迎来到健身动作指南</h2>
            <p className="text-sm text-foreground/50 mb-6">三步开始你的训练</p>

            <div className="space-y-3 mb-8 text-left">
              {[
                { n: '1', t: '生成训练计划', d: '填写身体信息，AI 自动安排每周训练' },
                { n: '2', t: '学习标准动作', d: '查看视频教程 + 动作要领，避免受伤' },
                { n: '3', t: '记录并坚持', d: '记录每次训练，追踪力量增长曲线' },
              ].map((s) => (
                <div key={s.n} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-sm font-semibold text-accent shrink-0">
                    {s.n}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.t}</p>
                    <p className="text-xs text-foreground/40">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={dismiss}
              className="liquid-glass rounded-full px-8 py-3 text-sm font-medium w-full mb-3">
              开始使用
            </button>
            <button onClick={dismiss}
              className="text-xs text-foreground/30 hover:text-foreground/50 transition-colors">
              跳过引导
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
