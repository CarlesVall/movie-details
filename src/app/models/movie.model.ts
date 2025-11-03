export interface MovieTMDB {
  id: number;
  title: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  date: string;
  language: string;
  overview: string;
  genres: string[];
}