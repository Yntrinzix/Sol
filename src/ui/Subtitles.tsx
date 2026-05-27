import { PLANETS } from '../data/planets';
import { useStore } from '../store';

export function Subtitles() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  const planet = PLANETS.find((p) => p.id === selectedPlanet);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: 600,
        padding: '10px 20px',
        background: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 20,
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        opacity: planet ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      {planet?.description}
    </div>
  );
}
