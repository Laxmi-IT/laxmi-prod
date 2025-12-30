import { type NextRequest, NextResponse } from 'next/server'
import { updateSession, createMiddlewareClient } from '@/lib/supabase/middleware'
import { locales, defaultLocale, type Locale } from '@/i18n/config'

// Get the preferred locale from Accept-Language header
function getPreferredLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, priority = 'q=1'] = lang.trim().split(';')
      return {
        code: code.split('-')[0].toLowerCase(),
        priority: parseFloat(priority.replace('q=', '')),
      }
    })
    .sort((a, b) => b.priority - a.priority)

  // Find first matching locale
  for (const { code } of languages) {
    if (locales.includes(code as Locale)) {
      return code as Locale
    }
  }

  return defaultLocale
}

// Check if the pathname already has a locale prefix
function pathnameHasLocale(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files like .ico, .png, etc.
  ) {
    return await updateSession(request)
  }

  // ============= Admin Route Protection =============
  if (pathname.startsWith('/admin')) {
    // Allow access to login page without auth
    if (pathname === '/admin/login') {
      // If already logged in as admin, redirect to dashboard
      const { supabase, response } = createMiddlewareClient(request)
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user is an admin
        const { data: adminUser } = await supabase
          .from('admin_users')
          .select('is_active')
          .eq('id', user.id)
          .single()

        if (adminUser?.is_active) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
      }

      return response
    }

    // For all other admin routes, require authentication
    const { supabase, response } = createMiddlewareClient(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // Redirect to admin login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user is an active admin
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('is_active, role')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_active) {
      // User is not an admin, redirect to login with error
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(loginUrl)
    }

    // Admin is authenticated, continue
    return response
  }

  // ============= Public Site Locale Handling =============
  // Check if pathname already has a locale
  if (pathnameHasLocale(pathname)) {
    return await updateSession(request)
  }

  // Redirect to the preferred locale
  const locale = getPreferredLocale(request)
  const newUrl = new URL(`/${locale}${pathname}`, request.url)

  // Preserve query parameters
  newUrl.search = request.nextUrl.search

  return NextResponse.redirect(newUrl)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
