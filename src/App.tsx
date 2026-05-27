import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { SolarSystem } from './scene/SolarSystem';
import { CameraRig } from './scene/CameraRig';
import { HomeButton } from './ui/HomeButton';
import { InfoPanel } from './ui/InfoPanel';
import { TimeControls } from './ui/TimeControls';
import { Subtitles } from './ui/Subtitles';
import { CameraControls } from './ui/CameraControls';
import { PlanetList } from './ui/PlanetList';
import { ScaleToggle } from './ui/ScaleToggle';
import { useAudio } from './hooks/useAudio';
import { useStore } from './store';

export default function App() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  const { play, stop } = useAudio();

  useEffect(() => {
    if (selectedPlanet) play(selectedPlanet);
    else stop();
  }, [selectedPlanet, play, stop]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden', boxSizing: 'border-box' }}>
      <Canvas shadows camera={{ position: [2, -150, 30], fov: 50, near: 0.001, far: 20000 }} dpr={[1, 2]}>
        <AdaptiveDpr pixelated />
        <Suspense fallback={null}>
          <SolarSystem />
          <CameraRig />
        </Suspense>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.6}
            luminanceSmoothing={0.4}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
      <PlanetList />
      <ScaleToggle />
      <HomeButton />
      <InfoPanel />
      <Subtitles />
      <CameraControls />
      <TimeControls />
    </div>
  );
}
