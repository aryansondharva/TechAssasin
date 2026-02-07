-- Create events table
-- This table stores hackathon event information

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER NOT NULL CHECK (max_participants > 0),
  registration_open BOOLEAN DEFAULT TRUE NOT NULL,
  image_urls TEXT[] DEFAULT '{}',
  prizes JSONB,
  themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on start_date for efficient date-based queries
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

-- Add comment to table
COMMENT ON TABLE public.events IS 'Hackathon events with details and registration settings';
