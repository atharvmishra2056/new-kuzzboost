import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';

const AuroraPlane: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const prefersReducedMotion = useReducedMotion();

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_resolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      u_colorA: { value: new THREE.Color('#c4b5fd') }, // lavender-300
      u_colorB: { value: new THREE.Color('#fbcfe8') }, // pink-200
      u_colorC: { value: new THREE.Color('#fed7aa') }, // peach-200
      u_intensity: { value: 0.9 },
    }),
    [viewport.width, viewport.height]
  );

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    // Pause time if reduced motion
    if (!prefersReducedMotion) {
      materialRef.current.uniforms.u_time.value += delta * 0.3;
    }
    materialRef.current.uniforms.u_resolution.value.set(viewport.width, viewport.height);
  });

  // Simple flowing aurora using layered noise-like functions
  const vertexShader = /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec3 u_colorA;
    uniform vec3 u_colorB;
    uniform vec3 u_colorC;
    uniform float u_intensity;

    // hash + noise helpers
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
    float noise(in vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main(){
      vec2 uv = vUv;
      // center-based coordinates for subtle vertical flow
      vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);

      float t = u_time * 0.2;
      // Layered bands moving at different speeds
      float n1 = noise(p * 1.5 + vec2(0.0, t));
      float n2 = noise(p * 2.3 + vec2(t * -0.6, t * 0.4));
      float n3 = noise(p * 3.1 + vec2(t * 0.8, -t * 0.3));

      float band = smoothstep(0.2, 0.9, n1) * 0.6 + smoothstep(0.3, 0.95, n2) * 0.3 + n3 * 0.15;
      band = pow(band, 1.6);

      vec3 col = mix(u_colorA, u_colorB, clamp(band, 0.0, 1.0));
      col = mix(col, u_colorC, smoothstep(0.5, 1.0, band));

      // gentle vignetting for focus
      float vignette = 1.0 - smoothstep(0.7, 1.2, length(p));
      col *= mix(0.9, 1.2, vignette);

      // intensity scaling for theme blending
      col = mix(vec3(0.96, 0.94, 0.90), col, u_intensity); // warm beige base tint

      gl_FragColor = vec4(col, 0.68); // slightly translucent so glass overlay can shine
    }
  `;

  return (
    <mesh scale={[viewport.width, viewport.height, 1]} position={[0, 0, 0]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
};

const AuroraBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 2]}>
        <AuroraPlane />
      </Canvas>
      {/* Soft glass noise overlay for cohesion */}
      <div className="absolute inset-0 backdrop-blur-[1.5px]" style={{ background: 'radial-gradient(1200px 600px at 50% 80%, rgba(255,255,255,0.06), transparent 60%)' }} />
    </div>
  );
};

export default AuroraBackground;
