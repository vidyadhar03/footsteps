import { insertWaitlistData, WaitlistData } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, selectedFeatures, comments } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email is required' 
      }, { status: 400 })
    }

    // Prepare data for database
    const waitlistData: WaitlistData = {
      email,
      suggested_feature: selectedFeatures && selectedFeatures.length > 0 ? selectedFeatures : null,
      comments: comments || null
    }

    // Insert data into Supabase
    const result = await insertWaitlistData(waitlistData)

    return NextResponse.json({ 
      success: true, 
      message: 'Successfully joined the waitlist!',
      data: result
    })

  } catch (error) {
    console.error('Waitlist submission error:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to join waitlist. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 