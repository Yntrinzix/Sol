import { useStore } from '../store';
import { PLANETS } from '../data/planets';

const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function formatMass(mass: number): string {
  const exp = Math.floor(Math.log10(mass));
  const coeff = mass / 10 ** exp;
  const sup = String(exp)
    .split('')
    .map((d) => superscriptDigits[Number(d)])
    .join('');
  return `${coeff.toFixed(2)} × 10${sup} kg`;
}

function formatRadius(radius: number): string {
  return `${Math.round(radius).toLocaleString()} km`;
}

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  right: 0,
  transform: 'translateY(-50%) translateX(0)',
  background: '#000000cc',
  color: '#fff',
  borderRadius: 12,
  padding: 24,
  maxWidth: 320,
  transition: 'transform 0.3s ease',
  zIndex: 10,
};

const hiddenStyle: React.CSSProperties = {
  ...panelStyle,
  transform: 'translateY(-50%) translateX(100%)',
  pointerEvents: 'none',
};

export function InfoPanel() {
  const selectedId = useStore((s) => s.selectedPlanet);
  const planet = PLANETS.find((p) => p.id === selectedId);

  return (
    <aside
      aria-label="Planet information"
      style={planet ? panelStyle : hiddenStyle}
    >
      {planet && (
        <>
          <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>{planet.name}</h2>
          <dl style={{ margin: 0, lineHeight: 1.8 }}>
            <dt style={{ fontWeight: 600, display: 'inline' }}>Mass: </dt>
            <dd style={{ display: 'inline', margin: 0 }}>{formatMass(planet.mass)}</dd>
            <br />
            <dt style={{ fontWeight: 600, display: 'inline' }}>Radius: </dt>
            <dd style={{ display: 'inline', margin: 0 }}>{formatRadius(planet.radius)}</dd>
            <br />
            <dt style={{ fontWeight: 600, display: 'inline' }}>Orbital Period: </dt>
            <dd style={{ display: 'inline', margin: 0 }}>{planet.orbitalPeriod.toLocaleString()} days</dd>
            <br />
            <dt style={{ fontWeight: 600, display: 'inline' }}>Surface Gravity: </dt>
            <dd style={{ display: 'inline', margin: 0 }}>{planet.surfaceGravity} m/s²</dd>
            <br />
            <dt style={{ fontWeight: 600, display: 'inline' }}>Moons: </dt>
            <dd style={{ display: 'inline', margin: 0 }}>{planet.moons}</dd>
          </dl>
          <p style={{ marginTop: 12, opacity: 0.85, fontSize: 14 }}>{planet.description}</p>
        </>
      )}
    </aside>
  );
}
