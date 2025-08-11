
import { Book, AdaptationSearchResult, AdaptationDetails } from '../types';

const OPEN_LIBRARY_URL = 'https://openlibrary.org';
const TMDB_API_URL = 'https://api.themoviedb.org/3';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;


export const searchBooks = async (query: string): Promise<Book[]> => {
  if (!query) return [];
  try {
    const response = await fetch(`${OPEN_LIBRARY_URL}/search.json?q=${encodeURIComponent(query)}&limit=12`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.docs.map((doc: any) => ({
        ...doc,
        author: doc.author_name?.[0] || 'Unknown Author',
    }));
  } catch (error) {
    console.error("Failed to search books:", error);
    return [];
  }
};

export const findAdaptation = async (title: string): Promise<AdaptationSearchResult | null> => {
  if (!TMDB_API_KEY) {
      console.error("TMDb API key is missing.");
      return null;
  }
  try {
    const response = await fetch(`${TMDB_API_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`);
    if (!response.ok) throw new Error('Failed to fetch adaptation from TMDb');
    const data = await response.json();
    console.log(`Search results for "${title}":`, data.results);  // <--- Debug log

    const result = data.results?.find((r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path);
    if (!result) {
      console.warn(`No adaptation found for "${title}"`);
      return null;
    }
    
    return {
        id: result.id,
        media_type: result.media_type,
        title: result.title || result.name,
        poster_path: result.poster_path,
        release_date: result.release_date || result.first_air_date,
        vote_average: result.vote_average,
    };
  } catch (error) {
    console.error("Failed to find adaptation:", error);
    return null;
  }
};


export const getAdaptationDetails = async (id: number, type: 'movie' | 'tv'): Promise<AdaptationDetails | null> => {
  if (!TMDB_API_KEY) return null;
  try {
    const response = await fetch(`${TMDB_API_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`);
    if (!response.ok) throw new Error('Failed to fetch adaptation details');
    const data = await response.json();
    return {
        id: data.id,
        media_type: type,
        title: data.title || data.name,
        poster_path: data.poster_path,
        release_date: data.release_date || data.first_air_date,
        vote_average: data.vote_average,
        overview: data.overview,
        genres: data.genres,
        credits: data.credits,
        videos: data.videos,
    };
  } catch (error) {
    console.error("Failed to get adaptation details:", error);
    return null;
  }
};

export const getBookCoverUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'L') => {
  if (!coverId) return 'https://picsum.photos/id/1040/300/450';
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const getPosterUrl = (path?: string | null) => {
  if (!path) return 'https://picsum.photos/id/1060/300/450';
  return `https://image.tmdb.org/t/p/w500${path}`;
};
