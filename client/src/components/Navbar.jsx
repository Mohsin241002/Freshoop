import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, User, Menu, X, Home as HomeIcon, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import logo from '../assets/logo12.jpg';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const cartItemsCount = getCartItemsCount();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-brand/10">
      <nav className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group -my-2"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Freshoop Logo"
                className="h-12 w-auto transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-brand text-white shadow-brand' 
                  : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/shop"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                isActive('/shop') 
                  ? 'bg-brand text-white shadow-brand' 
                  : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Shop</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/orders"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all ${
                    isActive('/orders') 
                      ? 'bg-brand text-white shadow-brand' 
                      : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/cart"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative ${
                    isActive('/cart') 
                      ? 'bg-brand text-white shadow-brand' 
                      : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l-2 border-gray-200">
                <div className="flex items-center gap-2 bg-cream-100 px-3 py-2 rounded-xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-700 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-red-50 text-red-600 hover:bg-red-100 transition-all font-semibold px-4 py-2.5 rounded-xl"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l-2 border-gray-200">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-brand transition-colors font-semibold px-5 py-2.5 rounded-xl hover:bg-cream-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-brand to-brand-600 text-white px-6 py-2.5 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-brand transition-colors p-2 rounded-lg hover:bg-cream-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t-2 border-cream-200 pt-4 animate-fade-in">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-brand text-white' 
                  : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
              }`}
            >
              <HomeIcon className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                isActive('/shop') 
                  ? 'bg-brand text-white' 
                  : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
              }`}
            >
              <Store className="w-5 h-5" />
              <span>Shop</span>
            </Link>

            {user && (
              <>
                <Link
                  to="/orders"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                    isActive('/orders') 
                      ? 'bg-brand text-white' 
                      : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all relative ${
                    isActive('/cart') 
                      ? 'bg-brand text-white' 
                      : 'text-gray-700 hover:bg-cream-100 hover:text-brand'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart</span>
                  {cartItemsCount > 0 && (
                    <span className="ml-auto bg-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="space-y-2 pt-3 border-t-2 border-cream-200 mt-3">
                <div className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 truncate flex-1">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-50 text-red-600 hover:bg-red-100 transition-all p-3 rounded-xl font-semibold text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-3 border-t-2 border-cream-200 mt-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center text-gray-700 hover:bg-cream-100 transition-all p-3 rounded-xl font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-gradient-to-r from-brand to-brand-600 text-white p-3 rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold shadow-brand"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

