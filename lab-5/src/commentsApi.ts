import type { Comment } from './types';

export const commentedBookId = 1;

const commentsByBook: Record<number, Comment[]> = {
  [commentedBookId]: [
  {
    id: 1,
    author: 'Анна',
    text: 'Мне понравилось, как в романе соединяются московская линия и история Мастера. Из-за этого книга читается необычно.',
    createdAt: '25.06.2026 10:15',
    replies: [
      {
        id: 11,
        author: 'Дмитрий',
        text: 'Согласен. Еще интересно, что мистические эпизоды не выглядят отдельно от основной истории.',
        createdAt: '25.06.2026 10:32'
      }
    ]
  },
  {
    id: 2,
    author: 'Максим',
    text: 'Мне больше всего запомнилась линия Понтия Пилата. Она делает роман серьезнее, чем обычная сатира.',
    createdAt: '25.06.2026 09:40',
    replies: []
  },
  {
    id: 3,
    author: 'Елена',
    text: 'Маргарита кажется самым сильным персонажем. Без нее история Мастера была бы совсем другой.',
    createdAt: '24.06.2026 18:20',
    replies: []
  }
  ]
};

export function loadComments(bookId: number): Promise<Comment[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(commentsByBook[bookId] || []);
    }, 900);
  });
}
