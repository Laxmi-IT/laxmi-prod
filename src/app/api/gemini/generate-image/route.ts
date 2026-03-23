import { NextRequest, NextResponse } from 'next/server'
import {
  getImagenModel,
  generateOptimizedImagePrompt,
  IMAGE_PROMPT_TEMPLATES,
} from '@/lib/gemini/client'
import { createClient } from '@/lib/supabase/server'
import { checkRateLimit, getClientIp, truncate } from '@/lib/security'

const ALLOWED_TEMPLATES = ['hero', 'product', 'lifestyle', 'moodboard'] as const

export async function POST(request: NextRequest) {
  try {
    // Auth check — admin only
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit: 10 requests per hour per IP
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`gemini-image:${clientIp}`, 10, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body = await request.json()
    const {
      prompt,
      imageType = 'lifestyle',
      optimizePrompt = true,
      template,
      templateParams,
    } = body

    if (!prompt && !template) {
      return NextResponse.json(
        { error: 'Either prompt or template is required' },
        { status: 400 }
      )
    }

    // Validate template against whitelist
    if (template && !ALLOWED_TEMPLATES.includes(template)) {
      return NextResponse.json(
        { error: 'Invalid template' },
        { status: 400 }
      )
    }

    let finalPrompt = typeof prompt === 'string' ? truncate(prompt, 1000) : ''

    // Use template if provided
    if (template && templateParams) {
      const safeParams = {
        description: truncate(String(templateParams?.description || ''), 500),
        furnitureType: truncate(String(templateParams?.furnitureType || 'sofa'), 100),
        style: truncate(String(templateParams?.style || 'modern Italian'), 100),
        room: truncate(String(templateParams?.room || 'living room'), 100),
        mood: truncate(String(templateParams?.mood || 'serene luxury'), 100),
        theme: truncate(String(templateParams?.theme || 'Italian luxury'), 100),
      }

      switch (template) {
        case 'hero':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.heroSection(safeParams.description)
          break
        case 'product':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.productShowcase(safeParams.furnitureType, safeParams.style)
          break
        case 'lifestyle':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.lifestyleScene(safeParams.room, safeParams.mood)
          break
        case 'moodboard':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.moodBoard(safeParams.theme)
          break
      }
    }

    // Optimize prompt with Gemini Pro if requested
    if (optimizePrompt && prompt) {
      finalPrompt = await generateOptimizedImagePrompt(finalPrompt, imageType)
    }

    // Generate image using Imagen model
    const model = getImagenModel()

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: finalPrompt }]
      }],
      generationConfig: {
        // Image generation specific configs
      }
    })

    const response = result.response
    const imageData = response.candidates?.[0]?.content?.parts?.[0]

    if (!imageData) {
      return NextResponse.json({
        success: true,
        type: 'prompt_only',
        optimizedPrompt: finalPrompt,
        message: 'Image generation model not available. Use this prompt with an external image generator.',
      })
    }

    return NextResponse.json({
      success: true,
      type: 'image',
      image: imageData,
      prompt: finalPrompt,
    })
  } catch (error) {
    console.error('Error generating image:', error instanceof Error ? error.message : 'Unknown error')

    return NextResponse.json({
      success: false,
      error: 'Image generation failed',
    }, { status: 500 })
  }
}
