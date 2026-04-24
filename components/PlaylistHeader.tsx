'use client';

import { Trash2 } from 'lucide-react';

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

interface PlaylistHeaderProps {
  playlist: Playlist;
  onDelete: () => void;
}

export default function PlaylistHeader({
  playlist,
  onDelete,
}: PlaylistHeaderProps): React.ReactElement {
  const createdDate = new Date(playlist.createdAt).toLocaleDateString();

  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-bold mb-2">{playlist.name}</h1>
        <p className="text-gray-400">
          {playlist.songs.length} songs • Created {createdDate}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="p-3 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        aria-label={`Delete playlist ${playlist.name}`}
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}