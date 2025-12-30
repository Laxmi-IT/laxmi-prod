'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface UpdateContentResult {
  success: boolean;
  error?: string;
}

/**
 * Revalidate all pages that use the dictionary
 * This ensures content changes appear immediately on the live site
 */
function revalidateAllPages() {
  // Revalidate the dictionary cache
  revalidateTag('dictionary', { expire: 0 });

  // Revalidate all locale pages to pick up dictionary changes
  // Using layout revalidation to cover all pages under each locale
  revalidatePath('/it', 'layout');
  revalidatePath('/en', 'layout');
}

/**
 * Update a single content item and revalidate caches
 */
export async function updateContentItem(
  id: string,
  content_en: string,
  content_it: string,
  userId: string
): Promise<UpdateContentResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('site_content')
      .update({
        content_en,
        content_it,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Failed to update content:', error);
      return { success: false, error: error.message };
    }

    // Revalidate dictionary cache AND all pages
    revalidateAllPages();

    return { success: true };
  } catch (err) {
    console.error('Error updating content:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}

/**
 * Batch update multiple content items
 */
export async function updateMultipleContentItems(
  updates: Array<{ id: string; content_en: string; content_it: string }>,
  userId: string
): Promise<UpdateContentResult> {
  try {
    const supabase = await createClient();

    // Update each item
    for (const update of updates) {
      const { error } = await supabase
        .from('site_content')
        .update({
          content_en: update.content_en,
          content_it: update.content_it,
          updated_by: userId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', update.id);

      if (error) {
        console.error('Failed to update content item:', update.id, error);
        return { success: false, error: `Failed to update item: ${error.message}` };
      }
    }

    // Revalidate dictionary cache AND all pages
    revalidateAllPages();

    return { success: true };
  } catch (err) {
    console.error('Error updating content items:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}
