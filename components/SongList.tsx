'use client';

import { useEffect, useState } from 'react';
import SongCard from '@/components/SongCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSearchStore } from '@/lib/search-store';
import { usePlayerStore } from '@/lib/player-store';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (playlistId: string) => Promise<void>;
  error?: string;
}

import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';

export default function SongList(): React.ReactElement {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSongForPlaylist, setSelectedSongForPlaylist] =
    useState<Song | null>(null);
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState(false);

  const searchResults = useSearchStore((state) => state.searchResults);
  const searchQuery = useSearchStore((state) => state.searchQuery);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);

  useEffect(() => {
    const fetchSongs = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/songs');
        if (!response.ok) {
          throw new Error('Failed to load songs');
        }
        const data = (await response.json()) as { songs: Song[] };
        setSongs(data.songs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load songs');
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const displaySongs = searchQuery ? searchResults : songs;
  const isEmpty = displaySongs.length === 0 && !loading;

  return (
    <div className="mt-8">
      {loading ? (
        <LoadingSpinner message="Loading songs..." />
      ) : error ? (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      ) : isEmpty ? (
        <div className="p-8 text-center text-gray-400">
          {searchQuery
            ? `No songs found matching "${searchQuery}"`
            : 'No songs available'}
        </div>
      ) : (
        <div className="space-y-2">
          {displaySongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={() => setCurrentSong(song)}
              onAddToPlaylist={() => {
                setSelectedSongForPlaylist(song);
                setIsAddingToPlaylist(true);
              }}
            />
          ))}
        </div>
      )}
      {selectedSongForPlaylist && (
        <AddToPlaylistMenu
          isOpen={isAddingToPlaylist}
          onClose={() => {
            setIsAddingToPlaylist(false);
            setSelectedSongForPlaylist(null);
          }}
          song={selectedSongForPlaylist}
        />
      )}
    </div>
  );
}