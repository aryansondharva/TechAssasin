# Implementation Plan: TechAssassin Backend

## Overview

This implementation plan breaks down the TechAssassin backend into discrete coding tasks. Each task builds on previous steps, starting with database setup, then authentication, followed by core features, and ending with testing and integration. The plan follows an incremental approach where each step validates functionality through code.

## Tasks

- [x] 1. Set up project structure and dependencies
  - Initialize Next.js 14 project with TypeScript and App Router
  - Install dependencies: @supabase/auth-helpers-nextjs, @supabase/supabase-js, zod, resend, fast-check, vitest
  - Create directory structure: lib/, types/, app/api/
  - Set up environment variables for Supabase and Resend
  - Configure TypeScript with strict mode
  - _Requirements: All_

- [x] 2. Create database schema and migrations
  - [x] 2.1 Write Supabase migration for profiles table
    - Create profiles table with columns: id (uuid, FK to auth.users), username (text, unique), full_name, avatar_url, github_url, skills (text[]), is_admin (boolean), created_at
    - Add unique constraint on username
    - Create index on username
    - _Requirements: 1.1, 1.8_

  - [x] 2.2 Write Supabase migration for events table
    - Create events table with columns: id (uuid, PK), title, description, start_date, end_date, location, max_participants (int), registration_open (boolean), image_urls (text[]), prizes (jsonb), themes (text[]), created_at
    - Create index on start_date
    - _Requirements: 1.2, 1.9_

  - [x] 2.3 Write Supabase migration for registrations table
    - Create registrations table with columns: id (uuid, PK), user_id (uuid, FK), event_id (uuid, FK), team_name, project_idea, status (enum), created_at
    - Add unique constraint on (user_id, event_id)
    - Add check constraint on status (pending/confirmed/waitlisted)
    - Create indexes on event_id and user_id
    - Add ON DELETE CASCADE for event_id foreign key
    - _Requirements: 1.3, 1.8, 1.9_

  - [x] 2.4 Write Supabase migration for announcements table
    - Create announcements table with columns: id (uuid, PK), author_id (uuid, FK), content (text), created_at, updated_at
    - Create index on created_at DESC
    - _Requirements: 1.4, 1.9_

  - [x] 2.5 Write Supabase migration for resources table
    - Create resources table with columns: id (uuid, PK), title, description, content_url, category, created_at
    - Create index on category
    - _Requirements: 1.5_

  - [x] 2.6 Write Supabase migration for sponsors table
    - Create sponsors table with columns: id (uuid, PK), name, logo_url, website_url, tier (enum), description, created_at
    - Add check constraint on tier (gold/silver/bronze)
    - _Requirements: 1.6_

  - [x] 2.7 Write Supabase migration for leaderboard table
    - Create leaderboard table with columns: id (uuid, PK), event_id (uuid, FK), user_id (uuid, FK), score (int), rank (int), updated_at
    - Create composite index on (event_id, rank)
    - _Requirements: 1.7, 1.9_

  - [x] 2.8 Create database trigger for automatic profile creation
    - Write PostgreSQL function handle_new_user() that creates profile on auth.users insert
    - Create trigger on_auth_user_created that calls handle_new_user()
    - Set default values: is_admin = false, skills = empty array
    - _Requirements: 2.8_

  - [x] 2.9 Write unit tests for database schema

    - Test that all tables exist with correct columns
    - Test unique constraints work (profiles.username, registrations composite)
    - Test check constraints work (registration status, sponsor tier)
    - Test foreign key constraints and cascade deletion
    - Test indexes exist
    - _Requirements: 1.1-1.9_

