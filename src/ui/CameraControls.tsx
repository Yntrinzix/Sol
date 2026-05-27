import { useEffect, useState } from 'react';

export function CameraControls() {
  const [debug, setDebug] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.getElementById('camera-debug-data');
      if (el) setDebug(el.textContent || '');
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div style={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        background: '#000000aa',
        borderRadius: 8,
        padding: '12px 16px',
        color: '#ffffffcc',
        fontSize: 12,
        lineHeight: '20px',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4, color: '#fff' }}>Controls</div>
        <div>🖱️ Left drag — Rotate</div>
        <div>🖱️ Right drag — Pan</div>
        <div>🖱️ Scroll — Zoom</div>
        <div style={{ marginTop: 4, opacity: 0.7 }}>Touch: 1-finger rotate, 2-finger zoom/pan</div>
      </div>
      <div style={{
        position: 'fixed',
        top: 16,
        left: 16,
        background: '#000000cc',
        borderRadius: 6,
        padding: '8px 12px',
        color: '#00ff88',
        fontSize: 11,
        fontFamily: 'monospace',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {debug}
      </div>
    </>
  );
}
