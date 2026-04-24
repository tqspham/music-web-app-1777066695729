'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PlaylistGrid from '@/components/PlaylistGrid';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Playlist {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
}

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

export default function PlaylistsPage(): React.ReactElement {
  const router = useRouter();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setError(err instanceof Error ? err.message : 'Failed to load playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = (id: string): void => {
    router.push(`/playlists/${id}`);
  };

  const handleCreatePlaylist = async (name: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      const data = (await response.json()) as { playlist: Playlist };
      setPlaylists([...playlists, data.playlist]);
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create playlist';
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading playlists..." />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Playlists</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
            aria-label="Create new playlist"
          >
            Create Playlist
          </button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        <PlaylistGrid playlists={playlists} onPlaylistClick={handlePlaylistClick} />
        <CreatePlaylistModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreatePlaylist}
          error={error}
        />
      </div>
    </main>
  );
}