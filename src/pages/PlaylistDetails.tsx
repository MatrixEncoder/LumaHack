import React from 'react';
import { useParams } from 'react-router-dom';
import { PlaylistHeader, PlaylistControls, PlaylistTableHeader } from '../components/playlists/PlaylistHeader';
import SongRow from '../components/playlists/SongRow';
import { usePlaylist } from '../context/PlaylistContext';

const PlaylistDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { userPlaylists } = usePlaylist();
  
  const playlist = userPlaylists.find(p => p.id === id);
  
  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#b3b3b3]">Playlist not found</p>
      </div>
    );
  }
  
  return (
    <div>
      <div 
        className="relative pb-6"
        style={{
          background: `linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), url(${playlist.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '30vh',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
        
        <div className="relative z-10">
          <PlaylistHeader playlist={playlist} />
        </div>
      </div>
      
      <PlaylistControls playlist={playlist} />
      
      <div className="mt-4">
        <PlaylistTableHeader />
        
        <div className="mt-2">
          {playlist.songs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} />
          ))}
          
          {playlist.songs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#b3b3b3]">This playlist is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistDetails;