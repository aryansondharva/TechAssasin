-- Create helper functions for profile management
-- These functions simplify common profile operations

-- Function to get user profile with skills
CREATE OR REPLACE FUNCTION public.get_user_profile_with_skills(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  username TEXT,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  aadhaar_number TEXT,
  avatar_url TEXT,
  github_url TEXT,
  bio TEXT,
  address TEXT,
  education TEXT,
  university TEXT,
  graduation_year INTEGER,
  skills JSON,
  is_admin BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.full_name,
    p.email,
    p.phone,
    p.aadhaar_number,
    p.avatar_url,
    p.github_url,
    p.bio,
    p.address,
    p.education,
    p.university,
    p.graduation_year,
    COALESCE(
      json_agg(
        json_build_object(
          'skill_id', us.skill_id,
          'skill_name', s.name,
          'category', s.category,
          'proficiency_level', us.proficiency_level
        )
      ) FILTER (WHERE s.name IS NOT NULL), 
      '[]'::json
    ) as skills,
    p.is_admin,
    p.created_at,
    p.updated_at
  FROM public.profiles p
  LEFT JOIN public.user_skills us ON p.id = us.user_id
  LEFT JOIN public.skills s ON us.skill_id = s.id
  WHERE p.id = user_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user skills
CREATE OR REPLACE FUNCTION public.update_user_skills(user_uuid UUID, skill_data JSON)
RETURNS VOID AS $$
DECLARE
  skill_record JSON;
  skill_name TEXT;
  skill_id UUID;
  proficiency INTEGER;
BEGIN
  -- Remove existing skills
  DELETE FROM public.user_skills WHERE user_id = user_uuid;
  
  -- Add new skills from JSON data
  FOR skill_record IN SELECT * FROM json_array_elements(skill_data)
  LOOP
    skill_name := skill_record->>'name';
    proficiency := COALESCE((skill_record->>'proficiency')::INTEGER, 1);
    
    -- Get or create skill
    SELECT id INTO skill_id FROM public.skills WHERE name = skill_name;
    
    IF skill_id IS NULL THEN
      INSERT INTO public.skills (name) VALUES (skill_name) RETURNING id INTO skill_id;
    END IF;
    
    -- Add skill to user with proficiency level
    INSERT INTO public.user_skills (user_id, skill_id, proficiency_level) 
    VALUES (user_uuid, skill_id, proficiency);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate Aadhaar number format
CREATE OR REPLACE FUNCTION public.validate_aadhaar_number(aadhaar TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if Aadhaar follows XXXX-XXXX-XXXX format (12 digits with hyphens)
  RETURN aadhaar ~ '^\d{4}-\d{4}-\d{4}$';
END;
$$ LANGUAGE plpgsql;

-- Function to check if email is available (excluding current user)
CREATE OR REPLACE FUNCTION public.is_email_available(email TEXT, user_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF user_uuid IS NOT NULL THEN
    -- Check if email is available for current user (excluding their own)
    RETURN NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE email = email AND id != user_uuid
    );
  ELSE
    -- Check if email is available for new user
    RETURN NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE email = email
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if Aadhaar is available (excluding current user)
CREATE OR REPLACE FUNCTION public.is_aadhaar_available(aadhaar TEXT, user_uuid UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF user_uuid IS NOT NULL THEN
    -- Check if Aadhaar is available for current user (excluding their own)
    RETURN NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE aadhaar_number = aadhaar AND id != user_uuid
    );
  ELSE
    -- Check if Aadhaar is available for new user
    RETURN NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE aadhaar_number = aadhaar
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_profile_with_skills(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_skills(UUID, JSON) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_aadhaar_number(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_email_available(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_aadhaar_available(TEXT, UUID) TO authenticated;
