import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks ──
const mockGetTokens = vi.fn()

vi.mock('@/lib/google/calendar', () => ({
  getTokens: (...args: any[]) => mockGetTokens(...args),
}))

const mockGetUser = vi.fn()
const mockUpsert = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      upsert: mockUpsert,
    })),
  })),
}))

import { GET } from '@/app/api/auth/google/callback/route'

function makeCallbackRequest(params: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/auth/google/callback')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

describe('GET /api/auth/google/callback', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpsert.mockResolvedValue({ error: null })
  })

  it('redirects with safe error for known OAuth error', async () => {
    const res = await GET(makeCallbackRequest({ error: 'access_denied' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('error=access_denied')
  })

  it('redirects with unknown_error for unexpected error values', async () => {
    const res = await GET(makeCallbackRequest({ error: 'https://evil.com/phish' }))
    expect(res.status).toBe(307)
    const location = res.headers.get('location')!
    expect(location).toContain('error=unknown_error')
    expect(location).not.toContain('evil.com')
  })

  it('redirects with error when no code param', async () => {
    const res = await GET(makeCallbackRequest({}))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('error=missing_code')
  })

  it('exchanges code for tokens and stores them', async () => {
    mockGetTokens.mockResolvedValue({
      access_token: 'at',
      refresh_token: 'rt',
      expiry_date: 12345,
    })
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const res = await GET(makeCallbackRequest({ code: 'test-code' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('google_connected=true')
    expect(mockGetTokens).toHaveBeenCalledWith('test-code')
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'u1',
        access_token: 'at',
        refresh_token: 'rt',
      })
    )
  })

  it('redirects to admin dashboard on success', async () => {
    mockGetTokens.mockResolvedValue({ access_token: 'at', refresh_token: 'rt', expiry_date: 0 })
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })

    const res = await GET(makeCallbackRequest({ code: 'valid-code' }))
    const location = res.headers.get('location')!
    expect(location).toContain('/admin/dashboard')
  })

  it('redirects with error when token exchange fails', async () => {
    mockGetTokens.mockRejectedValue(new Error('Invalid code'))

    const res = await GET(makeCallbackRequest({ code: 'bad-code' }))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('error=token_exchange_failed')
  })
})
