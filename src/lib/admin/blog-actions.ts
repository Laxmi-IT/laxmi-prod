'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface BlogPostFormData {
  slug: string;
  title_en: string;
  title_it: string;
  excerpt_en: string;
  excerpt_it: string;
  content_en: string;
  content_it: string;
  tags_en: string[];
  tags_it: string[];
  featured_image?: string;
  featured_image_alt_en?: string;
  featured_image_alt_it?: string;
  author_id?: string;
  category_id?: string;
  reading_time: number;
  schema_type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  seo_title_en?: string;
  seo_title_it?: string;
  seo_description_en?: string;
  seo_description_it?: string;
  seo_keywords_en: string[];
  seo_keywords_it: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

export interface BlogFAQData {
  id?: string;
  question_en: string;
  question_it: string;
  answer_en: string;
  answer_it: string;
  sort_order: number;
}

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}

/**
 * Revalidate all blog-related caches
 */
function revalidateBlogCaches() {
  // Revalidate blog cache tag (Next.js 16 requires options object)
  revalidateTag('blog', { expire: 0 });

  // Revalidate blog pages for both locales
  revalidatePath('/en/blog', 'layout');
  revalidatePath('/it/blog', 'layout');
}

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Create a new blog post
 */
export async function createBlogPost(
  data: BlogPostFormData,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Ensure slug is unique
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('slug', data.slug)
      .single();

    if (existingPost) {
      return { success: false, error: 'A post with this slug already exists' };
    }

    // Set published_at if publishing
    const publishedAt = data.status === 'published' ? new Date().toISOString() : null;

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        slug: data.slug,
        title_en: data.title_en,
        title_it: data.title_it,
        excerpt_en: data.excerpt_en,
        excerpt_it: data.excerpt_it,
        content_en: data.content_en,
        content_it: data.content_it,
        tags_en: data.tags_en,
        tags_it: data.tags_it,
        featured_image: data.featured_image,
        featured_image_alt_en: data.featured_image_alt_en,
        featured_image_alt_it: data.featured_image_alt_it,
        author_id: data.author_id || null,
        category_id: data.category_id || null,
        reading_time: data.reading_time,
        schema_type: data.schema_type,
        seo_title_en: data.seo_title_en,
        seo_title_it: data.seo_title_it,
        seo_description_en: data.seo_description_en,
        seo_description_it: data.seo_description_it,
        seo_keywords_en: data.seo_keywords_en,
        seo_keywords_it: data.seo_keywords_it,
        status: data.status,
        featured: data.featured,
        published_at: publishedAt,
        created_by: userId,
        updated_by: userId,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create blog post:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateBlogCaches();

    return { success: true, data: { id: post.id, slug: post.slug } };
  } catch (err) {
    console.error('Error creating blog post:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: string,
  data: Partial<BlogPostFormData>,
  userId: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Check if slug is being changed and ensure uniqueness
    if (data.slug) {
      const { data: existingPost } = await supabase
        .from('blog_posts')
        .select('id, slug')
        .eq('slug', data.slug)
        .neq('id', id)
        .single();

      if (existingPost) {
        return { success: false, error: 'A post with this slug already exists' };
      }
    }

    // Get current post to check status change
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('status, published_at')
      .eq('id', id)
      .single();

    // Set published_at if publishing for the first time
    let publishedAt = currentPost?.published_at;
    if (data.status === 'published' && currentPost?.status !== 'published' && !publishedAt) {
      publishedAt = new Date().toISOString();
    }

    const updateData: Record<string, unknown> = {
      ...data,
      published_at: publishedAt,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    };

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update blog post:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateBlogCaches();

    // Also revalidate the specific post page
    if (post.slug) {
      revalidatePath(`/en/blog/${post.slug}`);
      revalidatePath(`/it/blog/${post.slug}`);
    }

    return { success: true, data: { id: post.id, slug: post.slug } };
  } catch (err) {
    console.error('Error updating blog post:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Get slug before deleting for cache invalidation
    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete blog post:', error);
      return { success: false, error: error.message };
    }

    // Revalidate caches
    revalidateBlogCaches();

    // Also revalidate the specific post page
    if (post?.slug) {
      revalidatePath(`/en/blog/${post.slug}`);
      revalidatePath(`/it/blog/${post.slug}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Error deleting blog post:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Publish a blog post
 */
export async function publishBlogPost(id: string, userId: string): Promise<ActionResult> {
  return updateBlogPost(id, { status: 'published' }, userId);
}

/**
 * Unpublish a blog post (set to draft)
 */
export async function unpublishBlogPost(id: string, userId: string): Promise<ActionResult> {
  return updateBlogPost(id, { status: 'draft' }, userId);
}

/**
 * Toggle featured status
 */
export async function toggleFeaturedPost(
  id: string,
  featured: boolean,
  userId: string
): Promise<ActionResult> {
  return updateBlogPost(id, { featured }, userId);
}

// ============= FAQ Management =============

/**
 * Get FAQs for a blog post
 */
export async function getBlogPostFAQs(postId: string): Promise<BlogFAQData[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_post_faqs')
    .select('*')
    .eq('post_id', postId)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch FAQs:', error);
    return [];
  }

  return data as BlogFAQData[];
}

/**
 * Save FAQs for a blog post (replaces all existing)
 */
export async function saveBlogPostFAQs(
  postId: string,
  faqs: BlogFAQData[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Delete existing FAQs
    await supabase.from('blog_post_faqs').delete().eq('post_id', postId);

    // Insert new FAQs if any
    if (faqs.length > 0) {
      const faqsToInsert = faqs.map((faq, index) => ({
        post_id: postId,
        question_en: faq.question_en,
        question_it: faq.question_it,
        answer_en: faq.answer_en,
        answer_it: faq.answer_it,
        sort_order: index,
      }));

      const { error } = await supabase.from('blog_post_faqs').insert(faqsToInsert);

      if (error) {
        console.error('Failed to save FAQs:', error);
        return { success: false, error: error.message };
      }
    }

    // Revalidate the post page
    const { data: post } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('id', postId)
      .single();

    if (post?.slug) {
      revalidatePath(`/en/blog/${post.slug}`);
      revalidatePath(`/it/blog/${post.slug}`);
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving FAQs:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// ============= Related Posts =============

/**
 * Get related posts for a blog post
 */
export async function getRelatedPosts(postId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_related_posts')
    .select('related_post_id')
    .eq('post_id', postId)
    .order('sort_order');

  if (error) {
    console.error('Failed to fetch related posts:', error);
    return [];
  }

  return data.map((r) => r.related_post_id);
}

/**
 * Save related posts for a blog post
 */
export async function saveRelatedPosts(
  postId: string,
  relatedPostIds: string[]
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // Delete existing related posts
    await supabase.from('blog_related_posts').delete().eq('post_id', postId);

    // Insert new related posts if any
    if (relatedPostIds.length > 0) {
      const relationsToInsert = relatedPostIds.map((relatedId, index) => ({
        post_id: postId,
        related_post_id: relatedId,
        sort_order: index,
      }));

      const { error } = await supabase
        .from('blog_related_posts')
        .insert(relationsToInsert);

      if (error) {
        console.error('Failed to save related posts:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Error saving related posts:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// ============= Author Management =============

export interface AuthorFormData {
  name: string;
  slug: string;
  role_en: string;
  role_it: string;
  bio_en?: string;
  bio_it?: string;
  avatar_url?: string;
}

/**
 * Create a new author
 */
export async function createAuthor(data: AuthorFormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { data: author, error } = await supabase
      .from('blog_authors')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Failed to create author:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since author info appears on posts
    revalidateBlogCaches();

    return { success: true, data: { id: author.id } };
  } catch (err) {
    console.error('Error creating author:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update an author
 */
export async function updateAuthor(
  id: string,
  data: Partial<AuthorFormData>
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('blog_authors')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Failed to update author:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since author info appears on posts
    revalidateBlogCaches();

    return { success: true };
  } catch (err) {
    console.error('Error updating author:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete an author
 */
export async function deleteAuthor(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('blog_authors').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete author:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since author info appears on posts
    revalidateBlogCaches();

    return { success: true };
  } catch (err) {
    console.error('Error deleting author:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

// ============= Category Management =============

export interface CategoryFormData {
  name_en: string;
  name_it: string;
  slug: string;
  description_en?: string;
  description_it?: string;
  sort_order?: number;
}

/**
 * Create a new category
 */
export async function createCategory(data: CategoryFormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { data: category, error } = await supabase
      .from('blog_categories')
      .insert(data)
      .select()
      .single();

    if (error) {
      console.error('Failed to create category:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since category info appears on posts
    revalidateBlogCaches();

    return { success: true, data: { id: category.id } };
  } catch (err) {
    console.error('Error creating category:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('blog_categories')
      .update(data)
      .eq('id', id);

    if (error) {
      console.error('Failed to update category:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since category info appears on posts
    revalidateBlogCaches();

    return { success: true };
  } catch (err) {
    console.error('Error updating category:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from('blog_categories').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete category:', error);
      return { success: false, error: error.message };
    }

    // Revalidate blog caches since category info appears on posts
    revalidateBlogCaches();

    return { success: true };
  } catch (err) {
    console.error('Error deleting category:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred',
    };
  }
}
