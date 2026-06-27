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
 * Upsert a single site_content row by its content_key (insert if missing,
 * update if it already exists). Both locales get the same value — used for
 * locale-agnostic values like phone number and VAT.
 */
async function upsertContentByKey(
  key: string,
  section: string,
  value: string,
  userId: string,
  sortOrder: number,
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from('site_content')
    .select('id')
    .eq('content_key', key)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('site_content')
      .update({
        content_en: value,
        content_it: value,
        updated_by: userId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);
    return { error: error?.message };
  }

  const { error } = await supabase.from('site_content').insert({
    content_key: key,
    section,
    content_type: 'text',
    content_en: value,
    content_it: value,
    is_array: false,
    sort_order: sortOrder,
    updated_by: userId,
  });
  return { error: error?.message };
}

/**
 * Update the editable company contact fields (phone + VAT / P.IVA).
 * Stored in site_content under common.phone / common.vat so the values flow
 * through the dictionary merge and appear across the public site.
 */
export async function updateCompanyContact(
  phone: string,
  vat: string,
  userId: string,
): Promise<UpdateContentResult> {
  try {
    const phoneResult = await upsertContentByKey('common.phone', 'common', phone.trim(), userId, 10);
    if (phoneResult.error) {
      return { success: false, error: phoneResult.error };
    }

    const vatResult = await upsertContentByKey('common.vat', 'common', vat.trim(), userId, 11);
    if (vatResult.error) {
      return { success: false, error: vatResult.error };
    }

    // Revalidate dictionary cache AND all locale pages so the new values show
    revalidateAllPages();

    return { success: true };
  } catch (err) {
    console.error('Error updating company contact:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
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
