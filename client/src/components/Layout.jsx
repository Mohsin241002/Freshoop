import { Link, Outlet } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const { getCartItemsCount } = useCart();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-orange-600">
              Freshoop
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>

              {user && (
                <>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
                  >
                    <Package className="w-5 h-5" />
                    <span className="hidden sm:inline">Orders</span>
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition relative"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="hidden sm:inline">Cart</span>
                    {getCartItemsCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getCartItemsCount()}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden md:inline">
                    {user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Freshoop</h3>
              <p className="text-gray-400">
                Your online grocery store. Fresh fruits, vegetables, and groceries delivered to your door.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white">Shop</Link></li>
                <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
                <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: support@freshoop.com<br />
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Freshoop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

