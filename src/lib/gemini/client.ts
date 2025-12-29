import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

// Initialize the Gemini client
let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

// Get the Gemini Pro model for text generation
export function getGeminiProModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: 'gemini-1.5-pro' })
}

// Get the Gemini Pro Vision model for image understanding
export function getGeminiVisionModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: 'gemini-1.5-pro' })
}

// Get the Imagen model for image generation (when available)
export function getImagenModel(): GenerativeModel {
  return getGenAI().getGenerativeModel({ model: 'imagen-3.0-generate-002' })
}

// LAXMI Brand Context for consistent styling
export const LAXMI_BRAND_CONTEXT = `
You are a luxury interior design AI assistant for LAXMI, a premium Italian furniture consulting and boutique brand.

BRAND IDENTITY:
- LAXMI is named after the Hindu goddess of wealth, fortune, prosperity, beauty, and light
- Values: Professionalism, quality, authenticity, uniqueness, and Made in Italy
- Vision: Bring beauty, light, personality, and luxury into people's homes
- Aesthetic: Refined, elegant, timeless Italian craftsmanship

COLOR PALETTE:
- Primary Neutrals: Black (#000000), Espresso (#2E1E18), Bronze (#93694D), Champagne (#F5DBB9), Cream (#FFFAE7), Ivory (#FAF8F3)
- Accent Colors: Sage Green (#8B9B7A), Olive (#A4B494), Gold (#B8956E)
- Warm Taupes: (#9A8B7A), (#C4B8A9)

VISUAL STYLE:
- Organic flowing shapes and curves
- Generous negative space
- Thin gold decorative accent lines
- Arched architectural elements
- Soft natural lighting
- High-end Italian furniture pieces
- Plush fabrics: velvet, linen, silk
- Natural materials: marble, wood, brass
- Muted, sophisticated color tones

MOOD:
- Serene and tranquil
- Luxurious but not ostentatious
- Warm and inviting
- Timeless elegance
- Italian sophistication
`

// Image generation prompts optimized for LAXMI brand
export const IMAGE_PROMPT_TEMPLATES = {
  heroSection: (description: string) => `
    Create a stunning luxury interior design photograph for a high-end furniture brand.
    ${description}

    Style requirements:
    - Professional architectural photography style
    - Soft, warm natural lighting from large windows
    - Color palette: warm creams, ivory, sage green accents, bronze/gold details
    - Include elegant Italian furniture pieces
    - Arched doorways or windows if applicable
    - Clean, uncluttered composition with generous negative space
    - Plush textures: velvet sofas, linen curtains, marble surfaces
    - Plants and natural elements for warmth
    - Ultra high quality, 8K resolution, photorealistic
  `,

  productShowcase: (furnitureType: string, style: string) => `
    Create a professional product photography shot of a luxury ${furnitureType}.
    Style: ${style}

    Requirements:
    - Clean, neutral background (cream or soft gray)
    - Professional studio lighting with soft shadows
    - Show premium materials and craftsmanship details
    - Italian design aesthetic
    - Color palette aligned with warm neutrals and sage green
    - Ultra high quality, product photography style
  `,

  lifestyleScene: (room: string, mood: string) => `
    Create an aspirational lifestyle interior design photograph of a luxury ${room}.
    Mood: ${mood}

    Style requirements:
    - Magazine editorial quality
    - Italian villa or high-end apartment aesthetic
    - Warm natural light streaming through windows
    - Sage green velvet furniture pieces
    - Cream and ivory walls and fabrics
    - Bronze and gold accent details
    - Fresh flowers or greenery
    - Marble or travertine flooring
    - Architectural details: arches, moldings
    - Photorealistic, interior design magazine quality
  `,

  moodBoard: (theme: string) => `
    Create a sophisticated mood board collage for luxury interior design.
    Theme: ${theme}

    Include:
    - Material swatches (velvet, marble, brass)
    - Color palette samples (cream, sage, bronze)
    - Furniture silhouettes
    - Textile textures
    - Architectural details
    - Italian design elements
    - Elegant typography placeholder areas
    - Professional design presentation style
  `,
}

// Design improvement suggestions generator
export async function generateDesignSuggestions(
  currentDesign: string,
  context: string
): Promise<string> {
  const model = getGeminiProModel()

  const prompt = `
    ${LAXMI_BRAND_CONTEXT}

    As a luxury interior design consultant for LAXMI, analyze the following design context and provide specific improvement suggestions:

    Current Design: ${currentDesign}
    Context: ${context}

    Provide:
    1. 3-5 specific design improvements aligned with LAXMI's brand aesthetic
    2. Color and material recommendations
    3. Furniture placement suggestions
    4. Lighting recommendations
    5. Accessory and accent piece ideas

    Keep suggestions elegant, practical, and aligned with Italian luxury design principles.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Generate image prompt optimized for LAXMI brand
export async function generateOptimizedImagePrompt(
  userRequest: string,
  imageType: 'hero' | 'product' | 'lifestyle' | 'moodboard'
): Promise<string> {
  const model = getGeminiProModel()

  const prompt = `
    ${LAXMI_BRAND_CONTEXT}

    Create an optimized image generation prompt for the following request:
    "${userRequest}"

    Image Type: ${imageType}

    Generate a detailed, specific prompt that will create a stunning image perfectly aligned with LAXMI's luxury Italian furniture brand aesthetic.

    The prompt should:
    - Be highly detailed and specific
    - Include exact colors from the LAXMI palette
    - Specify lighting, mood, and atmosphere
    - Mention specific furniture styles and materials
    - Include technical quality requirements (8K, photorealistic, etc.)

    Return ONLY the optimized prompt, nothing else.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}

// Generate copy/text for website sections
export async function generateLuxuryCopy(
  section: string,
  context: string,
  tone: 'elegant' | 'warm' | 'professional' | 'poetic' = 'elegant'
): Promise<string> {
  const model = getGeminiProModel()

  const toneDescriptions = {
    elegant: 'sophisticated, refined, with understated luxury',
    warm: 'inviting, personal, creating emotional connection',
    professional: 'authoritative, trustworthy, expert',
    poetic: 'lyrical, evocative, painting pictures with words'
  }

  const prompt = `
    ${LAXMI_BRAND_CONTEXT}

    Write compelling website copy for LAXMI's ${section} section.

    Context: ${context}
    Tone: ${toneDescriptions[tone]}

    Requirements:
    - Align with LAXMI's luxury Italian furniture brand voice
    - Keep it concise but impactful
    - Use elegant, sophisticated language
    - Evoke feelings of beauty, quality, and Italian craftsmanship
    - Include subtle references to light, prosperity, and timeless design

    Return the copy text only, formatted appropriately for web use.
  `

  const result = await model.generateContent(prompt)
  return result.response.text()
}
