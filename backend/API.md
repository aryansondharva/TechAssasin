# TechAssassin Backend API Documentation

## Overview

The TechAssassin backend provides a RESTful API for managing hackathon events, user profiles, registrations, announcements, resources, sponsors, and leaderboards. The API is built with Next.js 14 App Router and uses Supabase for authentication, database, and storage.

**Base URL**: `https://your-domain.com/api` (or `http://localhost:3000/api` for local development)

**Authentication**: Most endpoints require authentication via Supabase Auth. Include the session token in requests.

**Content Type**: All requests and responses use `application/json` unless otherwise specified.

## Table of Contents

- [Authentication](#authentication)
- [Profile Management](#profile-management)
- [Event Management](#event-management)
- [Registration System](#registration-system)
- [Announcements](#announcements)
- [Resources](#resources)
- [Sponsors](#sponsors)
- [Leaderboard](#leaderboard)
- [Error Responses](#error-responses)

---

## Authentication

### Sign Up

Create a new user account.

**Endpoint**: `POST /api/auth/signup`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response** (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "email_confirmed_at": null
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

**Error Response** (400):
```json
{
  "error": "User already registered"
}
```

---

### Sign In

Authenticate an existing user.

**Endpoint**: `POST /api/auth/signin`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

**Error Response** (401):
```json
{
  "error": "Invalid login credentials"
}
```

---

### Sign Out

End the current user session.

**Endpoint**: `POST /api/auth/signout`

**Authentication**: Required

**Request Body**: None

**Success Response** (200):
```json
{
  "message": "Signed out successfully"
}
```

---

### Reset Password

Request a password reset email.

**Endpoint**: `POST /api/auth/reset-password`

**Authentication**: None required

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "Password reset email sent"
}
```

**Note**: Returns success even if email doesn't exist (security best practice).

---

## Profile Management

### Get Current User Profile

Retrieve the authenticated user's profile.

**Endpoint**: `GET /api/profile`

**Authentication**: Required

**Success Response** (200):
```json
{
  "id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "avatar_url": "https://storage.url/avatar.jpg",
  "github_url": "https://github.com/johndoe",
  "skills": ["JavaScript", "React", "Node.js"],
  "is_admin": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Response** (401):
```json
{
  "error": "Unauthorized"
}
```

---

### Get User Profile by ID

Retrieve a specific user's public profile.

**Endpoint**: `GET /api/profile/[id]`

**Authentication**: None required

**Success Response** (200):
```json
{
  "id": "uuid",
  "username": "johndoe",
  "full_name": "John Doe",
  "avatar_url": "https://storage.url/avatar.jpg",
  "github_url": "https://github.com/johndoe",
  "skills": ["JavaScript", "React", "Node.js"],
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Note**: Sensitive fields like `is_admin` are excluded for other users.

**Error Response** (404):
```json
{
  "error": "Profile not found"
}
```

---

### Update Profile

Update the authenticated user's profile.

**Endpoint**: `PATCH /api/profile`

**Authentication**: Required

**Request Body** (all fields optional):
```json
{
  "username": "newusername",
  "full_name": "John Smith",
  "github_url": "https://github.com/johnsmith",
  "skills": ["TypeScript", "Next.js", "PostgreSQL"]
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "username": "newusername",
  "full_name": "John Smith",
  "github_url": "https://github.com/johnsmith",
  "skills": ["TypeScript", "Next.js", "PostgreSQL"],
  "is_admin": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:

400 - Validation Error:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["username"],
      "message": "Username must be at least 3 characters"
    }
  ]
}
```

409 - Username Taken:
```json
{
  "error": "Username already taken"
}
```

---

### Upload Avatar

Upload a profile avatar image.

**Endpoint**: `POST /api/profile/avatar`

**Authentication**: Required

**Content Type**: `multipart/form-data`

**Request Body**:
- `file`: Image file (jpg, png, or webp, max 2MB)

**Success Response** (200):
```json
{
  "avatar_url": "https://storage.url/avatars/user-id/avatar.jpg"
}
```

**Error Responses**:

400 - Invalid File Type:
```json
{
  "error": "Invalid file type. Only jpg, png, and webp are allowed"
}
```

400 - File Too Large:
```json
{
  "error": "File size must be under 2MB"
}
```

---

## Event Management

### List Events

Retrieve a paginated list of events with optional status filter.

**Endpoint**: `GET /api/events`

**Authentication**: None required

**Query Parameters**:
- `status` (optional): Filter by status (`live`, `upcoming`, `past`)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Spring Hackathon 2024",
      "description": "Build innovative solutions...",
      "start_date": "2024-06-01T09:00:00Z",
      "end_date": "2024-06-02T18:00:00Z",
      "location": "Tech Hub, San Francisco",
      "max_participants": 100,
      "registration_open": true,
      "image_urls": ["https://storage.url/event1.jpg"],
      "prizes": {
        "first": "$5000",
        "second": "$3000",
        "third": "$1000"
      },
      "themes": ["AI/ML", "Web3", "Healthcare"],
      "participant_count": 45,
      "status": "upcoming",
      "created_at": "2024-01-10T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

---

### Get Event by ID

Retrieve details for a specific event.

**Endpoint**: `GET /api/events/[id]`

**Authentication**: None required

**Success Response** (200):
```json
{
  "id": "uuid",
  "title": "Spring Hackathon 2024",
  "description": "Build innovative solutions...",
  "start_date": "2024-06-01T09:00:00Z",
  "end_date": "2024-06-02T18:00:00Z",
  "location": "Tech Hub, San Francisco",
  "max_participants": 100,
  "registration_open": true,
  "image_urls": ["https://storage.url/event1.jpg"],
  "prizes": {
    "first": "$5000",
    "second": "$3000",
    "third": "$1000"
  },
  "themes": ["AI/ML", "Web3", "Healthcare"],
  "participant_count": 45,
  "status": "upcoming",
  "created_at": "2024-01-10T12:00:00Z"
}
```

**Error Response** (404):
```json
{
  "error": "Event not found"
}
```

---

### Create Event

Create a new hackathon event (admin only).

**Endpoint**: `POST /api/events`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "title": "Summer Hackathon 2024",
  "description": "Join us for an exciting weekend of coding...",
  "start_date": "2024-07-15T09:00:00Z",
  "end_date": "2024-07-16T18:00:00Z",
  "location": "Innovation Center, Austin",
  "max_participants": 150,
  "registration_open": true,
  "prizes": {
    "first": "$10000",
    "second": "$5000",
    "third": "$2500"
  },
  "themes": ["Sustainability", "EdTech", "FinTech"]
}
```

**Success Response** (201):
```json
{
  "id": "uuid",
  "title": "Summer Hackathon 2024",
  "description": "Join us for an exciting weekend of coding...",
  "start_date": "2024-07-15T09:00:00Z",
  "end_date": "2024-07-16T18:00:00Z",
  "location": "Innovation Center, Austin",
  "max_participants": 150,
  "registration_open": true,
  "image_urls": [],
  "prizes": {
    "first": "$10000",
    "second": "$5000",
    "third": "$2500"
  },
  "themes": ["Sustainability", "EdTech", "FinTech"],
  "created_at": "2024-02-08T14:30:00Z"
}
```

**Error Responses**:

401 - Not Authenticated:
```json
{
  "error": "Unauthorized"
}
```

403 - Not Admin:
```json
{
  "error": "Forbidden: Admin access required"
}
```

400 - Validation Error:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["end_date"],
      "message": "End date must be after start date"
    }
  ]
}
```

---

### Update Event

Update an existing event (admin only).

**Endpoint**: `PATCH /api/events/[id]`

**Authentication**: Required (Admin)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Event Title",
  "registration_open": false,
  "max_participants": 200
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "title": "Updated Event Title",
  "description": "Original description...",
  "start_date": "2024-07-15T09:00:00Z",
  "end_date": "2024-07-16T18:00:00Z",
  "location": "Innovation Center, Austin",
  "max_participants": 200,
  "registration_open": false,
  "image_urls": [],
  "prizes": {},
  "themes": [],
  "created_at": "2024-02-08T14:30:00Z"
}
```

**Error Responses**: Same as Create Event (401, 403, 404)

---

### Delete Event

Delete an event and all associated registrations (admin only).

**Endpoint**: `DELETE /api/events/[id]`

**Authentication**: Required (Admin)

**Success Response** (200):
```json
{
  "message": "Event deleted successfully"
}
```

**Error Responses**: Same as Create Event (401, 403, 404)

---

### Upload Event Images

Upload images for an event (admin only).

**Endpoint**: `POST /api/events/[id]/images`

**Authentication**: Required (Admin)

**Content Type**: `multipart/form-data`

**Request Body**:
- `files`: One or more image files (jpg, png, or webp, max 2MB each)

**Success Response** (200):
```json
{
  "image_urls": [
    "https://storage.url/event-images/event-id/image1.jpg",
    "https://storage.url/event-images/event-id/image2.jpg"
  ]
}
```

**Error Responses**: Same as Create Event plus file validation errors

---

## Registration System

### Create Registration

Register for an event.

**Endpoint**: `POST /api/registrations`

**Authentication**: Required

**Request Body**:
```json
{
  "event_id": "uuid",
  "team_name": "Code Warriors",
  "project_idea": "We plan to build an AI-powered platform that helps students..."
}
```

**Success Response** (201):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "event_id": "uuid",
  "team_name": "Code Warriors",
  "project_idea": "We plan to build an AI-powered platform...",
  "status": "confirmed",
  "created_at": "2024-02-08T15:00:00Z"
}
```

**Note**: Status will be "confirmed" if space available, "waitlisted" if event is at capacity.

**Error Responses**:

400 - Registration Closed:
```json
{
  "error": "Registration is closed for this event"
}
```

409 - Duplicate Registration:
```json
{
  "error": "You are already registered for this event"
}
```

429 - Rate Limit Exceeded:
```json
{
  "error": "Too many registration attempts. Please try again later"
}
```

---

### Get User Registrations

Retrieve all registrations for the authenticated user.

**Endpoint**: `GET /api/registrations`

**Authentication**: Required

**Success Response** (200):
```json
{
  "registrations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "event_id": "uuid",
      "team_name": "Code Warriors",
      "project_idea": "We plan to build...",
      "status": "confirmed",
      "created_at": "2024-02-08T15:00:00Z",
      "event": {
        "id": "uuid",
        "title": "Spring Hackathon 2024",
        "start_date": "2024-06-01T09:00:00Z",
        "end_date": "2024-06-02T18:00:00Z",
        "location": "Tech Hub, San Francisco"
      }
    }
  ]
}
```

---

### Get Event Registrations

Retrieve all registrations for a specific event (admin only).

**Endpoint**: `GET /api/registrations/event/[eventId]`

**Authentication**: Required (Admin)

**Success Response** (200):
```json
{
  "registrations": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "event_id": "uuid",
      "team_name": "Code Warriors",
      "project_idea": "We plan to build...",
      "status": "confirmed",
      "created_at": "2024-02-08T15:00:00Z",
      "user": {
        "id": "uuid",
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden)

---

### Update Registration Status

Update the status of a registration (admin only).

**Endpoint**: `PATCH /api/registrations/[id]`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "status": "confirmed"
}
```

**Valid Status Values**: `pending`, `confirmed`, `waitlisted`

**Success Response** (200):
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "event_id": "uuid",
  "team_name": "Code Warriors",
  "project_idea": "We plan to build...",
  "status": "confirmed",
  "created_at": "2024-02-08T15:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

## Announcements

### List Announcements

Retrieve a paginated list of announcements.

**Endpoint**: `GET /api/announcements`

**Authentication**: Required

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "author_id": "uuid",
      "content": "Exciting news! Registration for Summer Hackathon is now open!",
      "created_at": "2024-02-08T10:00:00Z",
      "updated_at": "2024-02-08T10:00:00Z",
      "author": {
        "username": "admin",
        "avatar_url": "https://storage.url/avatar.jpg"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

---

### Create Announcement

Create a new announcement (admin only).

**Endpoint**: `POST /api/announcements`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "content": "Don't forget to submit your projects by midnight tonight!"
}
```

**Success Response** (201):
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "content": "Don't forget to submit your projects by midnight tonight!",
  "created_at": "2024-02-08T16:00:00Z",
  "updated_at": "2024-02-08T16:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden)

---

### Update Announcement

Update an announcement (admin or author only).

**Endpoint**: `PATCH /api/announcements/[id]`

**Authentication**: Required (Admin or Author)

**Request Body**:
```json
{
  "content": "Updated announcement content"
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "author_id": "uuid",
  "content": "Updated announcement content",
  "created_at": "2024-02-08T16:00:00Z",
  "updated_at": "2024-02-08T16:30:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

### Delete Announcement

Delete an announcement (admin or author only).

**Endpoint**: `DELETE /api/announcements/[id]`

**Authentication**: Required (Admin or Author)

**Success Response** (200):
```json
{
  "message": "Announcement deleted successfully"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

## Resources

### List Resources

Retrieve a paginated list of educational resources.

**Endpoint**: `GET /api/resources`

**Authentication**: Required

**Query Parameters**:
- `category` (optional): Filter by category
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 50)

**Success Response** (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Getting Started with React",
      "description": "A comprehensive guide to building modern web apps with React",
      "content_url": "https://example.com/react-guide",
      "category": "Web Development",
      "created_at": "2024-01-20T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### Create Resource

Create a new resource (admin only).

**Endpoint**: `POST /api/resources`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "title": "Introduction to Machine Learning",
  "description": "Learn the fundamentals of ML and AI",
  "content_url": "https://example.com/ml-intro",
  "category": "AI/ML"
}
```

**Success Response** (201):
```json
{
  "id": "uuid",
  "title": "Introduction to Machine Learning",
  "description": "Learn the fundamentals of ML and AI",
  "content_url": "https://example.com/ml-intro",
  "category": "AI/ML",
  "created_at": "2024-02-08T17:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden)

---

### Update Resource

Update an existing resource (admin only).

**Endpoint**: `PATCH /api/resources/[id]`

**Authentication**: Required (Admin)

**Request Body** (all fields optional):
```json
{
  "title": "Updated Resource Title",
  "category": "Updated Category"
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "title": "Updated Resource Title",
  "description": "Learn the fundamentals of ML and AI",
  "content_url": "https://example.com/ml-intro",
  "category": "Updated Category",
  "created_at": "2024-02-08T17:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

### Delete Resource

Delete a resource (admin only).

**Endpoint**: `DELETE /api/resources/[id]`

**Authentication**: Required (Admin)

**Success Response** (200):
```json
{
  "message": "Resource deleted successfully"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

## Sponsors

### List Sponsors

Retrieve all sponsors (public access).

**Endpoint**: `GET /api/sponsors`

**Authentication**: None required

**Success Response** (200):
```json
{
  "sponsors": [
    {
      "id": "uuid",
      "name": "TechCorp",
      "logo_url": "https://storage.url/sponsor-logos/techcorp.png",
      "website_url": "https://techcorp.com",
      "tier": "gold",
      "description": "Leading technology solutions provider",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Note**: Sponsors are ordered by tier (gold, silver, bronze).

---

### Create Sponsor

Create a new sponsor (admin only).

**Endpoint**: `POST /api/sponsors`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "name": "InnovateCo",
  "logo_url": "https://example.com/logo.png",
  "website_url": "https://innovateco.com",
  "tier": "silver",
  "description": "Innovation-driven software company"
}
```

**Valid Tier Values**: `gold`, `silver`, `bronze`

**Success Response** (201):
```json
{
  "id": "uuid",
  "name": "InnovateCo",
  "logo_url": "https://example.com/logo.png",
  "website_url": "https://innovateco.com",
  "tier": "silver",
  "description": "Innovation-driven software company",
  "created_at": "2024-02-08T18:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden)

---

### Update Sponsor

Update an existing sponsor (admin only).

**Endpoint**: `PATCH /api/sponsors/[id]`

**Authentication**: Required (Admin)

**Request Body** (all fields optional):
```json
{
  "tier": "gold",
  "description": "Updated description"
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "name": "InnovateCo",
  "logo_url": "https://example.com/logo.png",
  "website_url": "https://innovateco.com",
  "tier": "gold",
  "description": "Updated description",
  "created_at": "2024-02-08T18:00:00Z"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

### Delete Sponsor

Delete a sponsor (admin only).

**Endpoint**: `DELETE /api/sponsors/[id]`

**Authentication**: Required (Admin)

**Success Response** (200):
```json
{
  "message": "Sponsor deleted successfully"
}
```

**Error Responses**: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

---

### Upload Sponsor Logo

Upload a logo for a sponsor (admin only).

**Endpoint**: `POST /api/sponsors/[id]/logo`

**Authentication**: Required (Admin)

**Content Type**: `multipart/form-data`

**Request Body**:
- `file`: Image file (jpg, png, or webp, max 2MB)

**Success Response** (200):
```json
{
  "logo_url": "https://storage.url/sponsor-logos/sponsor-id/logo.png"
}
```

**Error Responses**: Same as Create Sponsor plus file validation errors

---

## Leaderboard

### Get Event Leaderboard

Retrieve the leaderboard for a specific event.

**Endpoint**: `GET /api/leaderboard/[eventId]`

**Authentication**: Required

**Success Response** (200):
```json
{
  "leaderboard": [
    {
      "id": "uuid",
      "event_id": "uuid",
      "user_id": "uuid",
      "score": 950,
      "rank": 1,
      "updated_at": "2024-02-08T20:00:00Z",
      "user": {
        "username": "johndoe",
        "avatar_url": "https://storage.url/avatar.jpg"
      }
    },
    {
      "id": "uuid",
      "event_id": "uuid",
      "user_id": "uuid",
      "score": 920,
      "rank": 2,
      "updated_at": "2024-02-08T19:45:00Z",
      "user": {
        "username": "janedoe",
        "avatar_url": "https://storage.url/avatar2.jpg"
      }
    }
  ]
}
```

**Note**: Entries are ordered by rank (ascending).

---

### Update Leaderboard Entry

Create or update a leaderboard entry (admin only).

**Endpoint**: `POST /api/leaderboard`

**Authentication**: Required (Admin)

**Request Body**:
```json
{
  "event_id": "uuid",
  "user_id": "uuid",
  "score": 875
}
```

**Success Response** (200):
```json
{
  "id": "uuid",
  "event_id": "uuid",
  "user_id": "uuid",
  "score": 875,
  "rank": 3,
  "updated_at": "2024-02-08T20:30:00Z"
}
```

**Note**: Ranks are automatically recalculated for all entries in the event after updating a score.

**Error Responses**: 401 (Unauthorized), 403 (Forbidden)

---

## Error Responses

All API endpoints follow a consistent error response format:

### Common HTTP Status Codes

- **400 Bad Request**: Invalid input, validation errors
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Duplicate resource (e.g., username taken, duplicate registration)
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server-side error

### Error Response Format

```json
{
  "error": "Error message describing what went wrong"
}
```

### Validation Error Format

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["field_name"],
      "message": "Specific validation error message"
    }
  ]
}
```

### Example Error Responses

**Authentication Error**:
```json
{
  "error": "Unauthorized"
}
```

**Authorization Error**:
```json
{
  "error": "Forbidden: Admin access required"
}
```

**Not Found Error**:
```json
{
  "error": "Event not found"
}
```

**Validation Error**:
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    },
    {
      "path": ["password"],
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

**Rate Limit Error**:
```json
{
  "error": "Too many registration attempts. Please try again later"
}
```

---

## Real-time Features

The TechAssassin backend supports real-time updates via Supabase Realtime subscriptions. The following tables have real-time enabled:

- **events**: Live updates when events are created, updated, or deleted
- **registrations**: Live participant count updates
- **announcements**: Live feed of new announcements
- **leaderboard**: Live score updates during events

### Client-side Subscription Example

```javascript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Subscribe to registration changes for an event
const channel = supabase
  .channel('event-registrations')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'registrations',
      filter: `event_id=eq.${eventId}`
    },
    (payload) => {
      console.log('Registration changed:', payload)
      // Update UI with new participant count
    }
  )
  .subscribe()

