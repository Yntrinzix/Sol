import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { Planet } from '../data/planets';
import { getOrbitalPosition } from '../physics/kepler';
import { scalePosition } from '../hooks/useSimulation';
import { useStore } from '../store';

interface Props {
  planet: Planet;
}

export function OrbitTrail({ planet }: Props) {
  const trueScale = useStore((s) => s.trueScale);

  const points = useMemo(() => {
    const periodSeconds = planet.orbitalPeriod * 86400;
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * periodSeconds;
      const pos = getOrbitalPosition(planet, t);
      pts.push(scalePosition(pos));
    }
    return pts;
  }, [planet, trueScale]);

  return <Line points={points} color={planet.color} lineWidth={0.5} opacity={0.3} transparent renderOrder={-1} />;
}
