import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 20, 
        y: (e.clientY / window.innerHeight) * 20 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const [currentText, setCurrentText] = useState("Elevate Your Social Presence");
  const [isTyping, setIsTyping] = useState(false);

  const texts = [
    "Elevate Your Social Presence",
    "Boost Your Engagement",
    "Grow Your Audience",
    "Amplify Your Reach"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(true);
      setTimeout(() => {
        const currentIndex = texts.indexOf(currentText);
        const nextIndex = (currentIndex + 1) % texts.length;
        setCurrentText(texts[nextIndex]);
        setIsTyping(false);
      }, 500);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentText]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Morphing Background Blob */}
      <div 
        className="absolute top-1/2 left-1/2 w-96 h-96 morphing-blob opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--accent-lavender)), hsl(var(--accent-peach)), hsl(var(--primary-glow)))',
          transform: `translate(-50%, -50%) translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Secondary blob */}
      <div 
        className="absolute top-1/4 right-1/4 w-64 h-64 morphing-blob opacity-20"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent-peach)), hsl(var(--secondary)))',
          transform: `translate(50%, -50%) translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          transition: 'transform 0.3s ease-out',
          animationDelay: '10s'
        }}
      />

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="hero-title mb-4">
            KuzzBoost
          </h1>
          <div className="h-20 flex items-center justify-center">
            <h2 className={`text-3xl md:text-5xl font-semibold text-primary-glow ${isTyping ? 'typing-effect' : ''}`}>
              {currentText}
            </h2>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          The ultimate marketplace for authentic social media growth. 
          <span className="text-primary font-medium"> Professional, secure, and instant delivery.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link 
            to="/services" 
            className="glass-button group flex items-center gap-3 text-lg"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            Explore Services
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          
          <Link 
            to="/about" 
            className="glass rounded-2xl px-8 py-4 text-lg font-medium border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105"
          >
            Meet the Team
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-clash">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-clash">10K+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary font-clash">99%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;