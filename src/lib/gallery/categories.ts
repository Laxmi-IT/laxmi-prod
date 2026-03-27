/**
 * Single source of truth for gallery categories.
 * Used by both the admin gallery page and the frontend category filter.
 */

export interface GalleryCategoryDef {
  /** Canonical key stored in category_en in the DB */
  key: string;
  en: string;
  it: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryDef[] = [
  { key: 'Kitchen',  en: 'Kitchen',  it: 'Cucina' },
  { key: 'Living',   en: 'Living',   it: 'Soggiorno' },
  { key: 'Bedroom',  en: 'Bedroom',  it: 'Camera da Letto' },
  { key: 'Dining',   en: 'Dining',   it: 'Sala da Pranzo' },
  { key: 'Pantry',   en: 'Pantry',   it: 'Dispensa' },
  { key: 'Foyer',    en: 'Foyer',    it: 'Ingresso' },
  { key: 'Villa',    en: 'Villa',    it: 'Villa' },
  { key: 'Interior', en: 'Interior', it: 'Interni' },
  { key: 'Details',  en: 'Details',  it: 'Dettagli' },
];

/** Look up a category by its key */
export function getCategoryByKey(key: string): GalleryCategoryDef | undefined {
  return GALLERY_CATEGORIES.find((c) => c.key === key);
}

/** Get the localized label for a category key */
export function getCategoryLabel(key: string, locale: string): string {
  const cat = getCategoryByKey(key);
  if (!cat) return key;
  return locale === 'it' ? cat.it : cat.en;
}
