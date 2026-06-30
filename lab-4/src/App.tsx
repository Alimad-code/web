import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { loadBooks } from './booksApi';
import { loadComments } from './commentsApi';
import type { Book, BookStatusFilter, Comment, CommentForm, NotificationSettings } from './types';

const filters: { value: BookStatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'available', label: 'Доступные' },
  { value: 'unavailable', label: 'Нет в наличии' }
];

const emptyForm: CommentForm = {
  author: '',
  text: ''
};

const defaultNotifications: NotificationSettings = {
  replies: true,
  newComments: false
};

const notificationLabels: Record<keyof NotificationSettings, string> = {
  replies: 'Об ответах на мой комментарий',
  newComments: 'О новых комментариях к книге'
};

function getFilteredBooks(books: Book[], filter: BookStatusFilter) {
  if (filter === 'available') {
    return books.filter((book) => book.available);
  }

  if (filter === 'unavailable') {
    return books.filter((book) => !book.available);
  }

  return books;
}

function getCurrentDate() {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date());
}

function getMessagesCount(comments: Comment[]) {
  return comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);
}

function CatalogPage({ books, loading }: { books: Book[]; loading: boolean }) {
  const [currentFilter, setCurrentFilter] = useState<BookStatusFilter>('all');

  const filteredBooks = useMemo(() => {
    return getFilteredBooks(books, currentFilter);
  }, [books, currentFilter]);

  const availableCount = books.filter((book) => book.available).length;
  const unavailableCount = books.length - availableCount;

  return (
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
                <Link className="book-card" key={book.id} to={`/books/${book.id}`}>
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
                </Link>
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
  );
}

