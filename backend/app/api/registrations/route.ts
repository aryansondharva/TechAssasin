import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware/auth'
import { registrationCreateSchema } from '@/lib/validations/registration'
import { createRegistration } from '@/lib/services/registrations'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { ZodError } from 'zod'

/**
 * POST /api/registrations
 * Register for an event
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 12.8
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Check rate limit: 5 registrations per hour
    const rateLimit = checkRateLimit(user.id, 5, 60 * 60 * 1000)
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime)
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Too many registration attempts.',
          resetTime: resetDate.toISOString()
        },
        { status: 429 }
      )
    }
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = registrationCreateSchema.parse(body)
    
    // Check if registration is open for the event
    const supabase = await createClient()
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('registration_open')
      .eq('id', validatedData.event_id)
      .single()
    
    if (eventError) {
      if (eventError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        )
      }
      throw new Error(`Failed to get event: ${eventError.message}`)
    }
    
    if (!event.registration_open) {
      return NextResponse.json(
        { error: 'Registration is closed for this event' },
        { status: 400 }
      )
    }
    
    // Create registration with capacity check
    const registration = await createRegistration(user.id, validatedData)
    
    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }
      
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }
    
    console.error('POST /api/registrations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/registrations
 * Get current user's registrations across all events
 * Requirements: 5.8
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Get user's registrations with event details
    const supabase = await createClient()
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events:event_id (
          id,
          title,
          description,
          start_date,
          end_date,
          location,
          max_participants,
          registration_open,
          image_urls,
          prizes,
          themes
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      throw new Error(`Failed to get registrations: ${error.message}`)
    }
    
    return NextResponse.json(registrations || [])
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }
    }
    
    console.error('GET /api/registrations error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
