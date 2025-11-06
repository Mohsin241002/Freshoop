import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Mail, Phone, MapPin, Heart, Facebook, Twitter, Instagram } from 'lucide-react';
import logo from '../assets/logo12.jpg';

export default function Layout() {
  console.log('Layout rendering...');
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-brand via-brand-600 to-brand-700 text-white relative overflow-hidden mt-20">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-cream-100 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={logo} alt="Freshoop" className="h-16 w-auto filter brightness-0 invert" />
                <span className="text-3xl font-extrabold">Freshoop</span>
              </div>
              <p className="text-green-50 text-lg mb-6 leading-relaxed">
                Your online grocery store delivering fresh fruits, vegetables, and quality groceries right to your doorstep in just 30 minutes.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border border-white/30">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border border-white/30">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm border border-white/30">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-6 text-xl">Quick Links</h4>
              <ul className="space-y-3 text-green-50">
                <li>
                  <Link to="/" className="hover:text-white transition-colors hover:pl-2 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/shop" className="hover:text-white transition-colors hover:pl-2 inline-block">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-white transition-colors hover:pl-2 inline-block">
                    My Orders
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-white transition-colors hover:pl-2 inline-block">
                    Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-6 text-xl">Contact Us</h4>
              <ul className="space-y-4 text-green-50">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>support@freshoop.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>(555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>123 Fresh Street, Grocery City, GC 12345</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t-2 border-white/20 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-green-50 text-center md:text-left">
                &copy; 2025 Freshoop. All rights reserved.
              </p>
              <p className="text-green-50 flex items-center gap-2">
                Made with <Heart className="w-4 h-4 fill-red-400 text-red-400" /> for fresh food lovers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

