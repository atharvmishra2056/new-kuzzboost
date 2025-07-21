import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import ParticleField from "../components/ParticleField";
import SocialProofFeed from "../components/SocialProofFeed";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <ParticleField />
      <HeroSection />
      <HowItWorks />
      <Testimonials />
      <SocialProofFeed />
    </div>
  );
};

export default Index;
