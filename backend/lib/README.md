# Authentication Middleware

This module provides authentication and authorization middleware for API routes.

## Functions

### `requireAuth()`

Verifies that a user is authenticated and returns the authenticated user object.

**Returns:** `Promise<User>` - The authenticated user

**Throws:** `AuthenticationError` (401) - When user is not authenticated

**Example:**
```typescript
import { requireAuth } from '@/lib/middleware/auth'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    
    // User is authenticated, proceed with logic
    return Response.json({ userId: user.id })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    throw error
  }
}
```

### `requireAdmin(userId: string)`

Verifies that a user has admin privileges.

**Parameters:**
- `userId: string` - The user ID to check for admin status

**Returns:** `Promise<void>`

**Throws:** `AuthorizationError` (403) - When user is not an admin

**Example:**
```typescript
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    await requireAdmin(user.id)
    
    // User is admin, proceed with admin operation
    const body = await request.json()
    // ... create event logic
    
    return Response.json({ success: true })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    if (error instanceof AuthorizationError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    throw error
  }
}
```

## Error Classes

### `AuthenticationError`

Thrown when a user is not authenticated.
- **statusCode:** 401
- **Default message:** "Authentication required"

### `AuthorizationError`

Thrown when a user lacks required permissions.
- **statusCode:** 403
- **Default message:** "Insufficient permissions"

## Usage Pattern

The recommended pattern for using these middleware functions in API routes:

```typescript
import { requireAuth, requireAdmin, AuthenticationError, AuthorizationError } from '@/lib/middleware/auth'

export async function POST(request: Request) {
  try {
    // Step 1: Verify authentication
    const user = await requireAuth()
    
    // Step 2: Verify authorization (if needed)
    await requireAdmin(user.id)
    
    // Step 3: Process request
    const body = await request.json()
    // ... your logic here
    
    return Response.json({ success: true })
    
  } catch (error) {
    // Handle authentication errors
    if (error instanceof AuthenticationError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    // Handle authorization errors
    if (error instanceof AuthorizationError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    // Handle other errors
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Requirements Validated

This middleware implementation validates the following requirements:
- **2.1-2.10**: Authentication system requirements
- **4.3**: Admin verification for event operations
- **4.5**: Authorization for admin-only operations
