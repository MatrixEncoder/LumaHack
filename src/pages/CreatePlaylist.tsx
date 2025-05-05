import React, { useState } from 'react';

const CreatePlaylist: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setSuccess(true);
      setName('');
      setDesc('');
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Create Playlist</h2>
      {success && (
        <div className="mb-4 p-3 bg-green-700 bg-opacity-20 rounded text-green-400 font-semibold">
          Playlist created (simulated)!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Playlist Name</label>
          <input
            className="w-full px-4 py-2 rounded bg-[#232323] text-white focus:outline-none"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            className="w-full px-4 py-2 rounded bg-[#232323] text-white focus:outline-none"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="w-full bg-[#1DB954] text-black px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform">
          Create Playlist
        </button>
      </form>
    </div>
  );
};

export default CreatePlaylist;
