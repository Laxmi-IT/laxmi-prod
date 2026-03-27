import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import {
  initWithRefreshToken,
  createEvent,
  isCalendarConfigured,
} from '@/lib/google/calendar'
import {
  escapeHtml,
  stripCRLF,
  truncate,
  checkRateLimit,
  getClientIp,
  isValidFutureDate,
  isValidTime,
} from '@/lib/security'

// Configuration
const CONCIERGE_EMAIL = process.env.CONCIERGE_EMAIL || 'thelaxmii07@gmail.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thelaxmii.com'
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

interface ConsultationRequest {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  message?: string
  locale?: string
}

// Client email translations
const clientEmailStrings = {
  en: {
    subject: 'Your LAXMI Consultation Request',
    greeting: (name: string) => `Thank You, ${name}`,
    received: 'We have received your consultation request and are delighted by your interest in LAXMI.',
    preferredTime: 'Your Preferred Time',
    conciergeNote: 'Our design concierge will contact you within 24 hours to confirm.',
    explore: 'In the meantime, we invite you to explore our curated collection of exceptional Italian craftsmanship.',
    closing: 'We look forward to creating something beautiful together.',
    byAppointment: 'By Appointment Only',
  },
  it: {
    subject: 'La Tua Richiesta di Consulenza LAXMI',
    greeting: (name: string) => `Grazie, ${name}`,
    received: 'Abbiamo ricevuto la tua richiesta di consulenza e siamo lieti del tuo interesse per LAXMI.',
    preferredTime: 'La Tua Preferenza di Orario',
    conciergeNote: 'Il nostro concierge ti contatterà entro 24 ore per confermare.',
    explore: 'Nel frattempo, ti invitiamo a scoprire la nostra collezione curata di eccellenza artigianale italiana.',
    closing: 'Non vediamo l\'ora di creare qualcosa di bello insieme.',
    byAppointment: 'Solo su Appuntamento',
  },
}

// Format date for display
function formatDate(dateStr: string, locale = 'en'): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format time for display
function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

// Create email transporter
function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    return null
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

