import { describe, it, expect, vi } from 'vitest'

const mockGetAuthUrl = vi.fn()

vi.mock('@/lib/google/calendar', () => ({
  getAuthUrl: () => mockGetAuthUrl(),
}))

import { GET } from '@/app/api/auth/google/route'

describe('GET /api/auth/google', () => {
  it('redirects to Google auth URL', async () => {
    mockGetAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/auth?foo=bar')
    const res = await GET()
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('accounts.google.com')
  })

  it('returns 500 when getAuthUrl throws', async () => {
    mockGetAuthUrl.mockImplementation(() => { throw new Error('Missing config') })
    const res = await GET()
    expect(res.status).toBe(500)
  })

  it('includes OAuth scopes in redirect URL', async () => {
    mockGetAuthUrl.mockReturnValue('https://accounts.google.com/o/oauth2/auth?scope=calendar')
    const res = await GET()
    expect(res.headers.get('location')).toContain('scope=calendar')
  })
})
