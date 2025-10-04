import { createClient } from '@supabase/supabase-js'
import { redirect } from 'react-router-dom'

// Type assertions for Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Signs out the current user and redirects to the login page
 */
export const signOutUser = async () => {
  await supabase.auth.signOut()
  return redirect('/login')
}
