import { vi } from 'vitest'

// ── Environment variables (set before any module imports) ──
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.GOOGLE_CLIENT_ID = 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret'
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/api/auth/google/callback'
process.env.GOOGLE_REFRESH_TOKEN = 'test-refresh-token'
process.env.GOOGLE_CALENDAR_ID = 'test-calendar-id'
process.env.SMTP_HOST = 'smtp.test.com'
process.env.SMTP_PORT = '587'
process.env.SMTP_USER = 'test@test.com'
process.env.SMTP_PASS = 'test-password'
process.env.CONCIERGE_EMAIL = 'concierge@test.com'
process.env.NEXT_PUBLIC_SITE_URL = 'https://www.thelaxmii.com'

// ── Stub next/cache ──
vi.mock('next/cache', () => ({
  unstable_cache: (fn: Function) => fn,
  revalidateTag: vi.fn(),
}))

// ── Stub next/headers ──
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(() => []),
  })),
  headers: vi.fn(() => new Headers()),
}))
