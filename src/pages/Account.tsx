import React from 'react';

const mockUser = {
  name: 'Demo User',
  email: 'demo.user@email.com',
  plan: 'Spotify Free',
  joined: '2025-01-01',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
};

const Account: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white">
      <div className="flex items-center mb-6">
        <img
          src={mockUser.avatar}
          alt={mockUser.name}
          className="w-20 h-20 rounded-full border-4 border-[#1DB954] shadow-md mr-6"
        />
        <div>
          <h2 className="text-2xl font-bold">{mockUser.name}</h2>
          <p className="text-[#b3b3b3]">{mockUser.email}</p>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Plan:</span> {mockUser.plan}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Member since:</span> {new Date(mockUser.joined).toLocaleDateString()}
      </div>
      <button className="mt-6 bg-[#1DB954] text-black px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform">
        Upgrade Plan
      </button>
    </div>
  );
};

export default Account;
