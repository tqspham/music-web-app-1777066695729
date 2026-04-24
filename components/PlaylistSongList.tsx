'use client';

import { useState } from 'react';
import { Play, Trash2, Plus } from 'lucide-react';
import { usePlayerStore } from '@/lib/player-store';
import AddToPlaylistMenu from '@/components/AddToPlaylistMenu';

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

interface PlaylistSongListProps {
  playlistId: string;
  playlist: Playlist;
  onRemoveSong: (songId: string) => Promise<void>;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function PlaylistSongList({
  playlistId,
  playlist,
  onRemoveSong,
}: PlaylistSongListProps): React.ReactElement {
  const [selectedSongForAdd, setSelectedSongForAdd] = useState<Song | null>(
    null
  );
  const [isAddingToPlaylist, setIsAddingToPlaylist] = useState<boolean>(false);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);

  if (playlist.songs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        This playlist is empty. Add some songs!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {playlist.songs.map((song) => (
        <div
          key={song.id}
          className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group flex items-center justify-between"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setCurrentSong(song);
            }
          }}
          onClick={() => setCurrentSong(song)}
          aria-label={`Play ${song.title} by ${song.artist}`}
        >
          <div className="flex-1">
            <h3 className="font-semibold text-white">{song.title}</h3>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {formatDuration(song.duration)}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSong(song);
              }}
              className="p-2 bg-green-500 hover:bg-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              aria-label={`Play ${song.title}`}
            >
              <Play size={16} fill="currentColor" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSong(song.id);
              }}
              className="p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
              aria-label={`Remove ${song.title} from playlist`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={() => {
          setSelectedSongForAdd({ id: '', title: '', artist: '', duration: 0, audioUrl: '' });
          setIsAddingToPlaylist(true);
        }}
        className="w-full mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
        aria-label="Add songs to this playlist"
      >
        <Plus size={20} />
        Add More Songs
      </button>
      {selectedSongForAdd && selectedSongForAdd.id === '' && (
        <AddToPlaylistMenuForPlaylist
          isOpen={isAddingToPlaylist}
          onClose={() => {
            setIsAddingToPlaylist(false);
            setSelectedSongForAdd(null);
          }}
          playlistId={playlistId}
          currentPlaylistSongs={playlist.songs}
        />
      )}
    </div>
  );
}

interface AddToPlaylistMenuForPlaylistProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  currentPlaylistSongs: Song[];
}

function AddToPlaylistMenuForPlaylist({
  isOpen,
  onClose,
  playlistId,
  currentPlaylistSongs,
}: AddToPlaylistMenuForPlaylistProps): React.ReactElement | null {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddSong = async (songId: string): Promise<void> => {
    try {
      setError(null);
      const response = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      if (!response.ok) {
        const errorData = (await response.json()) as { error: string };
        throw new Error(errorData.error || 'Failed to add song');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add song');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-800">
          <h2 className="text-xl font-bold">Add Songs to Playlist</h2>
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
        {!loading && songs.length === 0 && (
          <SongsLoader
            onLoad={(loadedSongs) => setSongs(loadedSongs)}
            currentSongIds={currentPlaylistSongs.map((s) => s.id)}
            onLoadingChange={setLoading}
          />
        )}
        {loading ? (
          <div className="text-center py-4 text-gray-400">Loading songs...</div>
        ) : songs.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            All available songs are already in this playlist!
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="font-semibold text-sm">{song.title}</div>
                  <div className="text-xs text-gray-400">{song.artist}</div>
                </div>
                <button
                  onClick={() => handleAddSong(song.id)}
                  className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm transition-colors whitespace-nowrap"
                  aria-label={`Add ${song.title} to playlist`}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface SongsLoaderProps {
  onLoad: (songs: Song[]) => void;
  currentSongIds: string[];
  onLoadingChange: (loading: boolean) => void;
}

function SongsLoader({
  onLoad,
  currentSongIds,
  onLoadingChange,
}: SongsLoaderProps): React.ReactElement {
  const [loaded, setLoaded] = useState<boolean>(false);

  if (!loaded) {
    setLoaded(true);
    onLoadingChange(true);
    fetch('/api/songs')
      .then((res) => res.json())
      .then((data: { songs: Song[] }) => {
        const availableSongs = data.songs.filter(
          (s) => !currentSongIds.includes(s.id)
        );
        onLoad(availableSongs);
        onLoadingChange(false);
      })
      .catch(() => {
        onLoad([]);
        onLoadingChange(false);
      });
  }

  return <div className="text-center py-4 text-gray-400">Loading songs...</div>;
}