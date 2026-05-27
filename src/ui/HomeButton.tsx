import { useStore } from '../store';

export function HomeButton() {
  const selectedPlanet = useStore((s) => s.selectedPlanet);

  if (!selectedPlanet) return null;

  return (
    <button
      onClick={() => {
        useStore.getState().selectPlanet(null);
      }}
      style={{
        position: 'fixed',
        top: 16,
        left: 16,
        minWidth: 48,
        minHeight: 48,
        padding: '8px 16px',
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 14,
        touchAction: 'manipulation',
        boxSizing: 'border-box',
      }}
    >
      ← Overview
    </button>
  );
}
