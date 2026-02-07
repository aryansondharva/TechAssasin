# Requirements Document: TechAssassin Backend

## Introduction

TechAssassin is a hackathon community platform backend that provides comprehensive event management, user authentication, registration systems, and real-time community features. The system integrates with Supabase for database, authentication, storage, and real-time capabilities, while using Resend for email notifications. The backend is built as a serverless Next.js 14 application designed to run on Vercel's free tier.

## Glossary

- **System**: The TechAssassin backend application
- **User**: Any authenticated person using the platform
- **Admin**: A user with administrative privileges (admin role in profile)
- **Event**: A hackathon with details, dates, and participant limits
- **Registration**: A user's application to participate in an event
- **Announcement**: A Twitter-like post visible to all users
- **Resource**: Educational content like guides or templates
- **Supabase**: Backend-as-a-Service providing database, auth, storage, and real-time
- **Resend**: Email service provider for transactional emails
- **Profile**: Extended user information beyond basic authentication
- **Leaderboard**: Scoring system for ongoing hackathon events
- **Sponsor**: Organization supporting hackathon events

## Requirements

### Requirement 1: Database Schema

**User Story:** As a developer, I want a properly structured database schema, so that all platform data is organized with correct relationships and constraints.

#### Acceptance Criteria

1. THE System SHALL create a profiles table that extends auth.users with columns for username, full_name, avatar_url, github_url, skills (text array), and is_admin (boolean)
2. THE System SHALL create an events table with columns for title, description, start_date, end_date, location, max_participants, registration_open (boolean), image_urls (text array), prizes (jsonb), and themes (text array)
3. THE System SHALL create a registrations table with foreign keys to profiles and events, plus columns for team_name, project_idea, status (enum: pending/confirmed/waitlisted), and created_at
4. THE System SHALL create an announcements table with foreign keys to profiles (author), plus columns for content, created_at, and updated_at
5. THE System SHALL create a resources table with columns for title, description, content_url, category, and created_at
6. THE System SHALL create a sponsors table with columns for name, logo_url, website_url, tier, and description
7. THE System SHALL create a leaderboard table with foreign keys to events and profiles, plus columns for score, rank, and updated_at
8. THE System SHALL enforce unique constraints on profiles.username and registrations(user_id, event_id)
9. THE System SHALL create indexes on frequently queried columns including events.start_date, registrations.event_id, and announcements.created_at
10. THE System SHALL enable Row Level Security (RLS) policies on all tables for proper access control

### Requirement 2: Authentication System

**User Story:** As a user, I want to securely authenticate using multiple methods, so that I can access the platform safely and conveniently.

#### Acceptance Criteria

1. WHEN a user provides valid email and password, THE System SHALL create an account using Supabase Auth and return an authentication token
2. WHEN a user provides invalid credentials, THE System SHALL return a descriptive error message and prevent authentication
3. WHEN a user signs up, THE System SHALL send an email verification link via Supabase Auth
4. WHEN a user clicks the verification link, THE System SHALL mark their email as verified
5. WHEN a user initiates OAuth login with GitHub or Google, THE System SHALL redirect to the provider and complete authentication via Supabase
6. WHEN a user requests password reset, THE System SHALL send a reset link via Supabase Auth
7. WHEN a user completes password reset, THE System SHALL update their password and invalidate the reset token
8. WHEN a new user authenticates, THE System SHALL create a corresponding profile record with default values
9. THE System SHALL maintain authentication sessions using Supabase Auth tokens
10. WHEN a user logs out, THE System SHALL invalidate their session token

### Requirement 3: Profile Management

**User Story:** As a user, I want to manage my profile information, so that I can showcase my skills and connect with the community.

#### Acceptance Criteria

1. WHEN a user updates their profile, THE System SHALL validate all fields using Zod schemas
2. WHEN a user provides a username, THE System SHALL ensure it is unique across all profiles
3. WHEN a user uploads an avatar, THE System SHALL store it in Supabase Storage and save the URL to their profile
4. THE System SHALL allow users to update username, full_name, avatar_url, github_url, and skills array
5. WHEN a user queries their own profile, THE System SHALL return all profile fields including is_admin
6. WHEN a user queries another user's profile, THE System SHALL return public fields only (exclude sensitive data)
7. THE System SHALL prevent users from modifying the is_admin field through standard API endpoints

### Requirement 4: Event Management

**User Story:** As an admin, I want to create and manage hackathon events, so that users can discover and register for events.

#### Acceptance Criteria

