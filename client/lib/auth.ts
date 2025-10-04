import { supabase } from '../../src/lib/supabase';

const redirectTo = `${window.location.origin}/dashboard`;

export async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('Google authentication error:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

export async function signUpWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('Google signup error:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign up with Google:', error);
    throw error;
  }
}

export async function signInWithLinkedIn() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('LinkedIn authentication error:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign in with LinkedIn:', error);
    throw error;
  }
}

export async function signUpWithLinkedIn() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error('LinkedIn signup error:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign up with LinkedIn:', error);
    throw error;
  }
}

export async function signUpWithEmail(email: string, password: string, confirmPassword: string) {
  // Validate that passwords match
  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      console.error('Email signup error:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to sign up with email:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Failed to sign out:', error);
    throw error;
  }
}