import React from 'react';
import { Clock, Play, Heart, MoreHorizontal } from 'lucide-react';
import { PlaylistType } from '../../types';
import { usePlayback } from '../../context/PlaybackContext';

interface PlaylistHeaderProps {
  playlist: PlaylistType;
}

const PlaylistHeader: React.FC<PlaylistHeaderProps> = ({ playlist }) => {
  const { playSong } = usePlayback();
  
  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };
  
  // Convert ISO date string to readable format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const totalSongs = playlist.songs.length;
  
  // Calculate total duration
  const totalDuration = playlist.songs.reduce((acc, song) => acc + song.duration, 0);
  const formatTotalDuration = () => {
    const minutes = Math.floor(totalDuration / 60);
    return `${minutes} min`;
  };
  
  return (
    <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-6 pt-5">
      <div className="w-48 h-48 flex-shrink-0 shadow-2xl">
        <img 
          src={playlist.cover} 
          alt={playlist.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xs text-white font-bold uppercase">Playlist</span>
        <h1 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4">{playlist.title}</h1>
        
        <div className="text-sm text-[#b3b3b3]">
          <p className="mb-1">{playlist.description}</p>
          <div className="flex items-center">
            <span className="font-semibold text-white">{playlist.createdBy}</span>
            <span className="mx-1">•</span>
            <span>{totalSongs} songs,</span>
            <span className="ml-1">{formatTotalDuration()}</span>
            <span className="mx-1">•</span>
            <span>{formatDate(playlist.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaylistControls: React.FC<{ playlist: PlaylistType }> = ({ playlist }) => {
  const { playSong } = usePlayback();
  
  const handlePlayAll = () => {
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };
  
  return (
    <div className="flex items-center space-x-4 py-6">
      <button 
        onClick={handlePlayAll}
        className="rounded-full bg-[#1DB954] p-3 hover:scale-105 transition-transform shadow-lg"
      >
        <Play fill="black" size={24} />
      </button>
      
      <button className="text-[#b3b3b3] hover:text-white transition-colors">
        <Heart size={32} />
      </button>
      
      <button className="text-[#b3b3b3] hover:text-white transition-colors">
        <MoreHorizontal size={24} />
      </button>
    </div>
  );
};

const PlaylistTableHeader: React.FC<{ showAlbum?: boolean }> = ({ showAlbum = true }) => {
  return (
    <div className={`grid ${showAlbum ? 'grid-cols-[16px_4fr_3fr_1fr_1fr]' : 'grid-cols-[16px_4fr_1fr_1fr]'} gap-4 px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-sm`}>
      <div className="text-center">#</div>
      <div>TITLE</div>
      {showAlbum && <div>ALBUM</div>}
      <div></div>
      <div className="flex justify-end">
        <Clock size={16} />
      </div>
    </div>
  );
};

export { PlaylistHeader, PlaylistControls, PlaylistTableHeader };