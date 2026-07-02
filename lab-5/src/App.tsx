import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { loadBooks } from './booksApi';
import { CartProvider } from './cartContext';
import { ShoppingCart } from './components/ShoppingCart';
import { BookPage } from './pages/BookPage';
import { CatalogPage } from './pages/CatalogPage';
import type { Book } from './types';

function AppContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks().then((loadedBooks) => {
      setBooks(loadedBooks);
      setLoading(false);
    });
  }, []);

  return (
    <main className="page">
      <ShoppingCart />
      <Routes>
        <Route path="/" element={<CatalogPage books={books} loading={loading} />} />
        <Route path="/books/:bookId" element={<BookPage books={books} loading={loading} />} />
        <Route path="*" element={<CatalogPage books={books} loading={loading} />} />
      </Routes>
    </main>
  );
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
