import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPostGridClient, type EmailParams } from '@/lib/postgrid/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as EmailParams

    if (!body.to || !body.from || !body.subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, from, subject' },
        { status: 400 }
      )
    }

    if (!body.html && !body.text && !body.templateId) {
      return NextResponse.json(
        { error: 'Must provide html, text, or templateId' },
        { status: 400 }
      )
    }

    const postGrid = getPostGridClient()
    const result = await postGrid.sendEmail(body)

    // Log the notification in Supabase
    await supabase.from('notification_logs').insert({
      user_id: user.id,
      type: 'email',
      recipient: body.to,
      subject: body.subject,
      status: 'sent',
      provider_response: result,
      created_at: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Error sending email notification:', error)
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    )
  }
}
