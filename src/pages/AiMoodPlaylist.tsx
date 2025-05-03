import React, { useState } from "react";
import { generatePlaylistFromMood } from '../services/geminiService';

interface Song {
  title: string;
  artist: string;
}

const AiMoodPlaylist: React.FC = () => {
  const [mood, setMood] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateMoodPlaylist(mood: string) {
    setLoading(true);
    setError("");
    setSongs([]);
    try {
      const playlist = await generatePlaylistFromMood(mood);
      if (playlist && playlist.songs) {
        setSongs(playlist.songs);
      } else {
        setError("Could not generate playlist for this mood.");
      }
    } catch (err) {
      setError("Error generating playlist.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white pb-28">
      <h2 className="text-2xl font-bold mb-6">AI Mood Playlist Generator</h2>
      <div className="flex items-center mb-6 space-x-4">
        <input
          type="text"
          className="flex-1 px-4 py-2 rounded bg-[#232323] text-white border-none focus:ring-2 focus:ring-[#1DB954]"
          placeholder="Enter a mood (e.g. chill, party, focus)"
          value={mood}
          onChange={e => setMood(e.target.value)}
        />
        <button
          className="bg-[#1DB954] text-black px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform"
          onClick={() => generateMoodPlaylist(mood)}
          disabled={!mood || loading}
        >
          {loading ? "Generating..." : "Generate Playlist"}
        </button>
      </div>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {songs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Playlist for "{mood}" mood</h3>
          <ul className="space-y-3">
            {songs.map((song, idx) => (
              <li key={idx} className="flex items-center space-x-3 p-2 rounded bg-[#232323]">
                <span className="font-bold text-[#1DB954]">{idx + 1}</span>
                <span className="text-white">{song.title}</span>
                <span className="text-[#b3b3b3]">by {song.artist}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AiMoodPlaylist;
