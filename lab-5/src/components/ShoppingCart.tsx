import { useEffect, useRef, useState } from 'react';
import { useCart } from '../cartContext';
import { formatPrice } from '../utils';

export function ShoppingCart() {
  const { items, totalCount, totalPrice, increaseBook, decreaseBook, removeBook, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const previousTotalCount = useRef(totalCount);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingUp) {
        setIsVisible(true);
      }

      if (isScrollingUp || isScrollingDown) {
        setIsOpen(false);
      }

      if (isScrollingDown && !isOpen) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    if (totalCount > previousTotalCount.current) {
      setIsVisible(true);
    }

    previousTotalCount.current = totalCount;
  }, [totalCount]);

  function toggleCart() {
    setIsVisible(true);
    setIsOpen(!isOpen);
  }

  return (
    <section className={isVisible || isOpen ? 'cart-area visible' : 'cart-area'} aria-label="Корзина покупок">
      <button className="cart-toggle" type="button" onClick={toggleCart} aria-expanded={isOpen}>
        <span>Корзина</span>
        <span className="cart-count" key={totalCount}>
          {totalCount}
        </span>
      </button>

      <div className={isOpen ? 'cart-panel open' : 'cart-panel'}>
        <div className="cart-panel-inner">
          <div className="cart-header">
            <div>
              <h2>Корзина книг</h2>
              <p>{totalCount} товаров</p>
            </div>
            {items.length > 0 ? (
              <button className="clear-cart-button" type="button" onClick={clearCart}>
                Очистить
              </button>
            ) : null}
          </div>

          {items.length === 0 ? (
            <div className="cart-empty">
              <h3>Корзина пуста</h3>
              <p>Добавьте доступные книги из каталога или со страницы книги.</p>
            </div>
          ) : (
            <>
              <div className="cart-list">
                {items.map((item) => (
                  <article className="cart-item" key={item.book.id}>
                    <div>
                      <h3>{item.book.title}</h3>
                      <p>{formatPrice(item.book.price)} за книгу</p>
                    </div>

                    <div className="quantity-controls" aria-label={`Количество книги ${item.book.title}`}>
                      <button type="button" onClick={() => decreaseBook(item.book.id)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        disabled={item.quantity >= item.book.stock}
                        onClick={() => increaseBook(item.book.id)}
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-total">
                      <strong>{formatPrice(item.book.price * item.quantity)}</strong>
                      <span>Осталось: {item.book.stock - item.quantity}</span>
                      <button type="button" onClick={() => removeBook(item.book.id)}>
                        Удалить
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="cart-total">
                <span>Итого</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
