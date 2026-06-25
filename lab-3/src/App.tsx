import { useEffect, useMemo, useState } from 'react';
import { loadBooks } from './booksApi';
import type { Book, BookStatusFilter } from './types';

const filters: { value: BookStatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'available', label: 'Доступные' },
  { value: 'unavailable', label: 'Нет в наличии' }
];

function getFilteredBooks(books: Book[], filter: BookStatusFilter) {
  if (filter === 'available') {
    return books.filter((book) => book.available);
  }

  if (filter === 'unavailable') {
    return books.filter((book) => !book.available);
  }

  return books;
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState<BookStatusFilter>('all');

  useEffect(() => {
    loadBooks().then((loadedBooks) => {
      setBooks(loadedBooks);
      setLoading(false);
    });
  }, []);

  const filteredBooks = useMemo(() => {
    return getFilteredBooks(books, currentFilter);
  }, [books, currentFilter]);

  const availableCount = books.filter((book) => book.available).length;
  const unavailableCount = books.length - availableCount;

  return (
    <main className="page">
      <section className="library-panel" aria-labelledby="page-title">
        <header className="panel-header">
          <p className="eyebrow">Онлайн-библиотека</p>
          <h1 id="page-title">Каталог книг</h1>
        </header>

        <section className="controls-panel" aria-label="Фильтр наличия книг">
          <div className="filter-buttons">
            {filters.map((filter) => (
              <button
                className={filter.value === currentFilter ? 'filter-button active' : 'filter-button'}
                key={filter.value}
                type="button"
                aria-pressed={filter.value === currentFilter}
                onClick={() => setCurrentFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="counter-grid" aria-label="Статистика каталога">
            <div>
              <span>{books.length}</span>
              <p>всего</p>
            </div>
            <div>
              <span>{availableCount}</span>
              <p>доступно</p>
            </div>
            <div>
              <span>{unavailableCount}</span>
              <p>нет в наличии</p>
            </div>
          </div>
        </section>

        {loading ? (
          <section className="loading-card" aria-live="polite">
            <div className="loader" />
            <div>
              <h2>Загрузка каталога</h2>
              <p>Получаем список книг из имитации сервера...</p>
            </div>
          </section>
        ) : (
          <section className="book-section" aria-live="polite">
            <div className="section-title">
              <h2>Список книг</h2>
              <p>Показано: {filteredBooks.length}</p>
            </div>

            {filteredBooks.length > 0 ? (
              <div className="book-grid">
                {filteredBooks.map((book) => (
                  <article className="book-card" key={book.id}>
                    <div>
                      <div className="book-card-top">
                        <span className="book-genre">{book.genre}</span>
                        <span className={book.available ? 'status available' : 'status unavailable'}>
                          {book.available ? 'Доступна' : 'Нет в наличии'}
                        </span>
                      </div>
                      <h3>{book.title}</h3>
                      <p className="book-author">{book.author}</p>
                    </div>

                    <p className="book-description">{book.description}</p>

                    <div className="book-footer">
                      <span className="book-year">{book.year}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-card">
                <h3>Книг с таким статусом нет</h3>
                <p>Выберите другой фильтр, чтобы снова увидеть элементы каталога.</p>
              </div>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
