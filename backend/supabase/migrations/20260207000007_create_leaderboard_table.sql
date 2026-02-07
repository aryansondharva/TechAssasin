-- Create leaderboard table
-- This table stores scoring and rankings for hackathon events

CREATE TABLE IF NOT EXISTS public.leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
  rank INTEGER NOT NULL DEFAULT 0 CHECK (rank >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create composite index on (event_id, rank) for efficient leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_event_rank ON public.leaderboard(event_id, rank);

-- Add comment to table
COMMENT ON TABLE public.leaderboard IS 'Event leaderboard with participant scores and rankings';
