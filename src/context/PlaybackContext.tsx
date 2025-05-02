import React, { createContext, useState, useContext, useEffect } from 'react';
import { SongType, PlaybackContextType } from '../types';
import { songs } from '../data/mockData';

const defaultContext: PlaybackContextType = {
  currentSong: null,
  isPlaying: false,
  progress: 0,
  volume: 70,
  togglePlay: () => {},
  nextSong: () => {},
  prevSong: () => {},
  setProgress: () => {},
  setVolume: () => {},
  playSong: () => {},
};

const PlaybackContext = createContext<PlaybackContextType>(defaultContext);

export const usePlayback = () => useContext(PlaybackContext);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  
  // Simulate progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentSong) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            nextSong();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);
  
  const togglePlay = () => {
    if (!currentSong && songs.length > 0) {
      setCurrentSong(songs[0]);
    }
    setIsPlaying((prev) => !prev);
  };
  
  const nextSong = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setProgress(0);
  };
  
  const prevSong = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setProgress(0);
  };
  
  const playSong = (song: SongType) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
  };
  
  const value = {
    currentSong,
    isPlaying,
    progress,
    volume,
    togglePlay,
    nextSong,
    prevSong,
    setProgress,
    setVolume,
    playSong,
  };
  
  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};