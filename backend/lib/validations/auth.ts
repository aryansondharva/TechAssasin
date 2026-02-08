import { z } from 'zod'

/**
 * Validation schema for user signup
 * Requirements: 2.1, 2.2
 */
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

/**
 * Validation schema for user signin
 * Requirements: 2.1, 2.2
 */
export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

/**
 * Validation schema for password reset request
 * Requirements: 2.6
 */
export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
})

/**
 * Validation schema for password update
 * Requirements: 2.7
 */
export const updatePasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters')
})
