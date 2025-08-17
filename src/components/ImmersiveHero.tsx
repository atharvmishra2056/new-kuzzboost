import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Stars, Float } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

// Utility: Check WebGL support to gracefully fallback
const canUseWebGL = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      (window as any).WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
};

// 3D: Wireframe globe with slow rotation
const WireGlobe: React.FC = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshBasicMaterial wireframe color="#7c3aed" opacity={0.35} transparent />
    </mesh>
  );
};

// 3D: An orb that orbits around the globe
const OrbitingOrb: React.FC<{
  radius?: number;
  speed?: number;
  size?: number;
  color?: string;
  phase?: number;
}> = ({ radius = 3, speed = 0.35, size = 0.22, color = "#ec4899", phase = 0 }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + phase;
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    const y = Math.sin(t * 0.8) * 0.6;
    if (ref.current) {
      ref.current.position.set(x, y, z);
      ref.current.rotation.y = t;
    }
  });
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.5}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial color={color} emissive={new THREE.Color(color)} emissiveIntensity={0.45} metalness={0.6} roughness={0.2} />
      </mesh>
    </Float>
  );
};

// UI: Rotating headline with 3D-like flip
const RotatingText: React.FC = () => {
  const words = useMemo(
    () => [
      "Social Growth",
      "Instagram Followers",
      "YouTube Subscribers",
      "TikTok Engagement",
      "Twitter Boost",
      "LinkedIn Growth",
    ],
    []
  );
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <div className="h-16 md:h-20 flex items-center justify-center perspective-[1000px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ opacity: 0, rotateX: 90, y: 20 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: -90, y: -20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// UI: Mouse-follow glow
const MouseGlow: React.FC = () => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgba(168,85,247,0.12), rgba(236,72,153,0.06) 30%, transparent 60%)`,
        filter: "blur(25px)",
      }}
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

// Optional video background (passed via prop)
const VideoBG: React.FC<{ src?: string }> = ({ src }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Only enable if a src is provided
    setShow(!!src);
  }, [src]);
  if (!src || !show) return null;
  return (
    <video
      className="absolute inset-0 w-full h-full object-cover opacity-25"
      src={src}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setShow(false)}
    />
  );
};

const ImmersiveHero: React.FC<{ videoSrc?: string }> = ({ videoSrc }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [webglOk, setWebglOk] = useState(false);

  useEffect(() => {
    setWebglOk(canUseWebGL());
  }, []);

  // Mobile or no WebGL -> 2D fallback
  if (isMobile || !webglOk) {
    return (
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <MouseGlow />
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Boost Your</h1>
          <RotatingText />
          <p className="text-base md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto">
            Futuristic growth platform. Real engagement. Real results. Built for performance on any device.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-purple-500/25"
              onClick={() => navigate("/services")}
            >
              Start Growing Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400/20 px-8 py-4 rounded-full text-lg backdrop-blur-sm bg-white/5"
              onClick={() => navigate("/about")}
            >
              Learn More
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-10 max-w-xl mx-auto text-center">
            <div>
              <div className="text-xl md:text-2xl font-bold text-primary">24/7</div>
              <div className="text-sm text-gray-400">Support</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-primary">10K+</div>
              <div className="text-sm text-gray-400">Happy Clients</div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-bold text-primary">99%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Desktop + WebGL path
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900" />
      <VideoBG src={videoSrc} />
      <MouseGlow />

      {/* 3D scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 55 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <Environment preset="night" />
            <Stars radius={220} depth={60} count={1200} factor={6} saturation={0} fade />

            <WireGlobe />
            <OrbitingOrb color="#ec4899" phase={0} />
            <OrbitingOrb color="#f59e0b" phase={1.2} speed={0.28} radius={3.4} />
            <OrbitingOrb color="#10b981" phase={2.1} speed={0.32} radius={2.6} />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.h1
          className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <span className="block">Boost Your</span>
          <RotatingText />
          <span className="block">Like Never Before</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Experience the future of social media growth with our purpose-built 3D hero. Clean, performant, and visually distinct.
        </motion.p>

        <motion.div
          className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 py-4 rounded-full text-lg shadow-2xl hover:shadow-purple-500/25 group"
            onClick={() => navigate("/services")}
          >
            Start Growing Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400/20 px-8 py-4 rounded-full text-lg backdrop-blur-sm bg-white/5"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-12 grid grid-cols-3 gap-6 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
            <div className="text-sm text-gray-400">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary">99%</div>
            <div className="text-sm text-gray-400">Success Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImmersiveHero;
