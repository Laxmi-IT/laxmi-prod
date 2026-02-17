import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient } from '@/lib/supabase/public'

export async function POST(request: NextRequest) {
  try {
    const { email, locale } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
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
      console.error('Newsletter signup error:', error)
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
