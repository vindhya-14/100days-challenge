
import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SavedItem } from '../types';
import { Link } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const [favorites] = useLocalStorage<SavedItem[]>('favorites', []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6 border-b-2 border-cyan-500 pb-2">My Favorites</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-slate-400 mt-12">
          <p className="text-lg">You haven't added any favorites yet.</p>
          <p>Go back to the <Link to="/" className="text-cyan-400 hover:underline">homepage</Link> to find some!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map(item => (
            <div key={item.id} className="bg-slate-800 rounded-lg shadow-lg overflow-hidden group">
              <img src={item.imageUrl || ''} alt={item.title} className="w-full aspect-[2/3] object-cover" />
              <div className="p-2">
                <p className="text-sm font-semibold text-white truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