// Unsubscribe when done
channel.unsubscribe()
```

---

## Rate Limiting

The following endpoints have rate limiting enabled:

- **POST /api/registrations**: 5 requests per user per hour

When rate limit is exceeded, the API returns a 429 status code with an appropriate error message.

---

## File Upload Guidelines

### Supported File Types
- Images: `image/jpeg`, `image/png`, `image/webp`

### File Size Limits
- Maximum file size: 2MB per file

### Storage Buckets
- **avatars**: User profile avatars (path: `avatars/{user_id}/`)
- **event-images**: Event images (path: `event-images/{event_id}/`)
- **sponsor-logos**: Sponsor logos (path: `sponsor-logos/{sponsor_id}/`)

All uploaded files are publicly accessible via their generated URLs.

---

## Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max varies by endpoint)

### Pagination Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

## Health Check

### Check API Health

Verify the API is running.

**Endpoint**: `GET /api/health`

**Authentication**: None required

**Success Response** (200):
```json
{
  "status": "ok",
  "timestamp": "2024-02-08T21:00:00Z",
  "message": "TechAssassin API is running"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- UUIDs are used for all resource identifiers
- Authentication tokens should be included in the `Authorization` header as `Bearer {token}`
- Email sending is handled asynchronously and failures don't block primary operations
- Storage cleanup is automatic when resources are deleted
- Row Level Security (RLS) policies enforce access control at the database level

---

**API Version**: 1.0  
**Last Updated**: February 8, 2026
