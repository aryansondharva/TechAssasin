import { NextRequest, NextResponse } from 'next/server'
import { getEventById } from '@/lib/services/events'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'
import { eventUpdateSchema } from '@/lib/validations/event'
import { ZodError } from 'zod'

/**
 * GET /api/events/[id]
 * Get single event by ID with participant count and status
 * Requirements: 4.7, 4.8, 12.5
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const event = await getEventById(id)
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(event)
  } catch (error) {
    console.error('GET /api/events/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/events/[id]
 * Update an event (admin only)
 * Requirements: 4.1, 4.3, 4.5
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verify authentication
    const user = await requireAuth()
    
    // Verify admin privileges
    await requireAdmin(user.id)
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = eventUpdateSchema.parse(body)
    
    // Check if event exists
    const existingEvent = await getEventById(id)
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    // Update event in database
    const supabase = await createClient()
    const { data: event, error } = await supabase
      .from('events')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to update event: ${error.message}`)
    }
    
    return NextResponse.json(event)
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
      
      if (error.message.includes('Admin access required')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }
    }
    
    console.error('PATCH /api/events/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/events/[id]
 * Delete an event (admin only, cascade deletes registrations)
 * Requirements: 4.4, 4.5
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verify authentication
    const user = await requireAuth()
    
    // Verify admin privileges
    await requireAdmin(user.id)
    
    // Check if event exists
    const existingEvent = await getEventById(id)
    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }
    
    // Delete event (cascade will delete registrations)
    const supabase = await createClient()
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to delete event: ${error.message}`)
    }
    
    return NextResponse.json(
      { message: 'Event deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
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
    
    console.error('DELETE /api/events/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
