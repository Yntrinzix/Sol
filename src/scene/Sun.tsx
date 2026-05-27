import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import type { ShaderMaterial } from 'three';
import { scaleRadius } from '../physics/scale';

const SUN_RADIUS = scaleRadius(695700);

const SunSurfaceMaterial = shaderMaterial(
  { uTime: 0 },
  `varying vec2 vUv;
   void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   varying vec2 vUv;

   float hash(vec2 p) {
     return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
   }
   float noise(vec2 p) {
     vec2 i = floor(p);
     vec2 f = fract(p);
     f = f * f * (3.0 - 2.0 * f);
     float a = hash(i);
     float b = hash(i + vec2(1.0, 0.0));
     float c = hash(i + vec2(0.0, 1.0));
     float d = hash(i + vec2(1.0, 1.0));
     return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
   }
   float fbm(vec2 p) {
     float v = 0.0; float a = 0.5;
     for (int i = 0; i < 6; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
     return v;
   }

   void main() {
     float t = uTime * 0.08;
     vec2 uv = vUv;

     // Smooth turbulent plasma
     float turb = fbm(uv * 3.0 + t) * 0.4 + fbm(uv * 6.0 - t * 0.5) * 0.35 + fbm(uv * 9.0 + t * 0.2) * 0.25;

     float intensity = turb;

     // Color ramp: smooth orange to yellow
     vec3 orange = vec3(1.0, 0.65, 0.1);
     vec3 yellow = vec3(1.0, 0.9, 0.4);

     vec3 color = mix(orange, yellow, intensity);

     // Bright enough for bloom
     gl_FragColor = vec4(color * 2.0, 1.0);
   }`
);

extend({ SunSurfaceMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    sunSurfaceMaterial: object;
  }
}

export function Sun() {
  const matRef = useRef<ShaderMaterial>(null!);

  useFrame((_, delta) => {
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <group>
      {/* Actual light source */}
      <pointLight
        intensity={3}
        distance={5000}
        decay={0.3}
        color="#fff0d0"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={5000}
        shadow-bias={-0.0005}
      />

      {/* Sun core with turbulent surface */}
      <mesh>
        <sphereGeometry args={[SUN_RADIUS, 64, 64]} />
        <sunSurfaceMaterial ref={matRef} toneMapped={false} />
      </mesh>
    </group>
  );
}
