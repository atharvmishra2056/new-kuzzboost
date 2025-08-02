import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Text, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';



interface HelixPoint {
  position: [number, number, number];
  title: string;
  description: string;
  active: boolean;
}

const HelixGeometry: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const helixRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Group[]>([]);
  const { viewport } = useThree();

  const helixPoints: HelixPoint[] = [
    {
      position: [0, 4, 0],
      title: "Strategic Setup",
      description: "Ready accounts positioned for growth",
      active: scrollProgress > 0.1
    },
    {
      position: [2, 2, 0],
      title: "Ad Campaign Launch",
      description: "Targeted UK ads begin driving traffic",
      active: scrollProgress > 0.3
    },
    {
      position: [-2, 0, 0],
      title: "Organic Amplification",
      description: "Natural growth momentum builds",
      active: scrollProgress > 0.5
    },
    {
      position: [2, -2, 0],
      title: "Sustained Growth",
      description: "Continuous engagement and expansion",
      active: scrollProgress > 0.7
    },
    {
      position: [0, -4, 0],
      title: "Target Achievement",
      description: "Goals reached with lasting impact",
      active: scrollProgress > 0.9
    }
  ];

  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
    
    pointsRef.current.forEach((point, index) => {
      if (point && helixPoints[index].active) {
        const glowIntensity = Math.sin(state.clock.elapsedTime * 2 + index) * 0.5 + 1;
        point.scale.setScalar(glowIntensity);
      }
    });
  });

  const createHelixCurve = () => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 4, 0),
      new THREE.Vector3(2, 2, 0),
      new THREE.Vector3(-2, 0, 0),
      new THREE.Vector3(2, -2, 0),
      new THREE.Vector3(0, -4, 0)
    ]);
    
        return curve.getPoints(100);
  };

  return (
    <group ref={helixRef}>
      {/* Helix Line */}
            <Line
        points={createHelixCurve()}
        color="#3b82f6"
        lineWidth={3}
        transparent
        opacity={0.8}
      />
      
      {/* Glowing Points */}
      {helixPoints.map((point, index) => (
        <group 
          key={index} 
          position={point.position}
          ref={(el) => {
            if (el) pointsRef.current[index] = el;
          }}
        >
          <mesh>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial 
              color={point.active ? "#60a5fa" : "#1e293b"}
              transparent
              opacity={point.active ? 1 : 0.3}
            />
          </mesh>
          
          {/* Glow Effect */}
          {point.active && (
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial 
                color="#3b82f6"
                transparent
                opacity={0.2}
              />
            </mesh>
          )}
          
          {/* Point Label */}
          <Text
            position={[0.5, 0, 0]}
            fontSize={0.2}
            color={point.active ? "#ffffff" : "#64748b"}
            anchorX="left"
            anchorY="middle"
          >
            {point.title}
          </Text>
        </group>
      ))}
      
      {/* Particle System */}
      <ParticleSystem active={scrollProgress > 0.2} />
    </group>
  );
};

const ParticleSystem: React.FC<{ active: boolean }> = ({ active }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useFrame((state) => {
    if (particlesRef.current && active) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#60a5fa"
        size={0.02}
        transparent
        opacity={active ? 0.6 : 0}
      />
    </points>
  );
};

const HelixTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      setScrollProgress(latest);
    });
  }, [scrollYProgress]);

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
      
      <motion.div 
        ref={containerRef}
        className="relative z-10 container mx-auto px-4 py-20"
        style={{ y, opacity }}
      >
        <div className="text-center mb-16">
          <motion.h2 
            className="text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-200 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            From strategic setup to sustained growth - watch your social presence transform
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Helix Visualization */}
          <div className="h-[600px] relative">
            <Canvas
              camera={{ position: [5, 0, 5], fov: 60 }}
              className="bg-transparent"
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <HelixGeometry scrollProgress={scrollProgress} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "Strategic Setup",
                description: "Our ready accounts are strategically positioned to kickstart your growth journey with authentic engagement patterns.",
                active: scrollProgress > 0.1
              },
              {
                step: "02", 
                title: "Ad Campaign Launch",
                description: "Targeted UK ads begin driving high-quality traffic to your content, creating the initial momentum needed.",
                active: scrollProgress > 0.3
              },
              {
                step: "03",
                title: "Organic Amplification", 
                description: "As engagement builds, the algorithm takes notice, naturally amplifying your reach to broader audiences.",
                active: scrollProgress > 0.5
              },
              {
                step: "04",
                title: "Sustained Growth",
                description: "Continuous optimization ensures your growth maintains momentum with lasting, authentic engagement.",
                active: scrollProgress > 0.7
              },
              {
                step: "05",
                title: "Target Achievement",
                description: "Reach your goals with a solid foundation for continued success and long-term social media presence.",
                active: scrollProgress > 0.9
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-start space-x-4 p-6 rounded-xl transition-all duration-500 ${
                  item.active 
                    ? 'bg-blue-900/30 border border-blue-500/30 shadow-lg shadow-blue-500/10' 
                    : 'bg-slate-800/30 border border-slate-700/30'
                }`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                  item.active 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {item.step}
                </div>
                <div>
                  <h3 className={`text-xl font-semibold mb-2 transition-colors duration-500 ${
                    item.active ? 'text-white' : 'text-slate-300'
                  }`}>
                    {item.title}
                  </h3>
                  <p className={`transition-colors duration-500 ${
                    item.active ? 'text-blue-200' : 'text-slate-400'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HelixTimeline;
