export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { insertSupportMessage, SupportMessageInput } from '@/lib/supabase'
import nodemailer from 'nodemailer'

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
    const inserted = Array.isArray(result) && result.length > 0 ? result[0] : null

    // Attempt to send notification emails (best-effort; do not block success response)
    const smtpHost = process.env.SMTP_HOST
    const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined
    // Prefer authenticated user as From to avoid DMARC rejections (especially with Gmail)
    const emailFrom = (process.env.EMAIL_FROM && process.env.EMAIL_FROM.trim().length > 0)
      ? process.env.EMAIL_FROM
      : smtpUser || 'footsteps.space@gmail.com'

    let emailStatus: 'sent' | 'skipped' | 'failed' = 'skipped'

    if (smtpHost && smtpPort && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure ?? (smtpPort === 465),
          auth: { user: smtpUser, pass: smtpPass },
        })

        const ticketId = inserted?.id || ''
        const createdAt = inserted?.created_at || new Date().toISOString()

        const internalMail = transporter.sendMail({
          from: emailFrom,
          to: 'footsteps.space@gmail.com',
          subject: `New Support Message${ticketId ? ` (#${ticketId})` : ''}`,
          text: `New support message\n\nName: ${payload.name}\nEmail: ${payload.email}\nCategory: ${payload.category}\nCreated: ${createdAt}\n\nMessage:\n${payload.message}`,
        })

        const userAck = transporter.sendMail({
          from: emailFrom,
          to: payload.email,
          subject: 'We received your message – Footsteps',
          text: `Hi ${payload.name || ''},\n\nThanks for reaching out to Footsteps. We received your message and will get back to you shortly (usually within 24–48 hours).\n\nSummary:\n- Category: ${payload.category}\n- Submitted: ${new Date(createdAt).toLocaleString()}${ticketId ? `\n- Reference: ${ticketId}` : ''}\n\nYour message:\n${payload.message}\n\n— Footsteps Team\nfootsteps.space@gmail.com`,
        })

        await Promise.allSettled([internalMail, userAck])
        emailStatus = 'sent'
      } catch (e) {
        console.error('Email notification failed:', e)
        emailStatus = 'failed'
      }
    }

    return NextResponse.json({ success: true, message: 'Thanks! Your message was sent.', data: result, emailStatus })
  } catch (error) {
    console.error('Support submission error:', error)
    return NextResponse.json({ success: false, message: 'Failed to submit support message.' }, { status: 500 })
  }
}


