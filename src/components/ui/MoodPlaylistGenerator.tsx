import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Plus } from 'lucide-react';
import { AiPlaylistType } from '../../types';
import { generatePlaylistFromMood } from '../../services/geminiService';
import { usePlaylist } from '../../context/PlaylistContext';

interface MoodPlaylistGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const MoodPlaylistGenerator: React.FC<MoodPlaylistGeneratorProps> = ({ isOpen, onClose }) => {
  const [mood, setMood] = useState('');
  const moods = ['happy', 'energetic', 'sad', 'heartbroken', 'chill', 'relax'];
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<AiPlaylistType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addAiPlaylist, saveAiPlaylist } = usePlaylist();

  const handleGeneratePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood) {
      setError('Please select a mood');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const playlist = await generatePlaylistFromMood(mood);

      if (playlist) {
        setGeneratedPlaylist(playlist);
        addAiPlaylist(playlist);
      } else {
        setError('Sorry, we could not recognize that mood. Please enter a mood like happy, energetic, sad, heartbroken, chill, or relax.');
      }
    } catch (err) {
      console.error('Error generating playlist:', err);
      setError('An error occurred while generating your playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegeneratePlaylist = async () => {
    setIsLoading(true);

    try {
      const playlist = await generatePlaylistFromMood(mood);

      if (playlist) {
        setGeneratedPlaylist(playlist);
        addAiPlaylist(playlist);
      } else {
        setError('Sorry, we could not recognize that mood. Please enter a mood like happy, energetic, sad, heartbroken, chill, or relax.');
      }
    } catch (err) {
      setError('An error occurred while regenerating your playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlaylist = () => {
    if (generatedPlaylist) {
      saveAiPlaylist(generatedPlaylist);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#282828] rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#3e3e3e]">
          <h2 className="text-xl font-bold text-white">Generate Playlist by Mood</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#3e3e3e] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div>
          <div className="p-6 flex flex-col gap-4">
            <label className="text-white font-medium">Mood</label>
            <div className="flex gap-2 items-center">
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="py-2 px-4 rounded-lg bg-[#222] text-white focus:outline-none"
                disabled={isLoading}
              >
                <option value="">Select a mood</option>
                {moods.map(m => (
                  <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                ))}
              </select>
              <button
                type="button"
                className="bg-[#1DB954] text-white px-3 py-2 rounded-lg font-semibold hover:bg-[#169c44] transition-colors"
                disabled={isLoading}
                onClick={() => {
                  const randomMood = moods[Math.floor(Math.random() * moods.length)];
                  setMood(randomMood);
                  setTimeout(() => handleGeneratePlaylist(new Event('submit') as any), 0);
                }}
              >
                Random
              </button>
            </div>
          </div>
          {error && (
            <p className="text-red-400 mt-2 text-sm">{error}</p>
          )}
          {!generatedPlaylist ? (
            <form onSubmit={handleGeneratePlaylist} className="p-6 flex flex-col gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full py-3 rounded-full bg-[#1DB954] text-black font-bold hover:bg-opacity-80 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="mr-2" size={18} />
                    Generate Playlist
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white mb-1">{generatedPlaylist.title}</h3>
                <p className="text-sm text-[#b3b3b3]">Based on your mood: {generatedPlaylist.mood}</p>
              </div>
              <div className="bg-[#181818] rounded-md p-3 mb-4 max-h-60 overflow-y-auto">
                {generatedPlaylist.songs.map((song, index) => (
                  <div
                    key={index}
                    className="py-2 border-b border-[#3e3e3e] last:border-0"
                  >
                    <div className="font-medium text-white">{song.title}</div>
                    <div className="text-sm text-[#b3b3b3]">{song.artist}</div>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleRegeneratePlaylist}
                  disabled={isLoading}
                  className="flex-1 py-2 rounded-full border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Regenerate
                </button>
                <button
                  onClick={handleSavePlaylist}
                  className="flex-1 py-2 rounded-full bg-[#1DB954] text-black font-medium hover:bg-opacity-80 transition-colors flex items-center justify-center"
                >
                  <Plus className="mr-2" size={16} />
                  Add to Library
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPlaylistGenerator;
