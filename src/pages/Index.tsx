import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import PlatformShowcase from "../components/PlatformShowcase";
import FeaturedServices from "../components/FeaturedServices";
import SocialProofFeed from "../components/SocialProofFeed";
import Footer from "../components/Footer";
import ParticleField from "../components/ParticleField";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <ParticleField />
      <Navigation />
      <HeroSection />
      <PlatformShowcase />
      <FeaturedServices />
      <SocialProofFeed />
      <Footer />
    </div>
  );
};

export default Index;
