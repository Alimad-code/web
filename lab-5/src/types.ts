export type BookStatusFilter = 'all' | 'available' | 'unavailable';

export type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  year: number;
  price: number;
  stock: number;
  country: string;
  language: string;
  pages: number;
  ageLimit: string;
  description: string;
  details: string;
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

export type CartItem = {
  book: Book;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: 'add'; book: Book }
  | { type: 'increase'; bookId: number }
  | { type: 'decrease'; bookId: number }
  | { type: 'remove'; bookId: number }
  | { type: 'clear' };
