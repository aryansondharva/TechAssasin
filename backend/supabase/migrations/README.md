# Supabase Database Migrations

This directory contains SQL migration files for the TechAssassin backend database schema.

## Migration Files

The migrations are numbered sequentially and should be applied in order:

1. **20260207000001_create_profiles_table.sql**
   - Creates the `profiles` table extending auth.users
   - Adds unique constraint on username
   - Creates index on username

2. **20260207000002_create_events_table.sql**
   - Creates the `events` table for hackathon events
   - Creates index on start_date

3. **20260207000003_create_registrations_table.sql**
   - Creates the `registrations` table for event registrations
   - Adds unique constraint on (user_id, event_id)
   - Creates indexes on event_id and user_id
   - Implements CASCADE DELETE for event_id

4. **20260207000004_create_announcements_table.sql**
   - Creates the `announcements` table for community updates
   - Creates index on created_at DESC

5. **20260207000005_create_resources_table.sql**
   - Creates the `resources` table for educational content
   - Creates index on category

6. **20260207000006_create_sponsors_table.sql**
   - Creates the `sponsors` table for event sponsors
   - Adds check constraint on tier (gold/silver/bronze)

7. **20260207000007_create_leaderboard_table.sql**
   - Creates the `leaderboard` table for event scoring
   - Creates composite index on (event_id, rank)

8. **20260207000008_create_profile_trigger.sql**
   - Creates PostgreSQL function `handle_new_user()`
   - Creates trigger `on_auth_user_created` for automatic profile creation
   - Sets default values: is_admin = false, skills = empty array

## Applying Migrations

### Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push
```

### Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order
4. Execute each migration

### Manual Application

You can also apply these migrations manually by connecting to your PostgreSQL database and running each SQL file in order.

## Database Schema Overview

### Tables

- **profiles**: Extended user information (username, skills, admin status)
- **events**: Hackathon event details (dates, location, capacity)
- **registrations**: User event registrations (team name, project idea, status)
- **announcements**: Community announcements and updates
- **resources**: Educational resources and guides
- **sponsors**: Event sponsors and partners
- **leaderboard**: Event scoring and rankings

### Key Relationships

- `profiles.id` → `auth.users.id` (FK)
- `registrations.user_id` → `profiles.id` (FK, CASCADE DELETE)
- `registrations.event_id` → `events.id` (FK, CASCADE DELETE)
- `announcements.author_id` → `profiles.id` (FK, CASCADE DELETE)
- `leaderboard.event_id` → `events.id` (FK, CASCADE DELETE)
- `leaderboard.user_id` → `profiles.id` (FK, CASCADE DELETE)

### Constraints

- `profiles.username` UNIQUE
- `registrations(user_id, event_id)` UNIQUE
- `registrations.status` CHECK IN ('pending', 'confirmed', 'waitlisted')
- `sponsors.tier` CHECK IN ('gold', 'silver', 'bronze')
- `events.max_participants` CHECK > 0
- `leaderboard.score` CHECK >= 0
- `leaderboard.rank` CHECK >= 0

### Indexes

- `idx_profiles_username` on profiles(username)
- `idx_events_start_date` on events(start_date)
- `idx_registrations_event_id` on registrations(event_id)
- `idx_registrations_user_id` on registrations(user_id)
- `idx_announcements_created_at` on announcements(created_at DESC)
- `idx_resources_category` on resources(category)
- `idx_leaderboard_event_rank` on leaderboard(event_id, rank)

## Next Steps

After applying these migrations:

1. Set up Row Level Security (RLS) policies (Task 3)
2. Create Supabase Storage buckets (Task 4)
3. Implement TypeScript types and interfaces (Task 5)
4. Configure Supabase client (Task 6)

## Notes

- All tables use UUID primary keys
- Timestamps use TIMESTAMPTZ for timezone awareness
- Arrays use PostgreSQL array types (TEXT[])
- JSON data uses JSONB for efficient querying
- Foreign keys implement CASCADE DELETE where appropriate
- The profile trigger automatically creates profiles for new auth users
