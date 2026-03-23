import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { getPreferredLocale, pathnameHasLocale } from '@/middleware'

// Mock the supabase middleware module
vi.mock('@/lib/supabase/middleware', () => ({
  updateSession: vi.fn(async () => new Response(null, { status: 200 })),
  createMiddlewareClient: vi.fn(() => ({
    supabase: {
      auth: {
        getUser: vi.fn(async () => ({ data: { user: null } })),
      },
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(async () => ({ data: null })),
          })),
        })),
      })),
    },
    response: new Response(null, { status: 200 }),
  })),
}))

function makeRequest(url: string, headers?: Record<string, string>): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost:3000'), {
    headers: headers ? new Headers(headers) : undefined,
  })
}

// ── getPreferredLocale ──

describe('getPreferredLocale', () => {
  it('returns "it" (default) when no Accept-Language header', () => {
    const req = makeRequest('http://localhost:3000/')
    expect(getPreferredLocale(req)).toBe('it')
  })

  it('returns "it" for Italian Accept-Language', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'it-IT,it;q=0.9,en;q=0.8',
    })
    expect(getPreferredLocale(req)).toBe('it')
  })

  it('returns "en" for English Accept-Language', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'en-US,en;q=0.9',
    })
    expect(getPreferredLocale(req)).toBe('en')
  })

  it('returns "en" when English has higher priority than Italian', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'en;q=0.9,it;q=0.5',
    })
    expect(getPreferredLocale(req)).toBe('en')
  })

  it('returns "it" when Italian has higher priority', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'it;q=0.9,en;q=0.5',
    })
    expect(getPreferredLocale(req)).toBe('it')
  })

  it('returns default for unsupported languages', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'fr-FR,de;q=0.9',
    })
    expect(getPreferredLocale(req)).toBe('it')
  })

  it('parses complex Accept-Language with multiple entries', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'fr;q=0.8,de;q=0.7,en;q=0.6',
    })
    expect(getPreferredLocale(req)).toBe('en')
  })

  it('handles missing quality values (defaults to q=1)', () => {
    const req = makeRequest('http://localhost:3000/', {
      'accept-language': 'en',
    })
    expect(getPreferredLocale(req)).toBe('en')
  })
})

// ── pathnameHasLocale ──

describe('pathnameHasLocale', () => {
  it('returns true for /it', () => {
    expect(pathnameHasLocale('/it')).toBe(true)
  })

  it('returns true for /en', () => {
    expect(pathnameHasLocale('/en')).toBe(true)
  })

  it('returns true for /it/about', () => {
    expect(pathnameHasLocale('/it/about')).toBe(true)
  })

  it('returns true for /en/consulting', () => {
    expect(pathnameHasLocale('/en/consulting')).toBe(true)
  })

  it('returns false for /', () => {
    expect(pathnameHasLocale('/')).toBe(false)
  })

  it('returns false for /about', () => {
    expect(pathnameHasLocale('/about')).toBe(false)
  })

  it('returns false for /italian (partial match)', () => {
    expect(pathnameHasLocale('/italian')).toBe(false)
  })

  it('returns false for /english', () => {
    expect(pathnameHasLocale('/english')).toBe(false)
  })
})

// ── middleware (full flow) ──

describe('middleware', () => {
  let middlewareFn: typeof import('@/middleware').middleware

  beforeEach(async () => {
    vi.clearAllMocks()
    const mod = await import('@/middleware')
    middlewareFn = mod.middleware
  })

  it('skips locale redirect for /_next paths', async () => {
    const req = makeRequest('http://localhost:3000/_next/static/chunk.js')
    const res = await middlewareFn(req)
    expect(res.status).not.toBe(307)
  })

  it('skips locale redirect for /api paths', async () => {
    const req = makeRequest('http://localhost:3000/api/newsletter')
    const res = await middlewareFn(req)
    expect(res.status).not.toBe(307)
  })

  it('skips locale redirect for static files', async () => {
    const req = makeRequest('http://localhost:3000/favicon.ico')
    const res = await middlewareFn(req)
    expect(res.status).not.toBe(307)
  })

  it('redirects bare "/" to "/it" (default locale)', async () => {
    const req = makeRequest('http://localhost:3000/')
    const res = await middlewareFn(req)
    expect(res.status).toBe(307)
    expect(new URL(res.headers.get('location')!).pathname).toBe('/it/')
  })

  it('redirects "/about" to "/it/about" for default locale', async () => {
    const req = makeRequest('http://localhost:3000/about')
    const res = await middlewareFn(req)
    expect(res.status).toBe(307)
    expect(new URL(res.headers.get('location')!).pathname).toBe('/it/about')
  })

  it('redirects to "/en/about" when Accept-Language is English', async () => {
    const req = makeRequest('http://localhost:3000/about', {
      'accept-language': 'en-US,en;q=0.9',
    })
    const res = await middlewareFn(req)
    expect(res.status).toBe(307)
    expect(new URL(res.headers.get('location')!).pathname).toBe('/en/about')
  })
})
