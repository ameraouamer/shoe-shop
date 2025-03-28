import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import ShoeDetail from './pages/ShoeDetail';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import { CartItem } from './types';
import { supabase, saveCartItem, getCartItems, removeCartItem } from './lib/supabase';
import { shoes } from './data/shoes';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCartItems(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadCartItems(session.user.id);
      } else {
        setCartItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCartItems = async (userId: string) => {
    try {
      const cartData = await getCartItems(userId);
      const items = cartData.map(item => ({
        id: item.id,
        shoe: shoes.find(s => s.id === item.shoe_id)!,
        size: item.size,
        quantity: item.quantity,
        region: item.region
      }));
      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart items:', error);
    }
  };

  const addToCart = async (shoe: any, size: number | string, quantity: number, region: string) => {
    const newItem = { shoe, size, quantity, region };
    if (user) {
      try {
        await saveCartItem(user.id, newItem);
        loadCartItems(user.id);
      } catch (error) {
        console.error('Error saving cart item:', error);
      }
    }
    setCartItems([...cartItems, newItem]);
  };

  const removeFromCart = async (index: number) => {
    const item = cartItems[index];
    if (user && 'id' in item) {
      try {
        await removeCartItem(item.id);
      } catch (error) {
        console.error('Error removing cart item:', error);
        return;
      }
    }
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar
          cartItemsCount={cartItems.length}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home searchTerm={searchTerm} />} />
            <Route path="/categories" element={<Categories searchTerm={searchTerm} />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/shoe/:id"
              element={<ShoeDetail addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cartItems={cartItems} removeFromCart={removeFromCart} />}
            />
            <Route
              path="/admin"
              element={
                user?.email === 'admin' ? (
                  <Admin />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;