import Navigation from "../components/Navigation";
import HeroSection from "../components/HeroSection";
import PlatformShowcase from "../components/PlatformShowcase";
import FeaturedServices from "../components/FeaturedServices";
import ServiceCalculator from "../components/ServiceCalculator";
import SocialProofFeed from "../components/SocialProofFeed";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <PlatformShowcase />
      <FeaturedServices />
      <ServiceCalculator />
      <SocialProofFeed />
    </div>
  );
};

export default Index;
