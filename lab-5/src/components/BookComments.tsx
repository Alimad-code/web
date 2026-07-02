import { FormEvent, useEffect, useState } from 'react';
import { loadComments } from '../commentsApi';
import type { Comment, CommentForm, NotificationSettings } from '../types';
import { getCurrentDate, getMessagesCount } from '../utils';

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

export function BookComments({ bookId }: { bookId: number }) {
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
