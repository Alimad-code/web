export type BookStatusFilter = 'all' | 'available' | 'unavailable';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  description: string;
  available: boolean;
};
