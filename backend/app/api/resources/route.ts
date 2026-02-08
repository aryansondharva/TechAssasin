import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, requireAdmin, AuthenticationError, AuthorizationError } from '@/lib/middleware/auth'
import { resourceCreateSchema } from '@/lib/validations/resource'
import { ZodError } from 'zod'

/**
 * GET /api/resources
 * List resources with optional category filter
 * Supports pagination
 * Orders by created_at DESC
 * Requirements: 8.5, 8.6, 8.7, 13.3
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth()
    
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 50' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit
    
    // Build query with optional category filter
    let countQuery = supabase
      .from('resources')
      .select('*', { count: 'exact', head: true })
    
    let dataQuery = supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    // Apply category filter if provided
    if (category) {
      countQuery = countQuery.eq('category', category)
      dataQuery = dataQuery.eq('category', category)
    }
    
    // Get total count
    const { count, error: countError } = await countQuery
    
    if (countError) {
      throw new Error(`Failed to count resources: ${countError.message}`)
    }
    
    // Fetch resources
    const { data: resources, error } = await dataQuery
    
    if (error) {
      throw new Error(`Failed to fetch resources: ${error.message}`)
    }
    
    const total = count || 0
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      data: resources,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    console.error('GET /api/resources error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/resources
 * Create a new resource (admin only)
 * Requirements: 8.1, 8.2, 8.4
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Verify admin privileges
    await requireAdmin(user.id)
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = resourceCreateSchema.parse(body)
    
    // Create resource in database
    const supabase = await createClient()
    const { data: resource, error } = await supabase
      .from('resources')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        content_url: validatedData.content_url,
        category: validatedData.category
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to create resource: ${error.message}`)
    }
    
    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      )
    }
    
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }
    
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }
    
    console.error('POST /api/resources error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
