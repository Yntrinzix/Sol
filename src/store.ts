import { create } from 'zustand';

interface SolState {
  timeSpeed: number;
  isPlaying: boolean;
  selectedPlanet: string | null;
  cameraTarget: string | null;
  viewMode: 'orbit' | 'exploded';
  trueScale: boolean;
  setTimeSpeed: (speed: number) => void;
  selectPlanet: (id: string | null) => void;
  setCameraTarget: (target: string | null) => void;
  togglePlay: () => void;
  setViewMode: (mode: 'orbit' | 'exploded') => void;
  toggleScale: () => void;
}

export const useStore = create<SolState>((set) => ({
  timeSpeed: 1,
  isPlaying: true,
  selectedPlanet: null,
  cameraTarget: null,
  viewMode: 'orbit',
  trueScale: false,
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  selectPlanet: (id) => set({ selectedPlanet: id, viewMode: 'orbit' }),
  setCameraTarget: (target) => set({ cameraTarget: target }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleScale: () => set((s) => ({ trueScale: !s.trueScale })),
}));
