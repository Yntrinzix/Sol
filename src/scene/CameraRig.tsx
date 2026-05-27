import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { PLANETS } from '../data/planets';
import { getOrbitalPosition } from '../physics/kepler';
import { scalePosition } from '../hooks/useSimulation';
import { scaleRadius } from '../physics/scale';
import { useStore } from '../store';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const OVERVIEW_POS = new Vector3(2, -150, 30);
const OVERVIEW_TARGET = new Vector3(0, 0, 0);
let frameCount = 0;

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const simTime = useRef(0);
  const prevSelected = useRef<string | null>(null);
  const isAnimating = useRef(false);
  const animProgress = useRef(0);
  const animFrom = useRef(new Vector3());
  const animTo = useRef(new Vector3());
  const targetFrom = useRef(new Vector3());
  const targetTo = useRef(new Vector3());

  useFrame(({ camera }, delta) => {
    const { selectedPlanet, timeSpeed, isPlaying } = useStore.getState();

    if (isPlaying) {
      simTime.current += delta * timeSpeed * 86400;
    }

    // Debug output
    frameCount++;
    if (frameCount % 6 === 0) {
      const el = document.getElementById('camera-debug-data');
      if (el) {
        const p = camera.position;
        const t = controlsRef.current?.target;
        el.textContent =
          `Pos: [${p.x.toFixed(1)}, ${p.y.toFixed(1)}, ${p.z.toFixed(1)}] | ` +
          `Target: [${t?.x.toFixed(1) ?? 0}, ${t?.y.toFixed(1) ?? 0}, ${t?.z.toFixed(1) ?? 0}] | ` +
          `Dist: ${p.length().toFixed(1)}`;
      }
    }

    // Trigger animation on selection change
    if (selectedPlanet !== prevSelected.current) {
      prevSelected.current = selectedPlanet;
      isAnimating.current = true;
      animProgress.current = 0;
      animFrom.current.copy(camera.position);
      targetFrom.current.copy(controlsRef.current.target);

      if (selectedPlanet) {
        const planet = PLANETS.find((p) => p.id === selectedPlanet);
        if (planet && planet.type !== 'star') {
          const raw = getOrbitalPosition(planet, simTime.current);
          const [x, y, z] = scalePosition(raw);
          const planetPos = new Vector3(x, y, z);
          const radius = scaleRadius(planet.radius);
          const dist = radius * 3; // close enough to fill the view
          animTo.current.copy(planetPos.clone().add(new Vector3(dist * 0.3, -dist * 0.5, dist)));
          targetTo.current.copy(planetPos);
        }
      } else {
        animTo.current.copy(OVERVIEW_POS);
        targetTo.current.copy(OVERVIEW_TARGET);
      }
    }

    // Animate camera transition
    if (isAnimating.current) {
      animProgress.current = Math.min(1, animProgress.current + delta * 2);
      const t = 1 - Math.pow(1 - animProgress.current, 3); // ease-out cubic

      camera.position.lerpVectors(animFrom.current, animTo.current, t);
      controlsRef.current.target.lerpVectors(targetFrom.current, targetTo.current, t);
      controlsRef.current.update();

      if (animProgress.current >= 1) {
        isAnimating.current = false;
      }
    }

    // If following a selected planet (after animation), update target to track it
    if (!isAnimating.current && selectedPlanet) {
      const planet = PLANETS.find((p) => p.id === selectedPlanet);
      if (planet && planet.type !== 'star') {
        const raw = getOrbitalPosition(planet, simTime.current);
        const [x, y, z] = scalePosition(raw);
        const planetPos = new Vector3(x, y, z);
        // Move both camera and target to follow planet movement
        const offset = camera.position.clone().sub(controlsRef.current.target);
        controlsRef.current.target.copy(planetPos);
        camera.position.copy(planetPos.clone().add(offset));
        controlsRef.current.update();
      }
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        enablePan
        minDistance={0.001}
        maxDistance={10000}
        maxPolarAngle={Math.PI * 0.95}
      />
      <Html>
        <div id="camera-debug-data" style={{ display: 'none' }} />
      </Html>
    </>
  );
}
