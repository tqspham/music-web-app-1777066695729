'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  error?: string | null;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  error,
}: CreatePlaylistModalProps): React.ReactElement | null {
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) {
      setSubmitError('Playlist name is required');
      return;
    }

    setLoading(true);
    setSubmitError(null);
    try {
      await onSubmit(name);
      setName('');
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create playlist'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-sm mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Playlist</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-white placeholder-gray-400 mb-4"
            aria-label="Playlist name input"
            disabled={loading}
          />
          {(submitError || error) && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-300 text-sm">
              {submitError || error}
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-semibold disabled:opacity-50"
              disabled={loading}
              aria-label="Create playlist button"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}