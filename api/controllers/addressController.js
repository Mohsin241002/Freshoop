import { supabase } from '../config/supabase.js';

/**
 * Get all addresses for the logged-in user
 * @route GET /api/addresses
 * @access Protected
 */
export const getUserAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch addresses'
    });
  }
};

/**
 * Get a specific address by ID
 * @route GET /api/addresses/:id
 * @access Protected
 */
export const getAddressById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data: address, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch address'
    });
  }
};

/**
 * Create a new address
 * @route POST /api/addresses
 * @access Protected
 */
export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;

    // Validate required fields
    if (!name || !phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter a 10-digit number'
      });
    }

    // Validate pincode (basic validation)
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pincode. Please enter a 6-digit pincode'
      });
    }

    // If this is the first address, make it default
    const { data: existingAddresses } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', userId);

    const shouldBeDefault = is_default || (existingAddresses && existingAddresses.length === 0);

    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: userId,
        name,
        phone,
        address_line1,
        address_line2: address_line2 || null,
        city,
        state,
        pincode,
        is_default: shouldBeDefault
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address
    });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create address'
    });
  }
};

/**
 * Update an existing address
 * @route PUT /api/addresses/:id
 * @access Protected
 */
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, phone, address_line1, address_line2, city, state, pincode, is_default } = req.body;

    // Validate required fields
    if (!name || !phone || !address_line1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number. Please enter a 10-digit number'
      });
    }

    // Validate pincode
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid pincode. Please enter a 6-digit pincode'
      });
    }

    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        name,
        phone,
        address_line1,
        address_line2: address_line2 || null,
        city,
        state,
        pincode,
        is_default: is_default || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Address not found'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update address'
    });
  }
};

/**
 * Delete an address
 * @route DELETE /api/addresses/:id
 * @access Protected
 */
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Check if address exists and belongs to user
    const { data: address, error: fetchError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    // If deleted address was default, make another address default
    if (address.is_default) {
      const { data: remainingAddresses } = await supabase
        .from('addresses')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (remainingAddresses && remainingAddresses.length > 0) {
        await supabase
          .from('addresses')
          .update({ is_default: true })
          .eq('id', remainingAddresses[0].id);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete address'
    });
  }
};

/**
 * Set an address as default
 * @route PATCH /api/addresses/:id/default
 * @access Protected
 */
export const setDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verify address exists and belongs to user
    const { data: address, error: fetchError } = await supabase
      .from('addresses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !address) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    // The trigger will automatically unset other default addresses
    const { data: updatedAddress, error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: updatedAddress
    });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to set default address'
    });
  }
};

/**
 * Get default address for the logged-in user
 * @route GET /api/addresses/default
 * @access Protected
 */
export const getDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: address, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (!address) {
      return res.status(404).json({
        success: false,
        error: 'No default address found'
      });
    }

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    console.error('Get default address error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch default address'
    });
  }
};