- [ ] 3. Set up Row Level Security policies
  - [ ] 3.1 Create RLS policies for profiles table
    - Enable RLS on profiles table
    - Policy: "Profiles are viewable by everyone" (SELECT for all)
    - Policy: "Users can update own profile" (UPDATE where auth.uid() = id)
    - _Requirements: 1.10, 14.1_

  - [ ] 3.2 Create RLS policies for events table
    - Enable RLS on events table
    - Policy: "Events are viewable by everyone" (SELECT for all)
    - Policy: "Only admins can modify events" (INSERT/UPDATE/DELETE for admins)
    - _Requirements: 1.10, 14.2_

  - [ ] 3.3 Create RLS policies for registrations table
    - Enable RLS on registrations table
    - Policy: "Users can view own registrations" (SELECT where auth.uid() = user_id)
    - Policy: "Admins can view all registrations" (SELECT for admins)
    - Policy: "Users can create registrations" (INSERT where auth.uid() = user_id)
    - Policy: "Admins can update registrations" (UPDATE for admins)
    - _Requirements: 1.10, 14.3_

  - [ ] 3.4 Create RLS policies for announcements, resources, sponsors, leaderboard
    - Enable RLS on all four tables
    - Announcements: authenticated users read, admins/authors write
    - Resources: authenticated users read, admins write
    - Sponsors: public read, admins write
    - Leaderboard: authenticated users read, admins write
    - _Requirements: 1.10, 14.4, 14.5, 14.6, 14.7_

  - [ ]* 3.5 Write property tests for RLS policies
    - **Property 32: Row Level Security - Profile Updates**
    - **Property 33: Row Level Security - Event Modifications**
    - **Property 34: Row Level Security - Registration Access**
    - **Property 35: Row Level Security - Admin-Only Tables**
    - Test that non-admins cannot modify protected resources
    - Test that users cannot access other users' private data
    - _Requirements: 14.1-14.7_

- [ ] 4. Set up Supabase Storage buckets and policies
  - [ ] 4.1 Create storage buckets
    - Create 'avatars' bucket (public)
    - Create 'event-images' bucket (public)
    - Create 'sponsor-logos' bucket (public)
    - _Requirements: 15.4_

  - [ ] 4.2 Create storage policies
    - Policy: Users can upload to avatars/{user_id}/ folder
    - Policy: Admins can upload to event-images/ folder
    - Policy: Admins can upload to sponsor-logos/ folder
    - Policy: Public read access for all buckets
    - _Requirements: 15.6_

- [ ] 5. Create TypeScript types and interfaces
  - Define database types in types/database.ts
  - Create interfaces: Profile, Event, Registration, Announcement, Resource, Sponsor, LeaderboardEntry
  - Create API response types: EventWithParticipants, PaginatedResponse, ApiError
  - _Requirements: All_

- [ ] 6. Set up Supabase client configuration
  - [ ] 6.1 Create client-side Supabase client
    - Implement lib/supabase/client.ts using createClientComponentClient
    - _Requirements: 2.1-2.10_

  - [ ] 6.2 Create server-side Supabase client
    - Implement lib/supabase/server.ts using createServerComponentClient
    - _Requirements: 2.1-2.10_

- [ ] 7. Create validation schemas with Zod
  - [ ] 7.1 Create profile validation schemas
    - Implement lib/validations/profile.ts
    - Schema: profileUpdateSchema (username, full_name, github_url, skills)
    - Schema: avatarUploadSchema (file type and size validation)
    - _Requirements: 3.1, 15.1, 15.2_

  - [ ] 7.2 Create event validation schemas
    - Implement lib/validations/event.ts
    - Schema: eventCreateSchema with date validation
    - Schema: eventUpdateSchema (partial)
    - Schema: eventFilterSchema (status, page, limit)
    - _Requirements: 4.1_

  - [ ] 7.3 Create registration validation schemas
    - Implement lib/validations/registration.ts
    - Schema: registrationCreateSchema (event_id, team_name, project_idea)
    - Schema: registrationUpdateSchema (status enum)
    - _Requirements: 5.1_

  - [ ] 7.4 Create announcement, resource, sponsor, leaderboard validation schemas
    - Implement lib/validations/announcement.ts (content validation)
    - Implement lib/validations/resource.ts (title, description, content_url, category)
    - Implement lib/validations/sponsor.ts (name, logo_url, website_url, tier)
    - Implement lib/validations/leaderboard.ts (event_id, user_id, score)
    - _Requirements: 7.1, 8.1, 9.1, 10.1_

  - [ ]* 7.5 Write property tests for validation schemas
    - **Property 3: Input Validation Rejection**
    - Test that all schemas reject invalid inputs
    - Test that validation errors include descriptive messages
    - _Requirements: 3.1, 4.1, 5.1, 7.1, 8.1, 9.1, 10.1, 12.1, 12.2_

