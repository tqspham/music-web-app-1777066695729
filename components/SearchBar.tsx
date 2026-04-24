'use client';

import { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useSearchStore } from '@/lib/search-store';

export default function SearchBar(): React.ReactElement {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const setSearchResults = useSearchStore((state) => state.setSearchResults);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);

  const handleSearch = useCallback(
    async (searchQuery: string): Promise<void> => {
      setQuery(searchQuery);
      setSearchQuery(searchQuery);

      if (!searchQuery.trim()) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/songs/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = (await response.json()) as { songs: unknown[] };
        setSearchResults(data.songs);
      } catch {
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [setSearchResults, setSearchQuery]
  );

  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search songs or artists..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400"
          aria-label="Search for songs or artists"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}