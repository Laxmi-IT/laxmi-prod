-- Site Content table for managing editable translations/copy
-- Supports both English and Italian content

CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_key TEXT NOT NULL,           -- e.g., "hero.title", "cta.button", "services.service1.description"
    section TEXT NOT NULL,               -- Top-level section: metadata, nav, hero, values, services, gallery, cta, footer, booking, common, collections, consulting, contactPage, aboutPage
    content_en TEXT NOT NULL,            -- English content
    content_it TEXT NOT NULL,            -- Italian content
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'richtext', 'html', 'json')),
    description TEXT,                    -- Helper text for editors
    is_array BOOLEAN DEFAULT false,      -- Whether this content is an array (like gallery images)
    sort_order INTEGER DEFAULT 0,        -- For ordering items within sections
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES admin_users(id),
    UNIQUE(content_key)
);

-- Enable Row Level Security
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_content
-- Anyone can read (needed for public site)
CREATE POLICY "Public can read site content"
    ON site_content FOR SELECT
    USING (true);

-- Only admins can insert
CREATE POLICY "Admins can insert site content"
    ON site_content FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Only admins can update
CREATE POLICY "Admins can update site content"
    ON site_content FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Only admins can delete
CREATE POLICY "Admins can delete site content"
    ON site_content FOR DELETE
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Content version history for rollback functionality
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content_id UUID REFERENCES site_content(id) ON DELETE CASCADE,
    content_en TEXT NOT NULL,
    content_it TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES admin_users(id),
    change_note TEXT
);

-- Enable RLS on versions
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- Only admins can view/insert versions
CREATE POLICY "Admins can view content versions"
    ON content_versions FOR SELECT
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

CREATE POLICY "Admins can insert content versions"
    ON content_versions FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Function to auto-save version history before update
CREATE OR REPLACE FUNCTION save_content_version()
RETURNS TRIGGER AS $$
BEGIN
    -- Only save version if content actually changed
    IF OLD.content_en IS DISTINCT FROM NEW.content_en OR OLD.content_it IS DISTINCT FROM NEW.content_it THEN
        INSERT INTO content_versions (content_id, content_en, content_it, created_by)
        VALUES (OLD.id, OLD.content_en, OLD.content_it, NEW.updated_by);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to save version before update
CREATE TRIGGER save_content_version_before_update
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION save_content_version();

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at DESC);

-- Content sections reference table (for admin UI navigation)
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL,    -- e.g., "hero", "services", "aboutPage"
    display_name_en TEXT NOT NULL,
    display_name_it TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    icon TEXT,                           -- Icon name for admin UI
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Public can read sections (for admin UI navigation)
CREATE POLICY "Anyone can read content sections"
    ON content_sections FOR SELECT
    USING (true);

-- Only admins can modify sections
CREATE POLICY "Admins can modify content sections"
    ON content_sections FOR ALL
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Seed initial section definitions
INSERT INTO content_sections (section_key, display_name_en, display_name_it, description, sort_order, icon) VALUES
    ('metadata', 'SEO & Metadata', 'SEO e Metadati', 'Page titles, descriptions, and SEO settings', 1, 'search'),
    ('nav', 'Navigation', 'Navigazione', 'Navigation menu labels', 2, 'menu'),
    ('hero', 'Homepage Hero', 'Hero Homepage', 'Main hero section on homepage', 3, 'home'),
    ('values', 'Values Section', 'Sezione Valori', 'Vision, mission, and values content', 4, 'heart'),
    ('services', 'Services Section', 'Sezione Servizi', 'Service offerings on homepage', 5, 'briefcase'),
    ('gallery', 'Gallery Section', 'Sezione Galleria', 'Portfolio gallery content', 6, 'image'),
    ('cta', 'Call to Action', 'Call to Action', 'CTA sections across the site', 7, 'megaphone'),
    ('footer', 'Footer', 'Footer', 'Footer content and links', 8, 'layout'),
    ('booking', 'Booking Page', 'Pagina Prenotazione', 'Consultation booking page content', 9, 'calendar'),
    ('common', 'Common Phrases', 'Frasi Comuni', 'Reusable text across multiple pages', 10, 'type'),
    ('collections', 'Collections Page', 'Pagina Collezioni', 'Collections/gallery page content', 11, 'grid'),
    ('consulting', 'Consulting Page', 'Pagina Consulenza', 'Online consulting services page', 12, 'video'),
    ('contactPage', 'Contact Page', 'Pagina Contatti', 'Contact form and info page', 13, 'mail'),
    ('aboutPage', 'About Page', 'Pagina Chi Siamo', 'About us page content', 14, 'users')
ON CONFLICT (section_key) DO NOTHING;
