import { NextRequest, NextResponse } from 'next/server'
import { generateDesignSuggestions } from '@/lib/gemini/client'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, truncate } from '@/lib/security'

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
    const rl = checkRateLimit(`gemini-design:${clientIp}`, 20, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const { currentDesign, context } = body

    if (!currentDesign || typeof currentDesign !== 'string') {
      return NextResponse.json(
        { error: 'currentDesign is required' },
        { status: 400 }
      )
    }

    const suggestions = await generateDesignSuggestions(
      truncate(currentDesign, 3000),
      truncate(context || 'General interior design improvement', 2000)
    )

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error('Error generating design suggestions:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'Failed to generate design suggestions' },
      { status: 500 }
    )
  }
}
