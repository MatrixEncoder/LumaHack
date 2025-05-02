import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PlaylistCard } from '../components/playlists';
import { AlbumCard } from '../components/playlists';
import MoodPlaylistGenerator from '../components/ui/MoodPlaylistGenerator';
import { usePlaylist } from '../context/PlaylistContext';
import { playlists, albums, categories, recentlyPlayed, topMixes, jumpBackIn, newReleases } from '../data/mockData';

const Home: React.FC = () => {
  const [isMoodGeneratorOpen, setIsMoodGeneratorOpen] = useState(false);
  const { aiPlaylists } = usePlaylist();
  
  const featuredPlaylists = playlists.slice(0, 6);
  const featuredAlbums = albums.slice(0, 6);
  
  return (
    <div className="pb-8">
      {/* Mood Playlist Generator Button */}
      <div className="fixed bottom-28 right-8 z-10">
        <button
          onClick={() => setIsMoodGeneratorOpen(true)}
          className="bg-[#1DB954] text-black rounded-full p-4 shadow-lg hover:scale-105 transition-transform flex items-center"
        >
          <Sparkles className="mr-2" size={20} />
          <span className="font-bold">Generate Playlist by Mood</span>
        </button>
      </div>
      
      {/* Time-based greeting */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">
          {getTimeBasedGreeting()}
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyPlayed.map((song, index) => (
            <Link
              key={index}
              to={`/album/${albums.find(album => album.title === song.album)?.id || '1'}`}
              className="flex items-center bg-[#ffffff0f] hover:bg-[#ffffff1a] transition-colors rounded-md overflow-hidden"
            >
              <img
                src={song.cover}
                alt={song.title}
                className="h-16 w-16 object-cover"
              />
              <div className="p-4">
                <span className="block text-white font-medium truncate">{song.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      {/* AI-Generated Playlists section (if any) */}
      {aiPlaylists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Your AI-Generated Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {aiPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-colors group relative">
                <div className="relative">
                  <img 
                    src={playlist.cover}
                    alt={playlist.title} 
                    className="w-full aspect-square object-cover rounded-md shadow-lg mb-4"
                  />
                </div>
                <h3 className="font-bold text-base text-white truncate">{playlist.title}</h3>
                <p className="text-sm text-[#b3b3b3] mt-1 line-clamp-2">Generated for mood: {playlist.mood}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Your top mixes */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Your top mixes</h2>
          <Link to="/search" className="text-sm text-[#b3b3b3] font-bold uppercase hover:underline">
            Show all
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {topMixes.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
      
      {/* Jump back in */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Jump back in</h2>
          <Link to="/library" className="text-sm text-[#b3b3b3] font-bold uppercase hover:underline">
            Show all
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {jumpBackIn.map((song, index) => {
            const album = albums.find(a => a.title === song.album);
            if (!album) return null;
            return (
              <AlbumCard key={index} album={album} />
            );
          })}
        </div>
      </section>
      
      {/* Featured playlists */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Featured playlists</h2>
          <Link to="/search" className="text-sm text-[#b3b3b3] font-bold uppercase hover:underline">
            Show all
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
      
      {/* Mood Playlist Generator Modal */}
      <MoodPlaylistGenerator
        isOpen={isMoodGeneratorOpen}
        onClose={() => setIsMoodGeneratorOpen(false)}
      />
    </div>
  );
};

// Helper function to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export default Home;