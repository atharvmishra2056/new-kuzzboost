import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const ParallaxCapsules: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setPos({ x, y });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReducedMotion, isMobile]);

  if (isMobile) return null;

  const common = {
    transition: { type: 'spring', stiffness: 80, damping: 20 },
  } as const;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      {/* Top-left capsule */}
      <motion.div
        className="absolute rounded-full blur-2xl opacity-40"
        style={{
          width: '28rem',
          height: '10rem',
          left: '6%',
          top: '15%',
          background:
            'linear-gradient(135deg, hsla(270, 95%, 85%, 0.55), hsla(15, 90%, 80%, 0.35))',
        }}
        animate={prefersReducedMotion ? undefined : { x: pos.x * 15, y: pos.y * 8 }}
        {...common}
      />

      {/* Right-center capsule */}
      <motion.div
        className="absolute rounded-full blur-3xl opacity-35"
        style={{
          width: '32rem',
          height: '12rem',
          right: '8%',
          top: '35%',
          background:
            'linear-gradient(135deg, hsla(15, 90%, 75%, 0.45), hsla(155, 65%, 75%, 0.28))',
        }}
        animate={prefersReducedMotion ? undefined : { x: pos.x * -10, y: pos.y * 12 }}
        {...common}
      />

      {/* Bottom-left small capsule */}
      <motion.div
        className="absolute rounded-full blur-2xl opacity-30"
        style={{
          width: '18rem',
          height: '7rem',
          left: '10%',
          bottom: '12%',
          background:
            'linear-gradient(135deg, hsla(270, 95%, 85%, 0.45), hsla(270, 80%, 88%, 0.25))',
        }}
        animate={prefersReducedMotion ? undefined : { x: pos.x * 10, y: pos.y * -6 }}
        {...common}
      />
    </div>
  );
};

export default ParallaxCapsules;
