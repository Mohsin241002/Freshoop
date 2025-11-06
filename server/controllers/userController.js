import { supabase } from '../config/supabase.js';

/**
 * Create or update user profile
 * @route POST /api/users
 */
export const createUser = async (req, res) => {
  try {
    const { id, email, full_name } = req.body;

    if (!id || !email) {
      return res.status(400).json({
        success: false,
        error: 'id and email are required'
      });
    }

    // Upsert user (insert or update if exists)
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          id,
          email,
          full_name: full_name || null
        },
        {
          onConflict: 'id',
          ignoreDuplicates: false
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Create/update user error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      data: { user: data }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while creating user'
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/users/profile
 */
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: userProfile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching profile'
    });
  }
};

/**
 * Update current user profile
 * @route PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, email } = req.body;

    // Validate input
    if (!full_name && !email) {
      return res.status(400).json({
        success: false,
        error: 'At least one field (full_name or email) is required'
      });
    }

    // Prepare update data
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (email !== undefined) updateData.email = email;

    // Update profile in users table
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({
        success: false,
        error: updateError.message
      });
    }

    // If email is being updated, update it in Supabase Auth as well
    if (email) {
      const { error: authUpdateError } = await supabase.auth.updateUser({
        email: email
      });

      if (authUpdateError) {
        console.error('Error updating auth email:', authUpdateError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedProfile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while updating profile'
    });
  }
};

/**
 * Get user by ID (admin function)
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching user'
    });
  }
};

/**
 * Delete user account
 * @route DELETE /api/users/profile
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete user profile (cascade will handle related records)
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      return res.status(400).json({
        success: false,
        error: deleteError.message
      });
    }

    // Note: Supabase Auth user deletion requires admin privileges
    // This would typically be handled by a separate admin endpoint

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting account'
    });
  }
};

