import React from 'react';
import { Play, Heart, MoreHorizontal, Clock } from 'lucide-react';
import { SongType } from '../../types';
import { usePlayback } from '../../context/PlaybackContext';

interface SongRowProps {
  song: SongType;
  index: number;
  showAlbum?: boolean;
}

const SongRow: React.FC<SongRowProps> = ({ song, index, showAlbum = true }) => {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayback();
  
  const isActive = currentSong?.id === song.id;
  
  const handlePlay = () => {
    if (isActive) {
      togglePlay();
    } else {
      playSong(song);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <div 
      className={`grid ${showAlbum ? 'grid-cols-[16px_4fr_3fr_1fr_1fr]' : 'grid-cols-[16px_4fr_1fr_1fr]'} gap-4 px-4 py-2 rounded-md items-center group hover:bg-[#2a2a2a] ${isActive ? 'bg-[#2a2a2a]' : ''}`}
    >
      <div className="flex items-center justify-center w-4">
        <div className="group-hover:hidden">
          <span className={`text-sm ${isActive ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>{index + 1}</span>
        </div>
        <button 
          onClick={handlePlay}
          className="hidden group-hover:block text-white"
        >
          {isActive && isPlaying ? (
            <span className="text-[#1DB954] h-4 w-4 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 2H6V14H3V2Z" fill="currentColor"/>
                <path d="M10 2H13V14H10V2Z" fill="currentColor"/>
              </svg>
            </span>
          ) : (
            <Play size={14} />
          )}
        </button>
      </div>
      
      <div className="flex items-center">
        <div className="h-10 w-10 mr-3 flex-shrink-0">
          <img src={song.cover} alt={song.title} className="h-full w-full object-cover" />
        </div>
        <div>
          <div className={`text-sm font-medium ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{song.title}</div>
          <div className="text-xs text-[#b3b3b3]">{song.artist}</div>
        </div>
      </div>
      
      {showAlbum && (
        <div className="text-sm text-[#b3b3b3] truncate">{song.album}</div>
      )}
      
      <div className="flex items-center justify-end">
        <button className="p-2 text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart size={16} />
        </button>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#b3b3b3] mr-5">{formatDuration(song.duration)}</span>
        <button className="p-2 text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};

export default SongRow;