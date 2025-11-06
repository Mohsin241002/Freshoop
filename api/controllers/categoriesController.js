import { supabase } from '../config/supabase.js';

/**
 * Get all categories
 * @route GET /api/categories
 * @access Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
};

/**
 * Get category by ID
 * @route GET /api/categories/:id
 * @access Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Category not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category'
    });
  }
};

/**
 * Create new category
 * @route POST /api/categories
 * @access Admin only
 */
export const createCategory = async (req, res) => {
  try {
    const { name, display_order } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required'
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Category name must be at least 2 characters'
      });
    }

    // Check if category already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('name', name.trim())
      .single();

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }

    // Create category
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: name.trim(),
        display_order: display_order || 999
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: data
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create category'
    });
  }
};

/**
 * Update category
 * @route PUT /api/categories/:id
 * @access Admin only
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, display_order } = req.body;

    // Validation
    if (!name && display_order === undefined) {
      return res.status(400).json({
        success: false,
        error: 'At least one field (name or display_order) is required'
      });
    }

    if (name && name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Category name must be at least 2 characters'
      });
    }

    // Check if category exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check for duplicate name
    if (name) {
      const { data: duplicateCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name.trim())
        .neq('id', id)
        .single();

      if (duplicateCategory) {
        return res.status(409).json({
          success: false,
          error: 'Category with this name already exists'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (display_order !== undefined) updateData.display_order = display_order;

    // Update category
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update category'
    });
  }
};

/**
 * Delete category
 * @route DELETE /api/categories/:id
 * @access Admin only
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const { data: category } = await supabase
      .from('categories')
      .select('id, name')
      .eq('id', id)
      .single();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id')
      .eq('category_id', id);

    if (itemsError) throw itemsError;

    if (items && items.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${items.length} item(s). Please reassign or delete items first.`
      });
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete category'
    });
  }
};

