import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence, useMotionValue } from 'framer-motion';

const timelineData = [
  { 
    title: 'Sign Up', 
    description: 'Create your account in seconds with just your email. No complex forms, just simple and secure registration.',
    icon: '01',
    color: '#F7E7CE'
  },
  { 
    title: 'Select Service', 
    description: 'Choose from our range of growth services - followers, views, likes, or custom packages tailored to your needs.',
    icon: '02',
    color: '#E6D8B8'
  },
  { 
    title: 'Secure Payment', 
    description: 'Complete your order with our encrypted payment system. Multiple payment options available for your convenience.',
    icon: '03',
    color: '#D4C4A0'
  },
  { 
    title: 'Initial Boost', 
    description: 'We kickstart your growth using our network of real, active accounts to create authentic engagement.',
    icon: '04',
    color: '#C2B08E'
  },
  { 
    title: 'Targeted Advertising', 
    description: 'Your content is promoted through strategic ad campaigns, reaching your ideal audience for sustainable growth.',
    icon: '05',
    color: '#BEA876'
  },
];

const ProcessTimeline = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const scrollX = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });

  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Dynamic constraints for drag
  useEffect(() => {
    const updateConstraints = () => {
      if (timelineRef.current) {
        const slideWidth = window.innerWidth;
        const totalWidth = slideWidth * timelineData.length;
        setConstraints({ left: -(totalWidth - slideWidth), right: 0 });
      }
    };
    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, []);

  // Horizontal scroll tracking with container
  const { scrollXProgress } = useScroll({
    container: timelineRef,
    axis: 'x',
  });

  const smoothProgress = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle wheel for desktop horizontal scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (timelineRef.current) {
        timelineRef.current.scrollLeft += e.deltaY;
      }
    };
    timelineRef.current?.addEventListener('wheel', handleWheel);
    return () => timelineRef.current?.removeEventListener('wheel', handleWheel);
  }, []);

  // Auto-snap logic on drag end
  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const slideWidth = window.innerWidth;
    const currentX = scrollX.get();
    const velocity = info.velocity.x;
    let targetSlide = Math.round(-currentX / slideWidth);

    if (Math.abs(velocity) > 50) {
      targetSlide += velocity > 0 ? -1 : 1;
    }

    targetSlide = Math.max(0, Math.min(targetSlide, timelineData.length - 1));
    if (timelineRef.current) {
      timelineRef.current.scrollTo({ left: targetSlide * slideWidth, behavior: 'smooth' });
    }
  };

  return (
    <section ref={containerRef} className="relative bg-gradient-to-b from-[#FAF8F3] to-[#F5F0E8] overflow-hidden">
      {/* Parallax Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(230,216,184,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
            x: useTransform(smoothProgress, [0, 1], ['-20%', '20%']),
          }}
          animate={{
            y: ['0%', '5%', '0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full right-0 bottom-0"
          style={{
            background: 'radial-gradient(circle, rgba(190,168,118,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            x: useTransform(smoothProgress, [0, 1], ['20%', '-20%']),
          }}
          animate={{
            y: ['5%', '0%', '5%'],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Header Section (Vertical) */}
      <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-gradient-to-br from-[#1A1208] via-[#8B7355] to-[#BEA876] bg-clip-text text-transparent">
                How It Works
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-[#4A3A2C] max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Your journey to social media success in five simple steps
          </motion.p>

          <motion.div
            className="mt-12 inline-flex items-center gap-2 text-sm text-[#4A3A2C]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <span>Swipe or scroll to explore</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path d="M3 10L17 10M17 10L12 5M17 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Horizontal Timeline Section */}
      <motion.div 
        ref={timelineRef}
        className="relative z-10 flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
        style={{ 
          scrollBehavior: 'smooth',
          width: '100%',
          height: '100vh',
        }}
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.2}
        dragMomentum={true}
        onDragEnd={handleDragEnd}
        // Track scrollX for progress
        onScroll={() => scrollX.set(timelineRef.current?.scrollLeft || 0)}
      >
        {timelineData.map((item, index) => (
          <TimelineStep 
            key={index} 
            item={item} 
            index={index} 
            progress={smoothProgress}
            isMobile={isMobile}
            total={timelineData.length}
          />
        ))}
      </motion.div>

      {/* Progress Bar */}
      <div className="fixed bottom-8 left-0 right-0 z-20 flex justify-center">
        <div className="w-full max-w-md h-1 bg-[#E6D8B8]/40 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#BEA876] to-[#D4C4A0]"
            style={{ scaleX: smoothProgress }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Bottom CTA Section (Vertical) */}
      <div className="min-h-[50vh] flex items-center justify-center relative z-10 px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-[#1A1208] mb-6">
            Ready to grow your social presence?
          </h3>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[#BEA876] to-[#D4C4A0] text-white font-semibold rounded-full text-lg shadow-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(190,168,118,0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

const slideVariants = {
  hidden: { opacity: 0, scale: 0.95, rotate: -5 },
  visible: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.95, rotate: 5 },
};

const TimelineStep = ({ item, index, progress, isMobile, total }: any) => {
  const stepRef = useRef(null);
  const isInView = useInView(stepRef, { once: false, margin: "-20%" });
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      ref={stepRef}
      className="min-w-[100vw] h-full flex items-center justify-center px-4 md:px-8 lg:px-16 snap-center"
      variants={slideVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      exit="exit"
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className={`flex flex-col ${!isMobile && isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 lg:gap-24 w-full max-w-7xl mx-auto`}
      >
        {/* Content Side */}
        <div className="flex-1 w-full">
          <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={{ 
              opacity: isInView ? 1 : 0,
              x: isInView ? 0 : (isEven ? -50 : 50)
            }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Step Number */}
            <motion.div 
              className="inline-block mb-6"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E6D8B8]/50 to-[#BEA876]/50 rounded-3xl blur-xl" />
                <div className="relative px-6 py-3 bg-white/95 backdrop-blur-md rounded-3xl border border-[#E6D8B8]/40 shadow-md">
                  <span className="text-sm font-medium text-[#BEA876]">Step {item.icon}</span>
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1208] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {item.title}
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-[#4A3A2C] leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isInView ? 1 : 0,
                y: isInView ? 0 : 20
              }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {item.description}
            </motion.p>
          </motion.div>
        </div>

        {/* Visual Side */}
        <div className="flex-1 w-full flex items-center justify-center">
          <motion.div
            className="relative w-full max-w-md aspect-square"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: isInView ? 1 : 0.3,
              scale: isInView ? 1 : 0.8,
              rotate: isInView ? 0 : 10
            }}
            transition={{ duration: 1, delay: 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(230,216,184,0.4)' }}
          >
            {/* Glassmorphic Card */}
            <motion.div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${item.color}40 0%, ${item.color}20 100%)`,
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.4)',
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Inner glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
              
              {/* Floating elements with animation */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{
                  y: [-10, 10, -10],
                  rotate: [0, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="text-8xl md:text-9xl font-bold text-white/30">
                  {item.icon}
                </div>
              </motion.div>

              {/* Decorative circles with particle burst on view */}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full"
                style={{ background: `${item.color}50` }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full"
                style={{ background: `${item.color}40` }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatePresence>
                  {isInView && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 bg-white/60 rounded-full absolute"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            x: (Math.random() - 0.5) * 120,
                            y: (Math.random() - 0.5) * 120,
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5 + i * 0.2,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex gap-2">
                {[...Array(total)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: i <= index ? item.color : '#E6D8B8',
                      opacity: i <= index ? 1 : 0.3,
                    }}
                    whileHover={{ scale: 1.5 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProcessTimeline;