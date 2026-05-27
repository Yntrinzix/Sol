import { DEG_TO_RAD } from './constants';
import type { Planet } from '../data/planets';

/**
 * Solve Kepler's equation M = E - e*sin(E) for eccentric anomaly E
 * using Newton-Raphson iteration.
 */
export function solveKepler(meanAnomaly: number, eccentricity: number): number {
  let E = meanAnomaly; // initial guess
  for (let i = 0; i < 10; i++) {
    const dE = (E - eccentricity * Math.sin(E) - meanAnomaly) /
               (1 - eccentricity * Math.cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-8) break;
  }
  return E;
}

/**
 * Convert eccentric anomaly to true anomaly.
 */
function eccentricToTrue(E: number, e: number): number {
  return 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );
}

/**
 * Get 3D orbital position for a planet at a given time (in seconds).
 * Returns position in AU [x, y, z].
 */
export function getOrbitalPosition(
  planet: Planet,
  timeSeconds: number
): [number, number, number] {
  if (planet.semiMajorAxis === 0) return [0, 0, 0]; // Sun

  const a = planet.semiMajorAxis;
  const e = planet.eccentricity;
  const periodSeconds = planet.orbitalPeriod * 86400;
  const incl = planet.inclination * DEG_TO_RAD;

  // Mean anomaly (radians)
  const M = (2 * Math.PI * timeSeconds) / periodSeconds;

  // Solve for eccentric anomaly
  const E = solveKepler(M % (2 * Math.PI), e);

  // True anomaly
  const v = eccentricToTrue(E, e);

  // Distance from focus (Sun)
  const r = a * (1 - e * Math.cos(E));

  // Position in orbital plane
  const xOrbit = r * Math.cos(v);
  const yOrbit = r * Math.sin(v);

  // Rotate by inclination (simplified - no longitude of ascending node for visual clarity)
  const x = xOrbit;
  const y = yOrbit * Math.cos(incl);
  const z = yOrbit * Math.sin(incl);

  return [x, y, z];
}
