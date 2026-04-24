'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { usePlayerStore } from '@/lib/player-store';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function NowPlaying(): React.ReactElement {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const currentSong = usePlayerStore((state) => state.currentSong);

  const handlePlayPause = (): void => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        setError('Failed to play audio');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleNext = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentSong?.duration || 0;
    }
  };

  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    setError(null);
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.play().catch(() => {
      setError('Failed to play audio');
      setIsPlaying(false);
    });
    setIsPlaying(true);
    setCurrentTime(0);
  }, [currentSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = (): void => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = (): void => {
      setIsPlaying(false);
    };

    const handleError = (): void => {
      setError('Failed to play audio');
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  if (!currentSong) {
    return (
      <div className="p-6 bg-slate-800 rounded-lg sticky top-4">
        <h2 className="text-xl font-bold mb-4">Now Playing</h2>
        <div className="text-center text-gray-400 py-8">
          Select a song to play
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-800 rounded-lg sticky top-4">
      <h2 className="text-xl font-bold mb-4">Now Playing</h2>
      <audio ref={audioRef} />
      <div className="mb-6">
        <h3 className="font-semibold text-lg">{currentSong.title}</h3>
        <p className="text-gray-400 text-sm">{currentSong.artist}</p>
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
          {error}
        </div>
      )}
      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{
              width: `${(currentTime / (currentSong.duration || 1)) * 100}%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <span>{formatDuration(currentSong.duration)}</span>
        </div>
      </div>
      <div className="flex gap-4 justify-center">
        <button
          onClick={handlePrevious}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
          aria-label="Previous track"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-3 bg-green-500 hover:bg-green-600 rounded-full transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" />
          )}
        </button>
        <button
          onClick={handleNext}
          className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full transition-colors"
          aria-label="Next track"
        >
          <SkipForward size={20} />
        </button>
      </div>
    </div>
  );
}