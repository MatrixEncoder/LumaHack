import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MusicPlayer from './MusicPlayer';

const Layout: React.FC = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="w-64 hidden md:flex" />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1c1c1c] to-[#121212] p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      <MusicPlayer />
    </div>
  );
};

export default Layout;