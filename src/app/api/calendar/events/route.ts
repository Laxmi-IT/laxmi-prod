import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setCredentials, listEvents, createEvent } from '@/lib/google/calendar'

async function getGoogleTokens(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('user_google_tokens')
    .select('*')
    .eq('user_id', userId)
    .single()

  return data
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tokens = await getGoogleTokens(user.id)
    if (!tokens) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      )
    }

    setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    })

    const searchParams = request.nextUrl.searchParams
    const timeMin = searchParams.get('timeMin') || undefined
    const timeMax = searchParams.get('timeMax') || undefined
    const maxResults = parseInt(searchParams.get('maxResults') || '10')

    const events = await listEvents('primary', timeMin, timeMax, maxResults)

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching calendar events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tokens = await getGoogleTokens(user.id)
    if (!tokens) {
      return NextResponse.json(
        { error: 'Google Calendar not connected' },
        { status: 400 }
      )
    }

    setCredentials({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    })

    const eventData = await request.json()
    const event = await createEvent('primary', eventData)

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}
