/**
 * Admin Database Queries
 * Server-side only - uses server Supabase client
 */

import { createClient } from '@/lib/supabase/server';
import type {
  AdminUser,
  SiteContent,
  ContentSection,
  BlogPost,
  BlogPostFull,
  BlogAuthor,
  BlogCategory,
  BlogPostFAQ,
  DashboardStats,
  AdminActivityLog,
} from './types';

// ============= Admin User Queries =============

export async function getAdminUser(userId: string): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const admin = await getAdminUser(userId);
  return admin !== null && admin.is_active;
}

export async function updateLastLogin(userId: string): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('admin_users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);
}

// ============= Content Queries =============

export async function getContentSections(): Promise<ContentSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('content_sections')
    .select('*')
    .order('sort_order');

  if (error) throw error;
  return data as ContentSection[];
}

export async function getSiteContentBySection(section: string): Promise<SiteContent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('section', section)
    .order('sort_order');

  if (error) throw error;
  return data as SiteContent[];
}

export async function getAllSiteContent(): Promise<SiteContent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('section')
    .order('sort_order');

  if (error) throw error;
  return data as SiteContent[];
}

export async function getSiteContentItem(contentKey: string): Promise<SiteContent | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('content_key', contentKey)
    .single();

  if (error || !data) return null;
  return data as SiteContent;
}

export async function updateSiteContent(
  id: string,
  updates: { content_en: string; content_it: string },
  userId: string
): Promise<SiteContent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .update({
      content_en: updates.content_en,
      content_it: updates.content_it,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as SiteContent;
}

// ============= Blog Queries =============

export async function getAllBlogPosts(includeUnpublished = true): Promise<BlogPostFull[]> {
  const supabase = await createClient();
  let query = supabase
    .from('blog_posts_full')
    .select('*')
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as BlogPostFull[];
}

export async function getBlogPost(id: string): Promise<BlogPostFull | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts_full')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as BlogPostFull;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostFull | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts_full')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as BlogPostFull;
}

export async function createBlogPost(post: Partial<BlogPost>, userId: string): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...post,
      created_by: userId,
      updated_by: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function updateBlogPost(
  id: string,
  updates: Partial<BlogPost>,
  userId: string
): Promise<BlogPost> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_posts')
    .update({
      ...updates,
      updated_by: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) throw error;
}

// ============= Blog Authors =============

export async function getAllBlogAuthors(): Promise<BlogAuthor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_authors')
    .select('*')
    .order('name');

  if (error) throw error;
  return data as BlogAuthor[];
}

export async function createBlogAuthor(author: Partial<BlogAuthor>): Promise<BlogAuthor> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_authors')
    .insert(author)
    .select()
    .single();

  if (error) throw error;
  return data as BlogAuthor;
}

export async function updateBlogAuthor(id: string, updates: Partial<BlogAuthor>): Promise<BlogAuthor> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_authors')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogAuthor;
}

export async function deleteBlogAuthor(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_authors').delete().eq('id', id);
  if (error) throw error;
}

// ============= Blog Categories =============

export async function getAllBlogCategories(): Promise<BlogCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('sort_order');

  if (error) throw error;
  return data as BlogCategory[];
}

export async function createBlogCategory(category: Partial<BlogCategory>): Promise<BlogCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_categories')
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data as BlogCategory;
}

export async function updateBlogCategory(id: string, updates: Partial<BlogCategory>): Promise<BlogCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as BlogCategory;
}

export async function deleteBlogCategory(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('blog_categories').delete().eq('id', id);
  if (error) throw error;
}

// ============= Blog FAQs =============

export async function getBlogPostFAQs(postId: string): Promise<BlogPostFAQ[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('blog_post_faqs')
    .select('*')
    .eq('post_id', postId)
    .order('sort_order');

  if (error) throw error;
  return data as BlogPostFAQ[];
}

// ============= Activity Log =============

export async function logAdminActivity(
  adminId: string,
  action: string,
  entityType: string,
  entityId: string | null = null,
  oldValue: Record<string, unknown> | null = null,
  newValue: Record<string, unknown> | null = null,
  ipAddress: string | null = null,
  userAgent: string | null = null
): Promise<void> {
  const supabase = await createClient();
  await supabase.from('admin_activity_log').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

export async function getRecentActivity(limit = 10): Promise<AdminActivityLog[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('admin_activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AdminActivityLog[];
}

// ============= Dashboard Stats =============

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get post counts
  const { count: totalPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  const { count: publishedPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  const { count: draftPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft');

  const { count: totalCategories } = await supabase
    .from('blog_categories')
    .select('*', { count: 'exact', head: true });

  const { count: totalAuthors } = await supabase
    .from('blog_authors')
    .select('*', { count: 'exact', head: true });

  const { count: totalContentKeys } = await supabase
    .from('site_content')
    .select('*', { count: 'exact', head: true });

  const recentActivity = await getRecentActivity(5);

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    draftPosts: draftPosts || 0,
    totalCategories: totalCategories || 0,
    totalAuthors: totalAuthors || 0,
    totalContentKeys: totalContentKeys || 0,
    recentActivity,
  };
}
