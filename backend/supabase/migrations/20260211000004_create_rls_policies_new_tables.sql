-- Create RLS policies for new profile fields and tables
-- These policies ensure users can only access their own data

-- Enable RLS on skills table (read-only for all users)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_skills table
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Skills table policies (read-only for all authenticated users)
CREATE POLICY "Skills are viewable by everyone" ON public.skills
  FOR SELECT USING (auth.role() = 'authenticated');

-- User skills policies
CREATE POLICY "Users can view their own skills" ON public.user_skills
  FOR SELECT USING (user_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own skills" ON public.user_skills
  FOR INSERT WITH CHECK (user_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own skills" ON public.user_skills
  FOR UPDATE USING (user_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own skills" ON public.user_skills
  FOR DELETE USING (user_id = (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Enhanced profiles policies (update existing policies to handle new fields)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Admin policies (if not already exists)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
