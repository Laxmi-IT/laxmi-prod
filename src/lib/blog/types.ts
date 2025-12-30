/**
 * Blog Post Type Definitions
 *
 * This structure is designed to be easily migrated to a CMS (Sanity, Strapi, etc.)
 * or database (Supabase, PostgreSQL) in the future.
 *
 * Current implementation: Static JSON files
 * Future: API endpoints or CMS integration
 */

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  roleIT: string;
  avatar?: string;
  bio?: string;
  bioIT?: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  nameIT: string;
  slug: string;
  description: string;
  descriptionIT: string;
}

export interface BlogPost {
  // Identification
  id: string;
  slug: string;

  // Content - English
  title: string;
  excerpt: string;
  content: string; // Markdown format for rich content

  // Content - Italian
  titleIT: string;
  excerptIT: string;
  contentIT: string;

  // Metadata
  author: string; // Author ID reference
  category: string; // Category ID reference
  tags: string[];
  tagsIT: string[];

  // Media
  featuredImage: string;
  featuredImageAlt: string;
  featuredImageAltIT: string;
  images?: {
    url: string;
    alt: string;
    altIT: string;
    caption?: string;
    captionIT?: string;
  }[];

  // Dates
  publishedAt: string; // ISO date string
  updatedAt: string;

  // Reading
  readingTime: number; // minutes

  // SEO - English
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];

  // SEO - Italian
  seoTitleIT: string;
  seoDescriptionIT: string;
  seoKeywordsIT: string[];

  // Schema.org structured data
  schemaType: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';

  // FAQ Section (for FAQ schema and featured snippets)
  faqs?: {
    question: string;
    questionIT: string;
    answer: string;
    answerIT: string;
  }[];

  // Related content
  relatedPosts: string[]; // Post IDs

  // Status (for future admin panel)
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

// Helper type for localized content
export type LocalizedBlogPost = Omit<BlogPost,
  'titleIT' | 'excerptIT' | 'contentIT' | 'tagsIT' |
  'featuredImageAltIT' | 'seoTitleIT' | 'seoDescriptionIT' | 'seoKeywordsIT'
> & {
  locale: 'en' | 'it';
};

// Blog listing with pagination support
export interface BlogListingResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search and filter options
export interface BlogFilters {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
}
