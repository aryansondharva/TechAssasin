-- Seed data for enhanced profile functionality
-- This migration creates sample data for testing the Edit Profile features

-- Note: This is for development/testing only
-- In production, users will be created through the auth system

-- Sample profile updates (assuming existing users)
-- This updates existing profiles with the new fields
UPDATE public.profiles SET 
  email = CASE 
    WHEN username = 'admin' THEN 'admin@techassassin.com'
    WHEN username = 'johndoe' THEN 'john.doe@example.com'
    WHEN username = 'janesmith' THEN 'jane.smith@example.com'
    WHEN username = 'mikejohnson' THEN 'mike.johnson@example.com'
    ELSE email
  END,
  phone = CASE 
    WHEN username = 'admin' THEN '+1 555-0100'
    WHEN username = 'johndoe' THEN '+1 555-0101'
    WHEN username = 'janesmith' THEN '+1 555-0102'
    WHEN username = 'mikejohnson' THEN '+1 555-0103'
    ELSE phone
  END,
  aadhaar_number = CASE 
    WHEN username = 'admin' THEN '1111-1111-1111'
    WHEN username = 'johndoe' THEN '2341-5678-9012'
    WHEN username = 'janesmith' THEN '3456-7890-1234'
    WHEN username = 'mikejohnson' THEN '4567-8901-2345'
    ELSE aadhaar_number
  END,
  bio = CASE 
    WHEN username = 'admin' THEN 'Platform administrator and hackathon organizer'
    WHEN username = 'johndoe' THEN 'Full-stack developer passionate about AI and machine learning'
    WHEN username = 'janesmith' THEN 'UI/UX designer with experience in mobile app development'
    WHEN username = 'mikejohnson' THEN 'Data scientist specializing in machine learning and analytics'
    ELSE bio
  END,
  address = CASE 
    WHEN username = 'admin' THEN '123 Admin Street, Tech City, CA 94000'
    WHEN username = 'johndoe' THEN '456 Developer Ave, San Francisco, CA 94102'
    WHEN username = 'janesmith' THEN '789 Design Blvd, Palo Alto, CA 94301'
    WHEN username = 'mikejohnson' THEN '321 Data Drive, Mountain View, CA 94043'
    ELSE address
  END,
  education = CASE 
    WHEN username = 'admin' THEN 'Master of Computer Science'
    WHEN username = 'johndoe' THEN 'Bachelor of Computer Science'
    WHEN username = 'janesmith' THEN 'Bachelor of Design'
    WHEN username = 'mikejohnson' THEN 'Master of Data Science'
    ELSE education
  END,
  university = CASE 
    WHEN username = 'admin' THEN 'Tech University'
    WHEN username = 'johndoe' THEN 'Tech University'
    WHEN username = 'janesmith' THEN 'Art Institute'
    WHEN username = 'mikejohnson' THEN 'Data University'
    ELSE university
  END,
  graduation_year = CASE 
    WHEN username = 'admin' THEN 2020
    WHEN username = 'johndoe' THEN 2024
    WHEN username = 'janesmith' THEN 2023
    WHEN username = 'mikejohnson' THEN 2022
    ELSE graduation_year
  END
WHERE username IN ('admin', 'johndoe', 'janesmith', 'mikejohnson');

-- Insert sample user skills
-- John Doe's skills
INSERT INTO public.user_skills (user_id, skill_id, proficiency_level)
SELECT 
  p.id,
  s.id,
  CASE s.name
    WHEN 'JavaScript' THEN 5
    WHEN 'React' THEN 5
    WHEN 'TypeScript' THEN 4
    WHEN 'Python' THEN 4
    WHEN 'Node.js' THEN 4
    WHEN 'PostgreSQL' THEN 3
    WHEN 'Docker' THEN 3
    ELSE 3
  END
FROM public.profiles p
CROSS JOIN public.skills s
WHERE p.username = 'johndoe'
AND s.name IN ('JavaScript', 'React', 'TypeScript', 'Python', 'Node.js', 'PostgreSQL', 'Docker')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Jane Smith's skills
INSERT INTO public.user_skills (user_id, skill_id, proficiency_level)
SELECT 
  p.id,
  s.id,
  CASE s.name
    WHEN 'UI/UX Design' THEN 5
    WHEN 'Figma' THEN 5
    WHEN 'Adobe XD' THEN 4
    WHEN 'HTML/CSS' THEN 4
    WHEN 'JavaScript' THEN 3
    WHEN 'Mobile Development' THEN 4
    WHEN 'iOS Development' THEN 3
    ELSE 3
  END
FROM public.profiles p
CROSS JOIN public.skills s
WHERE p.username = 'janesmith'
AND s.name IN ('UI/UX Design', 'Figma', 'Adobe XD', 'HTML/CSS', 'JavaScript', 'Mobile Development', 'iOS Development')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Mike Johnson's skills
INSERT INTO public.user_skills (user_id, skill_id, proficiency_level)
SELECT 
  p.id,
  s.id,
  CASE s.name
    WHEN 'Python' THEN 5
    WHEN 'Machine Learning' THEN 5
    WHEN 'Data Analysis' THEN 5
    WHEN 'SQL' THEN 4
    WHEN 'PostgreSQL' THEN 4
    WHEN 'Artificial Intelligence' THEN 4
    WHEN 'TensorFlow' THEN 4
    ELSE 3
  END
FROM public.profiles p
CROSS JOIN public.skills s
WHERE p.username = 'mikejohnson'
AND s.name IN ('Python', 'Machine Learning', 'Data Analysis', 'SQL', 'PostgreSQL', 'Artificial Intelligence', 'TensorFlow')
ON CONFLICT (user_id, skill_id) DO NOTHING;

-- Admin's skills (limited set)
INSERT INTO public.user_skills (user_id, skill_id, proficiency_level)
SELECT 
  p.id,
  s.id,
  4
FROM public.profiles p
CROSS JOIN public.skills s
WHERE p.username = 'admin'
AND s.name IN ('JavaScript', 'Python', 'Project Management', 'Product Management')
ON CONFLICT (user_id, skill_id) DO NOTHING;
