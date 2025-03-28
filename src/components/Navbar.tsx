import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Phone, Grid, ShoppingCart, Search, User, LogOut } from 'lucide-react';
import SearchBar from './SearchBar';
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  cartItemsCount: number;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function Navbar({ cartItemsCount, searchTerm, onSearch }: NavbarProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-gray-900" />
              <span className="text-xl font-bold">ANZARO Shoes</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8">
            <SearchBar searchTerm={searchTerm} onSearch={onSearch} />
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/categories" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <Grid className="h-5 w-5" />
              <span>Categories</span>
            </Link>
            <Link to="/contact" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <Phone className="h-5 w-5" />
              <span>Contact</span>
            </Link>
            <Link to="/cart" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
              <span>Cart</span>
            </Link>
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => user ? setIsProfileMenuOpen(!isProfileMenuOpen) : setIsAuthModalOpen(true)}
                className="flex items-center space-x-1 text-gray-700 hover:text-gray-900"
              >
                <User className="h-5 w-5" />
                <span>{user ? (user.user_metadata?.firstName || 'Profile') : 'Sign In'}</span>
              </button>
              {user && isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{`${user.user_metadata?.firstName} ${user.user_metadata?.lastName}`}</p>
                    <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                  </div>
                  {user.email === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}