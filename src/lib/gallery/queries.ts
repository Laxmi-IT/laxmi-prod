/**
 * Public Gallery Queries
 * Cached queries for fetching gallery content from the database
 */

import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';
import type { GalleryImage, DBGalleryImage } from './types';

/**
 * Transform database image to frontend format
 */
function transformDBImageToFrontend(dbImage: DBGalleryImage): GalleryImage {
  return {
    id: dbImage.id,
    src: dbImage.image_url,
    category: dbImage.category_en,
    categoryIT: dbImage.category_it,
    title: {
      en: dbImage.title_en,
      it: dbImage.title_it,
    },
    description: {
      en: dbImage.alt_en,
      it: dbImage.alt_it,
    },
    isFeatured: dbImage.is_featured,
    isActive: dbImage.is_active,
    sortOrder: dbImage.sort_order,
  };
}

/**
 * Fetch all active gallery images from database
 */
async function fetchActiveGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createPublicClient();

    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch gallery images:', error);
      return [];
    }

    return (images as DBGalleryImage[]).map(transformDBImageToFrontend);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch featured gallery images
 */
async function fetchFeaturedGalleryImages(): Promise<GalleryImage[]> {
  try {
    const supabase = createPublicClient();

    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch featured gallery images:', error);
      return [];
    }

    return (images as DBGalleryImage[]).map(transformDBImageToFrontend);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch gallery images by category
 */
async function fetchGalleryImagesByCategory(category: string): Promise<GalleryImage[]> {
  if (category === 'all') {
    return fetchActiveGalleryImages();
  }

  try {
    const supabase = createPublicClient();

    const { data: images, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .eq('category_en', category)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Failed to fetch gallery images by category:', error);
      return [];
    }

    return (images as DBGalleryImage[]).map(transformDBImageToFrontend);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Get a single gallery image by ID
 */
async function fetchGalleryImageById(id: string): Promise<GalleryImage | null> {
  try {
    const supabase = createPublicClient();

    const { data: image, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !image) {
      console.error('Failed to fetch gallery image:', error);
      return null;
    }

    return transformDBImageToFrontend(image as DBGalleryImage);
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

// ============= Cached Exports =============

/**
 * Get all active gallery images (cached)
 */
export const getGalleryImages = unstable_cache(
  fetchActiveGalleryImages,
  ['gallery-images'],
  {
    tags: ['gallery'],
    revalidate: 3600, // 1 hour fallback
  }
);

/**
 * Get featured gallery images (cached)
 */
export const getFeaturedGalleryImages = unstable_cache(
  fetchFeaturedGalleryImages,
  ['gallery-featured-images'],
  {
    tags: ['gallery'],
    revalidate: 3600,
  }
);

/**
 * Get gallery images by category (cached)
 */
export const getGalleryImagesByCategory = unstable_cache(
  fetchGalleryImagesByCategory,
  ['gallery-images-by-category'],
  {
    tags: ['gallery'],
    revalidate: 3600,
  }
);

/**
 * Get a single gallery image by ID (cached)
 */
export const getGalleryImageById = unstable_cache(
  fetchGalleryImageById,
  ['gallery-image-by-id'],
  {
    tags: ['gallery'],
    revalidate: 3600,
  }
);

// ============= Helper Functions =============

/**
 * Get all unique categories from images
 */
export function getCategories(images: GalleryImage[]): string[] {
  const categories = new Set<string>();
  images.forEach((img) => categories.add(img.category));
  return Array.from(categories).sort();
}

/**
 * Filter images by category
 */
export function filterImagesByCategory(images: GalleryImage[], category: string): GalleryImage[] {
  if (category === 'all') return images;
  return images.filter((img) => img.category === category);
}
