-- =====================================================
-- Initial Setup for Local PostgreSQL
-- This creates the necessary schemas and extensions
-- that Supabase provides by default
-- =====================================================

-- Create auth schema (Supabase authentication schema)
CREATE SCHEMA IF NOT EXISTS auth;

-- Create storage schema (Supabase storage schema)
CREATE SCHEMA IF NOT EXISTS storage;

-- Create extensions schema
CREATE SCHEMA IF NOT EXISTS extensions;

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA extensions;

-- Create auth.users table (simplified version of Supabase auth.users)
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    encrypted_password VARCHAR(255) NOT NULL,
    email_confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_sign_in_at TIMESTAMPTZ,
    raw_app_meta_data JSONB DEFAULT '{}'::jsonb,
    raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
    is_super_admin BOOLEAN DEFAULT FALSE,
    role VARCHAR(255) DEFAULT 'authenticated'
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON auth.users(email);

-- Create storage.buckets table (simplified version)
CREATE TABLE IF NOT EXISTS storage.buckets (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    owner UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    public BOOLEAN DEFAULT FALSE,
    avif_autodetection BOOLEAN DEFAULT FALSE,
    file_size_limit BIGINT,
    allowed_mime_types TEXT[]
);

-- Create storage.objects table (simplified version)
CREATE TABLE IF NOT EXISTS storage.objects (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    bucket_id TEXT REFERENCES storage.buckets(id),
    name TEXT NOT NULL,
    owner UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb,
    path_tokens TEXT[] GENERATED ALWAYS AS (string_to_array(name, '/')) STORED,
    UNIQUE(bucket_id, name)
);

-- Create public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO PUBLIC;
GRANT USAGE ON SCHEMA storage TO PUBLIC;
GRANT USAGE ON SCHEMA extensions TO PUBLIC;
GRANT USAGE ON SCHEMA public TO PUBLIC;

-- Grant permissions on auth.users
GRANT SELECT ON auth.users TO PUBLIC;

-- Create a function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auth.users updated_at
CREATE TRIGGER handle_auth_users_updated_at
    BEFORE UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Note: RLS (Row Level Security) policies will be created by subsequent migrations
-- For local development, we'll disable RLS by default and enable it per table as needed

COMMENT ON SCHEMA auth IS 'Authentication schema - contains user accounts';
COMMENT ON SCHEMA storage IS 'Storage schema - contains file storage metadata';
COMMENT ON TABLE auth.users IS 'User accounts table';
COMMENT ON TABLE storage.buckets IS 'Storage buckets for file organization';
COMMENT ON TABLE storage.objects IS 'Stored files metadata';
