import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { Planet } from '../data/planets';
import { getOrbitalPosition } from '../physics/kepler';
import { scalePosition } from '../hooks/useSimulation';

interface Props {
  planet: Planet;
}

export function OrbitTrail({ planet }: Props) {
  const points = useMemo(() => {
    const periodSeconds = planet.orbitalPeriod * 86400;
    return Array.from({ length: 101 }, (_, i) => {
      const t = (i / 100) * periodSeconds;
      return scalePosition(getOrbitalPosition(planet, t));
    });
  }, [planet]);

  return <Line points={points} color={planet.color} lineWidth={0.5} opacity={0.12} transparent renderOrder={-1} />;
}
