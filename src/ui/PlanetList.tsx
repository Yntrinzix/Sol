import { PLANETS } from '../data/planets';
import { useStore } from '../store';

export function PlanetList() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);
  const selectPlanet = useStore((s) => s.selectPlanet);

  return (
    <div style={{
      position: 'fixed',
      left: 16,
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
    }}>
      {PLANETS.map((planet) => (
        <button
          key={planet.id}
          onClick={() => selectPlanet(planet.id === selectedPlanet ? null : planet.id)}
          style={{
            background: selectedPlanet === planet.id ? '#ffffff22' : '#00000088',
            border: selectedPlanet === planet.id ? '1px solid #fff' : '1px solid #ffffff33',
            borderRadius: 6,
            padding: '6px 12px',
            color: '#fff',
            fontSize: 12,
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: planet.color,
            display: 'inline-block',
            flexShrink: 0,
          }} />
          {planet.name}
        </button>
      ))}
    </div>
  );
}
