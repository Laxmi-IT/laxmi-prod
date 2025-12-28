# LAXMI Gemini Design Skill

Use this skill when asked to generate luxury interior design images, improve page designs, or create compelling visual content for the LAXMI website. This skill leverages Google's Gemini AI with LAXMI's brand context.

## Available Capabilities

### 1. Image Generation
Generate luxury interior design images aligned with LAXMI's Italian furniture aesthetic.

**API Endpoint**: `POST /api/gemini/generate-image`

```typescript
// Request body
{
  prompt: string,           // Custom image description
  imageType?: 'hero' | 'product' | 'lifestyle' | 'moodboard',
  optimizePrompt?: boolean, // Use Gemini to enhance prompt (default: true)
  template?: 'hero' | 'product' | 'lifestyle' | 'moodboard',
  templateParams?: {
    description?: string,   // For hero template
    furnitureType?: string, // For product template
    style?: string,         // For product template
    room?: string,          // For lifestyle template
    mood?: string,          // For lifestyle template
    theme?: string          // For moodboard template
  }
}
```

### 2. Design Suggestions
Get AI-powered design improvement suggestions for any interior space.

**API Endpoint**: `POST /api/gemini/design-suggestions`

```typescript
// Request body
{
  currentDesign: string,  // Description of current design
  context: string         // What improvement is needed
}
```

### 3. Copy Generation
Generate luxury brand copy for website sections.

**API Endpoint**: `POST /api/gemini/generate-copy`

```typescript
// Request body
{
  section: string,                                      // Website section name
  context: string,                                      // Context for the copy
  tone?: 'elegant' | 'warm' | 'professional' | 'poetic' // Default: 'elegant'
}
```

## LAXMI Brand Guidelines

When generating content, always align with these brand values:

### Brand Identity
- Named after the Hindu goddess of wealth, fortune, prosperity, beauty, and light
- Luxury Furniture Consulting & Boutique Reseller
- Made in Italy focus
- Values: Professionalism, quality, authenticity, uniqueness

### Color Palette
- **Primary Neutrals**: Black (#000000), Espresso (#2E1E18), Bronze (#93694D), Champagne (#F5DBB9), Cream (#FFFAE7), Ivory (#FAF8F3)
- **Accent Colors**: Sage Green (#8B9B7A), Olive (#A4B494), Gold (#B8956E)
- **Warm Taupes**: #9A8B7A, #C4B8A9

### Visual Style
- Organic flowing shapes and curves
- Generous negative space
- Thin gold decorative accent lines
- Arched architectural elements
- Soft natural lighting
- High-end Italian furniture pieces
- Plush fabrics: velvet, linen, silk
- Natural materials: marble, wood, brass

### Mood
- Serene and tranquil
- Luxurious but not ostentatious
- Warm and inviting
- Timeless elegance
- Italian sophistication

## Usage Examples

### Generate Hero Image
```typescript
const response = await fetch('/api/gemini/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: 'hero',
    templateParams: {
      description: 'Elegant Italian living room with sage velvet sofa and marble coffee table'
    }
  })
});
```

### Get Design Suggestions
```typescript
const response = await fetch('/api/gemini/design-suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentDesign: 'Modern minimalist living room with white walls and basic furniture',
    context: 'Transform into luxury Italian aesthetic'
  })
});
```

### Generate Website Copy
```typescript
const response = await fetch('/api/gemini/generate-copy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    section: 'About Us',
    context: 'Company history and Italian craftsmanship focus',
    tone: 'elegant'
  })
});
```

## Image Prompt Templates

The skill includes pre-built templates optimized for LAXMI:

1. **Hero Section**: Stunning luxury interior photographs for main banners
2. **Product Showcase**: Professional product photography for furniture pieces
3. **Lifestyle Scene**: Aspirational room settings showing furniture in context
4. **Mood Board**: Design collages for presentations and inspiration

## Important Notes

- The Gemini API key is stored in `.env.local` as `GEMINI_API_KEY`
- If Imagen model is unavailable, the API returns an optimized prompt for use with external generators (Midjourney, DALL-E)
- All generated content is automatically aligned with LAXMI brand guidelines
- Use the `optimizePrompt` option to enhance basic prompts with luxury design details