1. WHEN an admin creates an event, THE System SHALL validate all required fields (title, description, start_date, end_date, max_participants) using Zod
2. WHEN an admin uploads event images, THE System SHALL store them in Supabase Storage and save URLs to the event record
3. WHEN an admin updates an event, THE System SHALL verify admin privileges before allowing modifications
4. WHEN an admin deletes an event, THE System SHALL verify admin privileges and cascade delete related registrations
5. WHEN a non-admin attempts event CRUD operations, THE System SHALL return an authorization error
6. THE System SHALL allow querying events with filters for status (live/upcoming/past) based on current date
7. WHEN querying event details, THE System SHALL include current participant count
8. THE System SHALL calculate event status dynamically based on start_date, end_date, and current timestamp
9. THE System SHALL store prizes as JSONB to support flexible prize structures
10. THE System SHALL store themes as a text array for multi-theme events

### Requirement 5: Event Registration

**User Story:** As a user, I want to register for hackathon events, so that I can participate and submit my project ideas.

#### Acceptance Criteria

1. WHEN a user registers for an event, THE System SHALL validate team_name and project_idea are non-empty strings
2. WHEN a user registers for an event, THE System SHALL check if registration_open is true before allowing registration
3. WHEN a user registers for an event, THE System SHALL check current participant count against max_participants
4. WHEN participant count is below max_participants, THE System SHALL create registration with status "confirmed"
5. WHEN participant count equals max_participants, THE System SHALL create registration with status "waitlisted"
6. WHEN a user attempts duplicate registration, THE System SHALL return an error due to unique constraint
7. WHEN a registration is created, THE System SHALL send a confirmation email via Resend API
8. THE System SHALL allow users to view their own registrations across all events
9. THE System SHALL allow admins to view all registrations for any event
10. THE System SHALL allow admins to update registration status (pending/confirmed/waitlisted)

### Requirement 6: Real-time Features

**User Story:** As a user, I want to see live updates for participant counts and announcements, so that I have current information without refreshing.

#### Acceptance Criteria

1. WHEN a new registration is created, THE System SHALL broadcast the updated participant count via Supabase real-time subscriptions
2. WHEN a registration status changes, THE System SHALL broadcast the updated participant count via Supabase real-time subscriptions
3. WHEN a new announcement is posted, THE System SHALL broadcast it to all subscribed clients via Supabase real-time
4. WHEN leaderboard scores update, THE System SHALL broadcast changes via Supabase real-time subscriptions
5. THE System SHALL configure Supabase real-time channels for events, announcements, and leaderboard tables
6. THE System SHALL handle real-time connection errors gracefully and allow reconnection

### Requirement 7: Announcements System

**User Story:** As an admin, I want to post announcements, so that I can communicate updates to the community.

#### Acceptance Criteria

1. WHEN an admin creates an announcement, THE System SHALL validate content is non-empty using Zod
2. WHEN an admin creates an announcement, THE System SHALL store it with author profile reference and timestamp
3. WHEN an admin updates an announcement, THE System SHALL verify they are the author or have admin privileges
4. WHEN an admin deletes an announcement, THE System SHALL verify they are the author or have admin privileges
5. WHEN a non-admin attempts to create announcements, THE System SHALL return an authorization error
6. THE System SHALL allow all authenticated users to read announcements
7. WHEN querying announcements, THE System SHALL return them ordered by created_at descending
8. WHEN querying announcements, THE System SHALL include author profile information (username, avatar_url)

### Requirement 8: Resources Management

**User Story:** As an admin, I want to manage educational resources, so that participants can access preparation guides and templates.

#### Acceptance Criteria

1. WHEN an admin creates a resource, THE System SHALL validate title, description, content_url, and category using Zod
2. WHEN an admin updates a resource, THE System SHALL verify admin privileges before allowing modifications
3. WHEN an admin deletes a resource, THE System SHALL verify admin privileges before deletion
4. WHEN a non-admin attempts resource CRUD operations, THE System SHALL return an authorization error
5. THE System SHALL allow all authenticated users to read resources
6. THE System SHALL support filtering resources by category
7. WHEN querying resources, THE System SHALL return them ordered by created_at descending

### Requirement 9: Sponsors Management

**User Story:** As an admin, I want to manage sponsor information, so that we can showcase event supporters.

#### Acceptance Criteria

1. WHEN an admin creates a sponsor, THE System SHALL validate name, logo_url, website_url, and tier using Zod
2. WHEN an admin uploads sponsor logos, THE System SHALL store them in Supabase Storage
3. WHEN an admin updates a sponsor, THE System SHALL verify admin privileges before allowing modifications
4. WHEN an admin deletes a sponsor, THE System SHALL verify admin privileges before deletion
5. THE System SHALL allow all users (authenticated and unauthenticated) to read sponsor information
6. THE System SHALL support sponsor tiers (gold/silver/bronze) for display ordering

