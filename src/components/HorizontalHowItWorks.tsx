import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { CheckCircle, Zap, BarChart2, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: <Zap className="w-12 h-12 text-primary" />,
    title: "Select Your Service",
    description: "Choose from our wide range of social media growth services tailored to your needs. Browse through Instagram, YouTube, Discord, and more platforms.",
    color: "var(--accent-peach)",
  },
  {
    icon: <BarChart2 className="w-12 h-12 text-primary" />,
    title: "Customize Your Order",
    description: "Set your preferences and target audience for optimal growth and engagement. Use our calculator to get exactly what you need.",
    color: "var(--accent-lavender)",
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Watch Your Audience Grow",
    description: "See real results as your followers and engagement increase rapidly with our premium services and network.",
    color: "var(--accent-mint)",
  },
  {
    icon: <ShieldCheck className="w-12 h-12 text-primary" />,
    title: "Enjoy the Benefits",
    description: "Build your brand and increase your online presence with your new audience. 24/7 support and guaranteed results.",
    color: "var(--accent-coral)",
  },
];

const HorizontalHowItWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Horizontal transform based on vertical scroll
  const x = useTransform(sectionProgress, [0, 1], ["0%", "-75%"]);
  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Handle wheel events for horizontal scrolling within the section
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!containerRef.current || !scrollerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const isInSection = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      
      if (isInSection) {
        e.preventDefault();
        setIsScrolling(true);
        
        const scrollAmount = e.deltaY * 2;
        const currentScroll = scrollerRef.current.scrollLeft;
        const maxScroll = scrollerRef.current.scrollWidth - scrollerRef.current.clientWidth;
        
        // If we've reached the end and trying to scroll further, allow normal page scroll
        if ((scrollAmount > 0 && currentScroll >= maxScroll) || 
            (scrollAmount < 0 && currentScroll <= 0)) {
          return;
        }
        
        scrollerRef.current.scrollLeft += scrollAmount;
        
        setTimeout(() => setIsScrolling(false), 150);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative h-[400vh] bg-gradient-to-b from-background via-secondary/10 to-accent-peach/5"
    >
      {/* Fixed header */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center z-10">
        <motion.div 
          className="glass rounded-3xl p-8 mb-8 text-center max-w-4xl mx-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Simple & Effective
          </span>
          <h2 className="text-4xl md:text-6xl font-clash font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and see real results with our straightforward process
          </p>
        </motion.div>

        {/* Horizontal scrolling cards container */}
        <motion.div 
          ref={scrollerRef}
          className="w-full overflow-x-auto scrollbar-hide"
          style={{ x: smoothX }}
        >
          <div className="flex gap-8 px-8 pb-8" style={{ width: `${steps.length * 100}vw` }}>
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="glass rounded-3xl p-8 h-full border border-border/30 hover:border-primary/30 transition-all duration-500 group">
                  {/* Step indicator */}
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `hsl(${step.color} / 0.1)` }}
                    >
                      {step.icon}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      Step {index + 1} of {steps.length}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl md:text-3xl font-clash font-bold text-primary mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>

                  {/* Decorative element */}
                  <div className="mt-8 flex justify-end">
                    <motion.div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: `hsl(${step.color} / 0.2)` }}
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to action */}
        <motion.div 
          className="mt-12 text-center glass rounded-3xl p-8 mx-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 border border-border/50 text-primary font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>No password required • 24/7 Support • 100% Safe & Secure</span>
            </div>
            
            <div>
              <h3 className="text-2xl md:text-3xl font-clash font-bold text-primary mb-4">
                Ready to grow your social presence?
              </h3>
              <Link
                to="/services"
                className="glass-button inline-flex items-center gap-3 text-lg animate-breathing-glow"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Progress indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-8 bg-border/30 rounded-full overflow-hidden"
                whileHover={{ scale: 1.2 }}
              >
                <motion.div
                  className="w-full bg-gradient-primary rounded-full"
                  style={{
                    height: useTransform(
                      scrollYProgress,
                      [index / steps.length, (index + 1) / steps.length],
                      ["0%", "100%"]
                    ),
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
          style={{ 
            backgroundColor: 'hsl(var(--accent-peach))',
            x: useTransform(scrollYProgress, [0, 1], [0, 200]),
            y: useTransform(scrollYProgress, [0, 1], [0, -100]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, 360]),
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ 
            backgroundColor: 'hsl(var(--accent-lavender))',
            x: useTransform(scrollYProgress, [0, 1], [0, -200]),
            y: useTransform(scrollYProgress, [0, 1], [0, 100]),
            rotate: useTransform(scrollYProgress, [0, 1], [0, -360]),
          }}
        />
      </div>
    </section>
  );
};

export default HorizontalHowItWorks;