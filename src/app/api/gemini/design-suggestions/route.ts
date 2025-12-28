import { NextRequest, NextResponse } from 'next/server'
import { generateDesignSuggestions } from '@/lib/gemini/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentDesign, context } = body

    if (!currentDesign) {
      return NextResponse.json(
        { error: 'currentDesign is required' },
        { status: 400 }
      )
    }

    const suggestions = await generateDesignSuggestions(
      currentDesign,
      context || 'General interior design improvement'
    )

    return NextResponse.json({
      success: true,
      suggestions,
    })
  } catch (error) {
    console.error('Error generating design suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate design suggestions' },
      { status: 500 }
    )
  }
}
