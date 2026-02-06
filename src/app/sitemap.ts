import { MetadataRoute } from 'next'
import { locales, siteUrl } from '@/i18n/config'
import { getPublishedPosts } from '@/lib/blog/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl

  // Static pages
  const pages = [
    '',           // Home
    '/consulting',
    '/collections',
    '/about',
    '/contact',
    '/blog',
    '/book',
  ]

  // Generate sitemap entries for each locale and page
  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      const url = `${baseUrl}/${locale}${page}`

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'weekly' : page === '/blog' ? 'weekly' : 'monthly',
        priority: page === '' ? 1.0 : page === '/book' ? 0.9 : page === '/consulting' ? 0.9 : 0.8,
        alternates: {
          languages: {
            'it-IT': `${baseUrl}/it${page}`,
            'en-GB': `${baseUrl}/en${page}`,
            'x-default': `${baseUrl}/it${page}`,
          },
        },
      })
    }
  }

  // Dynamic blog post entries
  try {
    const posts = await getPublishedPosts()

    for (const post of posts) {
      for (const locale of locales) {
        const url = `${baseUrl}/${locale}/blog/${post.slug}`

        sitemapEntries.push({
          url,
          lastModified: new Date(post.updatedAt || post.publishedAt || new Date()),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              'it-IT': `${baseUrl}/it/blog/${post.slug}`,
              'en-GB': `${baseUrl}/en/blog/${post.slug}`,
              'x-default': `${baseUrl}/it/blog/${post.slug}`,
            },
          },
        })
      }
    }
  } catch (error) {
    // During build, Supabase may not be available — skip blog posts
    console.warn('Sitemap: unable to fetch blog posts:', error)
  }

  return sitemapEntries
}
