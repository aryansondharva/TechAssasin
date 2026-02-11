-- Enhance profiles table for Edit Profile functionality
-- Adds additional fields for comprehensive user profiles

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS aadhaar_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS graduation_year INTEGER,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;

-- Create indexes for new fields
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_aadhaar ON public.profiles(aadhaar_number);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON public.profiles(updated_at);

-- Add comments to new columns
COMMENT ON COLUMN public.profiles.email IS 'User email address (unique)';
COMMENT ON COLUMN public.profiles.phone IS 'User phone number';
COMMENT ON COLUMN public.profiles.aadhaar_number IS 'Aadhaar number (unique, format: XXXX-XXXX-XXXX)';
COMMENT ON COLUMN public.profiles.bio IS 'User biography/description';
COMMENT ON COLUMN public.profiles.address IS 'User physical address';
COMMENT ON COLUMN public.profiles.education IS 'Highest education level';
COMMENT ON COLUMN public.profiles.university IS 'University/college name';
COMMENT ON COLUMN public.profiles.graduation_year IS 'Year of graduation';
COMMENT ON COLUMN public.profiles.updated_at IS 'Last profile update timestamp';

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON public.profiles;
CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();
