import { useEffect, useState } from 'react';
import { categoriesApi, itemsApi } from '../lib/api';
import ItemCard from '../components/ItemCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchItems();
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
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchItems(categoryId);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Freshoop</h1>
        <p className="text-xl">Fresh fruits, vegetables, and groceries delivered to your doorstep</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-6 py-2 rounded-full transition ${
              selectedCategory === null
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full transition ${
                selectedCategory === category.id
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : 'All Items'}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No items found</p>
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
  );
}

