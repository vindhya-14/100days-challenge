
import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by book title or author..."
          className="w-full px-5 py-3 text-lg bg-slate-800 border-2 border-slate-700 rounded-full text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          {isLoading ? '...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
