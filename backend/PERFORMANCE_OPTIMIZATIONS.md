# Performance Optimizations

This document describes the performance optimizations implemented in the TechAssassin backend.

## Database Index Optimizations

### New Indexes Added (Migration 20260208000001)

1. **`idx_registrations_status`** - Index on `registrations.status`
   - Optimizes filtering registrations by status (confirmed/waitlisted/pending)
   - Used in registration listing and counting queries

2. **`idx_registrations_event_status`** - Composite index on `registrations(event_id, status)`
   - Optimizes counting confirmed registrations per event
   - Critical for participant count calculations
   - Reduces query time from O(n) to O(log n) for filtered counts

3. **`idx_sponsors_tier`** - Index on `sponsors.tier`
   - Optimizes ordering sponsors by tier (gold/silver/bronze)
   - Used in sponsor listing endpoint

4. **`idx_resources_created_at`** - Index on `resources.created_at DESC`
   - Optimizes ordering resources by creation date
   - Matches the query pattern in resource listing

5. **`idx_leaderboard_event_user`** - Unique composite index on `leaderboard(event_id, user_id)`
   - Optimizes leaderboard upsert operations
   - Prevents duplicate entries for same user/event combination
   - Improves query performance for user-specific leaderboard lookups

6. **`idx_events_registration_open`** - Index on `events.registration_open`
   - Optimizes filtering events by registration status
   - Useful for finding open events

7. **`idx_announcements_author_id`** - Index on `announcements.author_id`
   - Optimizes author lookups for announcements
   - Improves join performance with profiles table

8. **`idx_leaderboard_user_id`** - Index on `leaderboard.user_id`
   - Optimizes user-specific leaderboard queries
   - Improves join performance with profiles table

### Existing Indexes (From Initial Migrations)

- `idx_profiles_username` - Username lookups
- `idx_events_start_date` - Event date filtering
- `idx_registrations_event_id` - Event registration lookups
- `idx_registrations_user_id` - User registration lookups
- `idx_announcements_created_at` - Announcement ordering
- `idx_resources_category` - Resource category filtering
- `idx_leaderboard_event_rank` - Leaderboard ordering

## Query Optimizations

### 1. Events List N+1 Query Fix

**Problem**: The `listEvents` function was calling `getParticipantCount` for each event in a loop, resulting in N+1 queries.

**Solution**: 
- Fetch all events first
- Make a single query to get all registration counts for all events
- Build a map of event_id to participant count
- Use the map to populate participant counts without additional queries

**Impact**: Reduced from N+1 queries to 2 queries total (1 for events, 1 for all registration counts)

**Code Location**: `backend/lib/services/events.ts` - `listEvents` function

### 2. Leaderboard Rank Batch Update

**Problem**: The `recalculateRanks` function was updating each leaderboard entry individually in a loop, resulting in N update queries.

**Solution**:
- Calculate all rank updates in memory
- Use a single `upsert` operation to update all ranks at once
- Include `updated_at` timestamp in the batch update

**Impact**: Reduced from N update queries to 1 batch upsert operation

**Code Location**: `backend/lib/services/leaderboard.ts` - `recalculateRanks` function

## Query Pattern Best Practices

### Use Composite Indexes for Multi-Column Filters

When filtering by multiple columns (e.g., `event_id` AND `status`), use composite indexes with the most selective column first.

Example:
```sql
CREATE INDEX idx_registrations_event_status ON registrations(event_id, status);
```

### Use Descending Indexes for DESC Ordering

When ordering by a column in descending order, create the index with DESC to match the query pattern.

Example:
```sql
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);
```

### Batch Operations Over Loops

Always prefer batch operations (upsert, bulk insert) over loops with individual queries.

**Bad**:
```typescript
for (const item of items) {
  await supabase.from('table').update(item).eq('id', item.id)
}
```

**Good**:
```typescript
await supabase.from('table').upsert(items, { onConflict: 'id' })
```

### Fetch Related Data in Single Query

Use Supabase's join syntax to fetch related data in a single query instead of separate queries.

**Bad**:
```typescript
const events = await supabase.from('events').select('*')
for (const event of events) {
  const count = await getParticipantCount(event.id)
}
```

**Good**:
```typescript
const events = await supabase.from('events').select('*')
const counts = await supabase
  .from('registrations')
  .select('event_id')
  .in('event_id', eventIds)
  .eq('status', 'confirmed')
```

