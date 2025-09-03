import type { Song } from "@/types/music";

//  Shuffling the array to get random songs
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

//  Filtering songs by the genres that is selectedd
export function byGenres(songs: Song[], selected: Set<string>): Song[] {
  if (selected.size === 0) return songs;
  return songs.filter((song) => selected.has(song.genre));
}

//  Build a list of available songs excluding the current, history, and queue items
export function buildPool(
  allSongs: Song[],
  selectedGenres: Set<string>,
  excludeIds: Set<string | number>
): Song[] {
  const filtered = byGenres(allSongs, selectedGenres);
  return filtered.filter((song) => !excludeIds.has(song.id));
}

// Refill queue to maintain at least 10 songs
export function refillQueue(
  allSongs: Song[],
  selectedGenres: Set<string>,
  current: Song | null,
  history: Song[],
  queue: Song[]
): Song[] {
  const TARGET_LENGTH = 10;

  if (queue.length >= TARGET_LENGTH) {
    return queue;
  }

  //  exclude set
  const excludeIds = new Set<string | number>();
  if (current) excludeIds.add(current.id);
  history.forEach((song) => excludeIds.add(song.id));
  queue.forEach((song) => excludeIds.add(song.id));

  // Get available songs
  const pool = buildPool(allSongs, selectedGenres, excludeIds);

  if (pool.length === 0) {
    return queue;
  }

  // Calculate how many songs we need
  const needed = TARGET_LENGTH - queue.length;

  // If pool is smaller than needed, use all available songs
  const toAdd = pool.length >= needed ? needed : pool.length;

  // Shuffle and take the needed amount
  const shuffled = shuffle(pool);
  const newSongs = shuffled.slice(0, toAdd);

  return [...queue, ...newSongs];
}

// Advance to next song from queue
export function nextFromQueue({
  current,
  queue,
  history,
}: {
  current: Song | null;
  queue: Song[];
  history: Song[];
}): {
  newCurrent: Song | null;
  newQueue: Song[];
  newHistory: Song[];
} {
  if (queue.length === 0) {
    return { newCurrent: current, newQueue: queue, newHistory: history };
  }

  const [nextSong, ...remainingQueue] = queue;

  // Add current to history if it exists
  const newHistory = current ? [current, ...history].slice(0, 3) : history;

  return {
    newCurrent: nextSong,
    newQueue: remainingQueue,
    newHistory,
  };
}

// Go back to previous song from history
export function backFromHistory({
  current,
  history,
}: {
  current: Song | null;
  history: Song[];
}): {
  newCurrent: Song | null;
  newHistory: Song[];
} {
  if (history.length === 0) {
    return { newCurrent: current, newHistory: history };
  }

  const [previousSong, ...remainingHistory] = history;

  return {
    newCurrent: previousSong,
    newHistory: remainingHistory,
  };
}
