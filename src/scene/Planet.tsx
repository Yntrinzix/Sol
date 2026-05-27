import { forwardRef, useRef, useCallback, useState, useMemo } from 'react';
import type { Object3D, SphereGeometry } from 'three';
import { BufferGeometry, Float32BufferAttribute, DoubleSide } from 'three';
import type { Group } from 'three';
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
      { inner: 1.11, outer: 1.24, color: '#8b7d6b', opacity: 0.3 },  // D ring (faint)
      { inner: 1.24, outer: 1.53, color: '#a89880', opacity: 0.6 },  // C ring
      { inner: 1.53, outer: 1.95, color: '#d4c4a8', opacity: 0.9 },  // B ring (brightest)
      { inner: 2.03, outer: 2.27, color: '#c8b898', opacity: 0.8 },  // A ring
      { inner: 2.33, outer: 2.34, color: '#b0a090', opacity: 0.5 },  // F ring (narrow)
      { inner: 2.72, outer: 2.85, color: '#706050', opacity: 0.2 },  // G ring (faint)
      { inner: 3.0, outer: 4.0, color: '#504030', opacity: 0.08 },   // E ring (very faint, wide)
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
        {/* Planet mesh - true scale */}
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

        {/* Tooltip on hover */}
        {hovered && <Tooltip name={planet.name} position={[0, scale + 0.5, 0]} />}

        {/* Earth cloud layer */}
        {planet.id === 'earth' && <CloudLayer radius={scale} />}

        {/* Moons */}
        {MOONS.filter(m => m.parentId === planet.id).map(moon => (
          <MoonMesh key={moon.id} moon={moon} />
        ))}

        {/* Rings - LOD: flat discs when far, particles when close */}
        {ring && <RingLOD bands={ring.bands} tilt={ring.tilt} planetRadius={scale} planetId={planet.id} />}
      </group>
    );
  },
);

Planet.displayName = 'Planet';

function RingLOD({ bands, tilt, planetRadius, planetId }: { bands: typeof RINGS['saturn']['bands']; tilt: number; planetRadius: number; planetId: string }) {
  const close = useRef(false);
  const discsRef = useRef<Group>(null);
  const particlesRef = useRef<Group>(null);

  useFrame(({ camera }) => {
    const planet = camera.parent?.parent?.getObjectByName?.(planetId);
    const shouldBeClose = planet
      ? camera.position.distanceTo(planet.position) < planetRadius * 15
      : useStore.getState().selectedPlanet === planetId;
    close.current = shouldBeClose;
    if (discsRef.current) discsRef.current.visible = !shouldBeClose;
    if (particlesRef.current) particlesRef.current.visible = shouldBeClose;
  });

  return (
    <>
      <group ref={discsRef}>
        <RingDiscs bands={bands} tilt={tilt} planetRadius={planetRadius} />
      </group>
      <group ref={particlesRef} visible={false}>
        <RingParticles bands={bands} tilt={tilt} planetRadius={planetRadius} />
      </group>
    </>
  );
}

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

function RingParticles({ bands, tilt, planetRadius }: { bands: typeof RINGS['saturn']['bands']; tilt: number; planetRadius: number }) {
  const trueScale = useStore((s) => s.trueScale);
  const pointSize = trueScale ? 0.0005 : 0.008;
  const totalCount = trueScale ? 2_000_000 : 500_000;
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += 0.05 * delta;
  });
  const geometry = useMemo(() => {
    // Total particles - Saturn's rings are DENSE (billions of ice chunks)
    const positions = new Float32Array(totalCount * 3);
    let idx = 0;

    // Calculate total area for proportional distribution
    const areas = bands.map(b => (b.outer * b.outer - b.inner * b.inner));
    const totalArea = areas.reduce((a, b) => a + b, 0);

    for (let bandIdx = 0; bandIdx < bands.length; bandIdx++) {
      const band = bands[bandIdx];
      const bandCount = Math.floor(totalCount * (areas[bandIdx] / totalArea) * band.opacity);
      const innerR = planetRadius * band.inner;
      const outerR = planetRadius * band.outer;

      for (let i = 0; i < bandCount && idx < totalCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const r = innerR + Math.random() * (outerR - innerR);
        const i3 = idx * 3;
        positions[i3] = Math.cos(angle) * r;
        positions[i3 + 1] = Math.sin(angle) * r;
        // Outer bands get more vertical scatter (less solid, more diffuse)
        const scatterFactor = bandIdx / bands.length; // 0 for inner, ~1 for outer
        positions[i3 + 2] = (Math.random() - 0.5) * planetRadius * (0.002 + scatterFactor * 0.03);
        idx++;
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions.slice(0, idx * 3), 3));
    return geo;
  }, [bands, planetRadius, totalCount]);

  const tiltRad = tilt * Math.PI / 180;

  return (
    <group rotation={[tiltRad, 0, 0]}>
      <group ref={groupRef}>
        <points geometry={geometry}>
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={{ uSize: { value: pointSize }, uOpacity: { value: 0.9 }, uPlanetRadius: { value: planetRadius } }}
          vertexShader={`
            uniform float uSize;
            uniform float uPlanetRadius;
            varying float vLight;
            void main() {
              vec4 worldPos = modelMatrix * vec4(position, 1.0);
              vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = uSize * (300.0 / -mvPos.z);
              gl_Position = projectionMatrix * mvPos;

              // Sun direction (sun at origin, planet group is at planet position)
              vec3 toSun = normalize(-worldPos.xyz);

              // Basic ring normal (flat disc)
              vec3 normal = vec3(0.0, 0.0, 1.0);
              vLight = max(dot(normal, toSun), 0.0);

              // Shadow from planet body: check if this particle is behind the planet
              // Project particle position onto sun direction, check if within planet cylinder
              vec3 localPos = position; // position relative to planet center
              float distFromAxis = length(localPos.xy); // distance from planet center in ring plane
              // If particle is on the dark side AND within planet's shadow cylinder
              float behindPlanet = dot(normalize(localPos), -toSun);
              if (behindPlanet > 0.7 && distFromAxis < uPlanetRadius * 1.1) {
                vLight *= 0.05; // deep shadow
              }
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying float vLight;
            void main() {
              vec3 color = vec3(0.83, 0.76, 0.65) * (0.15 + 0.85 * vLight);
              gl_FragColor = vec4(color, uOpacity * (0.2 + 0.8 * vLight));
            }
          `}
        />
      </points>
      </group>
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
  const trueScale = useStore((s) => s.trueScale);

  const moonRadius = trueScale
    ? moon.radius / 6371 * 0.006
    : Math.max(moon.radius / 6371 * 0.3, 0.05);

  const orbitDist = trueScale
    ? moon.orbitRadius / 149597870 * 100
    : Math.max(moon.orbitRadius / moon.orbitRadius * 1.5, 0.8);

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
