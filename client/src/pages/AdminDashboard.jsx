import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  AlertCircle,
  Loader2,
  ArrowUpDown
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import StatsCards from '../components/admin/StatsCards';
import ItemForm from '../components/admin/ItemForm';
import AdminItemCard from '../components/admin/AdminItemCard';
import CategoryForm from '../components/admin/CategoryForm';
import OrdersList from '../components/admin/OrdersList';
import adminService from '../services/adminService';
import { categoriesApi, itemsApi } from '../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  // UI states
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notification, setNotification] = useState(null);

  // Check admin access on mount
  useEffect(() => {
    checkAdminAccess();
  }, []);

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const checkAdminAccess = async () => {
    try {
      const isAdmin = await adminService.isAdmin();
      if (!isAdmin) {
        setNotification({ type: 'error', message: 'Access denied. Admin privileges required.' });
        setTimeout(() => navigate('/shop'), 2000);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setNotification({ type: 'error', message: 'Failed to verify admin access' });
      setTimeout(() => navigate('/shop'), 2000);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        await Promise.all([
          loadStats(),
          loadLowStockItems(),
          loadRecentOrders(),
        ]);
      } else if (activeTab === 'items') {
        await Promise.all([loadItems(), loadCategories()]);
      } else if (activeTab === 'categories') {
        await loadCategories();
      } else if (activeTab === 'orders') {
        await loadOrders();
      }
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('error', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const statsData = await adminService.getDashboardStats();
    setStats(statsData);
  };

  const loadItems = async () => {
    const response = await itemsApi.getAll();
    const itemsData = response.data.data || response.data;
    const itemsArray = Array.isArray(itemsData) ? itemsData : [];
    // Force re-render by creating new array
    setItems([...itemsArray]);
  };

  const loadCategories = async () => {
    const response = await categoriesApi.getAll();
    const categoriesData = response.data.data || response.data;
    setCategories(Array.isArray(categoriesData) ? categoriesData : []);
  };

  const loadOrders = async () => {
    const ordersData = await adminService.getAllOrders();
    setOrders(Array.isArray(ordersData) ? ordersData : ordersData.data || []);
  };

  const loadLowStockItems = async () => {
    const lowStock = await adminService.getLowStockItems(10);
    setLowStockItems(Array.isArray(lowStock) ? lowStock : []);
  };

  const loadRecentOrders = async () => {
    const ordersData = await adminService.getAllOrders();
    const allOrders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
    setOrders(allOrders.slice(0, 5)); // Show only 5 recent orders on overview
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Item handlers
  const handleCreateItem = async (formData) => {
    setActionLoading(true);
    try {
      await adminService.createItem(formData);
      showNotification('success', 'Item created successfully');
      setShowItemForm(false);
      await loadItems();
      await loadStats();
    } catch (error) {
      console.error('Error creating item:', error);
      showNotification('error', error.message || 'Failed to create item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateItem = async (formData) => {
    setActionLoading(true);
    try {
      await adminService.updateItem(editingItem.id, formData);
      showNotification('success', 'Item updated successfully');
      setShowItemForm(false);
      setEditingItem(null);
      await loadItems();
    } catch (error) {
      console.error('Error updating item:', error);
      showNotification('error', error.message || 'Failed to update item');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await adminService.deleteItem(itemId);
      showNotification('success', 'Item deleted successfully');
      await loadItems();
      await loadStats();
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('error', 'Failed to delete item');
    }
  };

  const handleUpdateStock = async (itemId, quantity) => {
    try {
      await adminService.updateStock(itemId, quantity);
      showNotification('success', 'Stock updated successfully');
      await loadItems();
      await loadStats();
      if (activeTab === 'overview') {
        await loadLowStockItems();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      showNotification('error', 'Failed to update stock');
    }
  };

  const handleToggleAvailability = async (itemId, isAvailable) => {
    try {
      await adminService.toggleAvailability(itemId, isAvailable);
      showNotification('success', `Item ${isAvailable ? 'enabled' : 'disabled'} successfully`);
      await loadItems();
    } catch (error) {
      console.error('Error toggling availability:', error);
      showNotification('error', 'Failed to update item availability');
    }
  };

  // Category handlers
  const handleCreateCategory = async (data) => {
    setActionLoading(true);
    try {
      await adminService.createCategory(data);
      showNotification('success', 'Category created successfully');
      setShowCategoryForm(false);
      await loadCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      showNotification('error', 'Failed to create category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (data) => {
    setActionLoading(true);
    try {
      await adminService.updateCategory(editingCategory.id, data);
      showNotification('success', 'Category updated successfully');
      setShowCategoryForm(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      showNotification('error', 'Failed to update category');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Delete this category? All items in this category will need to be reassigned.')) {
      return;
    }
    
    try {
      await adminService.deleteCategory(categoryId);
      showNotification('success', 'Category deleted successfully');
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showNotification('error', 'Failed to delete category');
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, status);
      showNotification('success', 'Order status updated successfully');
      await loadOrders();
      if (activeTab === 'overview') {
        await loadStats();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showNotification('error', 'Failed to update order status');
    }
  };

  // Filter items
  const filteredItems = Array.isArray(items) ? items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Notification */}
      {notification && (
        <div
          className={`
            fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 animate-slide-in
            ${notification.type === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : 'bg-red-50 border-red-500 text-red-800'
            }
          `}
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
            <p className="text-gray-600">Monitor your inventory and orders at a glance</p>
          </div>

          <StatsCards stats={stats} loading={loading} />

          {/* Low Stock Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h2>
              <button
                onClick={() => setActiveTab('items')}
                className="text-brand hover:text-brand-dark font-semibold text-sm"
              >
                View All Items →
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : lowStockItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lowStockItems.slice(0, 6).map(item => (
                  <AdminItemCard
                    key={item.id}
                    item={item}
                    onEdit={(item) => {
                      setEditingItem(item);
                      setShowItemForm(true);
                    }}
                    onDelete={handleDeleteItem}
                    onUpdateStock={handleUpdateStock}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
                <p className="text-gray-600">No low stock items. Everything looks good! 🎉</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-brand hover:text-brand-dark font-semibold text-sm"
              >
                View All Orders →
              </button>
            </div>
            <OrdersList
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              loading={loading}
            />
          </div>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Items</h1>
              <p className="text-gray-600">{items.length} total items</p>
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowItemForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-brand-600 text-white font-bold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add New Item
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none"
              >
                <option value="all">All Categories</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map(item => (
                <AdminItemCard
                  key={item.id}
                  item={item}
                  onEdit={(item) => {
                    setEditingItem(item);
                    setShowItemForm(true);
                  }}
                  onDelete={handleDeleteItem}
                  onUpdateStock={handleUpdateStock}
                  onToggleAvailability={handleToggleAvailability}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center">
              <p className="text-gray-600 mb-4">No items found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-brand hover:text-brand-dark font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Categories</h1>
              <p className="text-gray-600">{categories.length} total categories</p>
            </div>
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryForm(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-brand-600 text-white font-bold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all shadow-lg hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add Category
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-6 border-2 border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories
                .sort((a, b) => a.display_order - b.display_order)
                .map(category => (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Order: {category.display_order}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {Array.isArray(items) ? items.filter(item => item.category_id === category.id).length : 0} items
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                        className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border-2 border-gray-200 text-center">
              <p className="text-gray-600">No categories yet. Create your first category!</p>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Orders</h1>
            <p className="text-gray-600">{orders.length} total orders</p>
          </div>

          <OrdersList
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            loading={loading}
          />
        </div>
      )}

      {/* Modals */}
      {showItemForm && (
        <ItemForm
          item={editingItem}
          categories={categories}
          onSubmit={editingItem ? handleUpdateItem : handleCreateItem}
          onCancel={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
          loading={actionLoading}
        />
      )}

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
          loading={actionLoading}
        />
      )}
    </AdminLayout>
  );
}

