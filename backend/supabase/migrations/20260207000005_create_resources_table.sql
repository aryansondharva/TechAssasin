-- Create resources table
-- This table stores educational resources like guides and templates

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content_url TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on category for efficient filtering
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);

-- Add comment to table
COMMENT ON TABLE public.resources IS 'Educational resources and learning materials';
