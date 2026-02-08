# Frontend-Backend Integration Guide

This guide explains how to connect the TechAssassin React frontend (Client) with the Next.js backend.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [API Client Usage](#api-client-usage)
- [Service Layer](#service-layer)
- [Authentication Flow](#authentication-flow)
- [Error Handling](#error-handling)
- [TypeScript Types](#typescript-types)
- [Testing the Integration](#testing-the-integration)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The TechAssassin application consists of:
- **Frontend**: React + Vite + TypeScript (in `Client/` directory)
- **Backend**: Next.js 14 API routes (in `backend/` directory)

The frontend communicates with the backend via REST API calls over HTTP.

### Technology Stack

**Frontend:**
- React 18
- Vite (build tool)
- TypeScript
- TanStack Query (React Query) for data fetching
- React Router for navigation
- Tailwind CSS + shadcn/ui for styling

**Backend:**
- Next.js 14 with App Router
- Supabase (PostgreSQL, Auth, Storage, Realtime)
- TypeScript
- Zod for validation

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Frontend (Client/)                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │  Components  │  │   Services   │  │  API Client │ │ │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ (REST API)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Backend (backend/)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes (/api/*)                                   │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐│ │
│  │  │  Auth    │  │  Events  │  │  Registrations, etc. ││ │
│  │  └──────────┘  └──────────┘  └──────────────────────┘│ │
│  └────────────────────────────────────────────────────────┘ │
│                            │                                 │
│                            ▼                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Supabase (Database, Auth, Storage, Realtime)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Backend already set up and running (see `backend/SETUP.md`)
- Supabase project configured

### Step 1: Install Frontend Dependencies

```bash
cd Client
npm install
```

### Step 2: Configure Environment Variables

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your configuration:
   ```bash
   # Backend API URL
   VITE_API_URL=http://localhost:3000/api

   # Supabase Configuration (same as backend)
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...

   # Application Configuration
   VITE_APP_NAME=TechAssassin
   VITE_APP_URL=http://localhost:8080
   VITE_DEBUG=true
   ```

### Step 3: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd Client
npm run dev
# Frontend runs on http://localhost:8080
```

### Step 4: Verify Connection

1. Open browser to `http://localhost:8080`
2. Open browser console (F12)
3. You should see API requests in the Network tab
4. Check for CORS errors (there shouldn't be any)

---

## Environment Configuration

### Development Environment

**Frontend (.env.local):**
```bash
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_URL=http://localhost:8080
VITE_DEBUG=true
```

**Backend (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_...
```

### Production Environment

**Frontend (.env.production):**
```bash
VITE_API_URL=https://your-backend.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_APP_URL=https://yourdomain.com
VITE_DEBUG=false
```

**Backend (Vercel Environment Variables):**
- Set in Vercel Dashboard → Settings → Environment Variables
- See `backend/DEPLOYMENT.md` for details

---

## API Client Usage

The API client is located in `Client/src/lib/api-client.ts` and provides a simple interface for making HTTP requests.

### Basic Usage

```typescript
import { api } from '@/lib/api-client';

// GET request
const events = await api.get('/events');

// POST request
const newEvent = await api.post('/events', {
  title: 'My Event',
  description: 'Event description',
  // ...
});

// PATCH request
const updated = await api.patch('/events/123', {
  title: 'Updated Title',
});

// DELETE request
await api.delete('/events/123');

// File upload
const result = await api.upload('/profile/avatar', file, 'avatar');
```

### With Query Parameters

```typescript
// GET /api/events?status=live&page=1&limit=20
const events = await api.get('/events', {
  status: 'live',
  page: 1,
  limit: 20,
});
```

### Authentication

The API client automatically includes the authentication token in requests:

```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api-client';

// After successful login
setAuthToken(response.session.access_token);

// After logout
clearAuthToken();
```

### Error Handling

```typescript
import { api, ApiError } from '@/lib/api-client';

try {
  const data = await api.get('/events');
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
    
    // Handle specific errors
    if (error.status === 401) {
      // Redirect to login
    } else if (error.status === 403) {
      // Show permission denied message
    }
  }
}
```

---

## Service Layer

Service modules provide a clean interface for API operations. They're located in `Client/src/services/`.

### Authentication Service

```typescript
import { authService } from '@/services/auth.service';

// Sign up
const response = await authService.signUp({
  email: 'user@example.com',
  password: 'SecurePass123!',
});

// Sign in
const response = await authService.signIn({
  email: 'user@example.com',
  password: 'SecurePass123!',
});

// Sign out
await authService.signOut();

// Reset password
await authService.resetPassword({
  email: 'user@example.com',
});

// Check if authenticated
const isAuth = authService.isAuthenticated();
```

### Events Service

```typescript
import { eventsService } from '@/services/events.service';

// List events
const response = await eventsService.list({
  status: 'live',
  page: 1,
  limit: 20,
});

// Get single event
const event = await eventsService.getById('event-id');

// Create event (admin only)
const newEvent = await eventsService.create({
  title: 'Hackathon 2026',
  description: 'Annual hackathon',
  start_date: '2026-03-01T00:00:00Z',
  end_date: '2026-03-02T00:00:00Z',
  location: 'Tech Hub',
  max_participants: 100,
});

// Update event (admin only)
const updated = await eventsService.update('event-id', {
  title: 'Updated Title',
});

// Delete event (admin only)
await eventsService.delete('event-id');

// Upload images (admin only)
const files = [file1, file2];
const result = await eventsService.uploadImages('event-id', files);
```

### Registrations Service

```typescript
import { registrationsService } from '@/services/registrations.service';

// Register for event
const registration = await registrationsService.create({
  event_id: 'event-id',
  team_name: 'Team Awesome',
  project_idea: 'Build something cool',
});

// Get my registrations
const myRegistrations = await registrationsService.getMyRegistrations();

// Get event registrations (admin only)
const eventRegs = await registrationsService.getEventRegistrations('event-id');

// Update registration status (admin only)
const updated = await registrationsService.updateStatus('reg-id', {
  status: 'confirmed',
});
```

---

## Authentication Flow

### Sign Up Flow

```typescript
import { authService } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

function SignUpForm() {
  const navigate = useNavigate();
  
  const handleSignUp = async (email: string, password: string) => {
    try {
      const response = await authService.signUp({ email, password });
      
      // Token is automatically stored
      console.log('Signed up:', response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        // Show error message to user
        alert(error.message);
      }
    }
  };
  
  // ... form JSX
}
```

### Sign In Flow

```typescript
import { authService } from '@/services/auth.service';

const handleSignIn = async (email: string, password: string) => {
  try {
    const response = await authService.signIn({ email, password });
    
    // Token is automatically stored
    console.log('Signed in:', response.user);
    
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        alert('Invalid email or password');
      } else {
        alert(error.message);
      }
    }
  }
};
```

### Protected Routes

```typescript
import { authService } from '@/services/auth.service';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Usage in router
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## Error Handling

### Global Error Handler

```typescript
import { ApiError } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    // Handle specific status codes
    switch (error.status) {
      case 400:
        toast({
          title: 'Validation Error',
          description: error.message,
          variant: 'destructive',
        });
        break;
      
      case 401:
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to continue',
          variant: 'destructive',
        });
        // Redirect to login
        window.location.href = '/login';
        break;
      
      case 403:
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action',
          variant: 'destructive',
        });
        break;
      
      case 404:
        toast({
          title: 'Not Found',
          description: error.message,
          variant: 'destructive',
        });
        break;
      
      case 429:
        toast({
          title: 'Rate Limit Exceeded',
          description: 'Please try again later',
          variant: 'destructive',
        });
        break;
      
      case 500:
        toast({
          title: 'Server Error',
          description: 'Something went wrong. Please try again later.',
          variant: 'destructive',
        });
        break;
      
      default:
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
    }
  } else {
    toast({
      title: 'Error',
      description: 'An unexpected error occurred',
      variant: 'destructive',
    });
  }
}
```

### Usage in Components

```typescript
import { handleApiError } from '@/lib/error-handler';

const handleSubmit = async () => {
  try {
    await eventsService.create(formData);
    toast({ title: 'Event created successfully!' });
  } catch (error) {
    handleApiError(error);
  }
};
```

---

## TypeScript Types

All API types are defined in `Client/src/types/api.ts` and match the backend schema.

### Using Types

```typescript
import type {
  Event,
  EventWithParticipants,
  EventCreateRequest,
  PaginatedResponse,
} from '@/types/api';

// Component props
interface EventListProps {
  events: EventWithParticipants[];
}

// Form data
const formData: EventCreateRequest = {
  title: 'My Event',
  description: 'Description',
  start_date: '2026-03-01T00:00:00Z',
  end_date: '2026-03-02T00:00:00Z',
  location: 'Venue',
  max_participants: 100,
};

// API response
const response: PaginatedResponse<EventWithParticipants> = 
  await eventsService.list();
```

---

## Testing the Integration

### Manual Testing

1. **Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"...","message":"..."}`

2. **Sign Up:**
   - Open frontend: `http://localhost:8080`
   - Navigate to sign up page
   - Create account
   - Check browser console for API requests
   - Check backend logs for incoming requests

3. **List Events:**
   - Navigate to events page
   - Should see list of events
   - Check Network tab for `/api/events` request

4. **Register for Event:**
   - Click on an event
   - Fill registration form
   - Submit
   - Check for success message
   - Verify in backend database

### Automated Testing

Create integration tests in `Client/src/test/`:

```typescript
import { describe, it, expect } from 'vitest';
import { eventsService } from '@/services/events.service';

describe('Events Service', () => {
  it('should fetch events list', async () => {
    const response = await eventsService.list();
    
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('pagination');
    expect(Array.isArray(response.data)).toBe(true);
  });
});
```

Run tests:
```bash
npm test
```

---

## Deployment

### Frontend Deployment (Vercel)

1. **Create `.env.production`:**
   ```bash
   VITE_API_URL=https://your-backend.vercel.app/api
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_APP_URL=https://yourdomain.com
   VITE_DEBUG=false
   ```

2. **Build:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add all variables from `.env.production`

### Backend Deployment

See `backend/DEPLOYMENT.md` for complete backend deployment instructions.

### CORS Configuration

Ensure backend CORS middleware (`backend/middleware.ts`) includes your frontend domain:

```typescript
const allowedOrigins = [
  'https://yourdomain.com',  // Production frontend
  'https://www.yourdomain.com',
  'http://localhost:8080',  // Development
];
```

---

## Troubleshooting

### CORS Errors

**Problem:** Browser shows CORS error when making API requests

**Solution:**
1. Check backend `middleware.ts` includes frontend domain
2. Verify backend is running
3. Check `VITE_API_URL` is correct
4. Clear browser cache
5. Restart both servers

### 401 Unauthorized Errors

**Problem:** API returns 401 even after login

**Solution:**
1. Check token is stored: `localStorage.getItem('auth_token')`
2. Verify token format is correct
3. Check backend authentication middleware
4. Try logging in again
5. Check token expiration

### Network Errors

**Problem:** "Network error: Unable to connect to the server"

**Solution:**
1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check `VITE_API_URL` in `.env.local`
3. Check firewall settings
4. Try different port if 3000 is in use

### Environment Variables Not Loading

**Problem:** `import.meta.env.VITE_API_URL` is undefined

**Solution:**
1. Ensure variable starts with `VITE_`
2. Restart Vite dev server after changing `.env.local`
3. Check `.env.local` exists in `Client/` directory
4. Verify no syntax errors in `.env.local`

### Type Errors

**Problem:** TypeScript errors about API types

**Solution:**
1. Ensure types in `Client/src/types/api.ts` match backend
2. Run `npm run build` to check for type errors
3. Update types if backend schema changed
4. Check imports are correct

---

## Best Practices

### 1. Use Service Layer

Always use service modules instead of calling `api` directly:

```typescript
// ✅ Good
import { eventsService } from '@/services/events.service';
const events = await eventsService.list();

// ❌ Bad
import { api } from '@/lib/api-client';
const events = await api.get('/events');
```

### 2. Handle Errors Properly

Always wrap API calls in try-catch:

```typescript
try {
  const data = await eventsService.list();
  // Handle success
} catch (error) {
  handleApiError(error);
}
```

### 3. Use TypeScript Types

Always type your data:

```typescript
import type { Event } from '@/types/api';

const [events, setEvents] = useState<Event[]>([]);
```

### 4. Use React Query

For better data fetching, use TanStack Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '@/services/events.service';

function EventsList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: () => eventsService.list(),
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render events */}</div>;
}
```

### 5. Environment-Specific Configuration

Use different `.env` files for different environments:
- `.env.local` - Development
- `.env.production` - Production
- `.env.test` - Testing

---

## Next Steps

1. ✅ Environment variables configured
2. ✅ API client set up
3. ✅ Service layer created
4. ✅ Types defined
5. Create additional service modules (profiles, announcements, etc.)
6. Implement authentication UI
7. Create event listing and detail pages
8. Implement registration flow
9. Add real-time updates with Supabase
10. Deploy to production

---

## Support

- **Frontend Issues:** Check `Client/README.md`
- **Backend Issues:** Check `backend/SETUP.md` and `backend/DEPLOYMENT.md`
- **API Documentation:** See `backend/API.md`

---

**Integration Guide Version:** 1.0  
**Last Updated:** February 8, 2026
