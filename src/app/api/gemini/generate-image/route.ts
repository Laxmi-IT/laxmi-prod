import { NextRequest, NextResponse } from 'next/server'
import {
  getImagenModel,
  generateOptimizedImagePrompt,
  IMAGE_PROMPT_TEMPLATES,
} from '@/lib/gemini/client'

export async function POST(request: NextRequest) {
  try {
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

    let finalPrompt = prompt

    // Use template if provided
    if (template && templateParams) {
      switch (template) {
        case 'hero':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.heroSection(templateParams.description || '')
          break
        case 'product':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.productShowcase(
            templateParams.furnitureType || 'sofa',
            templateParams.style || 'modern Italian'
          )
          break
        case 'lifestyle':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.lifestyleScene(
            templateParams.room || 'living room',
            templateParams.mood || 'serene luxury'
          )
          break
        case 'moodboard':
          finalPrompt = IMAGE_PROMPT_TEMPLATES.moodBoard(templateParams.theme || 'Italian luxury')
          break
      }
    }

    // Optimize prompt with Gemini Pro if requested
    if (optimizePrompt && prompt) {
      finalPrompt = await generateOptimizedImagePrompt(prompt, imageType)
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
      // If Imagen is not available, return the optimized prompt for external use
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
    console.error('Error generating image:', error)

    // Return optimized prompt even on error
    const body = await request.clone().json().catch(() => ({}))
    const prompt = body.prompt || ''

    return NextResponse.json({
      success: false,
      error: 'Image generation failed',
      fallbackPrompt: prompt,
      message: 'Use the fallbackPrompt with an external image generation service like Midjourney or DALL-E',
    }, { status: 500 })
  }
}
