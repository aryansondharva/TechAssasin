-- Performance optimization migration
-- Add missing indexes and optimize query patterns
-- Requirements: 13.2

-- Add index on registrations.status for efficient filtering by status
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);

-- Add composite index on registrations(event_id, status) for counting confirmed registrations
CREATE INDEX IF NOT EXISTS idx_registrations_event_status ON public.registrations(event_id, status);

-- Add index on sponsors.tier for efficient ordering
CREATE INDEX IF NOT EXISTS idx_sponsors_tier ON public.sponsors(tier);

-- Add index on resources.created_at for efficient ordering
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- Add composite unique index on leaderboard(event_id, user_id) for efficient upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_event_user ON public.leaderboard(event_id, user_id);

-- Add index on events.registration_open for filtering open events
CREATE INDEX IF NOT EXISTS idx_events_registration_open ON public.events(registration_open);

-- Add index on announcements.author_id for efficient author lookups
CREATE INDEX IF NOT EXISTS idx_announcements_author_id ON public.announcements(author_id);

-- Add index on leaderboard.user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_user_id ON public.leaderboard(user_id);

-- Add comment
COMMENT ON INDEX idx_registrations_status IS 'Optimize filtering registrations by status';
COMMENT ON INDEX idx_registrations_event_status IS 'Optimize counting confirmed registrations per event';
COMMENT ON INDEX idx_sponsors_tier IS 'Optimize ordering sponsors by tier';
COMMENT ON INDEX idx_resources_created_at IS 'Optimize ordering resources by creation date';
COMMENT ON INDEX idx_leaderboard_event_user IS 'Optimize leaderboard upserts and prevent duplicates';
COMMENT ON INDEX idx_events_registration_open IS 'Optimize filtering events by registration status';
COMMENT ON INDEX idx_announcements_author_id IS 'Optimize author lookups for announcements';
COMMENT ON INDEX idx_leaderboard_user_id IS 'Optimize user-specific leaderboard queries';
