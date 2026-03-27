import { google, calendar_v3 } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

/**
 * Initialize the OAuth client with the stored refresh token.
 * Call this before any calendar operation in server-side contexts.
 */
export function initWithRefreshToken() {
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!refreshToken) {
    throw new Error('GOOGLE_REFRESH_TOKEN is not configured')
  }
  oauth2Client.setCredentials({ refresh_token: refreshToken })
}

/**
 * Check if Google Calendar integration is configured
 */
export function isCalendarConfigured(): boolean {
  return !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_CALENDAR_ID
  )
}

export function getAuthUrl() {
  const scopes = [
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
  ]

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

export function setCredentials(tokens: {
  access_token?: string | null
  refresh_token?: string | null
}) {
  oauth2Client.setCredentials(tokens)
}

export function getCalendarClient() {
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function listEvents(
  calendarId = 'primary',
  timeMin?: string,
  timeMax?: string,
  maxResults = 10
): Promise<calendar_v3.Schema$Event[]> {
  const calendar = getCalendarClient()

  const response = await calendar.events.list({
    calendarId,
    timeMin: timeMin || new Date().toISOString(),
    timeMax,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  })

  return response.data.items || []
}

export async function createEvent(
  calendarId = 'primary',
  event: calendar_v3.Schema$Event,
  sendUpdates?: 'all' | 'externalOnly' | 'none'
): Promise<calendar_v3.Schema$Event> {
  const calendar = getCalendarClient()

  const response = await calendar.events.insert({
    calendarId,
    requestBody: event,
    ...(sendUpdates && { sendUpdates }),
  })

  return response.data
}

export async function updateEvent(
  calendarId = 'primary',
  eventId: string,
  event: calendar_v3.Schema$Event,
  sendUpdates?: 'all' | 'externalOnly' | 'none'
): Promise<calendar_v3.Schema$Event> {
  const calendar = getCalendarClient()

  const response = await calendar.events.update({
    calendarId,
    eventId,
    requestBody: event,
    ...(sendUpdates && { sendUpdates }),
  })

  return response.data
}

export async function deleteEvent(
  calendarId = 'primary',
  eventId: string,
  sendUpdates?: 'all' | 'externalOnly' | 'none'
): Promise<void> {
  const calendar = getCalendarClient()

  await calendar.events.delete({
    calendarId,
    eventId,
    ...(sendUpdates && { sendUpdates }),
  })
}

export async function listCalendars(): Promise<calendar_v3.Schema$CalendarListEntry[]> {
  const calendar = getCalendarClient()

  const response = await calendar.calendarList.list()

  return response.data.items || []
}
