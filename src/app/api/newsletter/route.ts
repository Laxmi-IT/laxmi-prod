import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'
import { checkRateLimit, getClientIp } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting: 3 requests per 10 minutes per IP ──
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`newsletter:${clientIp}`, 3, 10 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const { email, locale } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Stricter email regex (reject CRLF, consecutive dots, etc.)
    const emailRegex = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]{2,}$/
    if (!emailRegex.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const supabase = createPublicClient()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        locale: locale === 'en' ? 'en' : 'it',
      })

    if (error) {
      // Unique constraint violation = already subscribed
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadySubscribed: true })
      }
      console.error('Newsletter signup error:', error.code)
      return NextResponse.json(
        { error: 'Could not process subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Could not process subscription' },
      { status: 500 }
    )
  }
}
