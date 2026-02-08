import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Pagination metadata interface
 */
export interface PaginationMetadata {
  page: number
  limit: number
  total: number
  totalPages: number
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMetadata
}

/**
 * Apply pagination to a Supabase query
 * 
 * @param query - Supabase query builder
 * @param page - Page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Query with pagination applied
 * 
 * @example
 * const query = supabase.from('events').select('*')
 * const paginatedQuery = paginate(query, 1, 20)
 */
export function paginate<T>(
  query: any,
  page: number,
  limit: number
): any {
  const offset = (page - 1) * limit
  return query.range(offset, offset + limit - 1)
}

/**
 * Calculate pagination metadata
 * 
 * @param total - Total number of items
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * @returns Pagination metadata object
 * 
 * @example
 * const metadata = getPaginationMetadata(100, 1, 20)
 * // Returns: { page: 1, limit: 20, total: 100, totalPages: 5 }
 */
export function getPaginationMetadata(
  total: number,
  page: number,
  limit: number
): PaginationMetadata {
  const totalPages = Math.ceil(total / limit)
  
  return {
    page,
    limit,
    total,
    totalPages
  }
}

/**
 * Validate pagination parameters
 * 
 * @param page - Page number to validate
 * @param limit - Limit to validate
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @throws Error if parameters are invalid
 */
export function validatePaginationParams(
  page: number,
  limit: number,
  maxLimit: number = 100
): void {
  if (page < 1) {
    throw new Error('Page must be greater than or equal to 1')
  }
  
  if (limit < 1) {
    throw new Error('Limit must be greater than or equal to 1')
  }
  
  if (limit > maxLimit) {
    throw new Error(`Limit must not exceed ${maxLimit}`)
  }
}
