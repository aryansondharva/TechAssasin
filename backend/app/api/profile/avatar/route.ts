import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAuth, AuthenticationError } from '@/lib/middleware/auth'
import type { Profile } from '@/types/database'

/**
 * POST /api/profile/avatar
 * Upload avatar to Supabase Storage
 * Validates file type (jpg, png, webp) and size (< 2MB)
 * Stores file in avatars/{user_id}/ folder
 * Updates profile with avatar URL
 * Requirements: 3.3, 15.1, 15.2, 15.4, 15.5
 */
export async function POST(request: Request) {
  try {
    // Verify authentication
    const user = await requireAuth()
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be an image (jpg, png, or webp)' },
        { status: 400 }
      )
    }
    
    // Validate file size (< 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be under 2MB' },
        { status: 400 }
      )
    }
    
    // Get Supabase client
    const supabase = await createClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })
    
    if (uploadError) {
      console.error('Error uploading avatar:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      )
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    // Update profile with avatar URL
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('Error updating profile with avatar URL:', updateError)
      return NextResponse.json(
        { error: 'Failed to update profile with avatar URL' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      avatar_url: publicUrl,
      profile: updatedProfile as Profile
    })
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }
    
    console.error('Unexpected error in POST /api/profile/avatar:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
