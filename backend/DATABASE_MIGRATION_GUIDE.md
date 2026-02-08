# Database Migration Guide

This guide covers running database migrations for the TechAssassin backend on production and development Supabase instances.

## Table of Contents

- [Overview](#overview)
- [Migration Files](#migration-files)
- [Prerequisites](#prerequisites)
- [Method 1: Using Supabase CLI (Recommended)](#method-1-using-supabase-cli-recommended)
- [Method 2: Manual SQL Execution](#method-2-manual-sql-execution)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)
- [Creating New Migrations](#creating-new-migrations)

---

## Overview

Database migrations are SQL scripts that modify the database schema. They must be run in order to set up the TechAssassin database with all required tables, indexes, constraints, and policies.

**Important:**
- Always run migrations in order (they are numbered)
- Test migrations in development before running in production
- Backup production database before running migrations
- Migrations are idempotent where possible (safe to re-run)

---

## Migration Files

All migration files are located in `backend/supabase/migrations/`:

| # | File | Description |
|---|------|-------------|
| 1 | `20260207000001_create_profiles_table.sql` | Creates profiles table with user info |
| 2 | `20260207000002_create_events_table.sql` | Creates events table for hackathons |
| 3 | `20260207000003_create_registrations_table.sql` | Creates registrations table |
| 4 | `20260207000004_create_announcements_table.sql` | Creates announcements table |
| 5 | `20260207000005_create_resources_table.sql` | Creates resources table |
| 6 | `20260207000006_create_sponsors_table.sql` | Creates sponsors table |
| 7 | `20260207000007_create_leaderboard_table.sql` | Creates leaderboard table |
| 8 | `20260207000008_create_profile_trigger.sql` | Creates auto-profile creation trigger |
| 9 | `20260207000009_enable_rls_policies.sql` | Enables Row Level Security policies |
| 10 | `20260207000010_create_storage_buckets.sql` | Creates storage buckets for files |
| 11 | `20260207000011_enable_realtime.sql` | Enables realtime on tables |

**Total:** 11 migration files

---

## Prerequisites

Before running migrations:

### For Development
- [ ] Supabase project created
- [ ] Supabase project URL and keys obtained
- [ ] Environment variables configured in `.env.local`

### For Production
- [ ] Production Supabase project created (separate from development)
- [ ] Database backup created
- [ ] Maintenance window scheduled (if needed)
- [ ] Team notified of migration
- [ ] Rollback plan prepared

---

## Method 1: Using Supabase CLI (Recommended)

The Supabase CLI is the recommended method as it tracks migration history and provides better error handling.

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Or using Homebrew (macOS):
```bash
brew install supabase/tap/supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window for authentication.

### Step 3: Link to Your Project

**For Development:**
```bash
cd backend
supabase link --project-ref your-dev-project-ref
```

**For Production:**
```bash
cd backend
supabase link --project-ref your-prod-project-ref
```

**Finding your project ref:**
- Go to Supabase Dashboard
- Select your project
- Project ref is in the URL: `https://app.supabase.com/project/[project-ref]`
- Or go to Settings → General → Reference ID

### Step 4: Review Migrations (Dry Run)

Before applying, see what will be executed:

```bash
supabase db push --dry-run
```

This shows:
- Which migrations will be applied
- SQL that will be executed
- Any potential issues

### Step 5: Apply Migrations

```bash
supabase db push
```

This will:
1. Check which migrations have already been applied
2. Apply only new migrations in order
3. Track migration history in `supabase_migrations` table
4. Report success or failure for each migration

### Step 6: Verify Migrations

```bash
# Check migration status
supabase db diff

# Should show: "No schema differences detected"
```

---

## Method 2: Manual SQL Execution

If you can't use the CLI, you can run migrations manually through the Supabase Dashboard.

### Step 1: Access SQL Editor

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar

### Step 2: Run Migrations in Order

For each migration file (in order):

1. Open the migration file from `backend/supabase/migrations/`
2. Copy the entire SQL content
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Verify the query succeeds (green checkmark)
6. Proceed to next migration

**Migration Order:**
```
1. 20260207000001_create_profiles_table.sql
2. 20260207000002_create_events_table.sql
3. 20260207000003_create_registrations_table.sql
4. 20260207000004_create_announcements_table.sql
5. 20260207000005_create_resources_table.sql
6. 20260207000006_create_sponsors_table.sql
7. 20260207000007_create_leaderboard_table.sql
8. 20260207000008_create_profile_trigger.sql
9. 20260207000009_enable_rls_policies.sql
10. 20260207000010_create_storage_buckets.sql
11. 20260207000011_enable_realtime.sql
```

### Step 3: Track Migration History (Optional)

Create a tracking table to record which migrations have been applied:

```sql
-- Create migration tracking table
CREATE TABLE IF NOT EXISTS supabase_migrations (
  version TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Record applied migrations
INSERT INTO supabase_migrations (version, name) VALUES
  ('20260207000001', 'create_profiles_table'),
  ('20260207000002', 'create_events_table'),
  ('20260207000003', 'create_registrations_table'),
  ('20260207000004', 'create_announcements_table'),
  ('20260207000005', 'create_resources_table'),
  ('20260207000006', 'create_sponsors_table'),
  ('20260207000007', 'create_leaderboard_table'),
  ('20260207000008', 'create_profile_trigger'),
  ('20260207000009', 'enable_rls_policies'),
  ('20260207000010', 'create_storage_buckets'),
  ('20260207000011', 'enable_realtime');
```

---

## Verification

After running migrations, verify everything is set up correctly.

### Verify Tables

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected tables:
-- announcements
-- events
-- leaderboard
-- profiles
-- registrations
-- resources
-- sponsors
```

### Verify Indexes

```sql
-- List all indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Expected indexes include:
-- idx_events_start_date
-- idx_registrations_event_id
-- idx_registrations_user_id
-- idx_announcements_created_at
-- idx_leaderboard_event_rank
-- Plus unique constraint indexes
```

### Verify Foreign Keys

```sql
-- List all foreign key constraints
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name;
```

### Verify RLS Policies

```sql
-- Check RLS is enabled on all tables
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- All tables should have rowsecurity = true

-- List all RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verify Storage Buckets

```sql
-- List storage buckets
SELECT 
  id,
  name,
  public
FROM storage.buckets
ORDER BY name;

-- Expected buckets:
-- avatars (public: true)
-- event-images (public: true)
-- sponsor-logos (public: true)
```

### Verify Triggers

```sql
-- List triggers
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Expected trigger:
-- on_auth_user_created on auth.users
```

### Verify Realtime

```sql
-- Check realtime publication
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
ORDER BY tablename;

-- Expected tables:
-- announcements
-- events
-- leaderboard
-- registrations
```

### Run Verification Tests

```bash
# Run database schema tests
cd backend
npm test lib/utils/database-schema.test.ts
npm test lib/utils/database-schema-validation.test.ts

# All tests should pass
```

---

## Troubleshooting

### Migration Fails: "relation already exists"

**Problem:** Table or index already exists

**Solution:**
```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'your_table_name'
);

-- If exists, either:
-- 1. Skip this migration (already applied)
-- 2. Drop and recreate (CAUTION: loses data)
DROP TABLE IF EXISTS your_table_name CASCADE;
```

### Migration Fails: "permission denied"

**Problem:** Insufficient database permissions

**Solution:**
- Ensure you're using the correct database credentials
- Check that the database user has CREATE permissions
- For Supabase, use the service role key for migrations

### Migration Fails: "foreign key constraint"

**Problem:** Referenced table doesn't exist yet

**Solution:**
- Ensure migrations are run in correct order
- Check that parent tables are created before child tables
- Review migration dependencies

### RLS Policies Not Working

**Problem:** Users can't access data despite correct policies

**Solution:**
```sql
-- Verify RLS is enabled
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Check policy definitions
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';

-- Test policy with specific user
SET ROLE authenticated;
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM your_table_name;
RESET ROLE;
```

### Storage Buckets Not Created

**Problem:** File uploads fail, buckets don't exist

**Solution:**
1. Go to Supabase Dashboard → Storage
2. Manually create buckets:
   - Name: `avatars`, Public: Yes
   - Name: `event-images`, Public: Yes
   - Name: `sponsor-logos`, Public: Yes
3. Apply storage policies from migration file

### Realtime Not Working

**Problem:** Subscriptions don't receive updates

**Solution:**
1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for tables:
   - events
   - registrations
   - announcements
   - leaderboard
3. Restart your application

---

## Rollback Procedures

### Using Supabase CLI

```bash
# Reset database to clean state (CAUTION: loses all data)
supabase db reset --linked

# Then re-apply migrations up to a specific point
# (Manual process - apply migrations one by one)
```

### Manual Rollback

Create rollback scripts for each migration:

**Example: Rollback profiles table**
```sql
-- Drop trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Drop table
DROP TABLE IF EXISTS profiles CASCADE;
```

**General rollback order:**
1. Drop dependent objects first (triggers, functions)
2. Drop tables in reverse order of creation
3. Drop indexes and constraints

### Restore from Backup

If rollback scripts aren't available:

1. Go to Supabase Dashboard → Settings → Database → Backups
2. Select backup point before migration
3. Click "Restore"
4. Wait for restoration to complete
5. Verify data integrity

---

## Creating New Migrations

When you need to modify the database schema:

### Step 1: Create Migration File

```bash
# Using Supabase CLI
supabase migration new your_migration_name

# Or manually create file
# Format: YYYYMMDDHHMMSS_description.sql
# Example: 20260208120000_add_user_bio_field.sql
```

### Step 2: Write Migration SQL

```sql
-- Add new column to profiles table
ALTER TABLE profiles 
ADD COLUMN bio TEXT;

-- Add index if needed
CREATE INDEX idx_profiles_bio ON profiles(bio);

-- Update RLS policies if needed
-- ...
```

### Step 3: Test in Development

```bash
# Apply migration to development database
supabase db push

# Verify changes
supabase db diff

# Test application functionality
npm run dev
npm test
```

### Step 4: Create Rollback Script

```sql
-- rollback_20260208120000_add_user_bio_field.sql
ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
DROP INDEX IF EXISTS idx_profiles_bio;
```

### Step 5: Document Migration

Add to migration file header:
```sql
-- Migration: Add bio field to profiles
-- Date: 2026-02-08
-- Author: Your Name
-- Description: Adds optional bio field for user profiles
-- Rollback: See rollback_20260208120000_add_user_bio_field.sql
```

### Step 6: Apply to Production

1. Backup production database
2. Test migration in staging (if available)
3. Schedule maintenance window (if needed)
4. Apply migration:
   ```bash
   supabase link --project-ref prod-project-ref
   supabase db push
   ```
5. Verify changes
6. Monitor for issues

---

## Best Practices

### Before Running Migrations

- ✅ Always backup production database
- ✅ Test migrations in development first
- ✅ Review migration SQL carefully
- ✅ Check for syntax errors
- ✅ Verify migration order
- ✅ Prepare rollback plan
- ✅ Schedule during low-traffic period
- ✅ Notify team of maintenance

### During Migration

- ✅ Run migrations in order
- ✅ Verify each migration succeeds before proceeding
- ✅ Monitor database performance
- ✅ Watch for errors in logs
- ✅ Keep team updated on progress

### After Migration

- ✅ Run verification queries
- ✅ Test application functionality
- ✅ Check RLS policies work
- ✅ Verify indexes are used
- ✅ Monitor performance
- ✅ Document any issues
- ✅ Update migration tracking

### Migration Guidelines

- ✅ Keep migrations small and focused
- ✅ One logical change per migration
- ✅ Use descriptive migration names
- ✅ Include comments in SQL
- ✅ Make migrations idempotent where possible
- ✅ Test rollback procedures
- ✅ Document breaking changes
- ✅ Version control all migrations

---

## Migration Checklist

### Pre-Migration
- [ ] Backup created
- [ ] Migration files reviewed
- [ ] Tested in development
- [ ] Rollback plan prepared
- [ ] Team notified
- [ ] Maintenance window scheduled (if needed)

### Migration Execution
- [ ] Migrations run in order
- [ ] Each migration verified
- [ ] No errors in logs
- [ ] Migration history tracked

### Post-Migration
- [ ] Verification queries run
- [ ] All tables exist
- [ ] All indexes exist
- [ ] RLS policies active
- [ ] Storage buckets created
- [ ] Realtime enabled
- [ ] Application tested
- [ ] Performance acceptable
- [ ] Team notified of completion

---

## Support

**Supabase Documentation:**
- Migrations: [supabase.com/docs/guides/cli/local-development](https://supabase.com/docs/guides/cli/local-development)
- SQL Editor: [supabase.com/docs/guides/database/overview](https://supabase.com/docs/guides/database/overview)

**Supabase Support:**
- Community: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- Email: support@supabase.io

---

**Migration Guide Version:** 1.0  
**Last Updated:** February 8, 2026  
**Database Schema Version:** 11 migrations
