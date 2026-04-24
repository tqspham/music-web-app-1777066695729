'use client';

import { Play, Plus } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

interface SongCardProps {
  song: Song;
  onPlay: () => void;
  onAddToPlaylist: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SongCard({
  song,
  onPlay,
  onAddToPlaylist,
}: SongCardProps): React.ReactElement {
  return (
    <div
      className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors group cursor-pointer"
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onPlay();
        }
      }}
      aria-label={`Play ${song.title} by ${song.artist}`}
    >
      <div className="flex items-center justify-between">
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
              onPlay();
            }}
            className="p-2 bg-green-500 hover:bg-green-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            aria-label={`Play ${song.title}`}
          >
            <Play size={16} fill="currentColor" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist();
            }}
            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
            aria-label={`Add ${song.title} to playlist`}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}