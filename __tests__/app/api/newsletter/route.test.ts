import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Supabase mock ──
const mockInsert = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

import { POST } from '@/app/api/newsletter/route'

function makeRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/newsletter', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `${Math.random()}`, // unique IP per test
    },
  })
}

describe('POST /api/newsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({ insert: mockInsert })
  })

  it('returns success for valid email', async () => {
    const res = await POST(makeRequest({ email: 'user@example.com', locale: 'en' }))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('inserts with lowercase email', async () => {
    await POST(makeRequest({ email: 'User@Example.com', locale: 'en' }))
    expect(mockInsert).toHaveBeenCalledWith({
      email: 'user@example.com',
      locale: 'en',
    })
  })

  it('defaults locale to "it" for non-en', async () => {
    await POST(makeRequest({ email: 'user@test.com', locale: 'fr' }))
    expect(mockInsert).toHaveBeenCalledWith({
      email: 'user@test.com',
      locale: 'it',
    })
  })

  it('returns 400 for missing email', async () => {
    const res = await POST(makeRequest({}))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email format', async () => {
    const res = await POST(makeRequest({ email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('handles duplicate subscription gracefully', async () => {
    mockInsert.mockResolvedValue({ error: { code: '23505', message: 'unique violation' } })
    const res = await POST(makeRequest({ email: 'user@test.com' }))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.alreadySubscribed).toBe(true)
  })

  it('returns 500 for other DB errors', async () => {
    mockInsert.mockResolvedValue({ error: { code: '42000', message: 'unknown error' } })
    const res = await POST(makeRequest({ email: 'user@test.com' }))
    expect(res.status).toBe(500)
  })

  it('returns 500 for unexpected exceptions', async () => {
    mockFrom.mockImplementation(() => { throw new Error('Unexpected') })
    const res = await POST(makeRequest({ email: 'user@test.com' }))
    expect(res.status).toBe(500)
  })

  it('returns 429 when rate limited', async () => {
    const ip = 'newsletter-rate-limit-test'
    const makeReq = () => new NextRequest('http://localhost:3000/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@test.com', locale: 'en' }),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    })

    // First 3 should succeed
    for (let i = 0; i < 3; i++) {
      await POST(makeReq())
    }

    // 4th should be rate limited
    const res = await POST(makeReq())
    expect(res.status).toBe(429)
  })
})
