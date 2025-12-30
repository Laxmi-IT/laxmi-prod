'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface GalleryImageFormData {
  title_en: string;
  title_it: string;
  category_en: string;
  category_it: string;
  alt_en: string;
  alt_it: string;
  is_featured?: boolean;
  is_active?: boolean;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Revalidate all gallery-related caches
 */
function revalidateGalleryCaches() {
  // Revalidate gallery cache tag (Next.js 16 requires options object)
  revalidateTag('gallery', { expire: 0 });

  // Revalidate collections pages for both locales
  revalidatePath('/en/collections', 'layout');
  revalidatePath('/it/collections', 'layout');
}

/**
 * Update a gallery image
 */
export async function updateGalleryImage(
  id: string,
  data: Partial<GalleryImageFormData>,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const updateData: Record<string, unknown> = {
      ...data,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };

    const { data: image, error } = await supabase
      .from('gallery_images')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update gallery image:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateGalleryCaches();

    return { success: true, data: { id: image.id } };
  } catch (err) {
    console.error('Error updating gallery image:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a gallery image
 */
export async function deleteGalleryImage(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Get image path before deleting for storage cleanup
    const { data: image } = await supabase
      .from('gallery_images')
      .select('image_path')
      .eq('id', id)
      .single();

    // Delete from storage if it's in our storage bucket
    if (image?.image_path && image.image_path.startsWith('gallery/')) {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([image.image_path]);

      if (storageError) {
        console.warn('Storage delete failed:', storageError);
      }
    }

    // Delete from database
    const { error } = await supabase.from('gallery_images').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete gallery image:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateGalleryCaches();

    return { success: true };
  } catch (err) {
    console.error('Error deleting gallery image:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Toggle image active status
 */
export async function toggleGalleryImageActive(
  id: string,
  isActive: boolean,
  userId: string
): Promise<ActionResult> {
  return updateGalleryImage(id, { is_active: isActive }, userId);
}

/**
 * Toggle image featured status
 */
export async function toggleGalleryImageFeatured(
  id: string,
  isFeatured: boolean,
  userId: string
): Promise<ActionResult> {
  return updateGalleryImage(id, { is_featured: isFeatured }, userId);
}

/**
 * Reorder gallery images
 */
export async function reorderGalleryImages(
  updates: { id: string; sort_order: number }[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Update each image's sort order
    for (const update of updates) {
      const { error } = await supabase
        .from('gallery_images')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id);

      if (error) {
        console.error('Failed to update sort order:', error);
        return { success: false, error: error.message };
      }
    }

    // Revalidate caches
    revalidateGalleryCaches();

    return { success: true };
  } catch (err) {
    console.error('Error reordering gallery images:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create a new gallery image (after upload to storage)
 */
export async function createGalleryImage(
  imageUrl: string,
  imagePath: string,
  data: GalleryImageFormData,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Get max sort order
    const { data: maxOrderResult } = await supabase
      .from('gallery_images')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);

    const maxOrder = maxOrderResult?.[0]?.sort_order ?? 0;

    const { data: image, error } = await supabase
      .from('gallery_images')
      .insert({
        image_url: imageUrl,
        image_path: imagePath,
        title_en: data.title_en,
        title_it: data.title_it,
        category_en: data.category_en,
        category_it: data.category_it,
        alt_en: data.alt_en || data.title_en,
        alt_it: data.alt_it || data.title_it,
        sort_order: maxOrder + 1,
        is_featured: data.is_featured ?? false,
        is_active: data.is_active ?? true,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create gallery image:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateGalleryCaches();

    return { success: true, data: { id: image.id } };
  } catch (err) {
    console.error('Error creating gallery image:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}
