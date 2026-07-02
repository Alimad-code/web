import { useNavigate, useParams } from 'react-router-dom';
import { BookCartControls } from '../components/BookCartControls';
import { BookComments } from '../components/BookComments';
import type { Book } from '../types';
import { formatPrice } from '../utils';

export function BookPage({ books, loading }: { books: Book[]; loading: boolean }) {
  const navigate = useNavigate();
  const params = useParams();
  const bookId = Number(params.bookId);
  const book = books.find((item) => item.id === bookId);

  if (loading) {
    return (
      <section className="library-panel">
        <div className="loading-card" aria-live="polite">
          <div className="loader" />
          <div>
            <h2>Загрузка книги</h2>
            <p>Получаем данные выбранной книги...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!book) {
    return (
      <section className="library-panel">
        <button className="back-button" type="button" onClick={() => navigate('/')}>
          Вернуться в каталог
        </button>
        <div className="empty-card">
          <h1>Книга не найдена</h1>
          <p>В каталоге нет книги с таким номером.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="library-panel book-page" aria-labelledby="book-title">
      <button className="back-button" type="button" onClick={() => navigate('/')}>
        Вернуться в каталог
      </button>

      <article className="book-details">
        <div className="book-main-info">
          <h1 id="book-title">{book.title}</h1>
          <p className="book-author">Автор: {book.author}</p>
          <p className="book-description">{book.details}</p>
          <p className="book-detail-price">
            Цена: <strong>{formatPrice(book.price)}</strong>
          </p>
          <BookCartControls book={book} className="details-cart-button" showStock={false} />
        </div>

        <dl className="book-info-list" aria-label="Подробная информация о книге">
          <div>
            <dt>Жанр</dt>
            <dd>{book.genre}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd className={book.stock > 0 ? 'info-status available' : 'info-status unavailable'}>
              {book.stock > 0 ? 'Доступна' : 'Нет в наличии'}
            </dd>
          </div>
          <div>
            <dt>В наличии</dt>
            <dd>{book.stock}</dd>
          </div>
          <div>
            <dt>Цена</dt>
            <dd>{formatPrice(book.price)}</dd>
          </div>
          <div>
            <dt>Год выпуска</dt>
            <dd>{book.year}</dd>
          </div>
          <div>
            <dt>Страна</dt>
            <dd>{book.country}</dd>
          </div>
          <div>
            <dt>Язык оригинала</dt>
            <dd>{book.language}</dd>
          </div>
          <div>
            <dt>Количество страниц</dt>
            <dd>{book.pages}</dd>
          </div>
          <div>
            <dt>Возрастная категория</dt>
            <dd>{book.ageLimit}</dd>
          </div>
        </dl>
      </article>

      <BookComments bookId={book.id} />
    </section>
  );
}
