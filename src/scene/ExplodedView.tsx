import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { SphereGeometry, Group } from 'three';
import { useStore } from '../store';
import { PLANETS } from '../data/planets';
import { PLANET_LAYERS } from '../data/layers';
import { scaleRadius } from '../physics/scale';

const geometry = new SphereGeometry(1, 32, 32);
const SEPARATION = 1.5;

export function ExplodedView() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  const viewMode = useStore((s) => s.viewMode);

  if (viewMode !== 'exploded' || !selectedPlanet) return null;

  const planet = PLANETS.find((p) => p.id === selectedPlanet);
  if (!planet) return null;

  const layers = PLANET_LAYERS[planet.id];
  if (!layers) return null;

  const planetRadius = scaleRadius(planet.radius);

  return (
    <ExplodedLayers planetId={planet.id} layers={layers} planetRadius={planetRadius} />
  );
}

interface LayersProps {
  planetId: string;
  layers: { name: string; color: string; radiusFraction: number }[];
  planetRadius: number;
}

function ExplodedLayers({ planetId, layers, planetRadius }: LayersProps) {
  const progressRef = useRef(0);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    const { viewMode, selectedPlanet } = useStore.getState();
    if (viewMode !== 'exploded' || selectedPlanet !== planetId) return;

    progressRef.current = Math.min(1, progressRef.current + delta * 1.5);

    const scene = state.scene;
    const planetMesh = scene.getObjectByName(planetId);
    if (planetMesh && groupRef.current) {
      groupRef.current.position.copy(planetMesh.position);
    }

    if (!groupRef.current) return;
    const children = groupRef.current.children;
    children.forEach((child, i) => {
      const targetY = i * SEPARATION * progressRef.current;
      child.position.y = targetY;
    });
  });

  return (
    <group ref={groupRef}>
      {layers.map((layer) => {
        const radius = layer.radiusFraction * planetRadius;
        return (
          <mesh key={layer.name} geometry={geometry} scale={[radius, radius, radius]}>
            <meshStandardMaterial color={layer.color} transparent opacity={0.8} />
            <Html distanceFactor={10} position={[radius + 0.3, 0, 0]}>
              <span style={{ color: 'white', fontSize: '10px', whiteSpace: 'nowrap' }}>
                {layer.name}
              </span>
            </Html>
          </mesh>
        );
      })}
    </group>
  );
}
