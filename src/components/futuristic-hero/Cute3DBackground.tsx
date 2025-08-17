import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';

const CuteObjects: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const floatProps = prefersReducedMotion
    ? { speed: 0, rotationIntensity: 0, floatIntensity: 0 }
    : { speed: 0.6, rotationIntensity: 0.4, floatIntensity: 0.6 };

  return (
    <group>
      {/* Pastel sphere */}
      <Float {...floatProps} position={[ -2.6,  0.8, -2]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.9, 32, 32]} />
          <meshStandardMaterial color="#c4b5fd" emissive="#bda7ff" emissiveIntensity={0.12} roughness={0.35} metalness={0.15} />
        </mesh>
      </Float>

      {/* Rounded box */}
      <Float {...floatProps} position={[ 2.2,  1.0, -2.5]}>
        <RoundedBox args={[1.4, 0.9, 1.0]} radius={0.22} smoothness={6} castShadow receiveShadow>
          <meshStandardMaterial color="#fbcfe8" emissive="#f5bde0" emissiveIntensity={0.1} roughness={0.4} metalness={0.1} />
        </RoundedBox>
      </Float>

      {/* Small sphere */}
      <Float {...floatProps} position={[ 0.6, -0.4, -1.8]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color="#bbf7d0" emissive="#a7efc1" emissiveIntensity={0.08} roughness={0.5} metalness={0.08} />
        </mesh>
      </Float>

      {/* Tall rounded box */}
      <Float {...floatProps} position={[ -1.0, -1.0, -2.6]}>
        <RoundedBox args={[0.7, 1.6, 0.7]} radius={0.18} smoothness={6} castShadow receiveShadow>
          <meshStandardMaterial color="#fed7aa" emissive="#ffd0a0" emissiveIntensity={0.08} roughness={0.45} metalness={0.12} />
        </RoundedBox>
      </Float>

      {/* Sparkles overlay */}
      <Sparkles count={28} scale={[8, 4, 3]} size={2} speed={0.2} color="#ffffff" opacity={0.25} />
    </group>
  );
};

const Cute3DBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      {/* Subtle warm base gradient for beige cohesion */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(1200px 800px at 50% 60%, rgba(250,245,237,0.8), rgba(250,245,237,0.55) 40%, transparent 70%)'
      }} />

      <Canvas shadows gl={{ alpha: true, antialias: true }} dpr={[1, 2]} camera={{ position: [0, 0, 7.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 4]} intensity={0.8} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <CuteObjects />
      </Canvas>

      {/* Glassy highlight overlay */}
      <div className="absolute inset-0 backdrop-blur-[1.5px]" style={{
        background: 'radial-gradient(1000px 500px at 50% 75%, rgba(255,255,255,0.08), transparent 60%)'
      }} />
    </div>
  );
};

export default Cute3DBackground;
