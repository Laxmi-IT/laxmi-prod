/**
 * Public Blog Queries
 * Cached queries for fetching blog content from the database
 */

import { unstable_cache } from 'next/cache';
import { createPublicClient } from '@/lib/supabase/public';
import type { BlogPost, BlogAuthor, BlogCategory } from './types';

// Types matching the database schema
interface DBBlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_it: string;
  excerpt_en: string;
  excerpt_it: string;
  content_en: string;
  content_it: string;
  tags_en: string[];
  tags_it: string[];
  featured_image: string | null;
  featured_image_alt_en: string | null;
  featured_image_alt_it: string | null;
  author_id: string | null;
  category_id: string | null;
  reading_time: number;
  schema_type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  seo_title_en: string | null;
  seo_title_it: string | null;
  seo_description_en: string | null;
  seo_description_it: string | null;
  seo_keywords_en: string[];
  seo_keywords_it: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields from view
  author_name?: string;
  author_avatar?: string;
  author_role_en?: string;
  author_role_it?: string;
  category_name_en?: string;
  category_name_it?: string;
  category_slug?: string;
}

interface DBFAQ {
  id: string;
  post_id: string;
  question_en: string;
  question_it: string;
  answer_en: string;
  answer_it: string;
  sort_order: number;
}

/**
 * Transform database post to frontend BlogPost format
 */
function transformDBPostToFrontend(dbPost: DBBlogPost, faqs: DBFAQ[] = []): BlogPost {
  return {
    id: dbPost.id,
    slug: dbPost.slug,
    title: dbPost.title_en,
    titleIT: dbPost.title_it,
    excerpt: dbPost.excerpt_en,
    excerptIT: dbPost.excerpt_it,
    content: dbPost.content_en,
    contentIT: dbPost.content_it,
    author: dbPost.author_id || '',
    category: dbPost.category_id || '',
    tags: dbPost.tags_en || [],
    tagsIT: dbPost.tags_it || [],
    featuredImage: dbPost.featured_image || '/images/placeholder.jpg',
    featuredImageAlt: dbPost.featured_image_alt_en || '',
    featuredImageAltIT: dbPost.featured_image_alt_it || '',
    publishedAt: dbPost.published_at || dbPost.created_at,
    updatedAt: dbPost.updated_at,
    readingTime: dbPost.reading_time,
    seoTitle: dbPost.seo_title_en || dbPost.title_en,
    seoTitleIT: dbPost.seo_title_it || dbPost.title_it,
    seoDescription: dbPost.seo_description_en || dbPost.excerpt_en,
    seoDescriptionIT: dbPost.seo_description_it || dbPost.excerpt_it,
    seoKeywords: dbPost.seo_keywords_en || [],
    seoKeywordsIT: dbPost.seo_keywords_it || [],
    schemaType: dbPost.schema_type,
    faqs: faqs.map((faq) => ({
      question: faq.question_en,
      questionIT: faq.question_it,
      answer: faq.answer_en,
      answerIT: faq.answer_it,
    })),
    relatedPosts: [], // Will be populated separately
    status: dbPost.status,
    featured: dbPost.featured,
  };
}

/**
 * Fetch all published blog posts from database
 */
async function fetchPublishedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createPublicClient();

    const { data: posts, error } = await supabase
      .from('blog_posts_full')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch published posts:', error);
      return [];
    }

    return (posts as DBBlogPost[]).map((post) => transformDBPostToFrontend(post));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const supabase = createPublicClient();

    const { data: post, error } = await supabase
      .from('blog_posts_full')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !post) {
      console.error('Failed to fetch post by slug:', error);
      return null;
    }

    // Fetch FAQs for this post
    const { data: faqs } = await supabase
      .from('blog_post_faqs')
      .select('*')
      .eq('post_id', post.id)
      .order('sort_order');

    // Fetch related posts
    const { data: relatedLinks } = await supabase
      .from('blog_related_posts')
      .select('related_post_id')
      .eq('post_id', post.id)
      .order('sort_order');

    const transformedPost = transformDBPostToFrontend(post as DBBlogPost, faqs as DBFAQ[] || []);

    // Add related post IDs
    if (relatedLinks) {
      transformedPost.relatedPosts = relatedLinks.map((r) => r.related_post_id);
    }

    return transformedPost;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

