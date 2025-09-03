export type Genre = string;

export interface Song {
  id: number | string;
  title: string;
  artist: string;
  album: string;
  genre: Genre;
  coverImage: string;
}

export interface PlayerState {
  allSongs: Song[];
  selectedGenres: Set<string>;
  current: Song | null;
  queue: Song[];
  history: Song[];
}
