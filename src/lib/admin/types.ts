/**
 * Admin Dashboard Type Definitions
 */

// Admin user roles
export type AdminRole = 'super_admin' | 'admin' | 'editor';

// Admin user from database
export interface AdminUser {
  id: string;
  email: string;
  display_name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  is_active: boolean;
}

// Admin activity log entry
export interface AdminActivityLog {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// Site content item
export interface SiteContent {
  id: string;
  content_key: string;
  section: string;
  content_en: string;
  content_it: string;
  content_type: 'text' | 'richtext' | 'html' | 'json';
  description: string | null;
  is_array: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

// Content version for history
export interface ContentVersion {
  id: string;
  content_id: string;
  content_en: string;
  content_it: string;
  created_at: string;
  created_by: string | null;
  change_note: string | null;
}

// Content section reference
export interface ContentSection {
  id: string;
  section_key: string;
  display_name_en: string;
  display_name_it: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
}

// Blog author
export interface BlogAuthor {
  id: string;
  name: string;
  slug: string;
  role_en: string;
  role_it: string;
  bio_en: string | null;
  bio_it: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Blog category
export interface BlogCategory {
  id: string;
  name_en: string;
  name_it: string;
  slug: string;
  description_en: string | null;
  description_it: string | null;
  sort_order: number;
  created_at: string;
}

// Blog post
export interface BlogPost {
  id: string;
  slug: string;

  // English content
  title_en: string;
  excerpt_en: string;
  content_en: string;
  tags_en: string[];
  featured_image_alt_en: string | null;
  seo_title_en: string | null;
  seo_description_en: string | null;
  seo_keywords_en: string[];

  // Italian content
  title_it: string;
  excerpt_it: string;
  content_it: string;
  tags_it: string[];
  featured_image_alt_it: string | null;
  seo_title_it: string | null;
  seo_description_it: string | null;
  seo_keywords_it: string[];

  // References
  author_id: string | null;
  category_id: string | null;

  // Media
  featured_image: string | null;

  // Metadata
  reading_time: number;
  schema_type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';

  // Status
  status: 'draft' | 'published' | 'archived';
  featured: boolean;

  // Timestamps
  published_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

// Blog post with author and category info (from view)
export interface BlogPostFull extends BlogPost {
  author_name: string | null;
  author_avatar: string | null;
  author_role_en: string | null;
  author_role_it: string | null;
  category_name_en: string | null;
  category_name_it: string | null;
  category_slug: string | null;
}

// Blog post FAQ
export interface BlogPostFAQ {
  id: string;
  post_id: string;
  question_en: string;
  question_it: string;
  answer_en: string;
  answer_it: string;
  sort_order: number;
  created_at: string;
}

// Blog post image
export interface BlogPostImage {
  id: string;
  post_id: string;
  url: string;
  alt_en: string | null;
  alt_it: string | null;
  caption_en: string | null;
  caption_it: string | null;
  sort_order: number;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalAuthors: number;
  totalContentKeys: number;
  recentActivity: AdminActivityLog[];
}

// Form states
export interface ContentFormData {
  content_en: string;
  content_it: string;
  change_note?: string;
}

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
  featured_image: string | null;
  featured_image_alt_en: string | null;
  featured_image_alt_it: string | null;
  author_id: string | null;
  category_id: string | null;
  reading_time: number;
  schema_type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  seo_title_en: string | null;
  seo_title_it: string | null;
  seo_description_en: string | null;
  seo_description_it: string | null;
  seo_keywords_en: string[];
  seo_keywords_it: string[];
}
