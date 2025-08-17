import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const FuturisticHeroFallback: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Warm beige base */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(1200px 800px at 50% 60%, rgba(250,245,237,0.85), rgba(250,245,237,0.6) 40%, transparent 70%)'
      }} />

      {/* Soft color blobs */}
      <motion.div
        className="absolute -top-16 -left-10 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.6), rgba(196,181,253,0.2))' }}
        animate={prefersReducedMotion ? undefined : { y: [0, -12, 0], x: [0, 10, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-10 -right-8 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.55), rgba(253,186,116,0.18))' }}
        animate={prefersReducedMotion ? undefined : { y: [0, 10, 0], x: [0, -12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle top vignette for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/10 to-transparent" />
    </div>
  );
};

export default FuturisticHeroFallback;
