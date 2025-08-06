import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import ParticleField from "../components/ParticleField";
import SocialProofFeed from "../components/SocialProofFeed";
import ProcessTimeline from "@/components/ProcessTimeline";
import EditableFAQ from "@/components/EditableFAQ";
import Robot3D from "@/components/Robot3D";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="relative">
      <Robot3D />
      <ParticleField />
      <div className="pt-24 md:pt-20">
        <HeroSection />
        <ProcessTimeline />
        <EditableFAQ className="py-20" />
        <SocialProofFeed />
      </div>
    </div>
  );
};

export default Index;