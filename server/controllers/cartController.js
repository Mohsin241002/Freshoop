import { supabase } from '../config/supabase.js';

/**
 * Helper function to get or create user's cart
 */
const getOrCreateCart = async (userId) => {
  try {
    // Try to get existing cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    // If cart doesn't exist (PGRST116 is "no rows returned" error)
    if (cartError && cartError.code === 'PGRST116') {
      // Create new cart
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select('id')
        .single();

      if (createError) throw createError;
      return newCart;
    }

    if (cartError) throw cartError;
    return cart;
  } catch (error) {
    throw error;
  }
};

/**
 * Helper function to get cart with all items and calculate total
 */
const getCartWithItems = async (cartId) => {
  try {
    // Get cart items with populated item details
    const { data: cartItems, error: itemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        item_id,
        quantity,
        added_at,
        items (
          id,
          name,
          description,
          price,
          image_url,
          is_available,
          stock_quantity,
          category_id
        )
      `)
      .eq('cart_id', cartId)
      .order('added_at', { ascending: false });

    if (itemsError) throw itemsError;

    // Calculate total amount
    let totalAmount = 0;
    const items = cartItems.map(cartItem => {
      const itemTotal = parseFloat(cartItem.items.price) * cartItem.quantity;
      totalAmount += itemTotal;
      
      return {
        cart_item_id: cartItem.id,
        item_id: cartItem.item_id,
        name: cartItem.items.name,
        description: cartItem.items.description,
        price: parseFloat(cartItem.items.price),
        image_url: cartItem.items.image_url,
        is_available: cartItem.items.is_available,
        stock_quantity: cartItem.items.stock_quantity,
        quantity: cartItem.quantity,
        subtotal: itemTotal
      };
    });

    return {
      cart_id: cartId,
      items: items,
      total_items: items.length,
      total_amount: parseFloat(totalAmount.toFixed(2))
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get user's cart with all items
 * @route GET /api/cart
 * @access Protected
 */
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get or create cart
    const cart = await getOrCreateCart(userId);

    // Get cart with items and total
    const cartData = await getCartWithItems(cart.id);

    res.status(200).json({
      success: true,
      data: cartData
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
};

/**
 * Add item to cart
 * @route POST /api/cart/items
 * @access Protected
 */
export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_id, quantity } = req.body;

    // Validation
    if (!item_id) {
      return res.status(400).json({
        success: false,
        error: 'item_id is required'
      });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    const requestedQuantity = parseInt(quantity);
    if (isNaN(requestedQuantity)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quantity'
      });
    }

    // Check if item exists and is available
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id, name, is_available, stock_quantity')
      .eq('id', item_id)
      .single();

    if (itemError || !item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }

    // Check if item is available
    if (!item.is_available) {
      return res.status(400).json({
        success: false,
        error: `${item.name} is currently unavailable`
      });
    }

    // Check if sufficient stock
    if (item.stock_quantity < requestedQuantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Only ${item.stock_quantity} ${item.name}(s) available`
      });
    }

    // Get or create cart
    const cart = await getOrCreateCart(userId);

    // Check if item already in cart
    const { data: existingCartItem, error: checkError } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('item_id', item_id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingCartItem) {
      // Item already in cart - increase quantity
      const newQuantity = existingCartItem.quantity + requestedQuantity;

      // Check if new quantity exceeds stock
      if (newQuantity > item.stock_quantity) {
        return res.status(400).json({
          success: false,
          error: `Cannot add ${requestedQuantity} more. Only ${item.stock_quantity - existingCartItem.quantity} more ${item.name}(s) available`
        });
      }

      // Update quantity
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: newQuantity
        })
        .eq('id', existingCartItem.id);

      if (updateError) throw updateError;
    } else {
      // Add new cart item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          item_id: item_id,
          quantity: requestedQuantity
        }]);

      if (insertError) throw insertError;
    }

    // Get updated cart
    const cartData = await getCartWithItems(cart.id);

    res.status(200).json({
      success: true,
      message: `${item.name} added to cart`,
      data: cartData
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart'
    });
  }
};

/**
 * Update cart item quantity
 * @route PUT /api/cart/items/:cartItemId
 * @access Protected
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;

    // Validation
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        success: false,
        error: 'Quantity is required'
      });
    }

    const newQuantity = parseInt(quantity);
    if (isNaN(newQuantity) || newQuantity < 0) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be a positive number or 0'
      });
    }

    // Get user's cart
    const cart = await getOrCreateCart(userId);

    // Get cart item with item details
    const { data: cartItem, error: cartItemError } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        item_id,
        quantity,
        items (
          id,
          name,
          stock_quantity,
          is_available
        )
      `)
      .eq('id', cartItemId)
      .eq('cart_id', cart.id)
      .single();

    if (cartItemError || !cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // If quantity is 0, remove item from cart
    if (newQuantity === 0) {
      const { error: deleteError } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (deleteError) throw deleteError;

      // Get updated cart
      const cartData = await getCartWithItems(cart.id);

      return res.status(200).json({
        success: true,
        message: `${cartItem.items.name} removed from cart`,
        data: cartData
      });
    }

    // Check item availability
    if (!cartItem.items.is_available) {
      return res.status(400).json({
        success: false,
        error: `${cartItem.items.name} is currently unavailable`
      });
    }

    // Check stock availability
    if (newQuantity > cartItem.items.stock_quantity) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Only ${cartItem.items.stock_quantity} ${cartItem.items.name}(s) available`
      });
    }

    // Update quantity
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ 
        quantity: newQuantity
      })
      .eq('id', cartItemId);

    if (updateError) throw updateError;

    // Get updated cart
    const cartData = await getCartWithItems(cart.id);

    res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: cartData
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item'
    });
  }
};

/**
 * Remove item from cart
 * @route DELETE /api/cart/items/:cartItemId
 * @access Protected
 */
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;

    // Get user's cart
    const cart = await getOrCreateCart(userId);

    // Check if cart item exists and belongs to user
    const { data: cartItem, error: cartItemError } = await supabase
      .from('cart_items')
      .select('id, cart_id')
      .eq('id', cartItemId)
      .eq('cart_id', cart.id)
      .single();

    if (cartItemError || !cartItem) {
      return res.status(404).json({
        success: false,
        error: 'Cart item not found'
      });
    }

    // Delete cart item
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (deleteError) throw deleteError;

    // Get updated cart
    const cartData = await getCartWithItems(cart.id);

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cartData
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item from cart'
    });
  }
};

/**
 * Clear entire cart
 * @route DELETE /api/cart
 * @access Protected
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart
    const cart = await getOrCreateCart(userId);

    // Delete all cart items
    const { error: deleteError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (deleteError) throw deleteError;

    // Return empty cart
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart_id: cart.id,
        items: [],
        total_items: 0,
        total_amount: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart'
    });
  }
};

