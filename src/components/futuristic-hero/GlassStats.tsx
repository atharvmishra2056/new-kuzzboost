import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const items = [
  { value: '24/7', label: 'Support' },
  { value: '10K+', label: 'Happy Clients' },
  { value: '99%', label: 'Success Rate' },
];

const GlassStats: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mt-10 md:mt-14 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto" aria-label="KuzzBoost stats">
      {items.map((it, idx) => (
        <motion.div
          key={idx}
          className="glass rounded-2xl border border-primary/20 px-4 py-3 md:px-6 md:py-4 text-center shadow-sm"
          initial={prefersReducedMotion ? false : { y: 8, opacity: 0 }}
          whileInView={prefersReducedMotion ? {} : { y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: idx * 0.1, ease: 'easeOut' }}
        >
          <div className="text-lg md:text-2xl font-bold text-primary font-clash">{it.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{it.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default GlassStats;
