-- Create user_skills junction table
-- This table links users to their skills with proficiency levels

CREATE TABLE IF NOT EXISTS public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  proficiency_level INTEGER DEFAULT 1 CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, skill_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON public.user_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_skill_id ON public.user_skills(skill_id);
CREATE INDEX IF NOT EXISTS idx_user_skills_proficiency ON public.user_skills(proficiency_level);

-- Add comment to table
COMMENT ON TABLE public.user_skills IS 'Junction table linking users to their skills';
COMMENT ON COLUMN public.user_skills.user_id IS 'Reference to user profile';
COMMENT ON COLUMN public.user_skills.skill_id IS 'Reference to skill';
COMMENT ON COLUMN public.user_skills.proficiency_level IS 'Skill proficiency level (1-5 scale)';
