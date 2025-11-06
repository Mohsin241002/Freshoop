import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { usersApi } from '../lib/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If supabase client is not initialized, skip auth
    if (!supabase) {
      console.error('Supabase client not initialized');
      setLoading(false);
      return;
    }

    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // Create user profile if it doesn't exist
      if (session?.user && event === 'SIGNED_IN') {
        try {
          await usersApi.create({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || '',
          });
        } catch (error) {
          console.error('Error creating user profile:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, password, fullName) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check environment variables.');
    }
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

