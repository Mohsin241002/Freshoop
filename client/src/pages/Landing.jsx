import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import logo from '../assets/logo12.jpg';
import { useState, useEffect, useRef } from 'react';
import { fetchPexelsImages } from '../services/pexelsService';

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [heroImages, setHeroImages] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Scroll animation refs
  const categoryRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);
  const [isVisible, setIsVisible] = useState({
    category: false,
    stats: false,
    cta: false
  });

  useEffect(() => {
    // Fetch hero images
    const loadHeroImages = async () => {
      const images = await fetchPexelsImages('fresh vegetables fruits grocery market', 5);
      setHeroImages(images);
    };

    // Fetch category images
    const loadCategoryImages = async () => {
      const [fruits, vegetables, dairy] = await Promise.all([
        fetchPexelsImages('fresh fruits colorful', 1),
        fetchPexelsImages('fresh vegetables organic', 1),
        fetchPexelsImages('grocery shopping healthy food', 1),
      ]);

      setCategoryImages({
        fruits: fruits[0],
        vegetables: vegetables[0],
        dairy: dairy[0],
      });
    };

    loadHeroImages();
    loadCategoryImages();
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    if (heroImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages]);

  // Scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetName = entry.target.dataset.section;
          setIsVisible(prev => ({ ...prev, [targetName]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (categoryRef.current) observer.observe(categoryRef.current);
    if (statsRef.current) observer.observe(statsRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-cream-50">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `radial-gradient(circle at 20% 50%, rgba(119, 191, 84, 0.1) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 80%, rgba(252, 247, 235, 0.3) 0%, transparent 50%)`,
               }}>
          </div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                  <span className="text-gray-900">Fresh</span>
                  <br />
                  <span className="text-gray-900">Groceries in</span>
                  <br />
                  <span className="relative inline-block">
                    <span className="relative z-10 text-brand">5 Minutes</span>
                    <span className="absolute bottom-2 left-0 w-full h-4 bg-brand/20 -rotate-1"></span>
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Premium quality fruits, vegetables, and daily essentials delivered to your doorstep. Fresh from farm to table.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => navigate('/shop')}
                    className="group bg-brand text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-700 transition-all shadow-lg hover:shadow-brand/50 hover:-translate-y-0.5 transform flex items-center gap-2"
                  >
                    <span>Start Shopping</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {!user && (
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-0.5 transform"
                    >
                      Create Account
                    </button>
                  )}
                </div>
              </div>

              {/* Right Content - Image Grid */}
              <div className="relative hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  {heroImages.slice(0, 4).map((image, index) => (
                    <div
                      key={image.id}
                      className={`relative overflow-hidden rounded-2xl ${
                        index === 0 ? 'col-span-2 h-64' : 'h-48'
                      }`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      <img
                        src={image.src.large}
                        alt={image.alt}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  ))}
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">5 Min</div>
                      <div className="text-sm text-gray-600">Delivery</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Showcase */}
      <section 
        ref={categoryRef}
        data-section="category"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-1000 ${
              isVisible.category ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
                Shop Fresh
              </h2>
              <p className="text-xl text-gray-600">Handpicked quality, delivered daily</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'Fruits', 
                  image: categoryImages.fruits,
                  delay: '0ms',
                  category: 'Fruits'
                },
                { 
                  title: 'Vegetables', 
                  image: categoryImages.vegetables,
                  delay: '200ms',
                  category: 'Vegetables'
                },
                { 
                  title: 'Essentials', 
                  image: categoryImages.dairy,
                  delay: '400ms',
                  category: 'Dairy'
                }
              ].map((category, index) => (
                <div 
                  key={index}
                  className={`group relative h-96 rounded-3xl overflow-hidden cursor-pointer transition-all duration-1000 ${
                    isVisible.category ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: category.delay }}
                  onClick={() => navigate(`/shop?category=${encodeURIComponent(category.category)}`)}
                >
                  {/* Background Image */}
                  {category.image && (
                    <img 
                      src={category.image.src.large}
                      alt={category.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent group-hover:from-brand group-hover:via-brand/60 transition-all duration-500"></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <h3 className="text-4xl font-black mb-4">{category.title}</h3>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="text-lg font-semibold">Explore</span>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        ref={statsRef}
        data-section="stats"
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className={`transition-all duration-1000 ${
              isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-20 text-center">
                How It Works
              </h2>

              {/* Step 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="order-2 md:order-1">
                  {categoryImages.fruits && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={categoryImages.fruits.src.large}
                        alt="Browse products"
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="order-1 md:order-2 space-y-6">
                  <div className="text-8xl font-black text-brand/10">01</div>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">Browse</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Explore our curated selection of fresh produce and essentials. 
                    Browse through thousands of quality products, from farm-fresh 
                    vegetables to daily necessities.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-6">
                  <div className="text-8xl font-black text-brand/10">02</div>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">Order</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Add items to cart and checkout in seconds with our secure payment 
                    system. Easy, fast, and completely safe. Multiple payment options 
                    available for your convenience.
                  </p>
                </div>
                <div>
                  {categoryImages.vegetables && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={categoryImages.vegetables.src.large}
                        alt="Order products"
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  {categoryImages.dairy && (
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <img 
                        src={categoryImages.dairy.src.large}
                        alt="Receive delivery"
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="order-1 md:order-2 space-y-6">
                  <div className="text-8xl font-black text-brand/10">03</div>
                  <h3 className="text-4xl md:text-5xl font-black text-gray-900">Receive</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Get your order delivered fresh to your door in just 5 minutes. 
                    Our delivery team ensures your groceries arrive in perfect 
                    condition, ready to use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

