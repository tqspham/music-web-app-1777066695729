import { create } from 'zustand';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

interface SearchState {
  searchResults: Song[];
  searchQuery: string;
  setSearchResults: (songs: Song[]) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchResults: [],
  searchQuery: '',
  setSearchResults: (songs: Song[]) => set({ searchResults: songs }),
  setSearchQuery: (query: string) => set({ searchQuery: query }),
}));