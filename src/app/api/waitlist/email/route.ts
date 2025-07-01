import { insertWaitlistData, WaitlistData } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        message: 'Email is required' 
      }, { status: 400 })
    }

    // Prepare data for database - email only
    const waitlistData: WaitlistData = {
      email,
      suggested_feature: null,
      comments: null
    }

    // Insert data into Supabase
    const result = await insertWaitlistData(waitlistData)

    return NextResponse.json({ 
      success: true, 
      message: 'Email captured successfully',
      data: result
    })

  } catch (error) {
    console.error('Email submission error:', error)
    
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to save email. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 