/**
 * Fetch featured blog posts
 */
async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const supabase = createPublicClient();

    const { data: posts, error } = await supabase
      .from('blog_posts_full')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch featured posts:', error);
      return [];
    }

    return (posts as DBBlogPost[]).map((post) => transformDBPostToFrontend(post));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch posts by category
 */
async function fetchPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  try {
    const supabase = createPublicClient();

    const { data: posts, error } = await supabase
      .from('blog_posts_full')
      .select('*')
      .eq('status', 'published')
      .eq('category_slug', categorySlug)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch posts by category:', error);
      return [];
    }

    return (posts as DBBlogPost[]).map((post) => transformDBPostToFrontend(post));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch all blog authors
 */
async function fetchAuthors(): Promise<BlogAuthor[]> {
  try {
    const supabase = createPublicClient();

    const { data: authors, error } = await supabase
      .from('blog_authors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Failed to fetch authors:', error);
      return [];
    }

    return authors.map((author) => ({
      id: author.id,
      name: author.name,
      role: author.role_en,
      roleIT: author.role_it,
      avatar: author.avatar_url,
      bio: author.bio_en,
      bioIT: author.bio_it,
    }));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch all blog categories
 */
async function fetchCategories(): Promise<BlogCategory[]> {
  try {
    const supabase = createPublicClient();

    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('sort_order');

    if (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name_en,
      nameIT: cat.name_it,
      slug: cat.slug,
      description: cat.description_en || '',
      descriptionIT: cat.description_it || '',
    }));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

/**
 * Fetch related posts by IDs
 */
async function fetchRelatedPostsByIds(postIds: string[]): Promise<BlogPost[]> {
  if (postIds.length === 0) return [];

  try {
    const supabase = createPublicClient();

    const { data: posts, error } = await supabase
      .from('blog_posts_full')
      .select('*')
      .in('id', postIds)
      .eq('status', 'published');

    if (error) {
      console.error('Failed to fetch related posts:', error);
      return [];
    }

    return (posts as DBBlogPost[]).map((post) => transformDBPostToFrontend(post));
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return [];
  }
}

// ============= Cached Exports =============

/**
 * Get all published posts (cached)
 */
export const getPublishedPosts = unstable_cache(
  fetchPublishedPosts,
  ['blog-published-posts'],
  {
    tags: ['blog'],
    revalidate: 3600, // 1 hour fallback
  }
);

/**
 * Get a post by slug (cached)
 */
export const getPostBySlug = unstable_cache(
  fetchPostBySlug,
  ['blog-post-by-slug'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

/**
 * Get featured posts (cached)
 */
export const getFeaturedPosts = unstable_cache(
  fetchFeaturedPosts,
  ['blog-featured-posts'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

/**
 * Get posts by category (cached)
 */
export const getPostsByCategory = unstable_cache(
  fetchPostsByCategory,
  ['blog-posts-by-category'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

/**
 * Get all authors (cached)
 */
export const getAuthors = unstable_cache(
  fetchAuthors,
  ['blog-authors'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

/**
 * Get all categories (cached)
 */
export const getCategories = unstable_cache(
  fetchCategories,
  ['blog-categories'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

/**
 * Get related posts by IDs (cached)
 */
export const getRelatedPosts = unstable_cache(
  fetchRelatedPostsByIds,
  ['blog-related-posts'],
  {
    tags: ['blog'],
    revalidate: 3600,
  }
);

// ============= Helper Functions =============

/**
 * Get author by ID from a list of authors
 */
export function getAuthorById(authors: BlogAuthor[], authorId: string): BlogAuthor | undefined {
  return authors.find((author) => author.id === authorId);
}

/**
 * Get category by ID from a list of categories
 */
export function getCategoryById(categories: BlogCategory[], categoryId: string): BlogCategory | undefined {
  return categories.find((cat) => cat.id === categoryId);
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}

/**
 * Get all unique Italian tags from posts
 */
export function getAllTagsIT(posts: BlogPost[]): string[] {
  const allTags = new Set<string>();
  posts.forEach((post) => {
    post.tagsIT.forEach((tag) => allTags.add(tag));
  });
  return Array.from(allTags).sort();
}
