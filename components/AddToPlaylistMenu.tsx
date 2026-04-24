'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

interface Playlist {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
}

interface AddToPlaylistMenuProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
}

export default function AddToPlaylistMenu({
  isOpen,
  onClose,
  song,
}: AddToPlaylistMenuProps): React.ReactElement | null {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchPlaylists = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch('/api/playlists');
        if (!response.ok) {
          throw new Error('Failed to load playlists');
        }
        const data = (await response.json()) as { playlists: Playlist[] };
        setPlaylists(data.playlists);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load playlists'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [isOpen]);

  const handleSelectPlaylist = async (playlistId: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId: song.id }),
      });
      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || 'Failed to add song');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add song');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading...</div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            No playlists available. Create one first!
          </div>
        ) : (
          <div className="space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => handleSelectPlaylist(playlist.id)}
                className="w-full text-left px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                aria-label={`Add song to ${playlist.name} playlist`}
              >
                <div className="font-semibold">{playlist.name}</div>
                <div className="text-sm text-gray-400">
                  {playlist.songs.length} songs
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}