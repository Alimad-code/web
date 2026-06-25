import type { Book } from './types';

const books: Book[] = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    genre: 'Роман',
    year: 1967,
    description: 'История о Москве, писателе, любви и необычных гостях города.',
    available: true
  },
  {
    id: 2,
    title: 'Преступление и наказание',
    author: 'Федор Достоевский',
    genre: 'Классика',
    year: 1866,
    description: 'Психологический роман о выборе, вине и попытке найти оправдание поступку.',
    available: false
  },
  {
    id: 3,
    title: '451 градус по Фаренгейту',
    author: 'Рэй Брэдбери',
    genre: 'Антиутопия',
    year: 1953,
    description: 'Книга о мире, где чтение запрещено, а пожарные уничтожают библиотеки.',
    available: true
  },
  {
    id: 4,
    title: 'Пикник на обочине',
    author: 'Аркадий и Борис Стругацкие',
    genre: 'Фантастика',
    year: 1972,
    description: 'Повесть о сталкерах, Зоне и предметах, которые невозможно понять сразу.',
    available: true
  },
  {
    id: 5,
    title: 'Война и мир',
    author: 'Лев Толстой',
    genre: 'Исторический роман',
    year: 1869,
    description: 'Большой роман о семье, войне, взрослении и переменах в обществе.',
    available: false
  },
  {
    id: 6,
    title: 'Гарри Поттер и философский камень',
    author: 'Джоан Роулинг',
    genre: 'Фэнтези',
    year: 1997,
    description: 'Начало истории о мальчике, который узнает о мире магии и своей роли в нем.',
    available: true
  }
];

export function loadBooks(): Promise<Book[]> {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(books);
    }, 1200);
  });
}
