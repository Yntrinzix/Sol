export interface Moon {
  id: string;
  name: string;
  parentId: string;
  radius: number;
  orbitRadius: number;
  orbitalPeriod: number;
  color: string;
  texture?: string;
  irregular?: boolean;
  model?: string; // GLB model path for irregular moons
}

export const MOONS: Moon[] = [
  // Earth
  { id: 'luna', name: 'Moon', parentId: 'earth', radius: 1737, orbitRadius: 384400, orbitalPeriod: 27.32, color: '#aaaaaa', texture: '/textures/moon.jpg' },

  // Mars - irregular shaped rocks
  { id: 'phobos', name: 'Phobos', parentId: 'mars', radius: 11.3, orbitRadius: 9376, orbitalPeriod: 0.319, color: '#887766', irregular: true, model: '/nasa-assets/models/phobos.gltf' },
  { id: 'deimos', name: 'Deimos', parentId: 'mars', radius: 6.2, orbitRadius: 23460, orbitalPeriod: 1.263, color: '#998877', irregular: true, model: '/nasa-assets/models/deimos.gltf' },

  // Jupiter - Galilean moons
  { id: 'io', name: 'Io', parentId: 'jupiter', radius: 1822, orbitRadius: 421700, orbitalPeriod: 1.769, color: '#ccaa44' },
  { id: 'europa', name: 'Europa', parentId: 'jupiter', radius: 1561, orbitRadius: 671034, orbitalPeriod: 3.551, color: '#ccbbaa' },
  { id: 'ganymede', name: 'Ganymede', parentId: 'jupiter', radius: 2634, orbitRadius: 1070412, orbitalPeriod: 7.155, color: '#998877' },
  { id: 'callisto', name: 'Callisto', parentId: 'jupiter', radius: 2410, orbitRadius: 1882709, orbitalPeriod: 16.689, color: '#665544' },

  // Saturn
  { id: 'titan', name: 'Titan', parentId: 'saturn', radius: 2575, orbitRadius: 1221870, orbitalPeriod: 15.945, color: '#cc9944' },
  { id: 'enceladus', name: 'Enceladus', parentId: 'saturn', radius: 252, orbitRadius: 238042, orbitalPeriod: 1.370, color: '#ffffff' },
  { id: 'mimas', name: 'Mimas', parentId: 'saturn', radius: 198, orbitRadius: 185539, orbitalPeriod: 0.942, color: '#cccccc', irregular: true, model: '/nasa-assets/models/mimas.gltf' },
  { id: 'hyperion', name: 'Hyperion', parentId: 'saturn', radius: 135, orbitRadius: 1481009, orbitalPeriod: 21.277, color: '#aa9977', irregular: true, model: '/nasa-assets/models/hyperion.gltf' },
  { id: 'phoebe', name: 'Phoebe', parentId: 'saturn', radius: 106, orbitRadius: 12947780, orbitalPeriod: -550.31, color: '#666655', irregular: true, model: '/nasa-assets/models/phoebe.gltf' },

  // Uranus
  { id: 'titania', name: 'Titania', parentId: 'uranus', radius: 789, orbitRadius: 436300, orbitalPeriod: 8.706, color: '#aabbcc' },
  { id: 'oberon', name: 'Oberon', parentId: 'uranus', radius: 761, orbitRadius: 583500, orbitalPeriod: 13.463, color: '#998888' },

  // Neptune
  { id: 'triton', name: 'Triton', parentId: 'neptune', radius: 1353, orbitRadius: 354759, orbitalPeriod: -5.877, color: '#aabbcc' },
];
