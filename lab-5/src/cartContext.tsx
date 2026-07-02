import { createContext, ReactNode, useContext, useMemo, useReducer } from 'react';
import type { Book, CartAction, CartItem, CartState } from './types';

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addBook: (book: Book) => void;
  increaseBook: (bookId: number) => void;
  decreaseBook: (bookId: number) => void;
  removeBook: (bookId: number) => void;
  clearCart: () => void;
  getBookQuantity: (bookId: number) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

const initialState: CartState = {
  items: []
};

function cartReducer(state: CartState, action: CartAction): CartState {
  if (action.type === 'add') {
    if (action.book.stock <= 0) {
      return state;
    }

    const existingItem = state.items.find((item) => item.book.id === action.book.id);

    if (existingItem) {
      if (existingItem.quantity >= existingItem.book.stock) {
        return state;
      }

      return {
        items: state.items.map((item) => {
          if (item.book.id !== action.book.id) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity + 1
          };
        })
      };
    }

    return {
      items: [
        ...state.items,
        {
          book: action.book,
          quantity: 1
        }
      ]
    };
  }

  if (action.type === 'increase') {
    return {
      items: state.items.map((item) => {
        if (item.book.id !== action.bookId) {
          return item;
        }

        if (item.quantity >= item.book.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1
        };
      })
    };
  }

  if (action.type === 'decrease') {
    return {
      items: state.items
        .map((item) => {
          if (item.book.id !== action.bookId) {
            return item;
          }

          return {
            ...item,
            quantity: item.quantity - 1
          };
        })
        .filter((item) => item.quantity > 0)
    };
  }

  if (action.type === 'remove') {
    return {
      items: state.items.filter((item) => item.book.id !== action.bookId)
    };
  }

  if (action.type === 'clear') {
    return initialState;
  }

  return state;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const totalCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce((total, item) => total + item.book.price * item.quantity, 0);
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items: state.items,
      totalCount,
      totalPrice,
      addBook: (book) => dispatch({ type: 'add', book }),
      increaseBook: (bookId) => dispatch({ type: 'increase', bookId }),
      decreaseBook: (bookId) => dispatch({ type: 'decrease', bookId }),
      removeBook: (bookId) => dispatch({ type: 'remove', bookId }),
      clearCart: () => dispatch({ type: 'clear' }),
      getBookQuantity: (bookId) => {
        const item = state.items.find((cartItem) => cartItem.book.id === bookId);
        return item?.quantity || 0;
      }
    };
  }, [state.items, totalCount, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return value;
}
