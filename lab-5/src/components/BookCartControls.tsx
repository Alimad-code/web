import { useCart } from '../cartContext';
import type { Book } from '../types';

export function BookCartControls({
  book,
  className = '',
  showStock = true
}: {
  book: Book;
  className?: string;
  showStock?: boolean;
}) {
  const { addBook, increaseBook, decreaseBook, getBookQuantity } = useCart();
  const quantity = getBookQuantity(book.id);
  const isAvailable = book.stock > 0;
  const isLimitReached = quantity >= book.stock;

  return (
    <div className={`book-cart-controls ${className}`.trim()}>
      {showStock ? <p className={isAvailable ? 'stock-text' : 'stock-text empty'}>В наличии: {book.stock}</p> : null}

      {quantity > 0 ? (
        <div className="book-quantity-row">
          <button type="button" onClick={() => decreaseBook(book.id)}>
            -
          </button>
          <span>{quantity}</span>
          <button type="button" disabled={isLimitReached} onClick={() => increaseBook(book.id)}>
            +
          </button>
        </div>
      ) : (
        <button className="cart-action-button" type="button" disabled={!isAvailable} onClick={() => addBook(book)}>
          {isAvailable ? 'Добавить в корзину' : 'Нет в наличии'}
        </button>
      )}
    </div>
  );
}
