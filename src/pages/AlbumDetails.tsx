import React from 'react';
import { useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import SongRow from '../components/playlists/SongRow';
import { PlaylistControls } from '../components/playlists/PlaylistHeader';
import { PlaylistTableHeader } from '../components/playlists/PlaylistHeader';
import { albums } from '../data/mockData';

const AlbumDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const album = albums.find(a => a.id === id);
  
  if (!album) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl text-[#b3b3b3]">Album not found</p>
      </div>
    );
  }
  
  // Convert album to playlist format for PlaylistControls
  const albumAsPlaylist = {
    id: album.id,
    title: album.title,
    description: `Album by ${album.artist}`,
    cover: album.cover,
    songs: album.songs,
    createdBy: album.artist,
    createdAt: new Date(album.year, 0).toISOString(),
  };
  
  return (
    <div>
      <div 
        className="relative pb-6"
        style={{
          background: `linear-gradient(transparent 0, rgba(0,0,0,.5) 100%), url(${album.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '30vh',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-6 mb-6 pt-5">
          <div className="w-48 h-48 flex-shrink-0 shadow-2xl">
            <img 
              src={album.cover} 
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xs text-white font-bold uppercase">Album</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mt-2 mb-4">{album.title}</h1>
            
            <div className="text-sm text-[#b3b3b3]">
              <div className="flex items-center">
                <span className="font-semibold text-white">{album.artist}</span>
                <span className="mx-1">•</span>
                <span>{album.year}</span>
                <span className="mx-1">•</span>
                <span>{album.songs.length} songs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <PlaylistControls playlist={albumAsPlaylist} />
      
      <div className="mt-4">
        <PlaylistTableHeader showAlbum={false} />
        
        <div className="mt-2">
          {album.songs.map((song, index) => (
            <SongRow key={song.id} song={song} index={index} showAlbum={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;