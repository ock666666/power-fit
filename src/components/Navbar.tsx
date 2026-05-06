import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: 'Features', hasChevron: true },
  { label: 'Solutions', hasChevron: false },
  { label: 'Plans', hasChevron: false },
  { label: 'Learning', hasChevron: true },
] as const;

function ChevronDown() {
  return (
    <svg
      className="ml-1 h-4 w-4 opacity-60"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function NavButton({ label, hasChevron }: { label: string; hasChevron: boolean }) {
  return (
    <motion.button
      className="relative inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
      whileHover="hover"
      initial="rest"
    >
      {label}
      {hasChevron && <ChevronDown />}
      <motion.span
        className="absolute bottom-1 left-1/2 h-px bg-foreground/40"
        variants={{
          rest: { width: 0, x: '-50%' as any, opacity: 0 },
          hover: { width: '60%', x: '-50%' as any, opacity: 1 },
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      />
    </motion.button>
  );
}

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
    >
      <div className="flex items-center justify-between px-8 py-5">
        <a href="/" className="shrink-0">
          <span className="text-xl font-bold text-foreground">POWER AI</span>
        </a>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavButton key={item.label} {...item} />
          ))}
        </div>

        <motion.button
          className="liquid-glass rounded-full px-4 py-2 text-sm font-medium text-foreground"
          whileHover={{
            scale: 1.03,
            boxShadow: '0 0 24px rgba(255,255,255,0.12)',
          }}
          transition={{ duration: 0.2 }}
        >
          Sign Up
        </motion.button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent mt-[3px]" />
    </motion.nav>
  );
}
