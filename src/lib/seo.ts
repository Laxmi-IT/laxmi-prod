import { type Metadata } from 'next'
import { siteUrl, hreflangCodes, locales, defaultLocale, type Locale } from '@/i18n/config'

/**
 * Generate canonical URL and hreflang alternates for a given page path.
 * Use in every page's generateMetadata to ensure proper indexing.
 *
 * @param locale - Current locale ('it' | 'en')
 * @param path - Page path without locale prefix (e.g. '/consulting', '/blog/my-post', or '' for home)
 */
export function getPageAlternates(locale: Locale, path = ''): Pick<Metadata, 'alternates'> {
  const pagePath = path ? `/${path.replace(/^\//, '')}` : ''

  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[hreflangCodes[loc]] = `${siteUrl}/${loc}${pagePath}`
  }
  languages['x-default'] = `${siteUrl}/${defaultLocale}${pagePath}`

  return {
    alternates: {
      canonical: `${siteUrl}/${locale}${pagePath}`,
      languages,
    },
  }
}
