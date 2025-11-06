import api, { categoriesApi, itemsApi, ordersApi } from '../lib/api';
import { supabase } from '../lib/supabase';

/**
 * Admin Service
 * Handles all admin-related operations
 */

export const adminService = {
  // ==================== CATEGORY MANAGEMENT ====================
  
  /**
   * Create a new category
   * @param {Object} data - Category data (name, display_order)
   * @returns {Promise} - API response
   */
  async createCategory(data) {
    const response = await categoriesApi.create(data);
    return response.data;
  },

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} data - Updated category data
   * @returns {Promise} - API response
   */
  async updateCategory(id, data) {
    const response = await categoriesApi.update(id, data);
    return response.data;
  },

  /**
   * Delete a category
   * @param {string} id - Category ID
   * @returns {Promise} - API response
   */
  async deleteCategory(id) {
    const response = await categoriesApi.delete(id);
    return response.data;
  },

  // ==================== ITEM MANAGEMENT ====================

  /**
   * Create a new item with image upload
   * @param {FormData} formData - Form data including image file
   * @returns {Promise} - API response
   */
  async createItem(formData) {
    // If there's an image file, upload it first
    const imageFile = formData.get('image');
    let imageUrl = formData.get('image_url') || '';

    if (imageFile && imageFile instanceof File) {
      imageUrl = await this.uploadImage(imageFile);
    }

    // Prepare item data
    const itemData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category_id: formData.get('category_id'),
      stock_quantity: parseInt(formData.get('stock_quantity')),
      unit: formData.get('unit') || 'kg',
      image_url: imageUrl,
      is_available: formData.get('is_available') === 'true',
    };

    const response = await itemsApi.create(itemData);
    return response.data;
  },

  /**
   * Update an existing item
   * @param {string} id - Item ID
   * @param {FormData} formData - Form data including image file
   * @returns {Promise} - API response
   */
  async updateItem(id, formData) {
    // If there's a new image file, upload it
    const imageFile = formData.get('image');
    let imageUrl = formData.get('image_url') || '';

    if (imageFile && imageFile instanceof File) {
      imageUrl = await this.uploadImage(imageFile);
    }

    // Prepare item data
    const itemData = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category_id: formData.get('category_id'),
      stock_quantity: parseInt(formData.get('stock_quantity')),
      unit: formData.get('unit') || 'kg',
      image_url: imageUrl,
      is_available: formData.get('is_available') === 'true',
    };

    const response = await itemsApi.update(id, itemData);
    return response.data;
  },

  /**
   * Delete an item
   * @param {string} id - Item ID
   * @returns {Promise} - API response
   */
  async deleteItem(id) {
    const response = await itemsApi.delete(id);
    return response.data;
  },

  /**
   * Update item stock quantity
   * @param {string} id - Item ID
   * @param {number} quantity - New stock quantity
   * @returns {Promise} - API response
   */
  async updateStock(id, quantity) {
    const response = await itemsApi.update(id, { stock_quantity: quantity });
    return response.data;
  },

  /**
   * Toggle item availability
   * @param {string} id - Item ID
   * @param {boolean} isAvailable - Availability status
   * @returns {Promise} - API response
   */
  async toggleAvailability(id, isAvailable) {
    const response = await itemsApi.update(id, { is_available: isAvailable });
    return response.data;
  },

  // ==================== ORDER MANAGEMENT ====================

  /**
   * Get all orders (admin only)
   * @param {string} status - Filter by status (optional)
   * @returns {Promise} - API response
   */
  async getAllOrders(status = null) {
    const params = status ? { status } : {};
    const response = await api.get('/orders/admin/all', { params });
    return response.data;
  },

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} status - New status (pending, processing, delivered, cancelled)
   * @returns {Promise} - API response
   */
  async updateOrderStatus(id, status) {
    const response = await ordersApi.updateStatus(id, status);
    return response.data;
  },

  /**
   * Get order details by ID
   * @param {string} id - Order ID
   * @returns {Promise} - API response
   */
  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // ==================== IMAGE UPLOAD ====================

  /**
   * Upload image to Supabase Storage
   * @param {File} file - Image file
   * @returns {Promise<string>} - Public URL of uploaded image
   */
  async uploadImage(file) {
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  },

  // ==================== STATISTICS ====================

  /**
   * Get dashboard statistics
   * @returns {Promise} - Dashboard stats
   */
  async getDashboardStats() {
    try {
      const [itemsResponse, ordersResponse] = await Promise.all([
        itemsApi.getAll(),
        this.getAllOrders(),
      ]);

      const items = itemsResponse.data.data || itemsResponse.data || [];
      const itemsArray = Array.isArray(items) ? items : [];
      const orders = ordersResponse.data || ordersResponse;
      const ordersArray = Array.isArray(orders) ? orders : [];

      const stats = {
        totalItems: itemsArray.length,
        lowStockItems: itemsArray.filter(item => item.stock_quantity < 10).length,
        totalOrders: ordersArray.length,
        pendingDeliveries: ordersArray.filter(order => 
          order.status === 'pending' || order.status === 'processing'
        ).length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalItems: 0,
        lowStockItems: 0,
        totalOrders: 0,
        pendingDeliveries: 0,
      };
    }
  },

  /**
   * Get low stock items
   * @param {number} threshold - Stock threshold (default: 10)
   * @returns {Promise} - Array of low stock items
   */
  async getLowStockItems(threshold = 10) {
    const response = await itemsApi.getAll();
    const items = response.data.data || response.data || [];
    const itemsArray = Array.isArray(items) ? items : [];
    return itemsArray.filter(item => item.stock_quantity < threshold);
  },

  // ==================== ADMIN VERIFICATION ====================

  /**
   * Check if current user is an admin
   * @returns {Promise<boolean>} - True if user is admin
   */
  async isAdmin() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      // Check against backend admin emails list
      // Make a simple API call that requires admin privileges
      try {
        await api.get('/orders/admin/all', { params: { limit: 1 } });
        // If the call succeeds, user is an admin
        return true;
      } catch (error) {
        // If it fails with 403, user is not an admin
        if (error.response?.status === 403) {
          return false;
        }
        // For other errors, assume not admin
        console.error('Error checking admin status:', error);
        return false;
      }
    } catch (error) {
      console.error('Error in isAdmin:', error);
      return false;
    }
  },
};

export default adminService;

