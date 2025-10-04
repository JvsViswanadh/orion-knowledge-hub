import { supabase } from '../../src/lib/supabase';

/**
 * Sign in with Google OAuth
 * Redirects to Google authentication and then to dashboard on success
 */
export async function signInWithGoogle() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      alert(error.message);
    }
    // No need for redirect here as OAuth flow handles it
  } catch (err: any) {
    alert(err.message || 'Failed to sign in with Google');
  }
}

/**
 * Sign in with LinkedIn OAuth
 * Redirects to LinkedIn authentication and then to dashboard on success
 */
export async function signInWithLinkedIn() {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) {
      alert(error.message);
    }
    // No need for redirect here as OAuth flow handles it
  } catch (err: any) {
    alert(err.message || 'Failed to sign in with LinkedIn');
  }
}

/**
 * Sign up with email and password
 * Validates passwords match before sending request
 * @param email User's email
 * @param password User's password
 * @param confirmPassword Confirmation of user's password
 */
export async function signUpWithEmail(email: string, password: string, confirmPassword: string) {
  try {
    // Validate passwords match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/dashboard';
    }
  } catch (err: any) {
    alert(err.message || 'Failed to sign up');
  }
}

/**
 * Sign in with email and password
 * @param email User's email
 * @param password User's password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/dashboard';
    }
  } catch (err: any) {
    alert(err.message || 'Failed to sign in');
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/';
    }
  } catch (err: any) {
    alert(err.message || 'Failed to sign out');
  }
}

/**
 * Get the currently authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}