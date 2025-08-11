
import React, { useState, useEffect, useCallback } from 'react';
import { Book, AdaptationDetails, SavedItem } from '../types';
import { findAdaptation, getAdaptationDetails } from '../services/api';
import BookCard from './BookCard';
import AdaptationCard from './AdaptationCard';
import Loader from './Loader';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface CombinedCardProps {
  book: Book;
}

const CombinedCard: React.FC<CombinedCardProps> = ({ book }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adaptation, setAdaptation] = useState<AdaptationDetails | null>(null);

  const [favorites, setFavorites] = useLocalStorage<SavedItem[]>('favorites', []);
  const [watchlist, setWatchlist] = useLocalStorage<SavedItem[]>('watchlist', []);

  const isFavorite = favorites.some(item => item.id === book.key || (adaptation && item.id === `${adaptation.media_type}-${adaptation.id}`));
  const onWatchlist = watchlist.some(item => item.id === book.key || (adaptation && item.id === `${adaptation.media_type}-${adaptation.id}`));

  const fetchAdaptationData = useCallback(async () => {
    setIsLoading(true);
    const searchResult = await findAdaptation(book.title);
    if (searchResult) {
      const details = await getAdaptationDetails(searchResult.id, searchResult.media_type);
      setAdaptation(details);
    }
    setIsLoading(false);
  }, [book.title]);

  useEffect(() => {
    fetchAdaptationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.key]);

  const handleFlip = () => {
    if (adaptation) {
      setIsFlipped(!isFlipped);
    }
  };

  const toggleFavorite = (item: SavedItem) => {
    setFavorites(prev => 
      prev.some(f => f.id === item.id) 
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    );
  };
  
  const toggleWatchlist = (item: SavedItem) => {
    setWatchlist(prev =>
      prev.some(w => w.id === item.id)
        ? prev.filter(w => w.id !== item.id)
        : [...prev, item]
    );
  };

  return (
    <div className="w-full aspect-[2/3] [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        <div className="absolute w-full h-full [backface-visibility:hidden]">
          <BookCard 
            book={book}
            onViewAdaptation={handleFlip}
            hasAdaptation={!!adaptation}
            isLoadingAdaptation={isLoading}
            onToggleFavorite={toggleFavorite}
            onToggleWatchlist={toggleWatchlist}
            isFavorite={isFavorite}
            onWatchlist={onWatchlist}
          />
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {isLoading ? <Loader /> : adaptation ? (
            <AdaptationCard 
              adaptation={adaptation}
              book={book}
              onBack={handleFlip}
              onToggleFavorite={toggleFavorite}
              onToggleWatchlist={toggleWatchlist}
              isFavorite={isFavorite}
              onWatchlist={onWatchlist}
            />
          ) : (
            <div className="w-full h-full bg-slate-800 rounded-lg flex flex-col justify-center items-center text-center p-4">
                 <h3 className="text-xl font-bold text-slate-300">No Adaptation Found</h3>
                 <p className="text-slate-400 mt-2">We couldn't find a movie or series for this book.</p>
                 <button onClick={handleFlip} className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
                    Back to Book
                 </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedCard;
