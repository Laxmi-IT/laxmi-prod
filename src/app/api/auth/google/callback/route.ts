import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/lib/google/calendar'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?error=No authorization code provided', request.url)
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
      new URL('/dashboard?google_connected=true', request.url)
    )
  } catch (err) {
    console.error('Error exchanging code for tokens:', err)
    return NextResponse.redirect(
      new URL('/?error=Failed to authenticate with Google', request.url)
    )
  }
}
