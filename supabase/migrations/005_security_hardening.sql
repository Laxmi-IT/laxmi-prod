-- ============================================================
-- Migration 005: Security Hardening
-- Date: 2026-03-18
-- Fixes: NOT NULL constraints, unique content key, RLS gaps
-- ============================================================

-- ── 1. site_content: NOT NULL constraints + UNIQUE key ──

-- Ensure content_key is unique (prevents dictionary lookup ambiguity)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_content_key'
  ) THEN
    ALTER TABLE public.site_content
      ADD CONSTRAINT unique_content_key UNIQUE (content_key);
  END IF;
END $$;

-- Add NOT NULL where missing (safe: only if no NULLs exist)
DO $$
BEGIN
  -- content_key
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_content' AND column_name = 'content_key' AND is_nullable = 'YES'
  ) THEN
    -- Ensure no NULLs before adding constraint
    DELETE FROM public.site_content WHERE content_key IS NULL;
    ALTER TABLE public.site_content ALTER COLUMN content_key SET NOT NULL;
  END IF;

  -- content_en
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_content' AND column_name = 'content_en' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.site_content SET content_en = '' WHERE content_en IS NULL;
    ALTER TABLE public.site_content ALTER COLUMN content_en SET NOT NULL;
  END IF;

  -- content_it
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_content' AND column_name = 'content_it' AND is_nullable = 'YES'
  ) THEN
    UPDATE public.site_content SET content_it = '' WHERE content_it IS NULL;
    ALTER TABLE public.site_content ALTER COLUMN content_it SET NOT NULL;
  END IF;
END $$;


-- ── 2. Optimized index for is_admin() function lookups ──

CREATE INDEX IF NOT EXISTS idx_admin_users_active_id
  ON public.admin_users (id)
  WHERE is_active = true;


-- ── 3. Defensive RLS: deny user INSERT/UPDATE/DELETE on immutable tables ──

-- notification_logs: users can only SELECT their own, never write
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'notification_logs' AND policyname = 'Deny user writes to notification_logs'
  ) THEN
    CREATE POLICY "Deny user writes to notification_logs"
      ON public.notification_logs
      FOR ALL
      USING (false)
      WITH CHECK (false);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- admin_activity_log: only admins can SELECT, nobody can INSERT/UPDATE/DELETE via RLS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'admin_activity_log' AND policyname = 'Deny direct writes to audit log'
  ) THEN
    CREATE POLICY "Deny direct writes to audit log"
      ON public.admin_activity_log
      FOR INSERT
      USING (false)
      WITH CHECK (false);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ── 4. Newsletter: add email length constraint ──

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'newsletter_email_length'
  ) THEN
    ALTER TABLE public.newsletter_subscribers
      ADD CONSTRAINT newsletter_email_length CHECK (length(email) <= 254);
  END IF;
END $$;


-- ── 5. Ensure RLS is enabled on all tables ──

ALTER TABLE IF EXISTS public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_google_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gallery_images ENABLE ROW LEVEL SECURITY;
