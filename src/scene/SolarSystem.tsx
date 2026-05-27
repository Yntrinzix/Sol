import { useRef, useMemo, createRef } from 'react';
import type { Object3D } from 'three';
import { SphereGeometry } from 'three';
import { PLANETS } from '../data/planets';
import { useSimulation } from '../hooks/useSimulation';
import { Sun } from './Sun';
import { Planet } from './Planet';
import { OrbitTrail } from './OrbitTrail';
import { Lighting } from './Lighting';
import { AsteroidBelt } from './AsteroidBelt';
import { ExplodedView } from './ExplodedView';

export function SolarSystem() {
  const planetRefs = useRef(PLANETS.map(() => createRef<Object3D>())).current;
  const sharedGeometry = useMemo(() => new SphereGeometry(1, 32, 32), []);

  useSimulation(planetRefs);

  return (
    <>
      <Lighting />
      <Sun />
      <AsteroidBelt />
      <ExplodedView />
      {PLANETS.filter((p) => p.type !== 'star').map((planet) => {
        const refIndex = PLANETS.indexOf(planet);
        return (
          <group key={planet.id}>
            <Planet ref={planetRefs[refIndex]} planet={planet} geometry={sharedGeometry} />
            <OrbitTrail planet={planet} />
          </group>
        );
      })}
    </>
  );
}