### Requirement 10: Leaderboard System

**User Story:** As an admin, I want to manage leaderboard scores for ongoing events, so that participants can track competition standings.

#### Acceptance Criteria

1. WHEN an admin updates a leaderboard entry, THE System SHALL validate event_id, user_id, and score using Zod
2. WHEN an admin updates scores, THE System SHALL recalculate ranks based on score ordering
3. WHEN querying leaderboard for an event, THE System SHALL return entries ordered by rank ascending
4. WHEN querying leaderboard entries, THE System SHALL include participant profile information (username, avatar_url)
5. THE System SHALL allow all authenticated users to read leaderboard data
6. WHEN a non-admin attempts to modify leaderboard data, THE System SHALL return an authorization error

### Requirement 11: Email Notifications

**User Story:** As a user, I want to receive email notifications for important events, so that I stay informed about my registrations.

#### Acceptance Criteria

1. WHEN a user successfully registers for an event, THE System SHALL send a confirmation email via Resend API
2. WHEN a registration email is sent, THE System SHALL include event details (title, dates, location)
3. WHEN a new user signs up, THE System SHALL send a welcome email via Resend API
4. WHEN an email fails to send, THE System SHALL log the error but not block the primary operation
5. THE System SHALL use email templates for consistent branding
6. THE System SHALL respect Resend's free tier limit of 3000 emails per month

### Requirement 12: API Validation and Error Handling

**User Story:** As a developer, I want robust input validation and error handling, so that the API is secure and provides clear feedback.

#### Acceptance Criteria

1. WHEN an API endpoint receives a request, THE System SHALL validate input using Zod schemas before processing
2. WHEN validation fails, THE System SHALL return a 400 status code with descriptive error messages
3. WHEN authentication fails, THE System SHALL return a 401 status code with an appropriate message
4. WHEN authorization fails, THE System SHALL return a 403 status code with an appropriate message
5. WHEN a resource is not found, THE System SHALL return a 404 status code
6. WHEN a server error occurs, THE System SHALL return a 500 status code and log the error details
7. THE System SHALL sanitize all user inputs to prevent SQL injection and XSS attacks
8. THE System SHALL implement rate limiting on registration endpoints to prevent abuse

### Requirement 13: Performance and Scalability

**User Story:** As a user, I want fast API responses and page loads, so that I have a smooth experience.

#### Acceptance Criteria

1. WHEN an API endpoint is called, THE System SHALL respond within 500ms for 95% of requests
2. THE System SHALL use database indexes on frequently queried columns to optimize query performance
3. THE System SHALL implement pagination for list endpoints (events, announcements, resources)
4. THE System SHALL cache frequently accessed data where appropriate
5. THE System SHALL use Supabase connection pooling to handle concurrent requests efficiently
6. THE System SHALL operate within Supabase free tier limits (500MB database, 2GB bandwidth)
7. THE System SHALL operate within Vercel free tier limits (100GB bandwidth, 100 hours serverless execution)

### Requirement 14: Row Level Security

**User Story:** As a security-conscious developer, I want database-level access control, so that data is protected even if application logic fails.

#### Acceptance Criteria

1. THE System SHALL enable RLS on the profiles table allowing users to read all profiles but update only their own
2. THE System SHALL enable RLS on the events table allowing all users to read but only admins to create/update/delete
3. THE System SHALL enable RLS on the registrations table allowing users to read their own registrations and admins to read all
4. THE System SHALL enable RLS on the announcements table allowing all authenticated users to read but only admins to create/update/delete
5. THE System SHALL enable RLS on the resources table allowing all authenticated users to read but only admins to create/update/delete
6. THE System SHALL enable RLS on the sponsors table allowing all users to read but only admins to create/update/delete
7. THE System SHALL enable RLS on the leaderboard table allowing all authenticated users to read but only admins to update
8. THE System SHALL use Supabase service role key only in secure server-side contexts, never in client code

### Requirement 15: Storage Management

**User Story:** As a user, I want to upload images for profiles and events, so that the platform is visually engaging.

#### Acceptance Criteria

1. WHEN a user uploads an avatar, THE System SHALL validate file type is image (jpg, png, webp)
2. WHEN a user uploads an avatar, THE System SHALL validate file size is under 2MB
3. WHEN an admin uploads event images, THE System SHALL validate file types and sizes
4. THE System SHALL store uploaded files in Supabase Storage with organized bucket structure
5. THE System SHALL generate public URLs for uploaded images
6. THE System SHALL implement access policies on storage buckets (public read for avatars and event images)
7. WHEN a profile or event is deleted, THE System SHALL clean up associated storage files to prevent orphaned data
