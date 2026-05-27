export function scaleDistance(au: number): number {
  if (au === 0) return 0;
  return au * 100;
}

export function scaleRadius(km: number): number {
  return km / 6371 * 0.006;
}

export function scalePosition(pos: [number, number, number]): [number, number, number] {
  const [x, y, z] = pos;
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return [0, 0, 0];
  const scaled = scaleDistance(r);
  return [x / r * scaled, y / r * scaled, z / r * scaled];
}
