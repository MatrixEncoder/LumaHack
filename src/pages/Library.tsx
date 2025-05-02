import React, { useState } from 'react';
import { Grip, GridIcon, Clock, Music } from 'lucide-react';
import { PlaylistCard } from '../components/playlists';
import { AlbumCard } from '../components/playlists';
import { usePlaylist } from '../context/PlaylistContext';
import { albums } from '../data/mockData';

type ViewType = 'grid' | 'list';
type FilterType = 'playlists' | 'albums' | 'all';

const Library: React.FC = () => {
  const { userPlaylists } = usePlaylist();
  const [view, setView] = useState<ViewType>('grid');
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Filter items based on the selected filter
  const filteredItems = () => {
    if (filter === 'playlists') {
      return { playlists: userPlaylists, albums: [] };
    } else if (filter === 'albums') {
      return { playlists: [], albums };
    } else {
      return { playlists: userPlaylists, albums };
    }
  };
  
  const { playlists: displayPlaylists, albums: displayAlbums } = filteredItems();
  
  return (
    <div className="pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Your Library</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex p-1 bg-[#242424] rounded-md">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 rounded-md ${view === 'grid' ? 'bg-[#333333] text-white' : 'text-[#b3b3b3] hover:text-white'}`}
            >
              <GridIcon size={20} />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${view === 'list' ? 'bg-[#333333] text-white' : 'text-[#b3b3b3] hover:text-white'}`}
            >
              <Grip size={20} />
            </button>
          </div>
          
          <div className="flex">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${filter === 'all' ? 'bg-white text-black' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('playlists')}
              className={`px-3 py-1 rounded-full text-sm font-medium ml-2 ${filter === 'playlists' ? 'bg-white text-black' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
            >
              Playlists
            </button>
            <button 
              onClick={() => setFilter('albums')}
              className={`px-3 py-1 rounded-full text-sm font-medium ml-2 ${filter === 'albums' ? 'bg-white text-black' : 'bg-[#333333] text-white hover:bg-[#444444]'}`}
            >
              Albums
            </button>
          </div>
        </div>
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {displayPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
          
          {displayAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
          
          {displayPlaylists.length === 0 && displayAlbums.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-[#b3b3b3] text-lg">No items found</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#181818] rounded-md">
          <div className="grid grid-cols-[3fr_2fr_1fr] gap-4 px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-sm font-medium">
            <div>TITLE</div>
            <div>DATE ADDED</div>
            <div className="flex justify-end">
              <Clock size={16} />
            </div>
          </div>
          
          {displayPlaylists.length === 0 && displayAlbums.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#b3b3b3] text-lg">No items found</p>
            </div>
          ) : (
            <div>
              {displayPlaylists.map((playlist, index) => (
                <div 
                  key={playlist.id}
                  className="grid grid-cols-[3fr_2fr_1fr] gap-4 px-4 py-2 hover:bg-[#282828] rounded-md"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 mr-3 flex-shrink-0">
                      <img src={playlist.cover} alt={playlist.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{playlist.title}</div>
                      <div className="text-xs text-[#b3b3b3]">Playlist • {playlist.songs.length} songs</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-[#b3b3b3]">
                    {new Date(playlist.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-end text-sm text-[#b3b3b3]">
                    {formatDuration(playlist.songs.reduce((acc, song) => acc + song.duration, 0))}
                  </div>
                </div>
              ))}
              
              {displayAlbums.map((album, index) => (
                <div 
                  key={album.id}
                  className="grid grid-cols-[3fr_2fr_1fr] gap-4 px-4 py-2 hover:bg-[#282828] rounded-md"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 mr-3 flex-shrink-0">
                      <img src={album.cover} alt={album.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{album.title}</div>
                      <div className="text-xs text-[#b3b3b3]">Album • {album.artist}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-[#b3b3b3]">
                    {album.year}
                  </div>
                  <div className="flex items-center justify-end text-sm text-[#b3b3b3]">
                    {formatDuration(album.songs.reduce((acc, song) => acc + song.duration, 0))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to format duration
const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

export default Library;