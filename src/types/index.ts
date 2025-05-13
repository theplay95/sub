export interface SubsonicCredentials {
  serverUrl: string;
  username: string;
  password: string;
}

export interface SubsonicResponse<T> {
  "subsonic-response": {
    status: "ok" | "failed";
    version: string;
    [key: string]: any;
    data?: T;
  };
}

export interface Artist {
  id: string;
  name: string;
  albumCount: number;
  coverArt?: string;
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  coverArt: string;
  songCount: number;
  duration: number;
  created: string;
  year?: number;
  genre?: string;
}

export interface Song {
  id: string;
  parent: string;
  title: string;
  album: string;
  artist: string;
  track?: number;
  year?: number;
  genre?: string;
  coverArt: string;
  size: number;
  contentType: string;
  suffix: string;
  duration: number;
  bitRate: number;
  path: string;
  isVideo: boolean;
  created: string;
  albumId: string;
  artistId: string;
  type: string;
}

export interface ArtistsResponse {
  artists: {
    index: Array<{
      name: string;
      artist: Artist[];
    }>;
  };
}

export interface AlbumsResponse {
  albums: Album[];
}

export interface AlbumResponse {
  album: {
    id: string;
    name: string;
    artist: string;
    artistId: string;
    coverArt: string;
    songCount: number;
    duration: number;
    created: string;
    year?: number;
    genre?: string;
    song: Song[];
  };
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  volume: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  elapsed: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  credentials: SubsonicCredentials | null;
  error: string | null;
}