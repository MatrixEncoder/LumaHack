import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, User, Bell } from 'lucide-react';
import classNames from 'classnames';

interface TopbarProps {
  className?: string;
}

const Topbar: React.FC<TopbarProps> = ({ className }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const isSearchPage = location.pathname === '/search';
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header 
      className={classNames(
        "flex items-center justify-between py-4 px-8 bg-[#121212] bg-opacity-75 sticky top-0 z-10",
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex space-x-2 mr-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-black bg-opacity-70 text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => navigate(1)}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-black bg-opacity-70 text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        {isSearchPage && (
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="What do you want to listen to?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-2 pl-10 pr-4 rounded-full bg-white text-black w-80 focus:outline-none"
              />
            </div>
          </form>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          className="bg-white text-black font-bold py-1 px-4 rounded-full text-sm hover:scale-105 transition-transform"
          onClick={() => alert('Upgrade feature coming soon!')}
        >
          Upgrade
        </button>
        
        <button
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black bg-opacity-70 text-white"
          onClick={() => alert('Notifications coming soon!')}
        >
          <Bell size={18} />
        </button>
        
        <button
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black bg-opacity-70 text-white"
          onClick={() => alert('Account management coming soon!')}
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
};

export default Topbar;