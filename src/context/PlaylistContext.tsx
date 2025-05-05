import React, { createContext, useState, useContext } from 'react';
import { PlaylistType, AiPlaylistType } from '../types';
import { playlists } from '../data/mockData';
import { enhancePlaylist } from '../services/geminiService';

interface PlaylistContextType {
  userPlaylists: PlaylistType[];
  aiPlaylists: AiPlaylistType[];
  addAiPlaylist: (playlist: AiPlaylistType) => void;
  saveAiPlaylist: (aiPlaylist: AiPlaylistType) => void;
}

const defaultContext: PlaylistContextType = {
  userPlaylists: playlists,
  aiPlaylists: [],
  addAiPlaylist: () => {},
  saveAiPlaylist: () => {},
};

const PlaylistContext = createContext<PlaylistContextType>(defaultContext);

export const usePlaylist = () => useContext(PlaylistContext);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPlaylists, setUserPlaylists] = useState<PlaylistType[]>(playlists);
  const [aiPlaylists, setAiPlaylists] = useState<AiPlaylistType[]>([]);
  
  const addAiPlaylist = (playlist: AiPlaylistType) => {
    const enhancedPlaylist = enhancePlaylist(playlist);
    setAiPlaylists((prev) => [enhancedPlaylist, ...prev]);
  };
  
  const saveAiPlaylist = (aiPlaylist: AiPlaylistType) => {
    // Convert AI playlist to regular playlist format
    const enhanced = enhancePlaylist(aiPlaylist);
    
    // Create mock song objects from the AI playlist songs
    const playlistSongs = enhanced.songs.map((song, index) => ({
      id: `ai-${enhanced.id}-${index}`,
      title: song.title,
      artist: song.artist,
      album: 'AI Generated Playlist',
      cover: enhanced.cover,
      duration: Math.floor(Math.random() * 100) + 150, // Random duration between 150-250 seconds
    }));
    
    const newPlaylist: PlaylistType = {
      id: `saved-${enhanced.id}`,
      title: enhanced.title,
      description: `AI-generated playlist based on "${enhanced.mood}" mood`,
      cover: enhanced.cover,
      songs: playlistSongs,
      createdBy: 'You',
      createdAt: new Date().toISOString(),
    };
    
    setUserPlaylists((prev) => [newPlaylist, ...prev]);
  };
  
  const value = {
    userPlaylists,
    aiPlaylists,
    addAiPlaylist,
    saveAiPlaylist,
  };
  
  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};