import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import SongList from '@/components/SongList';
import NowPlaying from '@/components/NowPlaying';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home(): React.ReactElement {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Music Player</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingSpinner message="Loading songs..." />}>
              <SearchBar />
            </Suspense>
            <Suspense fallback={<LoadingSpinner message="Loading songs..." />}>
              <SongListContainer />
            </Suspense>
          </div>
          <div>
            <NowPlayingContainer />
          </div>
        </div>
      </div>
    </main>
  );
}

function SongListContainer(): React.ReactElement {
  return <SongList />;
}

function NowPlayingContainer(): React.ReactElement {
  return <NowPlaying />;
}