import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categoriesApi, itemsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/ItemCard';
import { Loader2, ShoppingBag } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const groceriesRef = useRef(null);
  const [searchParams] = useSearchParams();

  console.log('Home component rendering', { loading, itemsCount: items.length, categoriesCount: categories.length });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCategories();
      
      // Check if there's a category in URL params
      const categoryParam = searchParams.get('category');
      if (categoryParam) {
        // Wait for categories to be loaded, then find matching category
        const timer = setTimeout(() => {
          const matchingCategory = categories.find(
            cat => cat.name.toLowerCase() === categoryParam.toLowerCase()
          );
          if (matchingCategory) {
            setSelectedCategory(matchingCategory.id);
            fetchItems(matchingCategory.id);
          } else {
            fetchItems();
          }
        }, 100);
        return () => clearTimeout(timer);
      } else {
        fetchItems();
      }
    };
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handle category filtering when categories are loaded
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.length > 0) {
      const matchingCategory = categories.find(
        cat => cat.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchingCategory) {
        setSelectedCategory(matchingCategory.id);
        fetchItems(matchingCategory.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      console.log('Categories response:', response.data);
      // API returns { success, count, data }
      if (response.data && response.data.data) {
        setCategories(response.data.data);
      } else {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const fetchItems = async (categoryId = null) => {
    try {
      setLoading(true);
      const response = await itemsApi.getAll(categoryId);
      console.log('Items response:', response.data);
      // API returns { success, count, data }
      if (response.data && response.data.data) {
        setItems(response.data.data);
      } else {
        setItems(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchItems(categoryId);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Shop Fresh
            </h1>
            <p className="text-xl text-gray-600">
              Browse our curated selection of premium quality groceries
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div ref={groceriesRef}>
          {loading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <Loader2 className="w-12 h-12 animate-spin text-brand mb-4" />
              <p className="text-gray-600 font-medium">Loading products...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-32">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try selecting a different category</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 font-medium">
                  {items.length} {items.length === 1 ? 'product' : 'products'}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