- [ ] 8. Create authentication middleware and helpers
  - [ ] 8.1 Implement authentication middleware
    - Create lib/middleware/auth.ts
    - Function: requireAuth() - verify user session, throw 401 if not authenticated
    - Function: requireAdmin(userId) - verify admin status, throw 403 if not admin
    - _Requirements: 2.1-2.10, 4.3, 4.5_

  - [ ]* 8.2 Write property tests for authentication middleware
    - **Property 7: Admin-Only Operations Authorization**
    - Test that requireAdmin rejects non-admin users
    - Test that requireAuth rejects unauthenticated requests
    - _Requirements: 4.3, 4.5, 12.3, 12.4_

- [ ] 9. Checkpoint - Verify database and auth setup
  - Run migrations on test Supabase instance
  - Verify all tables, indexes, and constraints exist
  - Verify RLS policies are active
  - Verify storage buckets are created
  - Test authentication flow manually
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Implement profile management API
  - [ ] 10.1 Create GET /api/profile route
    - Get current user's profile with all fields
    - Return 401 if not authenticated
    - _Requirements: 3.5_

  - [ ] 10.2 Create GET /api/profile/[id] route
    - Get specific user's public profile
    - Exclude sensitive fields for other users
    - _Requirements: 3.6_

  - [ ] 10.3 Create PATCH /api/profile route
    - Update current user's profile
    - Validate input with profileUpdateSchema
    - Check username uniqueness
    - Prevent is_admin modification
    - Return 401 if not authenticated
    - _Requirements: 3.1, 3.2, 3.4, 3.7_

  - [ ] 10.4 Create POST /api/profile/avatar route
    - Upload avatar to Supabase Storage
    - Validate file type (jpg, png, webp) and size (< 2MB)
    - Store file in avatars/{user_id}/ folder
    - Update profile with avatar URL
    - Return 401 if not authenticated
    - _Requirements: 3.3, 15.1, 15.2, 15.4, 15.5_

  - [ ]* 10.5 Write property tests for profile management
    - **Property 4: Username Uniqueness Enforcement**
    - **Property 5: Profile Field Update Persistence**
    - **Property 6: Admin Privilege Protection**
    - **Property 36: File Type Validation**
    - **Property 37: File Size Validation**
    - **Property 38: File Storage and URL Generation**
    - _Requirements: 3.1-3.7, 15.1-15.5_

  - [ ]* 10.6 Write unit tests for profile API
    - Test successful profile retrieval
    - Test profile update with valid data
    - Test username uniqueness violation
    - Test avatar upload with valid image
    - Test avatar upload with invalid file type
    - Test avatar upload with oversized file
    - _Requirements: 3.1-3.7_

