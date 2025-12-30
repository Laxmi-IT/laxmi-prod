import { unstable_cache } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';

interface ContentRow {
  content_key: string;
  content_en: string;
  content_it: string;
}

/**
 * Set a nested value in an object using dot notation
 * e.g., setNestedValue(obj, "hero.tagline1", "value")
 * creates { hero: { tagline1: "value" } }
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const lastKey = keys[keys.length - 1];
  current[lastKey] = value;
}

/**
 * Parse content value - handles JSON arrays/objects
 */
function parseContentValue(value: string): unknown {
  if (!value) return value;

  // Try to parse as JSON for arrays and objects
  const trimmed = value.trim();
  if ((trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Not valid JSON, return as string
      return value;
    }
  }

  return value;
}

/**
 * Build a nested dictionary from flat content rows
 */
function buildNestedDictionary(
  content: ContentRow[],
  locale: Locale
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const row of content) {
    const value = locale === 'en' ? row.content_en : row.content_it;
    const parsedValue = parseContentValue(value);
    setNestedValue(result, row.content_key, parsedValue);
  }

  return result;
}

/**
 * Fetch dictionary from database with caching
 */
async function fetchDictionaryFromDB(locale: Locale): Promise<Dictionary> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('site_content')
    .select('content_key, content_en, content_it')
    .order('content_key');

  if (error) {
    throw new Error(`Failed to fetch dictionary from database: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No content found in database');
  }

  const dictionary = buildNestedDictionary(data as ContentRow[], locale);

  return dictionary as unknown as Dictionary;
}

/**
 * Cached dictionary loader from database
 * Uses Next.js unstable_cache with 'dictionary' tag for revalidation
 */
export const getDictionaryFromDB = unstable_cache(
  fetchDictionaryFromDB,
  ['dictionary-db'],
  {
    tags: ['dictionary'],
    revalidate: 3600, // Revalidate every hour (but also on-demand via tag)
  }
);

/**
 * Get dictionary without cache (for debugging/admin preview)
 */
export async function getDictionaryFromDBNoCache(locale: Locale): Promise<Dictionary> {
  return fetchDictionaryFromDB(locale);
}
