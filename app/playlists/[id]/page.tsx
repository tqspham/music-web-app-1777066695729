'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PlaylistHeader from '@/components/PlaylistHeader';
import SongList from '@/components/PlaylistSongList';
import NowPlaying from '@/components/NowPlaying';
import LoadingSpinner from '@/components/LoadingSpinner';

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

export default function PlaylistDetailPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylist = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/playlists/${playlistId}`);
        if (!response.ok) {
          throw new Error('Failed to load playlist');
        }
        const data = (await response.json()) as { playlist: Playlist };
        setPlaylist(data.playlist);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load playlist');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleDeletePlaylist = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete this playlist?')) {
      return;
    }
    try {
      const response = await fetch(`/api/playlists/${playlistId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete playlist');
      }
      router.push('/playlists');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playlist');
    }
  };

  const handleRemoveSong = async (songId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to remove song');
      }
      const data = (await response.json()) as { playlist: Playlist };
      setPlaylist(data.playlist);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove song');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading playlist..." />;
  }

  if (!playlist) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-center text-gray-400">Playlist not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <PlaylistHeader playlist={playlist} onDelete={handleDeletePlaylist} />
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <SongList
              playlistId={playlistId}
              playlist={playlist}
              onRemoveSong={handleRemoveSong}
            />
          </div>
          <div>
            <NowPlaying />
          </div>
        </div>
      </div>
    </main>
  );
}