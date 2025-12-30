import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Public Supabase client for reading public content
 * This client uses only the anon key and doesn't require cookies
 * Use this for fetching public data like site_content that has RLS for public reads
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
