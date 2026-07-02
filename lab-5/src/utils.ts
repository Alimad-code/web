import type { Book, BookStatusFilter, Comment } from './types';

export function getFilteredBooks(books: Book[], filter: BookStatusFilter) {
  if (filter === 'available') {
    return books.filter((book) => book.stock > 0);
  }

  if (filter === 'unavailable') {
    return books.filter((book) => book.stock === 0);
  }

  return books;
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(price);
}

export function getCurrentDate() {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

export function getMessagesCount(comments: Comment[]) {
  return comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);
}
