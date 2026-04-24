export const dynamic = 'force-dynamic';

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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; songId: string } }
): Promise<Response> {
  try {
    loadStore();
    const { id, songId } = params;

    const playlist = store.playlists.find((p) => p.id === id);
    if (!playlist) {
      return Response.json({ error: 'Playlist not found' }, { status: 404 });
    }

    const songIndex = playlist.songs.findIndex((s) => s.id === songId);
    if (songIndex === -1) {
      return Response.json(
        { error: 'Song not in playlist' },
        { status: 404 }
      );
    }

    playlist.songs.splice(songIndex, 1);
    saveStore();

    return Response.json({ success: true, playlist });
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to remove song',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}