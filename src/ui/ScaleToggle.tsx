import { useStore } from '../store';

export function ScaleToggle() {
  const trueScale = useStore((s) => s.trueScale);
  const toggleScale = useStore((s) => s.toggleScale);

  return (
    <button
      onClick={toggleScale}
      style={{
        position: 'fixed',
        top: 60,
        right: 16,
        background: '#000000aa',
        border: '1px solid #ffffff44',
        borderRadius: 6,
        padding: '8px 14px',
        color: '#fff',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      {trueScale ? '🔬 True Scale' : '👶 Kids Scale'}
    </button>
  );
}
