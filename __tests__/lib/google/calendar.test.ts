import { describe, it, expect, vi, beforeEach } from 'vitest'

// Hoist mocks so they're available when vi.mock factory runs
const { mockGenerateAuthUrl, mockGetToken, mockSetCredentials, mockInsert, mockUpdate, mockDelete } = vi.hoisted(() => ({
  mockGenerateAuthUrl: vi.fn(),
  mockGetToken: vi.fn(),
  mockSetCredentials: vi.fn(),
  mockInsert: vi.fn(),
  mockUpdate: vi.fn(),
  mockDelete: vi.fn(),
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
          insert: mockInsert,
          update: mockUpdate,
          delete: mockDelete,
        },
        calendarList: { list: vi.fn() },
      })),
    },
  }
})

import { isCalendarConfigured, getAuthUrl, getTokens, initWithRefreshToken, createEvent, updateEvent, deleteEvent } from '@/lib/google/calendar'

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

describe('createEvent', () => {
  beforeEach(() => {
    mockInsert.mockResolvedValue({ data: { id: 'evt-1' } })
    mockSetCredentials.mockClear()
    mockInsert.mockClear()
  })

  it('passes sendUpdates to events.insert when provided', async () => {
    initWithRefreshToken()
    await createEvent('primary', { summary: 'Test' }, 'all')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: 'primary',
        requestBody: { summary: 'Test' },
        sendUpdates: 'all',
      })
    )
  })

  it('omits sendUpdates when not provided', async () => {
    initWithRefreshToken()
    await createEvent('primary', { summary: 'Test' })
    const callArgs = mockInsert.mock.calls[0][0]
    expect(callArgs).not.toHaveProperty('sendUpdates')
  })

  it('returns event data from response', async () => {
    initWithRefreshToken()
    const result = await createEvent('primary', { summary: 'Test' })
    expect(result).toEqual({ id: 'evt-1' })
  })
})

describe('updateEvent', () => {
  beforeEach(() => {
    mockUpdate.mockResolvedValue({ data: { id: 'evt-1' } })
    mockUpdate.mockClear()
  })

  it('passes sendUpdates to events.update when provided', async () => {
    initWithRefreshToken()
    await updateEvent('primary', 'evt-1', { summary: 'Updated' }, 'all')
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: 'primary',
        eventId: 'evt-1',
        requestBody: { summary: 'Updated' },
        sendUpdates: 'all',
      })
    )
  })

  it('omits sendUpdates when not provided', async () => {
    initWithRefreshToken()
    await updateEvent('primary', 'evt-1', { summary: 'Updated' })
    const callArgs = mockUpdate.mock.calls[0][0]
    expect(callArgs).not.toHaveProperty('sendUpdates')
  })
})

describe('deleteEvent', () => {
  beforeEach(() => {
    mockDelete.mockResolvedValue({})
    mockDelete.mockClear()
  })

  it('passes sendUpdates to events.delete when provided', async () => {
    initWithRefreshToken()
    await deleteEvent('primary', 'evt-1', 'all')
    expect(mockDelete).toHaveBeenCalledWith(
      expect.objectContaining({
        calendarId: 'primary',
        eventId: 'evt-1',
        sendUpdates: 'all',
      })
    )
  })

  it('omits sendUpdates when not provided', async () => {
    initWithRefreshToken()
    await deleteEvent('primary', 'evt-1')
    const callArgs = mockDelete.mock.calls[0][0]
    expect(callArgs).not.toHaveProperty('sendUpdates')
  })
})
