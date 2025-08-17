import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion';

interface MotionHeadlineProps {
  brand?: string;
  phrases?: string[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const typingVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { delay: i * 0.04, duration: 0.04 }
  })
};

const defaultPhrases = [
  'Elevate Your Social Presence',
  'Boost Your Engagement',
  'Grow Your Audience',
  'Amplify Your Reach',
];

const MotionHeadline: React.FC<MotionHeadlineProps> = ({ brand = 'KuzzBoost', phrases = defaultPhrases }) => {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % phrases.length), 4000);
    return () => clearInterval(id);
  }, [phrases.length, prefersReducedMotion]);

  return (
    <motion.div
      className="relative z-10 text-center max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariants} className="hero-title mb-3 md:mb-4">
        {brand}
      </motion.h1>

      <div className="h-14 md:h-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.h2
            key={index}
            className="text-2xl md:text-4xl font-semibold text-primary-glow"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          >
            {phrases[index].split('').map((char, i) => (
              <motion.span key={i} custom={i} variants={typingVariants} initial="hidden" animate="visible">
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </AnimatePresence>
      </div>

      <motion.p variants={itemVariants} className="text-base md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
        The ultimate marketplace for authentic social media growth.
        <span className="text-primary font-medium"> Professional, secure, and instant delivery.</span>
      </motion.p>
    </motion.div>
  );
};

export default MotionHeadline;
