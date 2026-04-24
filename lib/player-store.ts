import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

interface PlayerState {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  setCurrentSong: (song: Song) => set({ currentSong: song }),
}));