import { MetadataRoute } from 'next'
import { locales, siteUrl } from '@/i18n/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl

  // Define all pages
  const pages = [
    '',           // Home
    '/book',      // Booking
    '/consulting',
    '/collections',
    '/about',
    '/contact',
  ]

  // Generate sitemap entries for each locale and page
  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      const url = `${baseUrl}/${locale}${page}`

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/book' ? 0.9 : 0.8,
        alternates: {
          languages: {
            'it-IT': `${baseUrl}/it${page}`,
            'en-GB': `${baseUrl}/en${page}`,
            'x-default': `${baseUrl}/it${page}`, // Italian is default
          },
        },
      })
    }
  }

  return sitemapEntries
}
