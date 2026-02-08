/**
 * Simple in-memory rate limiter
 * Requirements: 12.8
 * 
 * Note: This is a basic implementation suitable for single-instance deployments.
 * For production with multiple instances, consider using Redis or a similar distributed cache.
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store for rate limit tracking
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Check if a user has exceeded the rate limit
 * 
 * @param userId - The user ID to check
 * @param limit - Maximum number of requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining count
 */
export function checkRateLimit(
  userId: string,
  limit: number = 5,
  windowMs: number = 60 * 60 * 1000 // 1 hour default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = `registration:${userId}`
  
  // Get or create entry
  let entry = rateLimitStore.get(key)
  
  // If no entry or reset time has passed, create new entry
  if (!entry || now >= entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs
    }
    rateLimitStore.set(key, entry)
  }
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  }
}

/**
 * Clean up expired entries from the rate limit store
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up expired entries every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 10 * 60 * 1000)
}
