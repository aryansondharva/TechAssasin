-- Create skills table for user skill management
-- This table stores available skills that users can associate with their profiles

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skills_name ON public.skills(name);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);

-- Add comment to table
COMMENT ON TABLE public.skills IS 'Available skills that users can associate with their profiles';
COMMENT ON COLUMN public.skills.name IS 'Skill name (unique)';
COMMENT ON COLUMN public.skills.category IS 'Skill category (e.g., Programming, Design, Business)';

-- Insert default skills
INSERT INTO public.skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'Programming'),
('TypeScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('C++', 'Programming'),
('C#', 'Programming'),
('Go', 'Programming'),
('Rust', 'Programming'),
('PHP', 'Programming'),
('Ruby', 'Programming'),

-- Frontend Technologies
('React', 'Programming'),
('Vue.js', 'Programming'),
('Angular', 'Programming'),
('Next.js', 'Programming'),
('HTML/CSS', 'Programming'),
('Tailwind CSS', 'Programming'),
('SASS', 'Programming'),

-- Backend Technologies
('Node.js', 'Programming'),
('Express.js', 'Programming'),
('Django', 'Programming'),
('Flask', 'Programming'),
('Spring Boot', 'Programming'),
('Laravel', 'Programming'),
('Rails', 'Programming'),

-- Databases
('PostgreSQL', 'Programming'),
('MySQL', 'Programming'),
('MongoDB', 'Programming'),
('Redis', 'Programming'),
('SQLite', 'Programming'),

-- Cloud & DevOps
('AWS', 'Programming'),
('Google Cloud', 'Programming'),
('Azure', 'Programming'),
('Docker', 'Programming'),
('Kubernetes', 'Programming'),
('CI/CD', 'Programming'),
('Terraform', 'Programming'),

-- Mobile Development
('Mobile Development', 'Programming'),
('iOS Development', 'Programming'),
('Android Development', 'Programming'),
('React Native', 'Programming'),
('Flutter', 'Programming'),
('Swift', 'Programming'),
('Kotlin', 'Programming'),

-- Design
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Adobe XD', 'Design'),
('Sketch', 'Design'),
('Photoshop', 'Design'),
('Illustrator', 'Design'),

-- Business & Management
('Product Management', 'Business'),
('Marketing', 'Business'),
('Business Development', 'Business'),
('Data Analysis', 'Business'),
('Project Management', 'Business'),

-- AI & Machine Learning
('Machine Learning', 'Programming'),
('Artificial Intelligence', 'Programming'),
('Deep Learning', 'Programming'),
('TensorFlow', 'Programming'),
('PyTorch', 'Programming'),
('Data Science', 'Programming'),

-- Blockchain & Web3
('Blockchain', 'Programming'),
('Web3', 'Programming'),
('Solidity', 'Programming'),
('DeFi', 'Programming'),
('NFT', 'Programming'),
('DAO', 'Programming')
ON CONFLICT (name) DO NOTHING;
