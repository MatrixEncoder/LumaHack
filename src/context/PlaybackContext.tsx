import React, { createContext, useState, useContext } from 'react';
import { SongType, PlaybackContextType } from '../types';
import { songs } from '../data/mockData';

const defaultContext: PlaybackContextType = {
  currentSong: null,
  isPlaying: false,
  togglePlay: () => {},
  nextSong: () => {},
  prevSong: () => {},
  playSong: () => {},
};

const PlaybackContext = createContext<PlaybackContextType>(defaultContext);

export const usePlayback = () => useContext(PlaybackContext);

export const PlaybackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<SongType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  
  
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
  };
  
  const prevSong = () => {
    if (!currentSong) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };
  
  const playSong = (song: SongType) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  const value = {
    currentSong,
    isPlaying,
    togglePlay,
    nextSong,
    prevSong,
    playSong,
  };

  
  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
};