## Performance Monitoring

### Key Metrics to Monitor

1. **Query Response Time**: Target < 500ms for 95% of requests
2. **Database Connection Pool**: Monitor active connections
3. **Index Usage**: Use `EXPLAIN ANALYZE` to verify indexes are being used
4. **N+1 Query Detection**: Monitor for multiple sequential queries in loops

### Tools

- Supabase Dashboard: Monitor query performance and slow queries
- PostgreSQL `EXPLAIN ANALYZE`: Analyze query execution plans
- Application logs: Track API response times

## Future Optimization Opportunities

1. **Distributed Caching**: For multi-instance deployments, consider Redis or similar distributed cache
2. **Materialized Views**: Consider materialized views for complex aggregations
3. **Read Replicas**: Use read replicas for read-heavy operations (if scaling beyond free tier)
4. **Connection Pooling**: Optimize connection pool settings based on usage patterns
5. **Query Result Pagination**: Ensure all list endpoints use cursor-based pagination for large datasets
6. **CDN Integration**: Use CDN for static assets and API responses where appropriate

## Caching Implementation

### In-Memory Cache

Implemented a simple in-memory cache for frequently accessed data that rarely changes. This is suitable for serverless environments where each function instance maintains its own cache.

**Location**: `backend/lib/utils/cache.ts`

### Cached Endpoints

1. **GET /api/sponsors** - 5 minute TTL
   - Sponsors rarely change
   - Public endpoint with high read frequency
   - Cache invalidated on sponsor create/update/delete

2. **GET /api/events** - 2 minute TTL
   - Events change occasionally
   - Cached per status filter and pagination parameters
   - Cache invalidated on event create/update/delete

### Cache Invalidation Strategy

**Pattern-based invalidation**: When data changes, invalidate all related cache entries using pattern matching.

Examples:
- Event created/updated/deleted → Invalidate all `events:*` cache keys
- Sponsor created/updated/deleted → Invalidate `sponsors:list` cache key

**Automatic cleanup**: Expired cache entries are automatically cleaned up every 5 minutes to prevent memory leaks.

### Cache Configuration

Cache TTLs are configured based on data change frequency:

```typescript
export const CacheTTL = {
  sponsors: 5 * 60 * 1000,      // 5 minutes - sponsors rarely change
  events: 2 * 60 * 1000,        // 2 minutes - events change occasionally
  leaderboard: 30 * 1000,       // 30 seconds - leaderboard updates frequently
  resources: 5 * 60 * 1000,     // 5 minutes - resources rarely change
  profile: 1 * 60 * 1000        // 1 minute - profiles change occasionally
}
```

### Usage Example

```typescript
import { getCached, CacheKeys, CacheTTL } from '@/lib/utils/cache'

// Get cached data or fetch if not cached
const sponsors = await getCached(
  CacheKeys.sponsors(),
  async () => {
    // Fetch from database
    return await fetchSponsorsFromDB()
  },
  CacheTTL.sponsors
)
```

### Cache Invalidation Example

```typescript
import { cache, CacheKeys } from '@/lib/utils/cache'

// Invalidate specific cache entry
cache.invalidate(CacheKeys.sponsors())

// Invalidate all entries matching pattern
cache.invalidatePattern('events:')
```

### Limitations

- **In-memory only**: Each serverless function instance has its own cache
- **Not distributed**: Cache is not shared across multiple instances
- **Cold starts**: Cache is empty on cold starts
- **Memory usage**: Monitor cache size to prevent excessive memory usage

For production deployments with multiple instances, consider:
- Redis for distributed caching
- Vercel KV for edge caching
- CloudFlare Workers KV for global edge caching

## Verification

To verify optimizations are working:

1. Run the migration: `supabase db push`
2. Check indexes exist: `SELECT * FROM pg_indexes WHERE tablename IN ('registrations', 'sponsors', 'resources', 'leaderboard', 'events', 'announcements');`
3. Test query performance: Use `EXPLAIN ANALYZE` on key queries
4. Monitor API response times: Check that list endpoints respond < 500ms

## Requirements Satisfied

- **Requirement 13.2**: Database indexes on frequently queried columns
- **Requirement 13.1**: API response time < 500ms for 95% of requests
