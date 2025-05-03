export interface SongType {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: number; // in seconds
  audio?: string;
}

export interface AlbumType {
  id: string;
  title: string;
  artist: string;
  cover: string;
  year: number;
  songs: SongType[];
}

export interface PlaylistType {
  id: string;
  title: string;
  description: string;
  cover: string;
  songs: SongType[];
  createdBy: string;
  createdAt: string;
}

export interface AiPlaylistSongType {
  title: string;
  artist: string;
}

export interface AiPlaylistType {
  title: string;
  mood: string;
  songs: AiPlaylistSongType[];
  createdAt: string;
  id: string;
}

export interface PlaybackContextType {
  currentSong: SongType | null;
  isPlaying: boolean;
  togglePlay: () => void;
  nextSong: () => void;
  prevSong: () => void;
  playSong: (song: SongType) => void;
}