import { useStore } from '../store';

export function scaleDistance(au: number): number {
  if (au === 0) return 0;
  if (useStore.getState().trueScale) return au * 100;
  return Math.pow(au, 0.6) * 20;
}

export function scaleRadius(km: number): number {
  if (useStore.getState().trueScale) return km / 6371 * 0.006;
  if (km > 100000) return 4.0;
  return Math.pow(km / 2440, 0.5) * 0.3;
}

export function scalePosition(pos: [number, number, number]): [number, number, number] {
  const [x, y, z] = pos;
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return [0, 0, 0];
  const scaled = scaleDistance(r);
  return [x / r * scaled, y / r * scaled, z / r * scaled];
}
