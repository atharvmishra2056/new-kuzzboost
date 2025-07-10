import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

  const texts = [
    "Elevate Your Social Presence",
    "Boost Your Engagement",
    "Grow Your Audience",
    "Amplify Your Reach"
  ];
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [texts.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Morphing Background Blob */}
      <motion.div 
        className="absolute top-1/2 left-1/2 w-96 h-96 morphing-blob opacity-30"
        style={{
          background: 'linear-gradient(45deg, hsl(var(--accent-lavender)), hsl(var(--accent-peach)), hsl(var(--primary-glow)))',
        }}
        animate={{
          x: -mousePosition.x,
          y: -mousePosition.y,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />

      {/* Secondary blob */}
       <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 morphing-blob opacity-20"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--accent-peach)), hsl(var(--secondary)))',
          animationDelay: '10s'
        }}
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      />

      <motion.div 
        className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main Headline */}
        <div className="mb-8">
          <motion.h1 variants={itemVariants} className="hero-title mb-4">
            KuzzBoost
          </motion.h1>
          <div className="h-20 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentTextIndex}
                className="text-3xl md:text-5xl font-semibold text-primary-glow"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {texts[currentTextIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>

        {/* Subtitle */}
        <motion.p 
          variants={itemVariants} 
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          The ultimate marketplace for authentic social media growth. 
          <span className="text-primary font-medium"> Professional, secure, and instant delivery.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
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
        </motion.div>

        {/* Trust Indicators */}
        <motion.div variants={itemVariants} className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
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
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
