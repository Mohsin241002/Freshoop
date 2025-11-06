import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoriesApi, itemsApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import ItemCard from '../components/ItemCard';
import { Loader2, ShoppingBag, Truck, Clock, Shield, ArrowRight, Package, Heart, Star, ChevronRight } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const groceriesRef = useRef(null);

  console.log('Home component rendering', { loading, itemsCount: items.length, categoriesCount: categories.length });

  useEffect(() => {
    fetchCategories();
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="space-y-10">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand via-brand-600 to-brand-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Shop Fresh <span className="text-cream-100">Groceries</span>
          </h1>
          <p className="text-xl text-green-50 max-w-2xl">
            Browse through our wide selection of fresh fruits, vegetables, and quality groceries
          </p>
        </div>
      </div>

      {/* Groceries Section */}
      <div ref={groceriesRef} className="scroll-mt-20">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Our Products</h2>
          <p className="text-gray-600">Browse through our wide selection of fresh groceries</p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Filter by Category</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-md hover:shadow-lg hover:scale-105 ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-brand to-brand-600 text-white shadow-brand'
                  : 'bg-white text-gray-700 hover:bg-cream-100 border-2 border-gray-200'
              }`}
            >
              All Items
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-md hover:shadow-lg hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-brand to-brand-600 text-white shadow-brand'
                    : 'bg-white text-gray-700 hover:bg-cream-100 border-2 border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div>
          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-white rounded-3xl shadow-lg">
              <Loader2 className="w-12 h-12 animate-spin text-brand mb-4" />
              <p className="text-gray-600 font-medium">Loading fresh products...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl border-2 border-cream-200">
              <ShoppingBag className="w-20 h-20 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500 text-lg">Try selecting a different category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

