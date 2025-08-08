import { NextRequest, NextResponse } from 'next/server'
import { insertSupportMessage, SupportMessageInput } from '@/lib/supabase'

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, category, message }: Partial<SupportMessageInput> = body || {}

    if (!name || name.trim().length === 0 || name.length > 120) {
      return NextResponse.json({ success: false, message: 'Name is required (max 120 chars).' }, { status: 400 })
    }
    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ success: false, message: 'A valid email is required.' }, { status: 400 })
    }
    if (!category || !['bug', 'feedback', 'account', 'other'].includes(category)) {
      return NextResponse.json({ success: false, message: 'Category must be one of bug, feedback, account, other.' }, { status: 400 })
    }
    if (!message || message.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Message is required (min 10 chars).' }, { status: 400 })
    }

    const payload: SupportMessageInput = {
      name: name.trim(),
      email: email.trim(),
      category,
      message: message.trim(),
      user_agent: request.headers.get('user-agent'),
      page_url: request.headers.get('referer') || null,
    }

    const result = await insertSupportMessage(payload)

    return NextResponse.json({ success: true, message: 'Thanks! Your message was sent.', data: result })
  } catch (error) {
    console.error('Support submission error:', error)
    return NextResponse.json({ success: false, message: 'Failed to submit support message.' }, { status: 500 })
  }
}


