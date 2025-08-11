
export interface Book {
  key: string;
  title: string;
  author: string;
  first_publish_year: number;
  cover_i: number;
  ratings_average?: number;
  subjects?: string[];
}

export interface AdaptationSearchResult {
  id: number;
  media_type: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface AdaptationDetails extends AdaptationSearchResult {
  overview: string;
  genres: { id: number; name: string }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  videos?: {
    results: Video[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
}

export interface Video {
  id: string;
  key: string;
  site: string;
  type: string;
}

export interface CombinedResult {
  book: Book;
  adaptation: AdaptationDetails | null;
}

export interface SavedItem {
  id: string;
  title: string;
  imageUrl: string | null;
  type: 'book' | 'adaptation';
}
