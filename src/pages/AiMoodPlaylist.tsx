import React, { useState } from "react";

// TODO: Replace with your real Gemini API key for production/demo
const GEMINI_API_KEY = "AIzaSyDWTQQ3LeC34xS-poo7JaCL70iUjeITtzU";

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
      const prompt = `Generate a playlist of 10 songs for a ${mood} mood. Return as JSON array: [{ \"title\": \"...\", \"artist\": \"...\" }]`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      // Try to extract the playlist from Gemini's response
      let playlist: Song[] = [];
      try {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        playlist = JSON.parse(text);
      } catch (e) {
        setError("Could not parse Gemini response. Try again.");
        setLoading(false);
        return;
      }
      setSongs(playlist);
    } catch (e) {
      setError("Failed to fetch playlist. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white">
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
