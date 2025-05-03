import React from 'react';
import { songs } from '../data/mockData';

const likedSongs = songs.slice(0, 5); // Simulated liked songs

const LikedSongs: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span role="img" aria-label="heart" className="mr-2">💚</span> Liked Songs
      </h2>
      {likedSongs.length === 0 ? (
        <p className="text-[#b3b3b3]">You haven't liked any songs yet.</p>
      ) : (
        <ul className="divide-y divide-[#232323]">
          {likedSongs.map(song => (
            <li key={song.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <img src={song.cover} alt={song.title} className="w-12 h-12 rounded mr-4 object-cover" />
                <div>
                  <div className="font-semibold">{song.title}</div>
                  <div className="text-[#b3b3b3] text-sm">{song.artist}</div>
                </div>
              </div>
              <span className="text-[#b3b3b3] text-sm">{Math.floor(song.duration/60)}:{(song.duration%60).toString().padStart(2,'0')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LikedSongs;
