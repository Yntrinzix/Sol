import { useStore } from '../store';

export function TimeControls() {
  const isPlaying = useStore((s) => s.isPlaying);
  const timeSpeed = useStore((s) => s.timeSpeed);
  const togglePlay = useStore((s) => s.togglePlay);
  const setTimeSpeed = useStore((s) => s.setTimeSpeed);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
        padding: '8px 16px',
        color: '#fff',
        zIndex: 10,
        boxSizing: 'border-box',
        maxWidth: '100vw',
      }}
    >
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause simulation' : 'Play simulation'}
        style={{
          minWidth: 48,
          minHeight: 48,
          width: 48,
          height: 48,
          fontSize: 20,
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          touchAction: 'manipulation',
        }}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <input
        type="range"
        min={0.1}
        max={100}
        step={0.1}
        value={timeSpeed}
        onChange={(e) => setTimeSpeed(Number(e.target.value))}
        aria-label="Simulation speed"
        style={{ width: 120 }}
      />
      <span style={{ minWidth: 40, fontSize: 14 }}>{timeSpeed.toFixed(1)}x</span>
    </div>
  );
}
