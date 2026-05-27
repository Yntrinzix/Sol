import { create } from 'zustand';

interface SolState {
  timeSpeed: number;
  isPlaying: boolean;
  selectedPlanet: string | null;
  viewMode: 'orbit' | 'exploded';
  setTimeSpeed: (speed: number) => void;
  selectPlanet: (id: string | null) => void;
  togglePlay: () => void;
  setViewMode: (mode: 'orbit' | 'exploded') => void;
}

export const useStore = create<SolState>((set) => ({
  timeSpeed: 1,
  isPlaying: true,
  selectedPlanet: null,
  viewMode: 'orbit',
  setTimeSpeed: (speed) => set({ timeSpeed: speed }),
  selectPlanet: (id) => set({ selectedPlanet: id, viewMode: 'orbit' }),
  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
