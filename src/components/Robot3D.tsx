import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Dynamic import for Spline to handle potential loading issues
const SplineComponent = ({ scene, onLoad, onError, ...props }: any) => {
  const [SplineModule, setSplineModule] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadSpline = async () => {
      try {
        const module = await import('@splinetool/react-spline');
        setSplineModule(module.default);
      } catch (error) {
        console.error('Failed to load Spline:', error);
        setLoadError(true);
        onError?.(error);
      }
    };

    loadSpline();
  }, [onError]);

  if (loadError || !SplineModule) {
    return null;
  }

  return <SplineModule scene={scene} onLoad={onLoad} onError={onError} {...props} />;
};

const Robot3D = () => {
  const splineRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse movement for robot interaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({ x, y });

      // If spline is loaded, try to interact with robot objects
      if (splineRef.current && isLoaded && !hasError) {
        try {
          // Try to find and move robot parts based on cursor
          const robotObjects = [
            'Head', 'Robot', 'head', 'Eye', 'Eyes', 'Body', 'Sphere', 'Cube'
          ];
          
          for (const objectName of robotObjects) {
            try {
              const robotPart = splineRef.current.findObjectByName(objectName);
              if (robotPart) {
                // Make the robot part follow cursor smoothly
                robotPart.rotation.y = x * 0.2;
                robotPart.rotation.x = y * 0.1;
                break; // Found and moved one object, that's enough
              }
            } catch (objError) {
              // Continue to next object
            }
          }
        } catch (error) {
          // Silently handle any errors with object manipulation
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLoaded, hasError]);

  const onLoad = (spline: any) => {
    splineRef.current = spline;
    setIsLoaded(true);
    setHasError(false);
    console.log('Spline robot loaded successfully!');
    
    // Try to set initial camera position or zoom
    try {
      spline.setZoom(0.8); // Adjust zoom to show full robot
    } catch (error) {
      console.log('Camera adjustment not available');
    }

    // Try to hide Spline watermark if possible
    try {
      setTimeout(() => {
        const splineWatermark = document.querySelector('[data-spline-watermark]') || 
                              document.querySelector('.spline-watermark') ||
                              document.querySelector('a[href*="spline.design"]');
        if (splineWatermark) {
          (splineWatermark as HTMLElement).style.display = 'none';
        }
      }, 1000);
    } catch (error) {
      console.log('Could not hide Spline watermark');
    }
  };

  const onError = (error: any) => {
    console.error('Spline loading error:', error);
    setHasError(true);
    setIsLoaded(false);
  };

  // Fallback 3D robot using CSS animations if Spline fails
  const FallbackRobot = () => (
    <motion.div
      className="w-full h-full flex items-center justify-center opacity-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.6 }}
      transition={{ duration: 1 }}
    >
      <div className="relative">
        {/* Robot Body */}
        <motion.div
          className="w-16 h-20 bg-gradient-to-b from-blue-400/70 to-blue-600/70 rounded-lg relative"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Robot Head with Eyes */}
          <motion.div 
            className="w-12 h-12 bg-gradient-to-b from-blue-300/70 to-blue-500/70 rounded-full absolute -top-6 left-2 flex items-center justify-center gap-1"
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            {/* Eyes that follow cursor */}
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  x: mousePosition.x * 1,
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                  x: { duration: 0.3 },
                  y: { duration: 0.3 },
                }}
              />
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  x: mousePosition.x * 1,
                  y: mousePosition.y * 0.5,
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity, delay: 1 },
                  x: { duration: 0.3 },
                  y: { duration: 0.3 },
                }}
              />
            </div>
          </motion.div>
          
          {/* Arms */}
          <motion.div
            className="w-3 h-12 bg-blue-500/70 rounded-full absolute -left-4 top-2"
            animate={{
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="w-3 h-12 bg-blue-500/70 rounded-full absolute -right-4 top-2"
            animate={{
              rotate: [0, -8, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const isMobile = useIsMobile();
  
  // Don't render anything on mobile devices
  if (isMobile) {
    return null;
  }

  return (
    <motion.div 
      className="fixed robot-background"
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      animate={{ 
        opacity: 0.85, 
        x: 0, 
        scale: 1 
      }}
      transition={{ duration: 1, delay: 0.5 }}
      style={{
        left: '0.05%',
        top: '50%',
        width: '250px',
        height: '570px',
        opacity: 0.85,
        zIndex: 1, // Background layer - behind all content
        pointerEvents: 'none',
      }}
    >
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-6 h-6 border-2 border-purple-300/50 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Main Robot Container */}
      <div className="w-full h-full relative">
        {!hasError ? (
          <SplineComponent
            scene="https://prod.spline.design/SJ9RiGEy-advYPeS/scene.splinecode"
            onLoad={onLoad}
            onError={onError}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              pointerEvents: 'none', // Completely non-interactive
            }}
            className="robot-spline"
          />
        ) : (
          <FallbackRobot />
        )}
        
        {/* Subtle glow effect around robot */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 5}% ${50 + mousePosition.y * 5}%, 
              rgba(168, 85, 247, 0.08) 0%, 
              rgba(236, 72, 153, 0.04) 30%, 
              transparent 60%)`,
            filter: 'blur(25px)',
          }}
          animate={{
            opacity: (isLoaded || hasError) ? [0.2, 0.4, 0.2] : 0,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.div>
  );
};

export default Robot3D;