import { useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import Navbar from './Navbar';
import Hero from './Hero';
import BrandMarquee from './BrandMarquee';
import VideoBackground from './VideoBackground';

export default function LandingPage() {
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

      {/* Blur background shape (breathing) */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-1/2 z-[1] h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950"
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: [0.75, 0.95, 0.75],
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

      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <Hero />
        <BrandMarquee />
      </div>
    </div>
  );
}
