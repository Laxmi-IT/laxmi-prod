import type { MetadataRoute } from 'next';
import { siteUrl } from '@/i18n/config';

export default function robots(): MetadataRoute['robots'] {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
