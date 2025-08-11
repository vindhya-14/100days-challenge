
import React from 'react';
import { Book, SavedItem } from '../types';
import { getBookCoverUrl } from '../services/api';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface BookCardProps {
  book: Book;
  onViewAdaptation: () => void;
  hasAdaptation: boolean;
  isLoadingAdaptation: boolean;
  onToggleFavorite: (item: SavedItem) => void;
  onToggleWatchlist: (item: SavedItem) => void;
  isFavorite: boolean;
  onWatchlist: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onViewAdaptation, hasAdaptation, isLoadingAdaptation, onToggleFavorite, onToggleWatchlist, isFavorite, onWatchlist }) => {
  const coverUrl = getBookCoverUrl(book.cover_i);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite({ id: book.key, title: book.title, imageUrl: coverUrl, type: 'book' });
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist({ id: book.key, title: book.title, imageUrl: coverUrl, type: 'book' });
  };

  return (
    <div className="relative w-full h-full bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col group">
      <img src={coverUrl} alt={`Cover for ${book.title}`} className="w-full h-2/3 object-cover" />
      <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button onClick={handleFavoriteClick} className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'text-rose-500 bg-rose-500/20' : 'text-slate-300 bg-black/50 hover:bg-rose-500/30 hover:text-rose-400'}`}>
            <HeartIcon />
          </button>
          <button onClick={handleWatchlistClick} className={`p-2 rounded-full transition-colors duration-200 ${onWatchlist ? 'text-cyan-400 bg-cyan-400/20' : 'text-slate-300 bg-black/50 hover:bg-cyan-400/30 hover:text-cyan-400'}`}>
            <BookmarkIcon />
          </button>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-white truncate" title={book.title}>{book.title}</h3>
          <p className="text-sm text-slate-400 truncate">{book.author}</p>
        </div>
        <div className="mt-2 flex items-center justify-between text-slate-300">
          <span className="font-semibold">{book.first_publish_year}</span>
          {book.ratings_average && (
            <div className="flex items-center gap-1">
              <StarIcon className="text-amber-400" />
              <span>{book.ratings_average.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
       <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={onViewAdaptation}
          disabled={!hasAdaptation || isLoadingAdaptation}
          className="bg-cyan-600 text-white font-bold py-2 px-6 rounded-full hover:bg-cyan-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          {isLoadingAdaptation ? 'Searching...' : hasAdaptation ? 'View Adaptation' : 'No Adaptation Found'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
