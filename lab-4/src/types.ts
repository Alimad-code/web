export type BookStatusFilter = 'all' | 'available' | 'unavailable';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  country: string;
  language: string;
  pages: number;
  ageLimit: string;
  description: string;
  details: string;
  available: boolean;
};

export type NotificationSettings = {
  replies: boolean;
  newComments: boolean;
};

export type Comment = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
  replies: Reply[];
};

export type CommentForm = {
  author: string;
  text: string;
};

export type Reply = {
  id: number;
  author: string;
  text: string;
  createdAt: string;
};
