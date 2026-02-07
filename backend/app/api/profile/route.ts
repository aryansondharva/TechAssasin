import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, AuthenticationError } from '@/lib/middleware/auth'
import { profileUpdateSchema } from '@/lib/validations/profile'
import { ZodError } from 'zod'
import type { Profile } from '@/types/database'

/**
 * GET /api/profile
 * Get current user's profile with all fields
 * Requirements: 3.5
 */
export async function GET() {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Get Supabase client
    const supabase = await createClient()
    
    // Fetch user's profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (error) {
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
    
    return NextResponse.json(profile as Profile)
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    console.error('Unexpected error in GET /api/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/profile
 * Update current user's profile
 * Validates input with profileUpdateSchema
 * Checks username uniqueness
 * Prevents is_admin modification
 * Requirements: 3.1, 3.2, 3.4, 3.7
 */
export async function PATCH(request: Request) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Parse and validate request body
    const body = await request.json()
    
    // Validate input with Zod schema
    const validatedData = profileUpdateSchema.parse(body)
    
    // Prevent is_admin modification
    if ('is_admin' in body) {
      return NextResponse.json(
        { error: 'Cannot modify admin status' },
        { status: 403 }
      )
    }
    
    // Get Supabase client
    const supabase = await createClient()
    
    // If username is being updated, check uniqueness
    if (validatedData.username) {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', validatedData.username)
        .neq('id', user.id)
        .single()
      
      if (existingProfile) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        )
      }
    }
    
    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(validatedData)
      .eq('id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(updatedProfile as Profile)
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error in PATCH /api/profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
