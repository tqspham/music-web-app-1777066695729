export const dynamic = 'force-dynamic';

interface Song {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
}

const MOCK_SONGS: Song[] = [
  {
    id: '1',
    title: 'Midnight Dreams',
    artist: 'Luna Echo',
    duration: 243,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2422/2422-preview.mp3',
  },
  {
    id: '2',
    title: 'Electric Pulse',
    artist: 'Neon Lights',
    duration: 198,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2423/2423-preview.mp3',
  },
  {
    id: '3',
    title: 'Sunset Vibes',
    artist: 'Golden Hour',
    duration: 276,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2424/2424-preview.mp3',
  },
  {
    id: '4',
    title: 'Ocean Waves',
    artist: 'Coastal Dreams',
    duration: 210,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2425/2425-preview.mp3',
  },
  {
    id: '5',
    title: 'Mountain Echo',
    artist: 'Alpine Voice',
    duration: 234,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2426/2426-preview.mp3',
  },
  {
    id: '6',
    title: 'Urban Rhythm',
    artist: 'City Beats',
    duration: 215,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2427/2427-preview.mp3',
  },
  {
    id: '7',
    title: 'Forest Walk',
    artist: 'Nature Sounds',
    duration: 189,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2428/2428-preview.mp3',
  },
  {
    id: '8',
    title: 'Starlight',
    artist: 'Cosmic Journey',
    duration: 267,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2429/2429-preview.mp3',
  },
  {
    id: '9',
    title: 'Desert Wind',
    artist: 'Sand Dunes',
    duration: 201,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2430/2430-preview.mp3',
  },
  {
    id: '10',
    title: 'Winter Snow',
    artist: 'Frozen Peaks',
    duration: 244,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2431/2431-preview.mp3',
  },
  {
    id: '11',
    title: 'Summer Heat',
    artist: 'Tropical Vibes',
    duration: 219,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2432/2432-preview.mp3',
  },
  {
    id: '12',
    title: 'Spring Bloom',
    artist: 'Garden Harmony',
    duration: 205,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2433/2433-preview.mp3',
  },
  {
    id: '13',
    title: 'Night Club',
    artist: 'DJ Pulse',
    duration: 256,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2434/2434-preview.mp3',
  },
  {
    id: '14',
    title: 'Morning Glory',
    artist: 'Sunrise Melody',
    duration: 192,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2435/2435-preview.mp3',
  },
  {
    id: '15',
    title: 'Jazz Corner',
    artist: 'Blue Notes',
    duration: 287,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2436/2436-preview.mp3',
  },
  {
    id: '16',
    title: 'Acoustic Breeze',
    artist: 'Soft Strings',
    duration: 223,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2437/2437-preview.mp3',
  },
  {
    id: '17',
    title: 'Electronic Dreams',
    artist: 'Synth Wave',
    duration: 248,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2438/2438-preview.mp3',
  },
  {
    id: '18',
    title: 'Classical Mind',
    artist: 'Symphony Orchestra',
    duration: 301,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2439/2439-preview.mp3',
  },
  {
    id: '19',
    title: 'Pop Sensation',
    artist: 'Chart Toppers',
    duration: 211,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2440/2440-preview.mp3',
  },
  {
    id: '20',
    title: 'Rock Anthem',
    artist: 'Heavy Strings',
    duration: 264,
    audioUrl:
      'https://assets.mixkit.co/active_storage/sfx/2441/2441-preview.mp3',
  },
];

export async function GET(): Promise<Response> {
  return Response.json({ songs: MOCK_SONGS });
}