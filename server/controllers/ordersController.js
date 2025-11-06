import { supabase } from '../config/supabase.js';

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

/**
 * Process checkout - Create order from cart
 * @route POST /api/orders/checkout
 * @access Protected
 */
export const processCheckout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's cart with items
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cartError || !cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    // Get cart items with full item details
    const { data: cartItems, error: cartItemsError } = await supabase
      .from('cart_items')
      .select(`
        id,
        item_id,
        quantity,
        items (
          id,
          name,
          price,
          stock_quantity,
          is_available
        )
      `)
      .eq('cart_id', cart.id);

    if (cartItemsError) throw cartItemsError;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Check stock availability for all items
    const unavailableItems = [];
    const insufficientStockItems = [];
    
    for (const cartItem of cartItems) {
      const item = cartItem.items;
      
      if (!item.is_available) {
        unavailableItems.push({
          name: item.name,
          reason: 'Item is no longer available'
        });
      } else if (item.stock_quantity < cartItem.quantity) {
        insufficientStockItems.push({
          name: item.name,
          requested: cartItem.quantity,
          available: item.stock_quantity
        });
      }
    }

    // Return error if any items are unavailable or insufficient stock
    if (unavailableItems.length > 0 || insufficientStockItems.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Some items are unavailable or out of stock',
        unavailable_items: unavailableItems,
        insufficient_stock: insufficientStockItems
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = cartItems.map(cartItem => {
      const item = cartItem.items;
      const itemTotal = parseFloat(item.price) * cartItem.quantity;
      totalAmount += itemTotal;
      
      return {
        item_id: item.id,
        item_name: item.name,
        quantity: cartItem.quantity,
        price_at_purchase: parseFloat(item.price)
      };
    });

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw orderError;
    }

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsWithOrderId);

    if (orderItemsError) {
      console.error('Order items creation error:', orderItemsError);
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', order.id);
      throw orderItemsError;
    }

    // Deduct stock from items
    for (const cartItem of cartItems) {
      const item = cartItem.items;
      const newStock = item.stock_quantity - cartItem.quantity;

      const { error: stockError } = await supabase
        .from('items')
        .update({ stock_quantity: newStock })
        .eq('id', item.id);

      if (stockError) {
        console.error('Stock update error:', stockError);
        // Continue anyway - order is already created
      }
    }

    // Clear user's cart
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id);

    if (clearCartError) {
      console.error('Clear cart error:', clearCartError);
      // Don't fail checkout if cart clear fails
    }

    // Schedule auto-delivery after 2 minutes
    setTimeout(async () => {
      try {
        await supabase
          .from('orders')
          .update({
            status: 'delivered',
            delivered_at: new Date().toISOString()
          })
          .eq('id', order.id);
        
        console.log(`Order ${order.order_number} auto-delivered after 2 minutes`);
      } catch (error) {
        console.error('Auto-delivery error:', error);
      }
    }, 2 * 60 * 1000); // 2 minutes in milliseconds

    // Return order details
    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Your order will be delivered in 2 minutes.',
      data: {
        order: {
          id: order.id,
          order_number: order.order_number,
          total_amount: order.total_amount,
          status: order.status,
          created_at: order.created_at,
          estimated_delivery: new Date(Date.now() + 2 * 60 * 1000).toISOString()
        },
        items: orderItems
      }
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process checkout'
    });
  }
};

/**
 * Get user's order history
 * @route GET /api/orders
 * @access Protected
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        delivered_at,
        order_items (
          id,
          item_name,
          quantity,
          price_at_purchase
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

/**
 * Get specific order by order number
 * @route GET /api/orders/:orderNumber
 * @access Protected
 */
export const getOrderByNumber = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderNumber } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        total_amount,
        status,
        created_at,
        delivered_at,
        order_items (
          id,
          item_id,
          item_name,
          quantity,
          price_at_purchase
        )
      `)
      .eq('order_number', orderNumber)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

/**
 * Get all orders (Admin only)
 * @route GET /api/orders/admin/all
 * @access Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        user_id,
        total_amount,
        status,
        created_at,
        delivered_at,
        order_items (
          id,
          item_name,
          quantity,
          price_at_purchase
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: orders, error } = await query;

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

/**
 * Update order status (Admin only)
 * @route PATCH /api/orders/:id/status
 * @access Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Prepare update data
    const updateData = { status };
    
    // Set delivered_at if status is delivered
    if (status === 'delivered') {
      updateData.delivered_at = new Date().toISOString();
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
};

