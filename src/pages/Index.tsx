import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import ParticleField from "../components/ParticleField";
import SocialProofFeed from "../components/SocialProofFeed";
import HorizontalHowItWorks from "@/components/HorizontalHowItWorks";
import EditableFAQ from "@/components/EditableFAQ";
import CursorFollower from "@/components/CursorFollower";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-secondary/5 to-accent-peach/5">
      <CursorFollower />
      <ParticleField />
      <HeroSection />
      <HorizontalHowItWorks />
      <div className="glass mx-4 my-8 rounded-3xl border border-border/30">
        <EditableFAQ className="py-20" />
      </div>
      <div className="glass mx-4 my-8 rounded-3xl border border-border/30">
        <SocialProofFeed />
      </div>
    </div>
  );
};

export default Index;
