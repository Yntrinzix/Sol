import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { BackSide } from 'three';
import type { ShaderMaterial } from 'three';

const NebulaSkyMaterial = shaderMaterial(
  { uTime: 0 },
  `varying vec3 vWorldDir;
   void main() {
     vec4 worldPos = modelMatrix * vec4(position, 1.0);
     vWorldDir = normalize(worldPos.xyz);
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  `uniform float uTime;
   varying vec3 vWorldDir;

   float hash(vec3 p) {
     p = fract(p * vec3(443.897, 441.423, 437.195));
     p += dot(p, p.yzx + 19.19);
     return fract((p.x + p.y) * p.z);
   }

   float noise(vec3 p) {
     vec3 i = floor(p);
     vec3 f = fract(p);
     f = f * f * (3.0 - 2.0 * f);
     return mix(
       mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
           mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
           mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
   }

   float fbm(vec3 p) {
     float v = 0.0; float a = 0.5;
     for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
     return v;
   }

   void main() {
     vec3 dir = normalize(vWorldDir);

     // Stars - use smooth circular falloff instead of hard squares
     vec3 starCell = floor(dir * 400.0);
     vec3 starFrac = fract(dir * 400.0) - 0.5;
     float starDist = length(starFrac);
     float starRand = hash(starCell);
     float starBright = smoothstep(0.05, 0.0, starDist) * step(0.997, starRand);
     // Vary star brightness
     starBright *= 0.4 + 0.6 * hash(starCell + 1.0);

     // Dim galactic band stars
     float band = exp(-12.0 * dir.y * dir.y);
     vec3 bandCell = floor(dir * 600.0);
     vec3 bandFrac = fract(dir * 600.0) - 0.5;
     float bandDist = length(bandFrac);
     float bandStar = smoothstep(0.06, 0.0, bandDist) * step(0.994, hash(bandCell)) * band * 0.4;

     // Very subtle nebula - barely visible, desaturated
     float n1 = fbm(dir * 1.5 + uTime * 0.005);
     n1 = smoothstep(0.45, 0.75, n1) * 0.04;
     vec3 nebula = vec3(0.06, 0.03, 0.1) * n1;

     // Compose
     vec3 color = vec3(0.002, 0.002, 0.005); // near-black base
     color += nebula;
     color += vec3(0.85, 0.9, 1.0) * starBright;
     color += vec3(0.7, 0.75, 0.85) * bandStar;

     gl_FragColor = vec4(color, 1.0);
   }`
);

extend({ NebulaSkyMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    nebulaSkyMaterial: object;
  }
}

export function Nebula() {
  const matRef = useRef<ShaderMaterial>(null!);

  useFrame((_, delta) => {
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <nebulaSkyMaterial ref={matRef} side={BackSide} depthWrite={false} />
    </mesh>
  );
}