// Generate HTML email for concierge (all user inputs escaped)
function generateConciergeEmail(request: ConsultationRequest): string {
  const safeName = escapeHtml(request.name)
  const safeEmail = escapeHtml(request.email)
  const safePhone = request.phone ? escapeHtml(request.phone) : ''
  const safeMessage = request.message ? escapeHtml(request.message) : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { border-bottom: 2px solid #c9a961; padding-bottom: 20px; margin-bottom: 30px; }
    .logo { font-size: 24px; letter-spacing: 0.3em; color: #1a1a1a; }
    .badge { display: inline-block; background: #c9a961; color: white; padding: 4px 12px; font-size: 12px; letter-spacing: 0.1em; margin-top: 8px; }
    .section { margin-bottom: 25px; }
    .label { font-size: 11px; letter-spacing: 0.15em; color: #8b7355; text-transform: uppercase; margin-bottom: 4px; }
    .value { font-size: 16px; color: #1a1a1a; }
    .highlight { background: #faf8f5; padding: 20px; border-left: 3px solid #c9a961; margin: 20px 0; }
    .footer { border-top: 1px solid #e5e5e5; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #666; }
    .action-btn { display: inline-block; background: #8b7355; color: white; padding: 12px 24px; text-decoration: none; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${SITE_URL}/logo.png" alt="LAXMI" width="80" height="80" style="display: block; margin-bottom: 12px;" />
      <div class="logo">LAXMI</div>
      <div class="badge">NEW CONSULTATION REQUEST</div>
    </div>

    <p>A new consultation request has been submitted through the website.</p>

    <div class="section">
      <div class="label">Client Name</div>
      <div class="value">${safeName}</div>
    </div>

    <div class="section">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
    </div>

    ${safePhone ? `
    <div class="section">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${safePhone}">${safePhone}</a></div>
    </div>
    ` : ''}

    <div class="highlight">
      <div class="label">Preferred Appointment</div>
      <div class="value" style="font-size: 18px;">
        ${formatDate(request.date)} at ${formatTime(request.time)}
      </div>
    </div>

    ${safeMessage ? `
    <div class="section">
      <div class="label">Project Details</div>
      <div class="value" style="white-space: pre-wrap;">${safeMessage}</div>
    </div>
    ` : ''}

    <a href="mailto:${safeEmail}?subject=Your%20LAXMI%20Consultation%20Request&body=Dear%20${encodeURIComponent(request.name)},%0A%0AThank%20you%20for%20your%20interest%20in%20LAXMI.%0A%0A" class="action-btn">
      Reply to Client
    </a>

    <div class="footer">
      <p>This request was submitted on ${new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}</p>
      <p>LAXMI &mdash; Italian Luxury Interiors</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Generate confirmation email for client (name escaped, locale-aware)
function generateClientEmail(request: ConsultationRequest): string {
  const safeName = escapeHtml(request.name)
  const lang = request.locale === 'it' ? 'it' : 'en'
  const t = clientEmailStrings[lang]

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.8; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; border-bottom: 1px solid #e5e5e5; padding-bottom: 30px; margin-bottom: 30px; }
    .logo { font-size: 28px; letter-spacing: 0.3em; color: #1a1a1a; }
    .tagline { font-size: 12px; letter-spacing: 0.2em; color: #8b7355; margin-top: 8px; }
    .content { text-align: center; }
    h1 { font-weight: 300; font-size: 24px; margin-bottom: 20px; }
    .highlight { background: #faf8f5; padding: 25px; margin: 30px 0; text-align: center; }
    .date { font-size: 18px; color: #1a1a1a; }
    .note { font-size: 14px; color: #666; margin-top: 10px; }
    .footer { text-align: center; border-top: 1px solid #e5e5e5; padding-top: 30px; margin-top: 40px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${SITE_URL}/logo.png" alt="LAXMI" width="80" height="80" style="display: block; margin: 0 auto 12px;" />
      <div class="logo">LAXMI</div>
      <div class="tagline">ITALIAN LUXURY INTERIORS</div>
    </div>

    <div class="content">
      <h1>${t.greeting(safeName)}</h1>

      <p>${t.received}</p>

      <div class="highlight">
        <div class="date">
          <strong>${t.preferredTime}</strong><br>
          ${formatDate(request.date, lang)}<br>
          ${formatTime(request.time)}
        </div>
        <div class="note">${t.conciergeNote}</div>
      </div>

      <p>${t.explore}</p>

      <p style="color: #8b7355; font-style: italic;">${t.closing}</p>
    </div>

    <div class="footer">
      <p>LAXMI &mdash; ${t.byAppointment}</p>
      <p>${lang === 'it' ? 'Milano, Italia' : 'Milan, Italy'}</p>
      <p><a href="mailto:thelaxmii07@gmail.com" style="color: #8b7355;">thelaxmii07@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate Limiting: 5 requests per hour per IP ──
    const clientIp = getClientIp(request)
    const rl = checkRateLimit(`book:${clientIp}`, 5, 60 * 60 * 1000)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
      )
    }

    const body: ConsultationRequest = await request.json()

    // ── Validate required fields ──
    if (!body.name || !body.email || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Please complete all required fields' },
        { status: 400 }
      )
    }

    // ── Input length limits ──
    body.name = truncate(stripCRLF(body.name.trim()), 100)
    body.email = body.email.trim().slice(0, 254)
    if (body.phone) body.phone = truncate(stripCRLF(body.phone.trim()), 30)
    if (body.message) body.message = truncate(body.message.trim(), 2000)

    // ── Validate email (reject CRLF injection) ──
    const emailRegex = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // ── Validate date and time ──
    if (!isValidFutureDate(body.date)) {
      return NextResponse.json(
        { error: 'Please select a valid future date' },
        { status: 400 }
      )
    }

    if (!isValidTime(body.time)) {
      return NextResponse.json(
        { error: 'Please select a valid time' },
        { status: 400 }
      )
    }

    // Log the request (redacted for privacy)
    console.log('NEW CONSULTATION REQUEST',
      `| Name: ${body.name}`,
      `| Date: ${body.date} ${body.time}`,
      `| ${new Date().toISOString()}`
    )

    // Track notification outcomes
    let emailSuccess = false
    let calendarSuccess = false

    // Try to send email notifications
    const transporter = createTransporter()

    if (transporter) {
      try {
        // Sanitize subject line (strip CRLF to prevent header injection)
        const safeSubjectName = stripCRLF(body.name).slice(0, 50)

        // Send notification to concierge
        await transporter.sendMail({
          from: `"LAXMI Website" <${SMTP_USER}>`,
          to: CONCIERGE_EMAIL,
          subject: `New Consultation Request — ${safeSubjectName}`,
          html: generateConciergeEmail(body),
        })

        // Send confirmation to client (in their language)
        const lang = body.locale === 'it' ? 'it' : 'en'
        await transporter.sendMail({
          from: `"LAXMI" <${SMTP_USER}>`,
          to: body.email,
          subject: clientEmailStrings[lang].subject,
          html: generateClientEmail(body),
        })

        emailSuccess = true
      } catch (emailError) {
        console.error(
          'EMAIL_SEND_FAILED',
          `| Client: ${body.name}`,
          `| To: ${body.email}`,
          `| Error: ${emailError instanceof Error ? emailError.message : 'Unknown error'}`,
          `| ${new Date().toISOString()}`
        )
      }
    } else {
      console.warn(
        'EMAIL_SKIPPED: SMTP credentials not configured',
        `| Client: ${body.name}`,
        `| ${new Date().toISOString()}`
      )
    }

    // Create Google Calendar event with attendees
    if (isCalendarConfigured()) {
      try {
        initWithRefreshToken()

        // Build datetime strings without Z suffix so Google interprets them in Europe/Rome
        const startDateTime = `${body.date}T${body.time}:00`
        const [h, m] = body.time.split(':').map(Number)
        const endH = String(h + 1).padStart(2, '0')
        const endDateTime = `${body.date}T${endH}:${String(m).padStart(2, '0')}:00`

        const description = [
          `Client: ${body.name}`,
          `Email: ${body.email}`,
          body.phone ? `Phone: ${body.phone}` : null,
          body.message ? `\nProject Details:\n${body.message}` : null,
        ].filter(Boolean).join('\n')

        await createEvent(
          process.env.GOOGLE_CALENDAR_ID!,
          {
            summary: `LAXMI Consultation — ${stripCRLF(body.name).slice(0, 50)}`,
            description,
            status: 'tentative',
            start: {
              dateTime: startDateTime,
              timeZone: 'Europe/Rome',
            },
            end: {
              dateTime: endDateTime,
              timeZone: 'Europe/Rome',
            },
            attendees: [
              {
                email: body.email,
                displayName: body.name,
                responseStatus: 'needsAction',
              },
              {
                email: CONCIERGE_EMAIL,
                responseStatus: 'accepted',
              },
            ],
            guestsCanModify: false,
            reminders: {
              useDefault: false,
              overrides: [
                { method: 'popup', minutes: 30 },
                { method: 'email', minutes: 60 },
              ],
            },
          },
          'all'
        )

        calendarSuccess = true
      } catch (calendarError) {
        console.error('Calendar event creation failed:', calendarError instanceof Error ? calendarError.message : 'Unknown error')
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Your consultation request has been received. Our design concierge will contact you within 24 hours.',
      confirmationEmailSent: emailSuccess,
      calendarInviteSent: calendarSuccess,
    })

  } catch (error) {
    console.error('Booking request error:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json(
      { error: 'We could not process your request. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
