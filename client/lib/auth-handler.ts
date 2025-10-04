import { AuthError } from '@supabase/supabase-js';
import { supabase } from '../../src/lib/supabase';

interface AuthCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Helper function to handle auth errors
const handleAuthError = (error: AuthError | null) => {
  if (error) {
    // Provide more specific error messages for common auth errors
    if (error.message.includes('Email not confirmed')) {
      throw new AuthenticationError('Please verify your email before logging in');
    } else if (error.message.includes('Invalid login credentials')) {
      throw new AuthenticationError('Invalid email or password');
    } else {
      throw new AuthenticationError(error.message);
    }
  }
};

// Helper function for successful authentication
const handleAuthSuccess = () => {
  window.location.href = '/dashboard';
};

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'email profile',
      },
    });

    handleAuthError(error);
    // No need to manually redirect as OAuth will handle it
    return data;
  } catch (error) {
    console.error('Google authentication failed:', error);
    throw error;
  }
};

export const signInWithLinkedIn = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        scopes: 'r_liteprofile r_emailaddress',
      },
    });

    handleAuthError(error);
    return data;
  } catch (error) {
    console.error('LinkedIn authentication failed:', error);
    throw error;
  }
};

export const signUpWithEmail = async ({ email, password, confirmPassword }: AuthCredentials) => {
  try {
    // Validate passwords match
    if (confirmPassword && password !== confirmPassword) {
      throw new AuthenticationError('Passwords do not match');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    handleAuthError(error);
    handleAuthSuccess();
    return data;
  } catch (error) {
    console.error('Email signup failed:', error);
    throw error;
  }
};

export const signInWithEmail = async ({ email, password }: AuthCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    handleAuthError(error);
    handleAuthSuccess();
    return data;
  } catch (error) {
    console.error('Email login failed:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    handleAuthError(error);
    window.location.href = '/';
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Check if the user is authenticated
 * @returns Boolean indicating authentication status
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};