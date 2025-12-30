-- Admin Users table for dashboard access
-- Links to auth.users for authentication

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
-- Only active admins can view admin users
CREATE POLICY "Admins can view admin users"
    ON admin_users FOR SELECT
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Only super_admins can insert new admins
CREATE POLICY "Super admins can insert admin users"
    ON admin_users FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin' AND is_active = true));

-- Super admins can update any admin, admins can update editors
CREATE POLICY "Super admins can update admin users"
    ON admin_users FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin' AND is_active = true)
        OR (auth.uid() = id AND auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true))
    );

-- Only super_admins can delete admins
CREATE POLICY "Super admins can delete admin users"
    ON admin_users FOR DELETE
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE role = 'super_admin' AND is_active = true));

-- Trigger for updated_at
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Admin activity log for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view activity logs
CREATE POLICY "Admins can view activity logs"
    ON admin_activity_log FOR SELECT
    USING (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Only system/admins can insert activity logs
CREATE POLICY "Admins can insert activity logs"
    ON admin_activity_log FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admin_users WHERE is_active = true));

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_entity ON admin_activity_log(entity_type, entity_id);
