import { z } from 'zod'

/**
 * Event creation validation schema
 * Validates all required fields with date validation
 * Requirements: 4.1
 */
export const eventCreateSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .min(1, 'Description is required'),
  start_date: z
    .string()
    .datetime('Start date must be a valid ISO 8601 datetime'),
  end_date: z
    .string()
    .datetime('End date must be a valid ISO 8601 datetime'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(200, 'Location must not exceed 200 characters'),
  max_participants: z
    .number()
    .int('Max participants must be an integer')
    .positive('Max participants must be a positive number'),
  registration_open: z
    .boolean()
    .default(true),
  prizes: z
    .record(z.any())
    .optional(),
  themes: z
    .array(z.string())
    .optional()
}).refine(
  (data) => new Date(data.end_date) > new Date(data.start_date),
  {
    message: 'End date must be after start date',
    path: ['end_date']
  }
)

/**
 * Event update validation schema (partial)
 * Allows updating any subset of event fields
 * Requirements: 4.1
 */
export const eventUpdateSchema = eventCreateSchema.partial()

/**
 * Event filter validation schema
 * Validates status filter and pagination parameters
 * Requirements: 4.1
 */
export const eventFilterSchema = z.object({
  status: z
    .enum(['live', 'upcoming', 'past'])
    .optional(),
  page: z
    .number()
    .int('Page must be an integer')
    .positive('Page must be a positive number')
    .default(1),
  limit: z
    .number()
    .int('Limit must be an integer')
    .positive('Limit must be a positive number')
    .max(100, 'Limit cannot exceed 100')
    .default(20)
})
