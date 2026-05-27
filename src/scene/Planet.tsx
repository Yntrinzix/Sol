import { forwardRef, useRef, useCallback, useState } from 'react';
import type { Object3D, SphereGeometry } from 'three';
import { DoubleSide } from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useTexture, useGLTF } from '@react-three/drei';
import type { Planet as PlanetData } from '../data/planets';
import { scaleRadius } from '../physics/scale';
import { useStore } from '../store';
import { Tooltip } from '../ui/Tooltip';
import { MOONS } from '../data/moons';


const RINGS: Record<string, { bands: { inner: number; outer: number; color: string; opacity: number }[]; tilt: number }> = {
  saturn: {
    tilt: 26.7,
    bands: [
      { inner: 1.11, outer: 1.24, color: '#8b7d6b', opacity: 0.3 },
      { inner: 1.24, outer: 1.53, color: '#a89880', opacity: 0.6 },
      { inner: 1.53, outer: 1.95, color: '#d4c4a8', opacity: 0.9 },
      { inner: 2.03, outer: 2.27, color: '#c8b898', opacity: 0.8 },
      { inner: 2.33, outer: 2.34, color: '#b0a090', opacity: 0.5 },
      { inner: 2.72, outer: 2.85, color: '#706050', opacity: 0.2 },
      { inner: 3.0, outer: 4.0, color: '#504030', opacity: 0.08 },
    ],
  },
  uranus: {
    tilt: 97.8,
    bands: [
      { inner: 1.4, outer: 1.5, color: '#7799aa', opacity: 0.4 },
      { inner: 1.55, outer: 1.6, color: '#8899aa', opacity: 0.3 },
      { inner: 1.65, outer: 1.8, color: '#aabbcc', opacity: 0.5 },
    ],
  },
};

const TEXTURE_MAP: Record<string, string> = {
  mercury: '/textures/2k_mercury.jpg',
  venus: '/textures/2k_venus_atmosphere.jpg',
  earth: '/textures/2k_earth_daymap.jpg',
  mars: '/textures/2k_mars.jpg',
  jupiter: '/textures/2k_jupiter.jpg',
  saturn: '/textures/2k_saturn.jpg',
  uranus: '/textures/2k_uranus.jpg',
  neptune: '/textures/2k_neptune.jpg',
};

export const Planet = forwardRef<Object3D, { planet: PlanetData; geometry: SphereGeometry }>(
  ({ planet, geometry }, ref) => {
    const scale = scaleRadius(planet.radius);
    const clickTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [hovered, setHovered] = useState(false);
    const viewMode = useStore((s) => s.viewMode);
    const selectedPlanet = useStore((s) => s.selectedPlanet);
    const ring = RINGS[planet.id];
    const texturePath = TEXTURE_MAP[planet.id];

    const handleClick = useCallback(
      (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
          if (selectedPlanet === planet.id) {
            const store = useStore.getState();
            store.setViewMode(store.viewMode === 'exploded' ? 'orbit' : 'exploded');
          }
          return;
        }
        clickTimeout.current = setTimeout(() => {
          clickTimeout.current = null;
          useStore.getState().selectPlanet(planet.id);
        }, 250);
      },
      [planet.id, selectedPlanet],
    );

    const handlePointerOver = useCallback(() => {
      document.body.style.cursor = 'pointer';
      setHovered(true);
    }, []);

    const handlePointerOut = useCallback(() => {
      document.body.style.cursor = 'auto';
      setHovered(false);
    }, []);

    return (
      <group ref={ref} name={planet.id}>
        <mesh
          geometry={geometry}
          scale={[scale, scale, scale]}
          rotation={[Math.PI / 2, 0, 0]}
          visible={!(viewMode === 'exploded' && selectedPlanet === planet.id)}
          castShadow
          receiveShadow
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {texturePath ? <TexturedMaterial path={texturePath} /> : <meshStandardMaterial color={planet.color} />}
        </mesh>

        {hovered && <Tooltip name={planet.name} position={[0, scale + 0.5, 0]} />}

        {planet.id === 'earth' && <CloudLayer radius={scale} />}

        {MOONS.filter(m => m.parentId === planet.id).map(moon => (
          <MoonMesh key={moon.id} moon={moon} />
        ))}

        {ring && <RingDiscs bands={ring.bands} tilt={ring.tilt} planetRadius={scale} />}
      </group>
    );
  },
);

Planet.displayName = 'Planet';

function RingDiscs({ bands, tilt, planetRadius }: { bands: typeof RINGS['saturn']['bands']; tilt: number; planetRadius: number }) {
  const ringTexture = useTexture('/nasa-assets/rings/saturn_rings_top.png');
  const innerR = planetRadius * bands[0].inner;
  const outerR = planetRadius * bands[bands.length - 1].outer;

  return (
    <group rotation={[tilt * Math.PI / 180, 0, 0]}>
      <mesh castShadow receiveShadow>
        <ringGeometry args={[innerR, outerR, 128, 1]} />
        <meshStandardMaterial
          map={ringTexture}
          side={DoubleSide}
          transparent
          alphaTest={0.01}
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

function TexturedMaterial({ path }: { path: string }) {
  const texture = useTexture(path);
  return <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />;
}

function CloudLayer({ radius }: { radius: number }) {
  const cloudTexture = useTexture('/textures/2k_earth_clouds.jpg');
  const ref = useRef<Object3D>(null!);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02;
  });

  const s = radius * 1.01;
  return (
    <mesh ref={ref} scale={[s, s, s]} rotation={[Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={cloudTexture} transparent opacity={0.4} depthWrite={false} />
    </mesh>
  );
}

function MoonMesh({ moon }: { moon: typeof MOONS[number] }) {
  const ref = useRef<Object3D>(null!);

  const moonRadius = moon.radius / 6371 * 0.006;
  const orbitDist = moon.orbitRadius / 149597870 * 100;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const { timeSpeed, isPlaying } = useStore.getState();
    const t = isPlaying ? clock.elapsedTime * timeSpeed : 0;
    const period = Math.abs(moon.orbitalPeriod) * 86400;
    const angle = (t * 86400 / period) * Math.PI * 2 * Math.sign(moon.orbitalPeriod);
    ref.current.position.x = Math.cos(angle) * orbitDist;
    ref.current.position.y = Math.sin(angle) * orbitDist;
    ref.current.position.z = 0;
  });

  if (moon.model) {
    return (
      <group ref={ref} scale={[moonRadius * 0.1, moonRadius * 0.1, moonRadius * 0.1]}>
        <MoonModel path={moon.model} />
      </group>
    );
  }

  return (
    <mesh ref={ref}>
      {moon.irregular
        ? <icosahedronGeometry args={[moonRadius, 0]} />
        : <sphereGeometry args={[moonRadius, 16, 16]} />
      }
      {moon.texture
        ? <MoonTextureMaterial path={moon.texture} />
        : <meshStandardMaterial color={moon.color} roughness={0.9} />
      }
    </mesh>
  );
}

function MoonModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

function MoonTextureMaterial({ path }: { path: string }) {
  const texture = useTexture(path);
  return <meshStandardMaterial map={texture} roughness={0.9} />;
}
