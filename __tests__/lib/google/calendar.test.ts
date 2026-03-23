import { describe, it, expect, vi } from 'vitest'

// Hoist mocks so they're available when vi.mock factory runs
const { mockGenerateAuthUrl, mockGetToken, mockSetCredentials } = vi.hoisted(() => ({
  mockGenerateAuthUrl: vi.fn(),
  mockGetToken: vi.fn(),
  mockSetCredentials: vi.fn(),
}))

vi.mock('googleapis', () => {
  function OAuth2() {
    return {
      generateAuthUrl: mockGenerateAuthUrl,
      getToken: mockGetToken,
      setCredentials: mockSetCredentials,
    }
  }

  return {
    google: {
      auth: { OAuth2 },
      calendar: vi.fn(() => ({
        events: {
          list: vi.fn(),
          insert: vi.fn(),
          update: vi.fn(),
          delete: vi.fn(),
        },
        calendarList: { list: vi.fn() },
      })),
    },
  }
})

import { isCalendarConfigured, getAuthUrl, getTokens, initWithRefreshToken } from '@/lib/google/calendar'

describe('isCalendarConfigured', () => {
  it('returns true when all env vars are set', () => {
    expect(isCalendarConfigured()).toBe(true)
  })

  it('returns false when GOOGLE_CLIENT_ID is missing', () => {
    const original = process.env.GOOGLE_CLIENT_ID
    delete process.env.GOOGLE_CLIENT_ID
    expect(isCalendarConfigured()).toBe(false)
    process.env.GOOGLE_CLIENT_ID = original
  })

  it('returns false when GOOGLE_CALENDAR_ID is missing', () => {
    const original = process.env.GOOGLE_CALENDAR_ID
    delete process.env.GOOGLE_CALENDAR_ID
    expect(isCalendarConfigured()).toBe(false)
    process.env.GOOGLE_CALENDAR_ID = original
  })
})

describe('getAuthUrl', () => {
  it('calls generateAuthUrl with correct options', () => {
    mockGenerateAuthUrl.mockReturnValue('https://accounts.google.com/auth')
    const url = getAuthUrl()
    expect(url).toBe('https://accounts.google.com/auth')
    expect(mockGenerateAuthUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        access_type: 'offline',
        prompt: 'consent',
      })
    )
  })
})

describe('getTokens', () => {
  it('exchanges code for tokens', async () => {
    mockGetToken.mockResolvedValue({
      tokens: { access_token: 'at', refresh_token: 'rt' },
    })
    const tokens = await getTokens('test-code')
    expect(tokens).toEqual({ access_token: 'at', refresh_token: 'rt' })
    expect(mockGetToken).toHaveBeenCalledWith('test-code')
  })
})

describe('initWithRefreshToken', () => {
  it('sets refresh token credentials', () => {
    initWithRefreshToken()
    expect(mockSetCredentials).toHaveBeenCalledWith({
      refresh_token: 'test-refresh-token',
    })
  })

  it('throws when GOOGLE_REFRESH_TOKEN is missing', () => {
    const original = process.env.GOOGLE_REFRESH_TOKEN
    delete process.env.GOOGLE_REFRESH_TOKEN
    expect(() => initWithRefreshToken()).toThrow('GOOGLE_REFRESH_TOKEN is not configured')
    process.env.GOOGLE_REFRESH_TOKEN = original
  })
})
