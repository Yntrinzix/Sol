import { useRef, useMemo } from 'react';
import { Group, BufferGeometry, Float32BufferAttribute } from 'three';
import { useFrame } from '@react-three/fiber';
import { scaleDistance } from '../physics/scale';
import { useStore } from '../store';

export function AsteroidBelt() {
  const trueScale = useStore((s) => s.trueScale);
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  // Hide asteroid belt when zoomed into a planet
  if (selectedPlanet) return null;
  return <AsteroidBeltInner key={trueScale ? 't' : 'k'} />;
}

function AsteroidBeltInner() {
  const groupRef = useRef<Group>(null);
  const trueScale = useStore((s) => s.trueScale);
  const count = trueScale ? 1_000_000 : 2_000;

  const geometry = useMemo(() => {
    const innerR = scaleDistance(2.2);
    const outerR = scaleDistance(3.2);
    const width = outerR - innerR;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      // Gaussian-ish distribution: denser in middle, sparse at edges
      const gaussian = (Math.random() + Math.random() + Math.random()) / 3; // central tendency
      const r = innerR + gaussian * (outerR - innerR);
      const i3 = i * 3;
      positions[i3] = Math.cos(angle) * r;
      positions[i3 + 1] = Math.sin(angle) * r;
      // Wider vertical scatter, also denser near plane
      const vertGaussian = (Math.random() - 0.5) + (Math.random() - 0.5);
      positions[i3 + 2] = vertGaussian * width * 0.15;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    return geo;
  }, [count]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += 0.002 * delta;
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry}>
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uSize: { value: trueScale ? 0.003 : 0.02 }, uOpacity: { value: 0.5 } }}
          vertexShader={`
            uniform float uSize;
            varying float vLight;
            void main() {
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = uSize * (300.0 / -mvPos.z);
              gl_Position = projectionMatrix * mvPos;
              // Light: how much this point faces the sun (at origin)
              vec3 toSun = normalize(-position);
              vec3 normal = normalize(position); // point outward from center
              vLight = max(dot(normal, toSun), 0.0);
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying float vLight;
            void main() {
              vec3 color = vec3(0.67, 0.6, 0.47) * (0.1 + 0.9 * vLight);
              gl_FragColor = vec4(color, uOpacity * (0.2 + 0.8 * vLight));
            }
          `}
        />
      </points>
    </group>
  );
}
