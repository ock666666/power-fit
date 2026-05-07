import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MARQUEE_ITEMS = [
  '杠铃深蹲', '硬拉', '平板卧推', '引体向上', '哑铃飞鸟',
  '杠铃深蹲', '硬拉', '平板卧推', '引体向上', '哑铃飞鸟',
];

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

export default function HeroPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Motion values for parallax (PC: mouse, Mobile: gyro)
  const motionX = useMotionValue(0.5);
  const motionY = useMotionValue(0.5);
  const offsetX = useTransform(motionX, [0, 1], [-12, 12]);
  const offsetY = useTransform(motionY, [0, 1], [-12, 12]);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      motionX.set(e.clientX / window.innerWidth);
      motionY.set(e.clientY / window.innerHeight);
    },
    [motionX, motionY],
  );

  // Gyro-based parallax on mobile
  useEffect(() => {
    if (!isMobile) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        motionX.set((e.gamma + 90) / 180);
        motionY.set((e.beta + 180) / 360);
      }
    };
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isMobile, motionX, motionY]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen flex flex-col overflow-hidden bg-[#050510]"
    >
      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          // Mobile: animated gradient + subtle grid
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0d0720] to-[#080510]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 60px)',
              }}
            />
          </>
        ) : (
          <VideoEl offsetX={offsetX} offsetY={offsetY} />
        )}
        {/* Depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,16,0.5)_100%)]" />
      </div>

      {/* ── Animated light streaks (both PC & mobile) ── */}
      <motion.div
        className="pointer-events-none absolute top-0 left-1/4 z-[1] w-px h-full bg-gradient-to-b from-transparent via-violet-400/10 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3], x: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute top-0 right-1/4 z-[1] w-px h-full bg-gradient-to-b from-transparent via-purple-400/8 to-transparent"
        animate={{ opacity: [0.4, 0.15, 0.4], x: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />

      {/* ── Breathing blur ── */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 z-[1] w-[200%] max-w-[984px] aspect-[2/1] -translate-x-1/2 -translate-y-1/2 bg-violet-950 rounded-full"
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [0.94, 1.06, 0.94],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
          delay: 0.3,
        }}
        style={{ filter: 'blur(80px)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Hero */}
        <div className="flex flex-1 items-center">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <h1 className="font-heading text-[clamp(52px,14vw,200px)] font-normal leading-[1.02] tracking-[-0.024em]">
              <motion.span
                className="sm:inline-block text-foreground"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                POWER{' '}
              </motion.span>
              <motion.span
                className="sm:inline-block bg-gradient-to-l from-[#6366f1] via-[#a855f7] to-[#fcd34d] bg-clip-text text-transparent gradient-flow"
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              >
                FIT
              </motion.span>
            </h1>

            <motion.p
              className="mt-3 max-w-md text-base sm:text-lg leading-7 sm:leading-8 text-hero-sub"
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
              className="liquid-glass mt-5 sm:mt-6 rounded-full px-7 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-semibold text-foreground active:scale-95 transition-transform"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
              whileHover={{ scale: 1.04, boxShadow: '0 0 32px rgba(255,255,255,0.15)' }}
            >
              开始训练 →
            </motion.button>
          </div>
        </div>

        {/* Marquee */}
        <motion.div
          className="pb-6 sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
        >
          <div className="mx-auto flex max-w-5xl items-center gap-6 sm:gap-12 px-5 sm:px-8">
            <p className="shrink-0 text-xs sm:text-sm leading-4 sm:leading-5 text-foreground/50">
              覆盖全身
              <br />
              七大肌群
            </p>
            <div className="marquee-fade relative min-w-0 flex-1 overflow-hidden">
              <div className="flex gap-8 sm:gap-12 animate-marquee hover:[animation-play-state:paused]">
                {MARQUEE_ITEMS.map((item, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-2">
                    <div className="liquid-glass flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-md text-[9px] sm:text-[10px] font-semibold text-foreground">
                      🏋️
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground/70">{item}</span>
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

// ── PC video ──
function VideoEl({ offsetX, offsetY }: { offsetX: any; offsetY: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let timeoutId: ReturnType<typeof setTimeout>;

    const fadeIn = () => setOpacity(1);
    const handleEnded = () => {
      setOpacity(0);
      timeoutId = setTimeout(() => {
        if (video) video.currentTime = 0;
        setOpacity(1);
      }, 600);
    };

    video.addEventListener('loadeddata', fadeIn);
    video.addEventListener('ended', handleEnded);
    return () => {
      clearTimeout(timeoutId);
      video.removeEventListener('loadeddata', fadeIn);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <motion.video
      ref={videoRef}
      className="absolute inset-0 h-[110%] w-[110%] -top-[5%] -left-[5%] object-cover"
      muted playsInline
      style={{ x: offsetX, y: offsetY }}
      animate={{ opacity }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      src={VIDEO_SRC}
    />
  );
}