function BookPage({ books, loading }: { books: Book[]; loading: boolean }) {
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
          <p className="eyebrow">Страница книги</p>
          <h1 id="book-title">{book.title}</h1>
          <p className="book-author">{book.author}</p>
          <p className="book-description">{book.details}</p>
        </div>

        <dl className="book-info-list" aria-label="Подробная информация о книге">
          <div>
            <dt>Жанр</dt>
            <dd>{book.genre}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd className={book.available ? 'info-status available' : 'info-status unavailable'}>
              {book.available ? 'Доступна' : 'Нет в наличии'}
            </dd>
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

function BookComments({ bookId }: { bookId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [form, setForm] = useState<CommentForm>(emptyForm);
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const messagesCount = getMessagesCount(comments);

  useEffect(() => {
    setLoading(true);
    setComments([]);
    setForm(emptyForm);
    setReplyToId(null);
    setError('');
    setStatus('');

    loadComments(bookId).then((loadedComments) => {
      setComments(loadedComments);
      setLoading(false);
    });
  }, [bookId]);

  function updateField(field: keyof CommentForm, value: string) {
    setForm({
      ...form,
      [field]: value
    });
  }

  function updateNotification(field: keyof NotificationSettings) {
    setNotifications({
      ...notifications,
      [field]: !notifications[field]
    });
  }

  function getStatusText() {
    const selectedNotifications = (Object.keys(notificationLabels) as Array<keyof NotificationSettings>)
      .filter((field) => notifications[field])
      .map((field) => notificationLabels[field].toLowerCase());

    if (selectedNotifications.length === 0) {
      return 'Комментарий опубликован без уведомлений.';
    }

    return `Комментарий опубликован. Уведомления включены: ${selectedNotifications.join(', ')}.`;
  }

  function getReplyAuthor() {
    const comment = comments.find((item) => item.id === replyToId);
    return comment?.author || '';
  }

  function startReply(commentId: number) {
    setReplyToId(commentId);
    setError('');
    setStatus('');
  }

  function cancelReply() {
    setReplyToId(null);
    setError('');
    setStatus('');
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.author.trim() || !form.text.trim()) {
      setError('Заполните имя и текст комментария.');
      setStatus('');
      return;
    }

    if (replyToId !== null) {
      const replyAuthor = getReplyAuthor();
      const newReply = {
        id: Date.now(),
        author: form.author.trim(),
        text: form.text.trim(),
        createdAt: getCurrentDate()
      };

      setComments(
        comments.map((comment) => {
          if (comment.id !== replyToId) {
            return comment;
          }

          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        })
      );
      setForm(emptyForm);
      setReplyToId(null);
      setError('');
      setStatus(`Ответ на комментарий автора ${replyAuthor} опубликован.`);
      return;
    }

    const newComment: Comment = {
      id: Date.now(),
      author: form.author.trim(),
      text: form.text.trim(),
      createdAt: getCurrentDate(),
      replies: []
    };

    setComments([newComment, ...comments]);
    setForm(emptyForm);
    setError('');
    setStatus(getStatusText());
  }

  return (
    <section className="comments-panel" aria-live="polite">
      <div className="section-title">
        <h2>Комментарии</h2>
        <p>{messagesCount} всего</p>
      </div>

      {loading ? (
        <div className="loading-card">
          <div className="loader" />
          <div>
            <h3>Загрузка комментариев</h3>
            <p>Получаем существующие сообщения к книге...</p>
          </div>
        </div>
      ) : (
        <>
          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="form-title">
              <h2>{replyToId === null ? 'Новый комментарий' : `Ответ на комментарий: ${getReplyAuthor()}`}</h2>
            </div>

            {replyToId !== null ? (
              <button className="cancel-reply-button" type="button" onClick={cancelReply}>
                Отменить ответ
              </button>
            ) : null}

            {error ? (
              <p className="error-message" role="alert">
                {error}
              </p>
            ) : null}

            <label>
              Имя читателя
              <input
                type="text"
                value={form.author}
                onChange={(event) => updateField('author', event.target.value)}
                placeholder="Например, Иван"
              />
            </label>

            <label>
              Текст комментария
              <textarea
                rows={6}
                value={form.text}
                onChange={(event) => updateField('text', event.target.value)}
                placeholder="Напишите мнение о книге или ответ участникам обсуждения"
              />
            </label>

            <fieldset>
              <legend>Уведомлять меня</legend>
              {(Object.keys(notificationLabels) as Array<keyof NotificationSettings>).map((field) => (
                <label className="checkbox-row" key={field}>
                  <input
                    type="checkbox"
                    checked={notifications[field]}
                    onChange={() => updateNotification(field)}
                  />
                  <span>{notificationLabels[field]}</span>
                </label>
              ))}
            </fieldset>

            <button type="submit">{replyToId === null ? 'Опубликовать комментарий' : 'Опубликовать ответ'}</button>

            {status ? (
              <p className="success-message" role="status">
                {status}
              </p>
            ) : null}
          </form>

          {comments.length === 0 ? (
            <div className="empty-card">
              <h3>Комментариев пока нет</h3>
              <p>К этой книге читатели еще не оставляли сообщения. Вы можете начать обсуждение первым.</p>
            </div>
          ) : null}

          {comments.length > 0 ? (
            <div className="comment-list">
              {comments.map((comment) => (
                <article className="comment-card" key={comment.id}>
                  <div className="comment-top">
                    <div>
                      <h3>{comment.author}</h3>
                    </div>
                    <time>{comment.createdAt}</time>
                  </div>

                  <p className="comment-text">{comment.text}</p>

                  <button className="reply-button" type="button" onClick={() => startReply(comment.id)}>
                    Ответить
                  </button>

                  {comment.replies.length > 0 ? (
                    <div className="reply-list">
                      {comment.replies.map((reply) => (
                        <article className="reply-card" key={reply.id}>
                          <div className="comment-top">
                            <div>
                              <h4>{reply.author}</h4>
                            </div>
                            <time>{reply.createdAt}</time>
                          </div>
                          <p>{reply.text}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks().then((loadedBooks) => {
      setBooks(loadedBooks);
      setLoading(false);
    });
  }, []);

  return (
    <BrowserRouter>
      <main className="page">
        <Routes>
          <Route path="/" element={<CatalogPage books={books} loading={loading} />} />
          <Route path="/books/:bookId" element={<BookPage books={books} loading={loading} />} />
          <Route path="*" element={<CatalogPage books={books} loading={loading} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
