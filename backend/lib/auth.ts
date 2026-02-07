import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

/**
 * Authentication error thrown when user is not authenticated
 */
export class AuthenticationError extends Error {
  statusCode = 401
  
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

/**
 * Authorization error thrown when user lacks required permissions
 */
export class AuthorizationError extends Error {
  statusCode = 403
  
  constructor(message: string = 'Insufficient permissions') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

/**
 * Verify user session and return authenticated user
 * Throws AuthenticationError (401) if not authenticated
 * 
 * @returns Authenticated user object
 * @throws {AuthenticationError} When user is not authenticated
 * 
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const user = await requireAuth()
 *   // User is authenticated, proceed with logic
 * }
 * ```
 */
export async function requireAuth(): Promise<User> {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new AuthenticationError('Authentication required')
  }
  
  return user
}

/**
 * Verify user has admin privileges
 * Throws AuthorizationError (403) if user is not an admin
 * 
 * @param userId - The user ID to check for admin status
 * @throws {AuthorizationError} When user is not an admin
 * 
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const user = await requireAuth()
 *   await requireAdmin(user.id)
 *   // User is admin, proceed with admin operation
 * }
 * ```
 */
export async function requireAdmin(userId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single()
  
  if (error || !profile) {
    throw new AuthorizationError('Unable to verify admin status')
  }
  
  if (!profile.is_admin) {
    throw new AuthorizationError('Admin access required')
  }
}
