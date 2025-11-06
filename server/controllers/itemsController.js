import { supabase } from '../config/supabase.js';

/**
 * Helper function to upload image to Supabase Storage
 */
const uploadImage = async (file) => {
  try {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `items/${fileName}`;

    const { data, error } = await supabase.storage
      .from('food-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error('Image upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Helper function to delete image from Supabase Storage
 */
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract file path from URL
    const urlParts = imageUrl.split('/food-images/');
    if (urlParts.length < 2) return;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('food-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
    }
  } catch (error) {
    console.error('Delete image error:', error);
  }
};

/**
 * Get all items with optional category filter
 * @route GET /api/items
 * @access Public
 */
export const getAllItems = async (req, res) => {
  try {
    const { category_id, is_available, search } = req.query;

    let query = supabase
      .from('items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (is_available !== undefined) {
      query = query.eq('is_available', is_available === 'true');
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items'
    });
  }
};

/**
 * Get single item by ID
 * @route GET /api/items/:id
 * @access Public
 */
export const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch item'
    });
  }
};

/**
 * Create new item
 * @route POST /api/items
 * @access Admin only
 */
export const createItem = async (req, res) => {
  try {
    const { name, description, category_id, price, stock_quantity, is_available } = req.body;

    // Validation
    if (!name || !category_id || !price) {
      return res.status(400).json({
        success: false,
        error: 'Name, category_id, and price are required'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Item name must be at least 2 characters'
      });
    }

    if (isNaN(price) || price < 0) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
    }

    // Check if category exists
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('id', category_id)
      .single();

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      });
    }

    // Handle image upload if file is provided
    let imageUrl = null;
    if (req.file) {
      const imageData = await uploadImage(req.file);
      imageUrl = imageData.url;
    }

    // Create item
    const { data, error } = await supabase
      .from('items')
      .insert([{
        name: name.trim(),
        description: description?.trim() || null,
        category_id,
        price: parseFloat(price),
        stock_quantity: stock_quantity ? parseInt(stock_quantity) : 0,
        image_url: imageUrl,
        is_available: is_available !== undefined ? is_available === 'true' : true
      }])
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: data
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create item'
    });
  }
};

/**
 * Update item
 * @route PUT /api/items/:id
 * @access Admin only
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id, price, stock_quantity, is_available } = req.body;

    // Get existing item
    const { data: existingItem, error: fetchError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Validate inputs if provided
    if (name && name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Item name must be at least 2 characters'
      });
    }

    if (price && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        error: 'Price must be a positive number'
      });
    }

    if (category_id) {
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('id', category_id)
        .single();

      if (!category) {
        return res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
      }
    }

    // Handle image upload if new file is provided
    let imageUrl = existingItem.image_url;
    if (req.file) {
      // Delete old image
      if (existingItem.image_url) {
        await deleteImage(existingItem.image_url);
      }
      // Upload new image
      const imageData = await uploadImage(req.file);
      imageUrl = imageData.url;
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (name) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (category_id) updateData.category_id = category_id;
    if (price) updateData.price = parseFloat(price);
    if (stock_quantity !== undefined) updateData.stock_quantity = parseInt(stock_quantity);
    if (is_available !== undefined) updateData.is_available = is_available === 'true';
    if (req.file) updateData.image_url = imageUrl;

    // Update item
    const { data, error } = await supabase
      .from('items')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update item'
    });
  }
};

/**
 * Delete item
 * @route DELETE /api/items/:id
 * @access Admin only
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Get item to delete image
    const { data: item, error: fetchError } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Delete image from storage
    if (item.image_url) {
      await deleteImage(item.image_url);
    }

    // Delete item
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item'
    });
  }
};

/**
 * Update item stock
 * @route PATCH /api/items/:id/stock
 * @access Admin only
 */
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    // Validation
    if (stock_quantity === undefined || stock_quantity === null) {
      return res.status(400).json({
        success: false,
        error: 'stock_quantity is required'
      });
    }

    const quantity = parseInt(stock_quantity);
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock quantity must be a positive number'
      });
    }

    // Update stock
    const { data, error } = await supabase
      .from('items')
      .update({
        stock_quantity: quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Item not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: {
        id: data.id,
        name: data.name,
        stock_quantity: data.stock_quantity
      }
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update stock'
    });
  }
};

