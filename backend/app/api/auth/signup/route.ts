import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { signupSchema } from '@/lib/validations/auth'
import { handleApiError } from '@/lib/errors'

/**
 * POST /api/auth/signup
 * Create new user account with email and password
 * Automatically creates profile via database trigger
 * Requirements: 2.1, 2.2
 */
export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const { email, password } = signupSchema.parse(body)
    
    // Get Supabase client
    const supabase = await createClient()
    
    // Create user account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    })
    
    if (error) {
      // Handle specific Supabase Auth errors
      if (error.message.includes('already registered')) {
        throw new Error('Email already registered')
      }
      if (error.message.includes('password')) {
        throw new Error('Password does not meet requirements')
      }
      throw new Error(`Signup failed: ${error.message}`)
    }
    
    if (!data.user) {
      throw new Error('Signup failed: No user data returned')
    }
    
    // Return user and session
    return NextResponse.json(
      {
        user: data.user,
        session: data.session
      },
      { status: 201 }
    )
  } catch (error) {
    return handleApiError(error)
  }
}