- [ ] 11. Implement event management API
  - [ ] 11.1 Create service functions for events
    - Implement lib/services/events.ts
    - Function: calculateEventStatus(event) - determine live/upcoming/past
    - Function: getParticipantCount(eventId) - count confirmed registrations
    - Function: listEvents(filters) - query with status filter and pagination
    - Function: getEventById(eventId) - fetch single event with participant count
    - _Requirements: 4.6, 4.7, 4.8_

  - [ ] 11.2 Create GET /api/events route
    - List events with optional status filter (live/upcoming/past)
    - Support pagination (page, limit)
    - Calculate status dynamically for each event
    - Return events with participant counts
    - _Requirements: 4.6, 4.7, 4.8, 13.3_

  - [ ] 11.3 Create GET /api/events/[id] route
    - Get single event by ID
    - Include participant count
    - Calculate and include status
    - Return 404 if event not found
    - _Requirements: 4.7, 4.8, 12.5_

  - [ ] 11.4 Create POST /api/events route
    - Validate input with eventCreateSchema
    - Verify admin privileges with requireAdmin
    - Create event in database
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 4.1, 4.3, 4.5_

  - [ ] 11.5 Create PATCH /api/events/[id] route
    - Validate input with eventUpdateSchema
    - Verify admin privileges with requireAdmin
    - Update event in database
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 4.1, 4.3, 4.5_

  - [ ] 11.6 Create DELETE /api/events/[id] route
    - Verify admin privileges with requireAdmin
    - Delete event (cascade delete registrations)
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 4.4, 4.5_

  - [ ] 11.7 Create POST /api/events/[id]/images route
    - Validate file types (jpg, png, webp) and sizes (< 2MB)
    - Verify admin privileges with requireAdmin
    - Upload images to Supabase Storage event-images/ folder
    - Update event with image URLs
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 4.2, 15.3, 15.4, 15.5_

  - [ ]* 11.8 Write property tests for event management
    - **Property 8: Event Status Calculation**
    - **Property 9: Event Filtering by Status**
    - **Property 10: Participant Count Accuracy**
    - **Property 11: Cascade Deletion**
    - Test that event status is calculated correctly based on dates
    - Test that filtering returns only events matching status
    - Test that participant count matches confirmed registrations
    - Test that deleting event also deletes registrations
    - _Requirements: 4.4, 4.6, 4.7, 4.8_

  - [ ]* 11.9 Write unit tests for event API
    - Test event creation by admin
    - Test event creation rejection for non-admin
    - Test event listing with filters
    - Test event update by admin
    - Test event deletion with cascade
    - Test image upload by admin
    - _Requirements: 4.1-4.8_

- [ ] 12. Implement registration system API
  - [ ] 12.1 Create service functions for registrations
    - Implement lib/services/registrations.ts
    - Function: determineRegistrationStatus(eventId) - return confirmed or waitlisted based on capacity
    - Function: checkDuplicateRegistration(userId, eventId) - verify no existing registration
    - Function: createRegistration(userId, data) - create with capacity check
    - _Requirements: 5.3, 5.4, 5.5, 5.6_

  - [ ] 12.2 Create POST /api/registrations route
    - Validate input with registrationCreateSchema
    - Verify user is authenticated
    - Check registration_open is true
    - Check for duplicate registration
    - Determine status (confirmed/waitlisted) based on capacity
    - Create registration in database
    - Return 401 if not authenticated, 409 if duplicate
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

  - [ ] 12.3 Create GET /api/registrations route
    - Get current user's registrations across all events
    - Include event details in response
    - Return 401 if not authenticated
    - _Requirements: 5.8_

  - [ ] 12.4 Create GET /api/registrations/event/[eventId] route
    - Verify admin privileges with requireAdmin
    - Get all registrations for specified event
    - Include user profile details in response
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 5.9_

  - [ ] 12.5 Create PATCH /api/registrations/[id] route
    - Validate input with registrationUpdateSchema
    - Verify admin privileges with requireAdmin
    - Update registration status
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 5.10_

  - [ ] 12.6 Implement rate limiting for registration endpoint
    - Add rate limiting middleware to POST /api/registrations
    - Limit: 5 registrations per user per hour
    - Return 429 if rate limit exceeded
    - _Requirements: 12.8_

  - [ ]* 12.7 Write property tests for registration system
    - **Property 1: Unique Constraint Enforcement**
    - **Property 12: Registration Validation**
    - **Property 13: Registration Closed Enforcement**
    - **Property 14: Registration Status Assignment**
    - **Property 15: User Registration Retrieval**
    - **Property 16: Admin Registration Access**
    - **Property 17: Registration Status Update Authorization**
    - **Property 30: Registration Rate Limiting**
    - Test duplicate registration prevention
    - Test capacity-based status assignment
    - Test registration closed enforcement
    - _Requirements: 5.1-5.10, 12.8_

  - [ ]* 12.8 Write unit tests for registration API
    - Test successful registration when capacity available
    - Test waitlisted registration when at capacity
    - Test duplicate registration rejection
    - Test registration when closed
    - Test user can view own registrations
    - Test admin can view all registrations
    - Test rate limiting
    - _Requirements: 5.1-5.10_

