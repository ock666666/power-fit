import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <div className="flex flex-1 items-center overflow-visible">
      <div className="mx-auto w-full max-w-6xl px-8">
        <h1 className="font-heading text-[clamp(80px,14vw,220px)] font-normal leading-[1.02] tracking-[-0.024em]">
          <motion.span
            className="inline-block text-foreground"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Power{' '}
          </motion.span>
          <motion.span
            className="inline-block bg-gradient-to-l from-[#6366f1] via-[#a855f7] to-[#fcd34d] bg-clip-text text-transparent gradient-flow"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            AI
          </motion.span>
        </h1>

        <motion.p
          className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub"
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
            The most powerful AI ever deployed
            <br />
            in talent acquisition
          </motion.span>
        </motion.p>

        <motion.button
          className="liquid-glass mt-[25px] rounded-full px-[29px] py-[24px] text-base font-semibold text-foreground"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.5, ease: 'easeOut' }}
          whileHover={{
            scale: 1.04,
            boxShadow: '0 0 32px rgba(255,255,255,0.15)',
          }}
        >
          Schedule a Consult
        </motion.button>
      </div>
    </div>
  );
}
