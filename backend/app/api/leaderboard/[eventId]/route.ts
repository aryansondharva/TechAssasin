import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard } from '@/lib/services/leaderboard'
import { requireAuth } from '@/lib/middleware/auth'

/**
 * GET /api/leaderboard/[eventId]
 * Get leaderboard entries for an event with participant profile information
 * Requires authentication
 * Requirements: 10.3, 10.4, 10.5
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    // Verify authentication
    await requireAuth()
    
    const { eventId } = await params
    
    // Get leaderboard entries with user profiles
    const entries = await getLeaderboard(eventId)
    
    return NextResponse.json(entries)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }
    }
    
    console.error('GET /api/leaderboard/[eventId] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