- [ ] 13. Set up email service with Resend
  - [ ] 13.1 Create email service module
    - Implement lib/email/resend.ts
    - Configure Resend client with API key
    - Function: sendRegistrationConfirmation(to, eventTitle, eventDetails)
    - Function: sendWelcomeEmail(to, username)
    - Wrap email calls in try-catch to prevent blocking
    - _Requirements: 11.1, 11.3, 11.4_

  - [ ] 13.2 Create email templates
    - Create HTML template for registration confirmation
    - Create HTML template for welcome email
    - Include event details in registration email
    - _Requirements: 11.2_

  - [ ] 13.3 Integrate email sending into registration flow
    - Update POST /api/registrations to call sendRegistrationConfirmation
    - Ensure email failure doesn't block registration creation
    - Log email errors
    - _Requirements: 5.7, 11.1, 11.4_

  - [ ]* 13.4 Write property tests for email error handling
    - **Property 27: Email Failure Non-Blocking**
    - Test that registration succeeds even if email fails
    - Mock Resend API to simulate failures
    - _Requirements: 11.4_

- [ ] 14. Checkpoint - Verify core features
  - Test profile management endpoints
  - Test event CRUD operations
  - Test registration flow with capacity limits
  - Test email sending (use Resend test mode)
  - Verify rate limiting works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 15. Implement announcements API
  - [ ] 15.1 Create GET /api/announcements route
    - List announcements with pagination
    - Include author profile information (username, avatar_url)
    - Order by created_at DESC
    - Return 401 if not authenticated
    - _Requirements: 7.6, 7.7, 7.8, 13.3_

  - [ ] 15.2 Create POST /api/announcements route
    - Validate input with announcementCreateSchema
    - Verify admin privileges with requireAdmin
    - Create announcement with author_id
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 7.1, 7.2, 7.5_

  - [ ] 15.3 Create PATCH /api/announcements/[id] route
    - Validate input with announcementUpdateSchema
    - Verify user is author or admin
    - Update announcement and set updated_at
    - Return 401 if not authenticated, 403 if not authorized, 404 if not found
    - _Requirements: 7.3_

  - [ ] 15.4 Create DELETE /api/announcements/[id] route
    - Verify user is author or admin
    - Delete announcement
    - Return 401 if not authenticated, 403 if not authorized, 404 if not found
    - _Requirements: 7.4_

  - [ ]* 15.5 Write property tests for announcements
    - **Property 18: Announcement Ordering**
    - **Property 19: Announcement Author Information**
    - **Property 20: Announcement Ownership Authorization**
    - **Property 21: Authenticated User Read Access**
    - Test ordering by created_at DESC
    - Test author information is included
    - Test only author/admin can modify
    - _Requirements: 7.1-7.8_

  - [ ]* 15.6 Write unit tests for announcements API
    - Test announcement creation by admin
    - Test announcement creation rejection for non-admin
    - Test announcement listing with pagination
    - Test announcement update by author
    - Test announcement update by admin
    - Test announcement update rejection for non-author/non-admin
    - _Requirements: 7.1-7.8_

