import { z } from 'zod'

/**
 * Announcement creation validation schema
 * Validates content field
 * Requirements: 7.1
 */
export const announcementCreateSchema = z.object({
  content: z
    .string()
    .min(1, 'Content is required')
    .max(5000, 'Content must not exceed 5000 characters')
})

/**
 * Announcement update validation schema
 * Same as create schema
 * Requirements: 7.1
 */
export const announcementUpdateSchema = announcementCreateSchema

/**
 * Announcement list validation schema
 * Validates pagination parameters
 * Requirements: 7.1
 */
export const announcementListSchema = z.object({
  page: z
    .number()
    .int('Page must be an integer')
    .positive('Page must be a positive number')
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .max(50, 'Limit cannot exceed 50')
    .default(20)
})
