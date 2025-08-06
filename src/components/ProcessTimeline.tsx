import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const timelineData = [
  { 
    title: 'Sign Up', 
    description: 'Create your account in seconds with just your email. No complex forms, just simple and secure registration.',
    icon: '01',
    color: '#8B5CF6'
  },
  { 
    title: 'Select Service', 
    description: 'Choose from our range of growth services - followers, views, likes, or custom packages tailored to your needs.',
    icon: '02',
    color: '#EC4899'
  },
  { 
    title: 'Secure Payment', 
    description: 'Complete your order with our encrypted payment system. Multiple payment options available for your convenience.',
    icon: '03',
    color: '#F59E0B'
  },
  { 
    title: 'Watch Growth', 
    description: 'Sit back and watch your social media presence grow with authentic engagement and real followers.',
    icon: '04',
    color: '#10B981'
  },
];

const ProcessTimeline = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const isInView = useInView(containerRef, { margin: "-30%" });
  const isMobile = useIsMobile();

  // Desktop scroll-based navigation
  useEffect(() => {
    if (!isInView || isMobile) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const sectionHeight = rect.height;
      const scrollProgress = Math.abs(rect.top) / (sectionHeight - window.innerHeight);
      
      // Calculate which step should be active based on scroll progress
      const stepIndex = Math.min(
        Math.floor(scrollProgress * timelineData.length),
        timelineData.length - 1
      );
      
      setCurrentStep(Math.max(0, stepIndex));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isInView, isMobile]);

  // Mobile auto-progression
  useEffect(() => {
    if (!isMobile) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % timelineData.length);
    }, 3000); // Change step every 3 seconds on mobile

    return () => clearInterval(interval);
  }, [isMobile]);

  // Mobile Layout
  if (isMobile) {
    return (
      <section className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-16 px-4">
        {/* Background Effects - Smaller for mobile */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute w-48 h-48 rounded-full opacity-15 blur-2xl"
            style={{ background: timelineData[currentStep].color }}
            animate={{
              x: ['-10%', '10%', '-10%'],
              y: ['-5%', '5%', '-5%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full opacity-10 blur-xl right-0 bottom-0"
            style={{ background: timelineData[currentStep].color }}
            animate={{
              x: ['10%', '-10%', '10%'],
              y: ['5%', '-5%', '5%'],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.h1>
          <motion.p 
            className="text-base text-gray-600 max-w-sm mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Your journey to social media success in four simple steps
          </motion.p>
        </div>

        {/* Mobile Timeline - Vertical Stack */}
        <div className="relative z-10 max-w-sm mx-auto">
          {/* Progress Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {timelineData.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'scale-125 shadow-md' 
                    : 'bg-gray-300'
                }`}
                style={{
                  backgroundColor: index === currentStep ? timelineData[currentStep].color : undefined
                }}
                onClick={() => setCurrentStep(index)}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Step Visual */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative w-32 h-32"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${timelineData[currentStep].color}20, ${timelineData[currentStep].color}10)`,
                      border: `2px solid ${timelineData[currentStep].color}40`
                    }}
                  >
                    {/* Step Number */}
                    <div 
                      className="text-4xl font-bold opacity-40"
                      style={{ color: timelineData[currentStep].color }}
                    >
                      {timelineData[currentStep].icon}
                    </div>

                    {/* Floating Elements - Smaller for mobile */}
                    <motion.div
                      className="absolute w-6 h-6 rounded-full opacity-60"
                      style={{ backgroundColor: timelineData[currentStep].color }}
                      animate={{
                        x: [0, 15, 0],
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute w-4 h-4 rounded-full opacity-40"
                      style={{ backgroundColor: timelineData[currentStep].color }}
                      animate={{
                        x: [0, -12, 0],
                        y: [0, 8, 0],
                        scale: [1.1, 1, 1.1],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Step Number Badge */}
              <div 
                className="inline-block px-3 py-1.5 rounded-xl text-white font-bold text-sm mb-4"
                style={{ backgroundColor: timelineData[currentStep].color }}
              >
                Step {timelineData[currentStep].icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {timelineData[currentStep].title}
              </h2>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed px-4">
                {timelineData[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Ready to boost your social presence?
              </h3>
              <Link to="/services">
                <motion.button
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold rounded-full text-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Started Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop Layout (Original)
  return (
    <section 
      ref={containerRef} 
      className="relative bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 process-timeline"
      style={{ height: '400vh' }} // Make it tall for scroll-based navigation
    >
      {/* Sticky content container */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        
        {/* Background Effects */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: timelineData[currentStep].color }}
            animate={{
              x: ['-20%', '20%', '-20%'],
              y: ['-10%', '10%', '-10%'],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl right-0 bottom-0"
            style={{ background: timelineData[currentStep].color }}
            animate={{
              x: ['20%', '-20%', '20%'],
              y: ['10%', '-10%', '10%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                How It Works
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              Your journey to social media success in four simple steps
            </motion.p>
          </div>

          {/* Timeline Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Content */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Step Number */}
                  <div 
                    className="inline-block p-4 rounded-2xl text-white font-bold text-3xl mb-6"
                    style={{ backgroundColor: timelineData[currentStep].color }}
                  >
                    {timelineData[currentStep].icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    {timelineData[currentStep].title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {timelineData[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress Indicators */}
              <div className="flex gap-3 mt-8">
                {timelineData.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'scale-125 shadow-lg' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    style={{
                      backgroundColor: index === currentStep ? timelineData[currentStep].color : undefined
                    }}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  className="relative w-80 h-80"
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {/* Main Circle */}
                  <div 
                    className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: `linear-gradient(135deg, ${timelineData[currentStep].color}20, ${timelineData[currentStep].color}10)`,
                      border: `2px solid ${timelineData[currentStep].color}40`
                    }}
                  >
                    {/* Large Number */}
                    <div 
                      className="text-8xl font-bold opacity-30"
                      style={{ color: timelineData[currentStep].color }}
                    >
                      {timelineData[currentStep].icon}
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      className="absolute w-16 h-16 rounded-full opacity-60"
                      style={{ backgroundColor: timelineData[currentStep].color }}
                      animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute w-12 h-12 rounded-full opacity-40"
                      style={{ backgroundColor: timelineData[currentStep].color }}
                      animate={{
                        x: [0, -25, 0],
                        y: [0, 15, 0],
                        scale: [1.2, 1, 1.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Ready to boost your social presence?
              </h3>
              <Link to="/services">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold rounded-full text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;