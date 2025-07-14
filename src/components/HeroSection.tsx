import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Variants } from "framer-motion";

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
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

  const typingVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.05
      }
    })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Interactive Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-accent-peach/10" />
        
        {/* Interactive floating particles */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent-peach/60 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                x: mousePosition.x * (0.01 + i * 0.0002),
                y: mousePosition.y * (0.01 + i * 0.0002),
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        {/* Animated morphing blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 morphing-blob opacity-30"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent-lavender) / 0.4), hsl(var(--accent-peach) / 0.3))',
          }}
          animate={{
            x: mousePosition.x * 0.03,
            y: mousePosition.y * 0.03,
          }}
          transition={{
            type: "spring", 
            stiffness: 100, 
            damping: 30 
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 morphing-blob opacity-25"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent-coral) / 0.4), hsl(var(--accent-mint) / 0.3))',
          }}
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          transition={{
            type: "spring", 
            stiffness: 80, 
            damping: 25 
          }}
        />
      </div>

        <motion.div
            className="relative z-20 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
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
                  {texts[currentTextIndex].split("").map((char, index) => (
                      <motion.span
                          key={index}
                          custom={index}
                          variants={typingVariants}
                          initial="hidden"
                          animate="visible"
                      >
                        {char}
                      </motion.span>
                  ))}
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