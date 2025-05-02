import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlaylistCard } from '../components/playlists';
import { AlbumCard } from '../components/playlists';
import { SongRow } from '../components/playlists';
import { playlists, albums, songs, categories } from '../data/mockData';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [filteredPlaylists, setFilteredPlaylists] = useState(playlists);
  const [filteredAlbums, setFilteredAlbums] = useState(albums);
  const [filteredSongs, setFilteredSongs] = useState(songs);
  
  useEffect(() => {
    if (query) {
      const searchTerm = query.toLowerCase();
      
      setFilteredPlaylists(
        playlists.filter(playlist => 
          playlist.title.toLowerCase().includes(searchTerm) || 
          playlist.description.toLowerCase().includes(searchTerm)
        )
      );
      
      setFilteredAlbums(
        albums.filter(album => 
          album.title.toLowerCase().includes(searchTerm) || 
          album.artist.toLowerCase().includes(searchTerm)
        )
      );
      
      setFilteredSongs(
        songs.filter(song => 
          song.title.toLowerCase().includes(searchTerm) || 
          song.artist.toLowerCase().includes(searchTerm) || 
          song.album.toLowerCase().includes(searchTerm)
        )
      );
    } else {
      setFilteredPlaylists(playlists);
      setFilteredAlbums(albums);
      setFilteredSongs([]);
    }
  }, [query]);
  
  return (
    <div className="pb-8">
      {query ? (
        // Search results
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">
            Search results for "{query}"
          </h1>
          
          {filteredSongs.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
              <div className="bg-[#181818] rounded-md">
                {filteredSongs.slice(0, 5).map((song, index) => (
                  <SongRow key={song.id} song={song} index={index} />
                ))}
              </div>
            </section>
          )}
          
          {filteredAlbums.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Albums</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredAlbums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
          
          {filteredPlaylists.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredPlaylists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
          
          {filteredSongs.length === 0 && filteredAlbums.length === 0 && filteredPlaylists.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">No results found for "{query}"</h2>
              <p className="text-[#b3b3b3]">Please check your spelling or try different keywords.</p>
            </div>
          )}
        </div>
      ) : (
        // Browse categories
        <div>
          <h1 className="text-2xl font-bold text-white mb-6">Browse all</h1>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="aspect-square relative overflow-hidden rounded-lg group cursor-pointer"
                style={{ 
                  backgroundColor: getRandomColor(index),
                }}
              >
                <div className="p-4 h-full w-full">
                  <h3 className="text-2xl font-bold text-white">{category}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get a deterministic color based on index
const getRandomColor = (index: number) => {
  const colors = [
    '#1DB954', // Spotify green
    '#E13300', // Red
    '#7358FF', // Purple
    '#1E3264', // Deep blue
    '#E8115B', // Pink
    '#148A08', // Green
    '#BA5D07', // Orange
    '#8400E7', // Violet
    '#777777', // Gray
    '#509BF5', // Light blue
    '#AF2896', // Magenta
    '#477D95', // Teal
    '#19E68C', // Mint
    '#E91429', // Bright red
    '#B49BC8', // Lavender
  ];
  
  return colors[index % colors.length];
};

export default Search;