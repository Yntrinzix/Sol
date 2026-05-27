import { CanvasTexture, RepeatWrapping } from 'three';

/**
 * Generate a Saturn ring texture procedurally.
 * Returns a 1024x1 CanvasTexture with color and alpha representing the ring bands.
 */
export function createRingTexture(): CanvasTexture {
  const width = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  // Ring band data: [startFraction, endFraction, r, g, b, opacity]
  // Based on Cassini observations of Saturn's rings
  const bands: [number, number, number, number, number, number][] = [
    // D ring (very faint)
    [0.0, 0.06, 100, 90, 70, 0.1],
    // C ring (semi-transparent)
    [0.06, 0.22, 140, 125, 100, 0.4],
    // B ring (brightest, densest)
    [0.22, 0.47, 210, 195, 170, 0.95],
    // Cassini Division (gap)
    [0.47, 0.52, 30, 25, 20, 0.05],
    // A ring (bright)
    [0.52, 0.72, 190, 175, 150, 0.8],
    // Encke Gap
    [0.65, 0.66, 10, 10, 10, 0.02],
    // A ring continued
    [0.66, 0.72, 180, 165, 140, 0.75],
    // Roche Division
    [0.72, 0.74, 20, 18, 15, 0.03],
    // F ring (narrow, bright)
    [0.74, 0.76, 170, 155, 130, 0.6],
    // G ring (faint)
    [0.80, 0.88, 80, 70, 55, 0.08],
    // E ring (very faint, wide)
    [0.88, 1.0, 60, 55, 45, 0.03],
  ];

  // Fill with transparent black first
  ctx.clearRect(0, 0, width, 1);

  bands.forEach(([start, end, r, g, b, a]) => {
    const x0 = Math.floor(start * width);
    const x1 = Math.floor(end * width);
    for (let x = x0; x < x1; x++) {
      // Add some noise for realism
      const noise = 0.85 + Math.random() * 0.3;
      const rn = Math.min(255, Math.floor(r * noise));
      const gn = Math.min(255, Math.floor(g * noise));
      const bn = Math.min(255, Math.floor(b * noise));
      ctx.fillStyle = `rgba(${rn},${gn},${bn},${a})`;
      ctx.fillRect(x, 0, 1, 1);
    }
  });

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  return texture;
}
