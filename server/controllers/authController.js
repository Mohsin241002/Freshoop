import { supabase } from '../config/supabase.js';

/**
 * Register a new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || ''
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Create user profile in users table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: fullName || ''
          }
        ]);

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email to verify your account.',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || ''
        },
        session: authData.session
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during registration'
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: userProfile?.full_name || authData.user.user_metadata?.full_name || ''
        },
        session: authData.session,
        access_token: authData.session.access_token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during login'
    });
  }
};

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during logout'
    });
  }
};

/**
 * Verify token and get current user
 * @route GET /api/auth/me
 */
export const getCurrentUser = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const userId = req.user.id;

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
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
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching user data'
    });
  }
};

