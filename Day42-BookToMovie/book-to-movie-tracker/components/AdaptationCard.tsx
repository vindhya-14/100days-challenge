
import React, { useState } from 'react';
import { AdaptationDetails, Book, SavedItem } from '../types';
import { getPosterUrl } from '../services/api';
import RatingChart from './RatingChart';
import TrailerModal from './TrailerModal';
import StarIcon from './icons/StarIcon';
import HeartIcon from './icons/HeartIcon';
import BookmarkIcon from './icons/BookmarkIcon';

interface AdaptationCardProps {
  adaptation: AdaptationDetails;
  book: Book;
  onBack: () => void;
  onToggleFavorite: (item: SavedItem) => void;
  onToggleWatchlist: (item: SavedItem) => void;
  isFavorite: boolean;
  onWatchlist: boolean;
}

const AdaptationCard: React.FC<AdaptationCardProps> = ({ adaptation, book, onBack, onToggleFavorite, onToggleWatchlist, isFavorite, onWatchlist }) => {
  const [isTrailerOpen, setTrailerOpen] = useState(false);
  const posterUrl = getPosterUrl(adaptation.poster_path);
  const director = adaptation.credits?.crew.find(c => c.job === 'Director')?.name;
  const trailer = adaptation.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const bookRating10 = book.ratings_average ? book.ratings_average * 2 : 0;
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite({ id: `${adaptation.media_type}-${adaptation.id}`, title: adaptation.title, imageUrl: posterUrl, type: 'adaptation' });
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist({ id: `${adaptation.media_type}-${adaptation.id}`, title: adaptation.title, imageUrl: posterUrl, type: 'adaptation' });
  };
  
  return (
    <>
      <div className="relative w-full h-full bg-slate-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="relative h-1/2 w-full">
          <img src={posterUrl} alt={`Poster for ${adaptation.title}`} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent"></div>
           <div className="absolute top-2 right-2 flex flex-col gap-2">
                <button onClick={handleFavoriteClick} className={`p-2 rounded-full transition-colors duration-200 ${isFavorite ? 'text-rose-500 bg-rose-500/20' : 'text-slate-300 bg-black/50 hover:bg-rose-500/30 hover:text-rose-400'}`}>
                    <HeartIcon />
                </button>
                <button onClick={handleWatchlistClick} className={`p-2 rounded-full transition-colors duration-200 ${onWatchlist ? 'text-cyan-400 bg-cyan-400/20' : 'text-slate-300 bg-black/50 hover:bg-cyan-400/30 hover:text-cyan-400'}`}>
                    <BookmarkIcon />
                </button>
            </div>
          <div className="absolute bottom-0 left-0 p-3">
             <h3 className="font-bold text-lg text-white truncate" title={adaptation.title}>{adaptation.title}</h3>
             <p className="text-sm text-slate-300">{new Date(adaptation.release_date).getFullYear()} &bull; {director || adaptation.genres[0]?.name}</p>
          </div>
        </div>
        
        <div className="flex-grow p-3 overflow-y-auto text-sm text-slate-300">
           <RatingChart bookRating={bookRating10} adaptationRating={adaptation.vote_average} />
            <p className="text-xs text-slate-400 line-clamp-3 mb-2">{adaptation.overview}</p>
            <div className="flex justify-center gap-2 mt-auto">
                <button onClick={onBack} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-full transition-colors text-xs">Back to Book</button>
                {trailer && (
                    <button onClick={() => setTrailerOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full transition-colors text-xs">Watch Trailer</button>
                )}
            </div>
        </div>
      </div>
      <TrailerModal isOpen={isTrailerOpen} onClose={() => setTrailerOpen(false)} videoKey={trailer?.key || null} />
    </>
  );
};

export default AdaptationCard;
