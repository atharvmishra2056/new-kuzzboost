import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import ParticleField from "../components/ParticleField";
import SocialProofFeed from "../components/SocialProofFeed";
import ProcessTimeline from "@/components/ProcessTimeline";
import EditableFAQ from "@/components/EditableFAQ";
import Robot3D from "@/components/Robot3D";
import FuturisticHero from "@/components/futuristic-hero/FuturisticHero";
import { ENABLE_FUTURISTIC_HERO, ENABLE_HERO_AB_TEST } from "@/config/flags";
import { useABVariant } from "@/hooks/useABVariant";
import { trackHeroClick, trackHeroExposure } from "@/utils/abAnalytics";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const defaultVariant = ENABLE_FUTURISTIC_HERO ? 'futuristic' : 'classic';
  const { variant, source } = useABVariant({ flagEnabled: ENABLE_HERO_AB_TEST, defaultVariant });
  const showFuturistic = variant === 'futuristic';

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  // Track hero exposure when variant resolves
  useEffect(() => {
    trackHeroExposure(variant as any, source);
  }, [variant, source]);

  return (
    <div className="relative">
      <Robot3D />
      {showFuturistic ? null : <ParticleField />}
      <div className="pt-24 md:pt-20">
        {showFuturistic ? (
          <FuturisticHero
            variant={variant as any}
            onCtaClick={(cta) => trackHeroClick(variant as any, cta)}
          />
        ) : (
          <HeroSection />
        )}
        <ProcessTimeline />
        <EditableFAQ className="py-20" />
        <SocialProofFeed />
      </div>
    </div>
  );
};

export default Index;