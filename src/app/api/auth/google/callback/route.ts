import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/lib/google/calendar'
import { createClient } from '@/lib/supabase/server'

// Only allow expected OAuth error values from Google
const ALLOWED_OAUTH_ERRORS = new Set([
  'access_denied',
  'invalid_scope',
  'server_error',
  'temporarily_unavailable',
])

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    // Validate error is an expected OAuth error — do not reflect arbitrary input
    const safeError = ALLOWED_OAUTH_ERRORS.has(error) ? error : 'unknown_error'
    return NextResponse.redirect(
      new URL(`/admin/login?error=${safeError}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/login?error=missing_code', request.url)
    )
  }

  try {
    const tokens = await getTokens(code)

    // Store tokens in Supabase for the current user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      await supabase
        .from('user_google_tokens')
        .upsert({
          user_id: user.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          updated_at: new Date().toISOString(),
        })
    }

    return NextResponse.redirect(
      new URL('/admin/dashboard?google_connected=true', request.url)
    )
  } catch (err) {
    console.error('Google OAuth token exchange failed:', err instanceof Error ? err.message : 'Unknown error')
    return NextResponse.redirect(
      new URL('/admin/login?error=token_exchange_failed', request.url)
    )
  }
}
