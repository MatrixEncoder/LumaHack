import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { PlaylistType } from '../../types';
import { usePlayback } from '../../context/PlaybackContext';

interface PlaylistCardProps {
  playlist: PlaylistType;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const { playSong } = usePlayback();
  
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    if (playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };
  
  return (
    <Link 
      to={`/playlist/${playlist.id}`}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors group relative"
    >
      <div className="relative">
        <img 
          src={playlist.cover} 
          alt={playlist.title} 
          className="w-full aspect-square object-cover rounded-md shadow-lg mb-4"
        />
        <button 
          onClick={handlePlay}
          className="play-button absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all"
        >
          <Play fill="black" size={24} />
        </button>
      </div>
      <h3 className="font-bold text-base text-white truncate">{playlist.title}</h3>
      <p className="text-sm text-[#b3b3b3] mt-1 line-clamp-2">{playlist.description}</p>
    </Link>
  );
};

export default PlaylistCard;