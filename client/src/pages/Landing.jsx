import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Truck, Shield, Clock, Leaf, Star, Heart } from 'lucide-react';
import logo from '../assets/logo12.png';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-cream-50 overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-5xl mx-auto">
            {/* Logo and Main Content */}
            <div className="text-center space-y-6">
              {/* Logo - Fixed Size */}
              <div className="flex justify-center mb-6">
                <img
                  src={logo}
                  alt="Freshoop"
                  className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-lg"
                />
              </div>

              {/* Heading */}
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Fresh Groceries
                <br />
                <span className="bg-gradient-to-r from-brand via-brand-600 to-brand-700 bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your one-stop shop for fresh fruits, vegetables, and groceries delivered 
                to your doorstep in just 30 minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <button
                  onClick={() => navigate('/shop')}
                  className="group inline-flex items-center justify-center gap-2 bg-brand text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <span>Start Shopping</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {!user && (
                  <button
                    onClick={() => navigate('/register')}
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brand text-brand px-8 py-4 rounded-full font-bold text-lg hover:bg-brand hover:text-white transition-all shadow-md"
                  >
                    <span>Sign Up Free</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <span className="text-gray-300">|</span>
                <span>10,000+ Happy Customers</span>
                <span className="text-gray-300">|</span>
                <span>5,000+ Products</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  icon: <Clock className="w-8 h-8" />, 
                  title: '30 Min Delivery',
                  description: 'Fast & reliable',
                  gradient: 'from-brand/10 to-brand/5'
                },
                { 
                  icon: <Leaf className="w-8 h-8" />, 
                  title: '100% Fresh',
                  description: 'Quality guaranteed',
                  gradient: 'from-green-100 to-green-50'
                },
                { 
                  icon: <Truck className="w-8 h-8" />, 
                  title: 'Free Delivery',
                  description: 'On orders over $50',
                  gradient: 'from-blue-100 to-blue-50'
                },
                { 
                  icon: <Shield className="w-8 h-8" />, 
                  title: 'Secure Payment',
                  description: '100% safe & secure',
                  gradient: 'from-purple-100 to-purple-50'
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="group bg-cream-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 text-brand group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-cream-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Browse & Add',
                  description: 'Choose from our wide selection of fresh products'
                },
                {
                  step: '2',
                  title: 'Quick Checkout',
                  description: 'Complete your order in just a few clicks'
                },
                {
                  step: '3',
                  title: 'Fast Delivery',
                  description: 'Get your groceries delivered in 30 minutes'
                }
              ].map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand text-white rounded-full text-2xl font-bold mb-4 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-brand/20"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-brand via-brand-600 to-brand-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg md:text-xl text-green-50">
              Join thousands of happy customers enjoying fresh groceries delivered fast
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/shop')}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand px-10 py-4 rounded-full font-bold text-lg hover:bg-cream-50 transition-all shadow-xl hover:scale-105"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              {!user && (
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand transition-all"
                >
                  <span>Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

