import React from 'react';

const mockNotifications = [
  {
    id: 1,
    title: 'Welcome to Spotify Clone!',
    message: 'Enjoy your favorite music and discover new playlists.',
    date: '2025-05-01T10:00:00Z',
    read: false,
  },
  {
    id: 2,
    title: 'Playlist Generated',
    message: 'Your AI-generated playlist "Happy Vibes" is ready to play!',
    date: '2025-05-02T14:30:00Z',
    read: true,
  },
  {
    id: 3,
    title: 'Upgrade Available',
    message: 'Unlock premium features by upgrading your plan.',
    date: '2025-05-03T09:15:00Z',
    read: false,
  },
];

const Notifications: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 bg-[#181818] rounded-lg shadow-lg p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>
      {mockNotifications.length === 0 ? (
        <p className="text-[#b3b3b3]">No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {mockNotifications.map((notif) => (
            <li
              key={notif.id}
              className={`p-4 rounded-md border ${notif.read ? 'border-[#282828] bg-[#232323]' : 'border-[#1DB954] bg-[#202c1d]'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-lg">{notif.title}</span>
                <span className="text-xs text-[#b3b3b3]">{new Date(notif.date).toLocaleString()}</span>
              </div>
              <p className="text-[#b3b3b3]">{notif.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