- [ ] 16. Implement resources API
  - [ ] 16.1 Create GET /api/resources route
    - List resources with optional category filter
    - Support pagination
    - Order by created_at DESC
    - Return 401 if not authenticated
    - _Requirements: 8.5, 8.6, 8.7, 13.3_

  - [ ] 16.2 Create POST /api/resources route
    - Validate input with resourceCreateSchema
    - Verify admin privileges with requireAdmin
    - Create resource
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 8.1, 8.2, 8.4_

  - [ ] 16.3 Create PATCH /api/resources/[id] route
    - Validate input with resourceUpdateSchema
    - Verify admin privileges with requireAdmin
    - Update resource
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 8.2, 8.4_

  - [ ] 16.4 Create DELETE /api/resources/[id] route
    - Verify admin privileges with requireAdmin
    - Delete resource
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 8.3, 8.4_

  - [ ]* 16.5 Write property tests for resources
    - **Property 22: Resource Category Filtering**
    - Test category filtering returns correct resources
    - Test pagination works correctly
    - _Requirements: 8.1-8.7_

  - [ ]* 16.6 Write unit tests for resources API
    - Test resource creation by admin
    - Test resource listing with category filter
    - Test resource update by admin
    - Test resource deletion by admin
    - Test non-admin rejection
    - _Requirements: 8.1-8.7_

- [ ] 17. Implement sponsors API
  - [ ] 17.1 Create GET /api/sponsors route
    - List all sponsors (public access, no auth required)
    - Order by tier (gold, silver, bronze)
    - _Requirements: 9.5, 9.6_

  - [ ] 17.2 Create POST /api/sponsors route
    - Validate input with sponsorCreateSchema
    - Verify admin privileges with requireAdmin
    - Create sponsor
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 9.1, 9.3_

  - [ ] 17.3 Create PATCH /api/sponsors/[id] route
    - Validate input with sponsorUpdateSchema
    - Verify admin privileges with requireAdmin
    - Update sponsor
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 9.3_

  - [ ] 17.4 Create DELETE /api/sponsors/[id] route
    - Verify admin privileges with requireAdmin
    - Delete sponsor
    - Return 401 if not authenticated, 403 if not admin, 404 if not found
    - _Requirements: 9.4_

  - [ ] 17.5 Create POST /api/sponsors/[id]/logo route
    - Validate file type (jpg, png, webp) and size (< 2MB)
    - Verify admin privileges with requireAdmin
    - Upload logo to Supabase Storage sponsor-logos/ folder
    - Update sponsor with logo URL
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 9.2, 15.3, 15.4, 15.5_

  - [ ]* 17.6 Write property tests for sponsors
    - **Property 23: Public Sponsor Access**
    - Test unauthenticated users can read sponsors
    - Test sponsors are ordered by tier
    - _Requirements: 9.1-9.6_

  - [ ]* 17.7 Write unit tests for sponsors API
    - Test sponsor creation by admin
    - Test sponsor listing without authentication
    - Test sponsor update by admin
    - Test sponsor deletion by admin
    - Test logo upload by admin
    - _Requirements: 9.1-9.6_

- [ ] 18. Implement leaderboard API
  - [ ] 18.1 Create service functions for leaderboard
    - Implement lib/services/leaderboard.ts
    - Function: recalculateRanks(eventId) - assign ranks based on scores
    - Handle ties consistently (same score = same rank)
    - _Requirements: 10.2_

  - [ ] 18.2 Create GET /api/leaderboard/[eventId] route
    - Get leaderboard entries for event
    - Include participant profile information (username, avatar_url)
    - Order by rank ASC
    - Return 401 if not authenticated
    - _Requirements: 10.3, 10.4, 10.5_

  - [ ] 18.3 Create POST /api/leaderboard route
    - Validate input with leaderboardUpdateSchema
    - Verify admin privileges with requireAdmin
    - Upsert leaderboard entry (create or update)
    - Recalculate ranks for the event
    - Return 401 if not authenticated, 403 if not admin
    - _Requirements: 10.1, 10.2, 10.6_

  - [ ]* 18.4 Write property tests for leaderboard
    - **Property 24: Leaderboard Rank Calculation**
    - **Property 25: Leaderboard Ordering**
    - **Property 26: Leaderboard Participant Information**
    - Test ranks are calculated correctly based on scores
    - Test entries are ordered by rank
    - Test participant info is included
    - _Requirements: 10.1-10.6_

  - [ ]* 18.5 Write unit tests for leaderboard API
    - Test leaderboard retrieval for event
    - Test score update by admin
    - Test rank recalculation
    - Test non-admin rejection
    - _Requirements: 10.1-10.6_

