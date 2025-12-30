-- Blog System Tables
-- Migrates from static TypeScript arrays to database

-- Blog Authors
CREATE TABLE IF NOT EXISTS blog_authors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    role_en TEXT NOT NULL,
    role_it TEXT NOT NULL,
    bio_en TEXT,
    bio_it TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;

-- Public can read authors
CREATE POLICY "Public can read blog authors"
    ON blog_authors FOR SELECT
    USING (true);

-- Admins can manage authors
CREATE POLICY "Admins can manage blog authors"
    ON blog_authors FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Blog Categories
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_it TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_en TEXT,
    description_it TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "Public can read blog categories"
    ON blog_categories FOR SELECT
    USING (true);

-- Admins can manage categories
CREATE POLICY "Admins can manage blog categories"
    ON blog_categories FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Blog Posts (main table)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,

    -- English Content
    title_en TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    content_en TEXT NOT NULL,           -- Markdown format
    tags_en TEXT[] DEFAULT '{}',
    featured_image_alt_en TEXT,
    seo_title_en TEXT,
    seo_description_en TEXT,
    seo_keywords_en TEXT[] DEFAULT '{}',

    -- Italian Content
    title_it TEXT NOT NULL,
    excerpt_it TEXT NOT NULL,
    content_it TEXT NOT NULL,           -- Markdown format
    tags_it TEXT[] DEFAULT '{}',
    featured_image_alt_it TEXT,
    seo_title_it TEXT,
    seo_description_it TEXT,
    seo_keywords_it TEXT[] DEFAULT '{}',

    -- References
    author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,

    -- Media
    featured_image TEXT,

    -- Metadata
    reading_time INTEGER DEFAULT 5,
    schema_type TEXT DEFAULT 'BlogPosting' CHECK (schema_type IN ('Article', 'BlogPosting', 'HowTo', 'FAQPage')),

    -- Status & Flags
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,

    -- Timestamps
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Tracking
    created_by UUID REFERENCES admin_users(id),
    updated_by UUID REFERENCES admin_users(id)
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can only read published posts
CREATE POLICY "Public can read published blog posts"
    ON blog_posts FOR SELECT
    USING (status = 'published' OR auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Admins can manage all posts
CREATE POLICY "Admins can insert blog posts"
    ON blog_posts FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can update blog posts"
    ON blog_posts FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can delete blog posts"
    ON blog_posts FOR DELETE
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_authors_updated_at
    BEFORE UPDATE ON blog_authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Blog Post Images (additional images besides featured)
CREATE TABLE IF NOT EXISTS blog_post_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_en TEXT,
    alt_it TEXT,
    caption_en TEXT,
    caption_it TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_post_images ENABLE ROW LEVEL SECURITY;

-- Public can read images for published posts
CREATE POLICY "Public can read blog post images"
    ON blog_post_images FOR SELECT
    USING (
        post_id IN (SELECT id FROM blog_posts WHERE status = 'published')
        OR auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
    );

-- Admins can manage images
CREATE POLICY "Admins can manage blog post images"
    ON blog_post_images FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Blog Post FAQs (for FAQ schema and featured snippets)
CREATE TABLE IF NOT EXISTS blog_post_faqs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    question_en TEXT NOT NULL,
    question_it TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    answer_it TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_post_faqs ENABLE ROW LEVEL SECURITY;

-- Public can read FAQs for published posts
CREATE POLICY "Public can read blog post faqs"
    ON blog_post_faqs FOR SELECT
    USING (
        post_id IN (SELECT id FROM blog_posts WHERE status = 'published')
        OR auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true)
    );

-- Admins can manage FAQs
CREATE POLICY "Admins can manage blog post faqs"
    ON blog_post_faqs FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Related Posts junction table
CREATE TABLE IF NOT EXISTS blog_related_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    related_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    UNIQUE(post_id, related_post_id),
    CHECK (post_id != related_post_id)
);

-- Enable RLS
ALTER TABLE blog_related_posts ENABLE ROW LEVEL SECURITY;

-- Public can read related posts
CREATE POLICY "Public can read related posts"
    ON blog_related_posts FOR SELECT
    USING (true);

-- Admins can manage related posts
CREATE POLICY "Admins can manage related posts"
    ON blog_related_posts FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_images_post ON blog_post_images(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_faqs_post ON blog_post_faqs(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_related_posts_post ON blog_related_posts(post_id);

-- Blog post version history for drafts
CREATE TABLE IF NOT EXISTS blog_post_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,

    -- Snapshot of content at this version
    title_en TEXT NOT NULL,
    title_it TEXT NOT NULL,
    excerpt_en TEXT NOT NULL,
    excerpt_it TEXT NOT NULL,
    content_en TEXT NOT NULL,
    content_it TEXT NOT NULL,

    -- Metadata
    version_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id)
);

-- Enable RLS
ALTER TABLE blog_post_versions ENABLE ROW LEVEL SECURITY;

-- Only admins can view/manage versions
CREATE POLICY "Admins can manage blog post versions"
    ON blog_post_versions FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Index for versions
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_post ON blog_post_versions(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_post_versions_created ON blog_post_versions(created_at DESC);

-- View for published posts with author and category info (convenience view)
CREATE OR REPLACE VIEW blog_posts_full AS
SELECT
    p.*,
    a.name AS author_name,
    a.avatar_url AS author_avatar,
    a.role_en AS author_role_en,
    a.role_it AS author_role_it,
    c.name_en AS category_name_en,
    c.name_it AS category_name_it,
    c.slug AS category_slug
FROM blog_posts p
LEFT JOIN blog_authors a ON p.author_id = a.id
LEFT JOIN blog_categories c ON p.category_id = c.id;
