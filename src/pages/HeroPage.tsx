import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '../components/VideoBackground';

const MARQUEE_ITEMS = [
  '杠铃深蹲', '硬拉', '平板卧推', '引体向上', '哑铃飞鸟',
  '杠铃深蹲', '硬拉', '平板卧推', '引体向上', '哑铃飞鸟',
];

export default function HeroPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const videoX = useTransform(mouseX, [0, 1], [-12, 12]);
  const videoY = useTransform(mouseY, [0, 1], [-12, 12]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    },
    [mouseX, mouseY],
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      <VideoBackground videoX={videoX} videoY={videoY} />

      {/* Breathing blur */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 z-[1] h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-cyan-950"
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: [0.65, 0.9, 0.65],
          scale: [0.94, 1.06, 0.94],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
          delay: 0.3,
        }}
        style={{ filter: 'blur(82px)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Simple top bar */}
        <motion.div
          className="flex items-center justify-between px-8 py-6"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          <span className="text-xl font-bold text-foreground tracking-tight">
            💪 POWER FIT
          </span>
        </motion.div>

        {/* Hero */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-6xl px-8">
            <h1 className="font-heading text-[clamp(64px,12vw,200px)] font-normal leading-[1.02] tracking-[-0.024em]">
              <motion.span
                className="inline-block text-foreground"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                POWER{' '}
              </motion.span>
              <motion.span
                className="inline-block bg-gradient-to-r from-[#00e5ff] via-[#00ff88] to-[#00e5ff] bg-clip-text text-transparent gradient-flow"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                FIT
              </motion.span>
            </h1>

            <motion.p
              className="mt-3 max-w-md text-lg leading-8 text-hero-sub"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5, ease: 'easeOut' }}
            >
              <motion.span
                className="opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                AI 驱动的智能健身教练
                <br />
                量身定制你的训练计划
              </motion.span>
            </motion.p>

            <motion.button
              onClick={() => navigate('/home')}
              className="liquid-glass mt-6 rounded-full px-8 py-5 text-base font-semibold text-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
              whileHover={{
                scale: 1.04,
                boxShadow: '0 0 32px rgba(0,229,255,0.2)',
              }}
            >
              开始训练 →
            </motion.button>
          </div>
        </div>

        {/* Marquee */}
        <motion.div
          className="pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="mx-auto flex max-w-5xl items-center gap-12 px-8">
            <p className="shrink-0 text-sm leading-5 text-foreground/50">
              覆盖全身
              <br />
              七大肌群
            </p>
            <div className="marquee-fade relative min-w-0 flex-1 overflow-hidden">
              <div className="flex gap-12 animate-marquee hover:[animation-play-state:paused]">
                {MARQUEE_ITEMS.map((item, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2">
                    <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold text-foreground">
                      🏋️
                    </div>
                    <span className="text-sm font-semibold text-foreground/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
