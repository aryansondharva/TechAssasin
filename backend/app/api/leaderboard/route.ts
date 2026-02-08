import { NextRequest, NextResponse } from 'next/server'
import { upsertLeaderboardEntry } from '@/lib/services/leaderboard'
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'
import { leaderboardUpdateSchema } from '@/lib/validations/leaderboard'
import { ZodError } from 'zod'

/**
 * POST /api/leaderboard
 * Create or update a leaderboard entry (admin only)
 * Upserts the entry and recalculates ranks for the event
 * Requirements: 10.1, 10.2, 10.6
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Verify admin privileges
    await requireAdmin(user.id)
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = leaderboardUpdateSchema.parse(body)
    
    // Upsert leaderboard entry and recalculate ranks
    const entry = await upsertLeaderboardEntry(validatedData)
    
    return NextResponse.json(entry, { status: 201 })
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
    
    console.error('POST /api/leaderboard error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
