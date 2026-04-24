export const dynamic = 'force-dynamic';

import { cookies } from 'next/headers';

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

interface PlaylistsStore {
  playlists: Playlist[];
}

let store: PlaylistsStore = {
  playlists: [],
};

function loadStore(): void {
  if (typeof window === 'undefined' && store.playlists.length === 0) {
    try {
      const cookieStore = require('next/headers').cookies();
      if (cookieStore) {
        const data = cookieStore.get('playlistStore')?.value;
        if (data) {
          const parsed = JSON.parse(data) as PlaylistsStore;
          store = parsed;
        }
      }
    } catch {
      store = { playlists: [] };
    }
  }
}

function saveStore(): void {
  if (typeof window === 'undefined') {
    try {
      const cookieStore = require('next/headers').cookies();
      if (cookieStore) {
        cookieStore.set('playlistStore', JSON.stringify(store), {
          maxAge: 60 * 60 * 24 * 365,
        });
      }
    } catch {
      // Silently fail
    }
  }
}

export async function GET(): Promise<Response> {
  loadStore();
  return Response.json({ playlists: store.playlists });
}

export async function POST(request: Request): Promise<Response> {
  try {
    loadStore();
    const body = (await request.json()) as { name: string };
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return Response.json(
        { error: 'Invalid playlist name' },
        { status: 400 }
      );
    }

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      songs: [],
    };

    store.playlists.push(newPlaylist);
    saveStore();

    return Response.json({ playlist: newPlaylist }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to create playlist',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}