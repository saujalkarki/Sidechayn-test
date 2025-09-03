import { useState, useEffect, useCallback } from "react";
import type { Song } from "@/types/music";
import {
  refillQueue,
  nextFromQueue,
  backFromHistory,
  byGenres,
} from "@/lib/queue";

const STORAGE_KEY = "music-player-state";

interface StoredState {
  selectedGenres: string[];
  current: Song | null;
  queue: Song[];
  history: Song[];
}

export function usePlayer() {
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lowSongWarning, setLowSongWarning] = useState(false);

  useEffect(() => {
    async function loadSongs() {
      try {
        const response = await fetch("../songs.json");
        const songs: Song[] = await response.json();
        setAllSongs(songs);

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsedState: StoredState = JSON.parse(stored);
            setSelectedGenres(new Set(parsedState.selectedGenres));
            setCurrent(parsedState.current);
            setQueue(parsedState.queue);
            setHistory(parsedState.history);
          } catch (e) {
            console.warn("Failed to parse stored state:", e);
            initializeDefault(songs);
          }
        } else {
          initializeDefault(songs);
        }
      } catch (error) {
        console.error("Failed to load songs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    function initializeDefault(songs: Song[]) {
      if (songs.length > 0) {
        const firstSong = songs[0];
        setCurrent(firstSong);
        const initialQueue = refillQueue(songs, new Set(), firstSong, [], []);
        setQueue(initialQueue);
      }
    }

    loadSongs();
  }, []);

  useEffect(() => {
    if (!isLoading && allSongs.length > 0) {
      const stateToStore: StoredState = {
        selectedGenres: Array.from(selectedGenres),
        current,
        queue,
        history,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    }
  }, [selectedGenres, current, queue, history, isLoading, allSongs.length]);

  useEffect(() => {
    if (allSongs.length > 0) {
      const availableSongs = byGenres(allSongs, selectedGenres);
      setLowSongWarning(availableSongs.length < 10);
    }
  }, [allSongs, selectedGenres]);

  const toggleGenre = useCallback(
    (genre: string) => {
      setSelectedGenres((prev) => {
        const newGenres = new Set(prev);
        if (newGenres.has(genre)) {
          newGenres.delete(genre);
        } else {
          newGenres.add(genre);
        }

        const newQueue = refillQueue(allSongs, newGenres, current, history, []);
        setQueue(newQueue);

        return newGenres;
      });
    },
    [allSongs, current, history]
  );

  const clearGenres = useCallback(() => {
    setSelectedGenres(new Set());
    const newQueue = refillQueue(allSongs, new Set(), current, history, []);
    setQueue(newQueue);
  }, [allSongs, current, history]);

  const next = useCallback(() => {
    const refilledQueue = refillQueue(
      allSongs,
      selectedGenres,
      current,
      history,
      queue
    );

    const { newCurrent, newQueue, newHistory } = nextFromQueue({
      current,
      queue: refilledQueue,
      history,
    });

    setCurrent(newCurrent);
    setHistory(newHistory);

    const finalQueue = refillQueue(
      allSongs,
      selectedGenres,
      newCurrent,
      newHistory,
      newQueue
    );
    setQueue(finalQueue);
  }, [allSongs, selectedGenres, current, queue, history]);

  const back = useCallback(() => {
    const { newCurrent, newHistory } = backFromHistory({ current, history });
    setCurrent(newCurrent);
    setHistory(newHistory);

    const newQueue = refillQueue(
      allSongs,
      selectedGenres,
      newCurrent,
      newHistory,
      queue
    );
    setQueue(newQueue);
  }, [allSongs, selectedGenres, current, history, queue]);

  const removeFromQueue = useCallback(
    (songId: string | number) => {
      const newQueue = queue.filter((song) => song.id !== songId);
      const refilledQueue = refillQueue(
        allSongs,
        selectedGenres,
        current,
        history,
        newQueue
      );
      setQueue(refilledQueue);
    },
    [allSongs, selectedGenres, current, history, queue]
  );

  const jumpTo = useCallback(
    (songId: string | number) => {
      const song = queue.find((s) => s.id === songId);
      if (!song) return;

      const newHistory = current ? [current, ...history].slice(0, 3) : history;

      const newQueue = queue.filter((s) => s.id !== songId);

      setCurrent(song);
      setHistory(newHistory);

      const refilledQueue = refillQueue(
        allSongs,
        selectedGenres,
        song,
        newHistory,
        newQueue
      );
      setQueue(refilledQueue);
    },
    [allSongs, selectedGenres, current, history, queue]
  );

  const allGenres = Array.from(
    new Set(allSongs.map((song) => song.genre))
  ).sort();

  return {
    // State
    allSongs,
    selectedGenres,
    current,
    queue,
    history,
    isLoading,
    lowSongWarning,
    allGenres,

    // Actions
    toggleGenre,
    clearGenres,
    next,
    back,
    removeFromQueue,
    jumpTo,
  };
}
