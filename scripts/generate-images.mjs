import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Error: GEMINI_API_KEY environment variable is required');
  process.exit(1);
}
const ai = new GoogleGenAI({ apiKey });

// LAXMI Brand optimized prompts
const heroPrompt = `Create a stunning luxury interior design photograph of an elegant Italian living room.

Key elements:
- Sage green velvet curved sofas with organic flowing shapes
- Multiple tall arched windows with sheer cream curtains letting in soft natural light
- Cream/ivory walls with subtle architectural moldings
- Warm walnut wood oval coffee table
- Travertine or cream marble flooring
- Brass and gold accent details on furniture legs
- Fresh eucalyptus or olive branches in a ceramic vase
- Soft ambient lighting creating a serene atmosphere
- High ceilings with subtle architectural arches
- Clean, uncluttered composition with generous negative space

Style: Professional architectural photography, magazine editorial quality, photorealistic, 8K resolution, warm natural lighting from the windows, Italian villa aesthetic, serene and tranquil mood, luxurious but not ostentatious.

Color palette: Sage green (#8B9B7A), cream (#FFFAE7), ivory (#FAF8F3), bronze (#93694D), champagne (#F5DBB9), gold accents (#B8956E).`;

const servicesPrompt = `Create a sophisticated interior design photograph of a luxury Italian bedroom or sitting area.

Key elements:
- Elegant arched doorway or window as a focal point
- Soft cream and ivory color palette
- Plush velvet or linen upholstered furniture in sage green or champagne tones
- Natural light streaming through sheer curtains
- Marble or travertine surfaces
- Brass table lamp or decorative object
- Fresh flowers in a refined ceramic vase
- Textured throw blanket in warm neutral tones
- Subtle gold accent details
- Minimalist but warm aesthetic

Style: Professional interior photography, editorial magazine quality, photorealistic, natural soft lighting, Italian elegance, serene and inviting atmosphere.

Color palette: Sage green (#8B9B7A), cream (#FFFAE7), ivory (#FAF8F3), champagne (#F5DBB9), bronze (#93694D), warm taupe (#9A8B7A).`;

async function generateImage(prompt, filename) {
  try {
    console.log(`\nGenerating: ${filename}...`);

    // Try using Gemini 2.0 Flash with image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        responseModalities: ['Text', 'Image'],
      },
    });

    // Check for image parts in the response
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          const outputPath = path.join('public', 'images', filename);
          fs.writeFileSync(outputPath, buffer);
          console.log(`✓ Saved: ${outputPath}`);
          return true;
        }
      }
    }

    // Alternative: check response structure
    if (response.images && response.images.length > 0) {
      const imageData = response.images[0];
      const buffer = Buffer.from(imageData, 'base64');
      const outputPath = path.join('public', 'images', filename);
      fs.writeFileSync(outputPath, buffer);
      console.log(`✓ Saved: ${outputPath}`);
      return true;
    }

    console.log('Response structure:', JSON.stringify(response, null, 2).substring(0, 500));
    console.log('No image data found in response.');
    return false;
  } catch (error) {
    console.error(`Error generating ${filename}:`, error.message);

    // Save the optimized prompt for external use
    const promptPath = path.join('public', 'images', `${filename.replace('.png', '')}-prompt.txt`);
    fs.writeFileSync(promptPath, prompt);
    console.log(`Saved optimized prompt to: ${promptPath}`);
    return false;
  }
}

async function main() {
  console.log('🎨 LAXMI Image Generator');
  console.log('========================\n');

  // Ensure output directory exists
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }

  // Generate hero image
  const heroSuccess = await generateImage(heroPrompt, 'hero-interior.png');

  // Generate services image
  const servicesSuccess = await generateImage(servicesPrompt, 'services-interior.png');

  console.log('\n========================');
  if (heroSuccess && servicesSuccess) {
    console.log('✓ All images generated successfully!');
  } else {
    console.log('Note: Prompts have been saved for use with external generators if needed.');
  }
}

main();
