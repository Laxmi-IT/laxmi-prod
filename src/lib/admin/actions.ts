'use server';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface UpdateContentResult {
  success: boolean;
  error?: string;
}

/**
 * Update a single content item and revalidate the dictionary cache
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

    // Revalidate the dictionary cache so frontend picks up changes immediately
    // Using { expire: 0 } for immediate cache expiration (Next.js 16+ API)
    revalidateTag('dictionary', { expire: 0 });

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

    // Revalidate the dictionary cache immediately
    revalidateTag('dictionary', { expire: 0 });

    return { success: true };
  } catch (err) {
    console.error('Error updating content items:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    };
  }
}
