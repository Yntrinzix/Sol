import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { DirectionalLight, Vector3 } from 'three';
import { useStore } from '../store';

const DEFAULT_DIR = new Vector3(1, 1, 0).normalize();

export function Lighting() {
  const lightRef = useRef<DirectionalLight>(null);
  const { scene } = useThree();

  useFrame(() => {
    if (!lightRef.current) return;
    const selected = useStore.getState().selectedPlanet;
    if (selected) {
      const obj = scene.getObjectByName(selected);
      if (obj) {
        lightRef.current.target.position.copy(obj.position);
        lightRef.current.target.updateMatrixWorld();
        return;
      }
    }
    lightRef.current.target.position.copy(DEFAULT_DIR);
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <ambientLight intensity={0.02} />
      <directionalLight ref={lightRef} position={[0, 0, 0]} intensity={1.5} />
    </>
  );
}
