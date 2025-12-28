import { NextRequest, NextResponse } from 'next/server'
import { generateLuxuryCopy } from '@/lib/gemini/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, context, tone = 'elegant' } = body

    if (!section) {
      return NextResponse.json(
        { error: 'section is required' },
        { status: 400 }
      )
    }

    const validTones = ['elegant', 'warm', 'professional', 'poetic'] as const
    const selectedTone = validTones.includes(tone) ? tone : 'elegant'

    const copy = await generateLuxuryCopy(section, context || '', selectedTone)

    return NextResponse.json({
      success: true,
      copy,
      section,
      tone: selectedTone,
    })
  } catch (error) {
    console.error('Error generating copy:', error)
    return NextResponse.json(
      { error: 'Failed to generate copy' },
      { status: 500 }
    )
  }
}
