import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// ── Mocks ──
const mockSendMail = vi.fn()

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail: mockSendMail })),
  },
}))

const mockCreateEvent = vi.fn()
const mockInitWithRefreshToken = vi.fn()
const mockIsCalendarConfigured = vi.fn()

vi.mock('@/lib/google/calendar', () => ({
  createEvent: (...args: any[]) => mockCreateEvent(...args),
  initWithRefreshToken: () => mockInitWithRefreshToken(),
  isCalendarConfigured: () => mockIsCalendarConfigured(),
}))

import { POST } from '@/app/api/book/route'

function makeBookingRequest(body: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/book', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': `${Math.random()}`, // unique IP per test to avoid rate limit
    },
  })
}

const validBody = {
  name: 'Maria Rossi',
  email: 'maria@example.com',
  phone: '+39 123 456 789',
  date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week from now
  time: '10:00',
  message: 'Interested in kitchen redesign',
}

describe('POST /api/book', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSendMail.mockResolvedValue({ messageId: 'test-id' })
    mockIsCalendarConfigured.mockReturnValue(true)
    mockCreateEvent.mockResolvedValue({})
  })

  it('returns success for valid request', async () => {
    const res = await POST(makeBookingRequest(validBody))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('sends concierge and client emails', async () => {
    await POST(makeBookingRequest(validBody))
    expect(mockSendMail).toHaveBeenCalledTimes(2)
    expect(mockSendMail.mock.calls[0][0].subject).toContain('Maria Rossi')
    expect(mockSendMail.mock.calls[1][0].to).toBe('maria@example.com')
  })

  it('creates a Google Calendar event', async () => {
    await POST(makeBookingRequest(validBody))
    expect(mockInitWithRefreshToken).toHaveBeenCalled()
    expect(mockCreateEvent).toHaveBeenCalledWith(
      'test-calendar-id',
      expect.objectContaining({
        summary: expect.stringContaining('Maria Rossi'),
      })
    )
  })

  it('returns 400 for missing required fields', async () => {
    const res = await POST(makeBookingRequest({ name: 'Test' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email', async () => {
    const res = await POST(makeBookingRequest({ ...validBody, email: 'not-an-email' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for past date', async () => {
    const res = await POST(makeBookingRequest({ ...validBody, date: '2020-01-01' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid time', async () => {
    const res = await POST(makeBookingRequest({ ...validBody, time: '25:99' }))
    expect(res.status).toBe(400)
  })

  it('succeeds even when email sending fails', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP down'))
    const res = await POST(makeBookingRequest(validBody))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('succeeds even when calendar creation fails', async () => {
    mockCreateEvent.mockRejectedValue(new Error('Calendar API error'))
    const res = await POST(makeBookingRequest(validBody))
    const data = await res.json()
    expect(res.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('skips calendar when not configured', async () => {
    mockIsCalendarConfigured.mockReturnValue(false)
    await POST(makeBookingRequest(validBody))
    expect(mockCreateEvent).not.toHaveBeenCalled()
  })

  it('handles optional phone and message', async () => {
    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const body = { name: 'Test', email: 'test@test.com', date: futureDate, time: '14:00' }
    const res = await POST(makeBookingRequest(body))
    expect(res.status).toBe(200)
  })

  it('returns 500 for malformed JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/book', {
      method: 'POST',
      body: 'not json',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': 'malformed-json-test' },
    })
    const res = await POST(req)
    expect(res.status).toBe(500)
  })

  it('escapes HTML in email templates (XSS prevention)', async () => {
    const xssBody = {
      ...validBody,
      name: '<script>alert("xss")</script>',
      message: '<img src=x onerror="steal()">',
    }
    await POST(makeBookingRequest(xssBody))
    const emailHtml = mockSendMail.mock.calls[0][0].html
    expect(emailHtml).not.toContain('<script>')
    expect(emailHtml).toContain('&lt;script&gt;')
  })

  it('strips CRLF from email subject (header injection prevention)', async () => {
    const crlfBody = {
      ...validBody,
      name: 'Test\r\nBcc: attacker@evil.com',
    }
    await POST(makeBookingRequest(crlfBody))
    const subject = mockSendMail.mock.calls[0][0].subject
    expect(subject).not.toContain('\r')
    expect(subject).not.toContain('\n')
  })

  it('returns 429 when rate limited', async () => {
    const ip = 'rate-limit-test-ip'
    const makeReq = () => new NextRequest('http://localhost:3000/api/book', {
      method: 'POST',
      body: JSON.stringify(validBody),
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    })

    // First 5 should succeed
    for (let i = 0; i < 5; i++) {
      await POST(makeReq())
    }

    // 6th should be rate limited
    const res = await POST(makeReq())
    expect(res.status).toBe(429)
  })
})
