// i18n Configuration for LAXMI
// Italian is the default language (x-default)

export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'it';

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
};

// SEO: Language and region codes for hreflang
export const hreflangCodes: Record<Locale, string> = {
  it: 'it-IT',
  en: 'en-GB',
};

// Base URL for canonical and hreflang tags
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laxmi.it';
