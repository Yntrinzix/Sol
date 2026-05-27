import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Object3D } from 'three';
import { PLANETS } from '../data/planets';
import { getOrbitalPosition } from '../physics/kepler';
import { scaleDistance } from '../physics/scale';
import { useStore } from '../store';

function scalePosition(pos: [number, number, number]): [number, number, number] {
  const [x, y, z] = pos;
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return [0, 0, 0];
  const scaled = scaleDistance(r);
  return [x / r * scaled, y / r * scaled, z / r * scaled];
}

export { scalePosition };

export function useSimulation(refs: React.RefObject<Object3D | null>[]) {
  const simTime = useRef(0);

  useFrame((_, delta) => {
    const { timeSpeed, isPlaying } = useStore.getState();
    if (!isPlaying) return;

    simTime.current += delta * timeSpeed * 86400;

    for (let i = 0; i < PLANETS.length; i++) {
      const planet = PLANETS[i];
      if (planet.type === 'star') continue;
      const ref = refs[i];
      if (!ref.current) continue;

      const pos = getOrbitalPosition(planet, simTime.current);
      const [x, y, z] = scalePosition(pos);
      ref.current.position.set(x, y, z);

      // Axial rotation (spin) - rotate the mesh child
      // rotationPeriod is in hours, simTime is in seconds
      const mesh = ref.current.children[0];
      if (mesh) {
        const rotPerSec = (2 * Math.PI) / (Math.abs(planet.rotationPeriod) * 3600);
        const dir = planet.rotationPeriod < 0 ? -1 : 1;
        mesh.rotation.y += dir * rotPerSec * delta * timeSpeed * 86400;
      }
    }
  });
}
