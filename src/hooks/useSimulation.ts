import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Object3D } from 'three';
import { PLANETS } from '../data/planets';
import { getOrbitalPosition } from '../physics/kepler';
import { scalePosition } from '../physics/scale';
import { useStore } from '../store';

export { scalePosition };

export function useSimulation(refs: React.RefObject<Object3D | null>[]) {
  const simTime = useRef(0);

  useFrame((_, delta) => {
    const { timeSpeed, isPlaying } = useStore.getState();
    if (!isPlaying) return;

    simTime.current += delta * timeSpeed * 86400;

    PLANETS.forEach((planet, i) => {
      if (planet.type === 'star') return;
      const ref = refs[i];
      if (!ref.current) return;

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
    });
  });
}
