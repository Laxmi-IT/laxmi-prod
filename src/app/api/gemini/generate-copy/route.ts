import { NextRequest, NextResponse } from 'next/server'
import { generateLuxuryCopy } from '@/lib/gemini/client'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, truncate } from '@/lib/security'

const ALLOWED_SECTIONS = [
  'hero', 'about', 'services', 'consulting', 'collections',
  'gallery', 'contact', 'blog', 'footer', 'cta', 'values',
  'booking', 'newsletter', 'testimonials', 'faq',
] as const

export async function POST(request: NextRequest) {
  try {
    // Auth check — admin only
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 20 requests per hour per IP
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`gemini-copy:${clientIp}`, 20, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { section, context, tone = 'elegant' } = body

    if (!section || typeof section !== 'string') {
      return NextResponse.json(
        { error: 'section is required' },
        { status: 400 }
      )
    }

    // Validate section against whitelist
    if (!ALLOWED_SECTIONS.includes(section as any)) {
      return NextResponse.json(
        { error: 'Invalid section' },
        { status: 400 }
      )
    }

    const validTones = ['elegant', 'warm', 'professional', 'poetic'] as const
    const selectedTone = validTones.includes(tone) ? tone : 'elegant'

    // Truncate context to prevent abuse
    const safeContext = typeof context === 'string' ? truncate(context, 2000) : ''

    const copy = await generateLuxuryCopy(section, safeContext, selectedTone)

    return NextResponse.json({
      success: true,
      copy,
      section,
      tone: selectedTone,
    })
  } catch (error) {
    console.error('Error generating copy:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to generate copy' },
      { status: 500 }
    )
  }
}
