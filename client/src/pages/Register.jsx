import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2, CheckCircle, Package, Truck, Shield } from 'lucide-react';
import logo from '../assets/logo12.jpg';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      setSuccess(true);
      
      // Wait 2 seconds and then navigate to home
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-2 border-brand">
            <div className="w-20 h-20 bg-gradient-to-br from-brand to-brand-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-brand">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Account Created!</h2>
            <p className="text-gray-600 text-lg mb-4">
              Welcome to Freshoop! 🎉 Your account has been successfully created.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting you to the homepage...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="bg-gradient-to-br from-brand via-brand-600 to-brand-700 rounded-3xl p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <img 
                  src={logo} 
                  alt="Freshoop Logo" 
                  className="h-24 w-auto filter brightness-0 invert drop-shadow-2xl"
                />
              </div>
              <h2 className="text-4xl font-bold mb-4">Join Freshoop Today!</h2>
              <p className="text-green-100 text-lg mb-8">
                Start your fresh grocery shopping journey with thousands of quality products
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">5000+ Products</div>
                    <div className="text-sm text-green-100">Wide selection available</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">30-Min Delivery</div>
                    <div className="text-sm text-green-100">Lightning fast service</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">100% Fresh Guarantee</div>
                    <div className="text-sm text-green-100">Quality assured</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="Freshoop Logo" 
                className="h-20 w-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Get Started</h1>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600 text-lg">Join thousands of happy shoppers</p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-cream-200">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-2xl mb-6 flex items-start gap-3 animate-shake shadow-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Create a password"
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent transition-all outline-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Confirm your password"
                    minLength={6}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-brand to-brand-600 text-white py-4 rounded-2xl hover:from-brand-600 hover:to-brand-700 transition-all font-bold text-lg shadow-brand hover:shadow-xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-brand hover:text-brand-dark font-bold transition-colors hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500 mt-6">
            By creating an account, you agree to our <span className="text-brand font-semibold">Terms of Service</span> and <span className="text-brand font-semibold">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

