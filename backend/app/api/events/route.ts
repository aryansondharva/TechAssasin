import { NextRequest, NextResponse } from 'next/server'
import { listEvents } from '@/lib/services/events'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'
import { eventCreateSchema } from '@/lib/validations/event'
import { ZodError } from 'zod'

/**
 * GET /api/events
 * List events with optional status filter and pagination
 * Requirements: 4.6, 4.7, 4.8, 13.3
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as 'live' | 'upcoming' | 'past' | null
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }
    
    // Validate status if provided
    if (status && !['live', 'upcoming', 'past'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status filter. Must be live, upcoming, or past' },
        { status: 400 }
      )
    }
    
    const { events, total } = await listEvents({
      status: status || undefined,
      page,
      limit
    })
    
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    console.error('GET /api/events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/events
 * Create a new event (admin only)
 * Requirements: 4.1, 4.3, 4.5
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Verify admin privileges
    await requireAdmin(user.id)
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = eventCreateSchema.parse(body)
    
    // Create event in database
    const supabase = await createClient()
    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        start_date: validatedData.start_date,
        end_date: validatedData.end_date,
        location: validatedData.location,
        max_participants: validatedData.max_participants,
        registration_open: validatedData.registration_open,
        prizes: validatedData.prizes || null,
        themes: validatedData.themes || [],
        image_urls: []
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to create event: ${error.message}`)
    }
    
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
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
      
      if (error.message.includes('Admin access required')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }
    }
    
    console.error('POST /api/events error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
