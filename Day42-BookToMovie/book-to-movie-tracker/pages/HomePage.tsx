
import React, { useState, useCallback } from 'react';
import { Book } from '../types';
import { searchBooks } from '../services/api';
import SearchBar from '../components/SearchBar';
import CombinedCard from '../components/CombinedCard';
import Loader from '../components/Loader';

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const results = await searchBooks(query);
      setBooks(results);
      if (results.length === 0) {
        setError('No books found for your search. Try a different title or author.');
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error(err);
    }
    setIsLoading(false);
  }, []);

  return (
    <div>
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {isLoading && <Loader />}

      {error && !isLoading && <p className="text-center text-rose-400">{error}</p>}
      
      {!isLoading && !error && hasSearched && books.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map(book => (
              <CombinedCard key={book.key} book={book} />
            ))}
          </div>
      )}

      {!isLoading && !error && !hasSearched && (
        <div className="text-center text-slate-400 mt-16">
          <h2 className="text-3xl font-bold text-slate-200">Welcome!</h2>
          <p className="mt-2 text-lg">Find out if your favorite book has been adapted for the screen.</p>
          <p className="mt-1">Just type a title or author above to start your search.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
