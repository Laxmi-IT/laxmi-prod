import { MetadataRoute } from 'next'
import { locales, siteUrl } from '@/i18n/config'
import { getPublishedPosts } from '@/lib/blog/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteUrl

  // Static pages with stable lastModified dates
  // Update these dates only when the page content actually changes
  const pages: { path: string; changeFrequency: MetadataRoute.Sitemap[0]['changeFrequency']; priority: number; lastModified: string }[] = [
    { path: '',             changeFrequency: 'weekly',   priority: 1.0,  lastModified: '2026-03-27' },
    { path: '/consulting',  changeFrequency: 'monthly',  priority: 0.9,  lastModified: '2026-03-27' },
    { path: '/book',        changeFrequency: 'monthly',  priority: 0.9,  lastModified: '2026-03-27' },
    { path: '/collections', changeFrequency: 'weekly',   priority: 0.8,  lastModified: '2026-03-27' },
    { path: '/about',       changeFrequency: 'monthly',  priority: 0.7,  lastModified: '2026-03-27' },
    { path: '/contact',     changeFrequency: 'monthly',  priority: 0.7,  lastModified: '2026-03-27' },
    { path: '/blog',           changeFrequency: 'weekly',   priority: 0.8,  lastModified: '2026-03-27' },
    { path: '/privacy-policy',  changeFrequency: 'yearly',   priority: 0.3,  lastModified: '2026-03-01' },
    { path: '/terms-of-service',changeFrequency: 'yearly',   priority: 0.3,  lastModified: '2026-03-01' },
    { path: '/legal-notice',    changeFrequency: 'yearly',   priority: 0.3,  lastModified: '2026-03-01' },
    { path: '/cookie-policy',   changeFrequency: 'yearly',   priority: 0.3,  lastModified: '2026-03-01' },
  ]

  // Generate sitemap entries for each locale and page
  const sitemapEntries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of pages) {
      const url = `${baseUrl}/${locale}${page.path}`

      sitemapEntries.push({
        url,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            'it-IT': `${baseUrl}/it${page.path}`,
            'en-GB': `${baseUrl}/en${page.path}`,
            'x-default': `${baseUrl}/it${page.path}`,
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
