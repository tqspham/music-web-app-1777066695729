'use client';

import { Music } from 'lucide-react';

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

interface PlaylistGridProps {
  playlists: Playlist[];
  onPlaylistClick: (id: string) => void;
}

export default function PlaylistGrid({
  playlists,
  onPlaylistClick,
}: PlaylistGridProps): React.ReactElement {
  if (playlists.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No playlists yet. Create one to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          onClick={() => onPlaylistClick(playlist.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onPlaylistClick(playlist.id);
            }
          }}
          className="p-6 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors"
          aria-label={`Open playlist ${playlist.name}`}
        >
          <Music className="mb-4 text-green-500" size={32} />
          <h3 className="font-bold text-lg mb-2">{playlist.name}</h3>
          <p className="textclassName="text-sm text-gray-400">
            {playlist.songs.length} songs
          </p>
        </div>
      ))}
    </div>
  );
}