- [ ] 19. Configure Supabase real-time subscriptions
  - [ ] 19.1 Enable real-time on tables
    - Enable real-time replication on events table
    - Enable real-time replication on registrations table
    - Enable real-time replication on announcements table
    - Enable real-time replication on leaderboard table
    - _Requirements: 6.5_

  - [ ] 19.2 Document real-time subscription patterns
    - Create documentation for client-side subscription setup
    - Example: Subscribe to registration changes for participant count updates
    - Example: Subscribe to announcement inserts for live feed
    - Example: Subscribe to leaderboard updates for live scores
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 20. Implement comprehensive error handling
  - [ ] 20.1 Create error handling utilities
    - Implement lib/errors/handlers.ts
    - Function: handleApiError(error) - map errors to HTTP status codes
    - Function: formatErrorResponse(error) - create consistent error response format
    - _Requirements: 12.2-12.6_

  - [ ] 20.2 Add error handling to all API routes
    - Wrap all route handlers in try-catch blocks
    - Return appropriate status codes (400, 401, 403, 404, 500)
    - Include descriptive error messages
    - Log server errors for debugging
    - _Requirements: 12.2-12.6_

  - [ ]* 20.3 Write property tests for error handling
    - **Property 28: HTTP Status Code Correctness**
    - **Property 29: SQL Injection Prevention**
    - Test correct status codes for different error types
    - Test SQL injection attempts are safely handled
    - _Requirements: 12.2-12.7_

  - [ ]* 20.4 Write unit tests for error scenarios
    - Test validation errors return 400
    - Test authentication errors return 401
    - Test authorization errors return 403
    - Test not found errors return 404
    - Test server errors return 500
    - _Requirements: 12.2-12.6_

- [ ] 21. Implement pagination helper
  - [ ] 21.1 Create pagination utility
    - Implement lib/utils/pagination.ts
    - Function: paginate(query, page, limit) - apply pagination to Supabase query
    - Function: getPaginationMetadata(total, page, limit) - calculate pagination info
    - _Requirements: 13.3_

  - [ ] 21.2 Apply pagination to list endpoints
    - Update GET /api/events to use pagination helper
    - Update GET /api/announcements to use pagination helper
    - Update GET /api/resources to use pagination helper
    - Return pagination metadata in responses
    - _Requirements: 13.3_

  - [ ]* 21.3 Write property tests for pagination
    - **Property 31: Pagination Support**
    - Test pagination returns correct number of items
    - Test pagination metadata is accurate
    - Test page boundaries work correctly
    - _Requirements: 13.3_

