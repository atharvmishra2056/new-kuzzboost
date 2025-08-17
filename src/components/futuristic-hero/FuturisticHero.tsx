import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import MotionHeadline from './MotionHeadline';
import MagneticButton from './MagneticButton';
import AuroraBackground from './AuroraBackground';
import FuturisticHeroFallback from './FuturisticHeroFallback';
import { useWebGLCapable } from './hooks/useWebGLCapable';
import GlassStats from './GlassStats';
import ParallaxCapsules from './ParallaxCapsules';

type HeroVariant = 'classic' | 'futuristic';

interface FuturisticHeroProps {
  variant?: HeroVariant;
  onCtaClick?: (ctaId: string) => void;
}

const FuturisticHero: React.FC<FuturisticHeroProps> = ({ variant = 'futuristic', onCtaClick }) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const webglCapable = useWebGLCapable();

  const showAurora = webglCapable && !isMobile;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      {showAurora ? <AuroraBackground /> : <FuturisticHeroFallback />}
      <ParallaxCapsules />

      {/* Content */}
      <motion.div
        className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <MotionHeadline />

        {/* CTAs */}
        <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
          <MagneticButton to="/services" icon="sparkles" variant="primary" onClick={() => onCtaClick?.('services')}>
            Explore Services
          </MagneticButton>
          <MagneticButton to="/about" icon={null} variant="secondary" onClick={() => onCtaClick?.('about')}>
            Meet the Team
          </MagneticButton>
        </div>
        <GlassStats />

        {/* Accessibility helper: reduced motion note for SRs only */}
        {prefersReducedMotion && (
          <span className="sr-only">Animations reduced to accommodate your system preferences.</span>
        )}
      </motion.div>
    </section>
  );
};

export default FuturisticHero;
