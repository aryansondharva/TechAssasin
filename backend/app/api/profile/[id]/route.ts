import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types/database'

/**
 * GET /api/profile/[id]
 * Get specific user's public profile
 * Excludes sensitive fields for other users
 * Requirements: 3.6
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get Supabase client
    const supabase = await createClient()
    
    // Fetch user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching profile:', error)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    // Get current user to determine if this is their own profile
    const { data: { user } } = await supabase.auth.getUser()
    
    // If viewing own profile, return all fields
    if (user && user.id === id) {
      return NextResponse.json(profile as Profile)
    }
    
    // For other users, return public fields only (exclude is_admin)
    const publicProfile = {
      id: profile.id,
      username: profile.username,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      github_url: profile.github_url,
      skills: profile.skills,
      created_at: profile.created_at
    }
    
    return NextResponse.json(publicProfile)
  } catch (error) {
    console.error('Unexpected error in GET /api/profile/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