- [ ] 22. Implement storage cleanup on deletion
  - [ ] 22.1 Create storage cleanup utilities
    - Implement lib/storage/cleanup.ts
    - Function: deleteAvatar(userId) - delete avatar from storage
    - Function: deleteEventImages(eventId) - delete event images from storage
    - Function: deleteSponsorLogo(sponsorId) - delete sponsor logo from storage
    - _Requirements: 15.7_

  - [ ] 22.2 Integrate cleanup into deletion routes
    - Update DELETE /api/profile to call deleteAvatar
    - Update DELETE /api/events/[id] to call deleteEventImages
    - Update DELETE /api/sponsors/[id] to call deleteSponsorLogo
    - Handle cleanup errors gracefully (log but don't fail deletion)
    - _Requirements: 15.7_

  - [ ]* 22.3 Write property tests for storage cleanup
    - **Property 39: Storage Cleanup on Deletion**
    - Test that deleting profile also deletes avatar
    - Test that deleting event also deletes images
    - Test that deleting sponsor also deletes logo
    - _Requirements: 15.7_

- [ ] 23. Add authentication flow endpoints
  - [ ] 23.1 Create POST /api/auth/signup route
    - Accept email and password
    - Call Supabase Auth signUp
    - Return user and session on success
    - Return error on failure (duplicate email, weak password)
    - _Requirements: 2.1, 2.2_

  - [ ] 23.2 Create POST /api/auth/signin route
    - Accept email and password
    - Call Supabase Auth signInWithPassword
    - Return user and session on success
    - Return error on failure (invalid credentials)
    - _Requirements: 2.1, 2.2_

  - [ ] 23.3 Create POST /api/auth/signout route
    - Call Supabase Auth signOut
    - Invalidate session
    - Return success
    - _Requirements: 2.10_

  - [ ] 23.4 Create POST /api/auth/reset-password route
    - Accept email
    - Call Supabase Auth resetPasswordForEmail
    - Return success (don't reveal if email exists)
    - _Requirements: 2.6_

  - [ ]* 23.5 Write property tests for authentication
    - **Property 2: Profile Creation Trigger**
    - Test that signup creates profile automatically
    - Test that valid credentials allow signin
    - Test that invalid credentials are rejected
    - _Requirements: 2.1, 2.2, 2.8_

  - [ ]* 23.6 Write unit tests for authentication API
    - Test successful signup
    - Test signup with duplicate email
    - Test successful signin
    - Test signin with invalid credentials
    - Test signout
    - Test password reset request
    - _Requirements: 2.1, 2.2, 2.6, 2.10_

- [ ] 24. Checkpoint - Verify all features
  - Test all API endpoints manually or with Postman
  - Verify authentication flows work
  - Verify admin authorization works
  - Verify file uploads work
  - Verify pagination works
  - Verify error handling works
  - Verify storage cleanup works
  - Run all unit tests and property tests
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 25. Create API documentation
  - [ ] 25.1 Document all API endpoints
    - Create API.md with endpoint documentation
    - Include request/response examples
    - Document authentication requirements
    - Document error responses
    - _Requirements: All_

  - [ ] 25.2 Create setup guide
    - Create SETUP.md with environment setup instructions
    - Document required environment variables
    - Document Supabase setup steps
    - Document Resend setup steps
    - Document local development setup
    - _Requirements: All_

- [ ] 26. Performance optimization
  - [ ] 26.1 Review and optimize database queries
    - Verify indexes are being used
    - Add missing indexes if needed
    - Optimize N+1 query problems
    - _Requirements: 13.2_

  - [ ] 26.2 Add caching where appropriate
    - Consider caching frequently accessed data (events list, sponsors)
    - Implement cache invalidation strategy
    - _Requirements: 13.4_

- [ ] 27. Final testing and validation
  - [ ]* 27.1 Run full test suite
    - Execute all unit tests
    - Execute all property tests with 100+ iterations
    - Verify test coverage meets 80%+ goal
    - _Requirements: All_

  - [ ] 27.2 Manual testing checklist
    - Test complete user registration flow
    - Test complete event creation and registration flow
    - Test admin operations
    - Test file uploads
    - Test real-time updates
    - Test error scenarios
    - _Requirements: All_

  - [ ] 27.3 Verify free tier compliance
    - Check Supabase usage (database size, bandwidth)
    - Check Resend usage (email count)
    - Check Vercel usage (bandwidth, function execution time)
    - Ensure all within free tier limits
    - _Requirements: 13.6, 13.7, 11.6_

- [ ] 28. Deployment preparation
  - [ ] 28.1 Configure production environment
    - Set up production Supabase project
    - Configure production environment variables
    - Set up Resend production API key
    - Configure CORS settings
    - _Requirements: All_

  - [ ] 28.2 Create deployment documentation
    - Document Vercel deployment steps
    - Document environment variable configuration
    - Document database migration process
    - Document post-deployment verification steps
    - _Requirements: All_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- All file uploads must validate type and size before storage
- All admin operations must verify privileges before execution
- All API routes must handle errors consistently with appropriate status codes
- Email failures should not block primary operations
- Real-time features are configured but client-side implementation is in frontend
