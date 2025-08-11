
import React from 'react';
import { NavLink } from 'react-router-dom';
import HeartIcon from './icons/HeartIcon';
import BookmarkIcon from './icons/BookmarkIcon';

const Header: React.FC = () => {
  const linkClass = "flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors";
  const activeLinkClass = "text-cyan-400";

  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 shadow-lg shadow-slate-900/20">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <NavLink to="/" className="text-xl md:text-2xl font-bold text-white hover:text-cyan-300 transition-colors">
          Book-to-Movie Tracker
        </NavLink>
        <div className="flex items-center gap-4 md:gap-6">
          <NavLink
            to="/favorites"
            className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <HeartIcon className="w-5 h-5" />
            <span className="hidden md:inline">Favorites</span>
          </NavLink>
          <NavLink
            to="/watchlist"
            className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
          >
            <BookmarkIcon className="w-5 h-5" />
            <span className="hidden md:inline">Watchlist</span>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;
