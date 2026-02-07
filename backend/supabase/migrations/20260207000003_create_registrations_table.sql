-- Create registrations table
-- This table stores user registrations for hackathon events

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  project_idea TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'waitlisted')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add unique constraint on (user_id, event_id) to prevent duplicate registrations
ALTER TABLE public.registrations 
  ADD CONSTRAINT registrations_user_event_unique UNIQUE (user_id, event_id);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON public.registrations(user_id);

-- Add comment to table
COMMENT ON TABLE public.registrations IS 'User registrations for hackathon events';
