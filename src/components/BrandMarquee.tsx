import { motion } from 'framer-motion';

const BRANDS = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn'];
const MARQUEE_BRANDS = [...BRANDS, ...BRANDS];

export default function BrandMarquee() {
  return (
    <motion.div
      className="pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 0.6 }}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-12 px-8">
        <p className="shrink-0 text-sm leading-5 text-foreground/50">
          Relied on by brands
          <br />
          across the globe
        </p>

        <div className="marquee-fade relative min-w-0 flex-1 overflow-hidden">
          <div className="flex gap-16 animate-marquee hover:[animation-play-state:paused]">
            {MARQUEE_BRANDS.map((brand, i) => (
              <div key={i} className="flex shrink-0 items-center gap-2">
                <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold text-foreground">
                  {brand[0]}
                </div>
                <span className="text-base font-semibold text-foreground">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
