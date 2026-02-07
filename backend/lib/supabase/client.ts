import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

/**
 * Client-side Supabase client for use in React components
 * Uses cookies for session management
 * Automatically handles authentication state
 */
export const createClient = () => {
  return createClientComponentClient<Database>()
}
