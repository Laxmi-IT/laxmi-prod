import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks ──
const mockGetUser = vi.fn()
const mockTokenSelect = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockTokenSelect,
        })),
      })),
    })),
  })),
}))

const mockSetCredentials = vi.fn()
const mockListEvents = vi.fn()
const mockCreateEvent = vi.fn()

vi.mock('@/lib/google/calendar', () => ({
  setCredentials: (...args: any[]) => mockSetCredentials(...args),
  listEvents: (...args: any[]) => mockListEvents(...args),
  createEvent: (...args: any[]) => mockCreateEvent(...args),
}))

import { GET, POST } from '@/app/api/calendar/events/route'

function makeGetRequest(params?: Record<string, string>): NextRequest {
  const url = new URL('http://localhost:3000/api/calendar/events')
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  return new NextRequest(url)
}

function makePostRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/calendar/events', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('GET /api/calendar/events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(401)
  })

  it('returns 400 when Google not connected', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({ data: null })
    const res = await GET(makeGetRequest())
    expect(res.status).toBe(400)
  })

  it('returns events when authenticated and connected', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({
      data: { access_token: 'at', refresh_token: 'rt' },
    })
    mockListEvents.mockResolvedValue([{ id: 'ev1', summary: 'Test Event' }])

    const res = await GET(makeGetRequest())
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.events).toHaveLength(1)
    expect(mockSetCredentials).toHaveBeenCalledWith({
      access_token: 'at',
      refresh_token: 'rt',
    })
  })

  it('passes query params to listEvents', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({
      data: { access_token: 'at', refresh_token: 'rt' },
    })
    mockListEvents.mockResolvedValue([])

    await GET(makeGetRequest({ timeMin: '2026-01-01', maxResults: '5' }))
    expect(mockListEvents).toHaveBeenCalledWith('primary', '2026-01-01', undefined, 5)
  })
})

describe('POST /api/calendar/events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makePostRequest({ summary: 'Test' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 when Google not connected', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({ data: null })
    const res = await POST(makePostRequest({ summary: 'Test' }))
    expect(res.status).toBe(400)
  })

  it('creates event when authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({
      data: { access_token: 'at', refresh_token: 'rt' },
    })
    mockCreateEvent.mockResolvedValue({ id: 'new-ev', summary: 'Created' })

    const res = await POST(makePostRequest({ summary: 'New Event' }))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.event.summary).toBe('Created')
  })

  it('returns 500 when calendar API fails', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockTokenSelect.mockResolvedValue({
      data: { access_token: 'at', refresh_token: 'rt' },
    })
    mockCreateEvent.mockRejectedValue(new Error('API Error'))

    const res = await POST(makePostRequest({ summary: 'Test' }))
    expect(res.status).toBe(500)
  })
})
