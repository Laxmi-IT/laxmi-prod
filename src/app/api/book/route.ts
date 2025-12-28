import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Configuration - Set these in .env.local
const CONCIERGE_EMAIL = process.env.CONCIERGE_EMAIL || 'thelaxmii07@gmail.com'
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS // Gmail App Password

interface ConsultationRequest {
  name: string
  email: string
  phone?: string
  date: string
  time: string
  message?: string
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
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

// Generate HTML email for concierge
function generateConciergeEmail(request: ConsultationRequest): string {
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
      <div class="logo">LAXMI</div>
      <div class="badge">NEW CONSULTATION REQUEST</div>
    </div>

    <p>A new consultation request has been submitted through the website.</p>

    <div class="section">
      <div class="label">Client Name</div>
      <div class="value">${request.name}</div>
    </div>

    <div class="section">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${request.email}">${request.email}</a></div>
    </div>

    ${request.phone ? `
    <div class="section">
      <div class="label">Phone</div>
      <div class="value"><a href="tel:${request.phone}">${request.phone}</a></div>
    </div>
    ` : ''}

    <div class="highlight">
      <div class="label">Preferred Appointment</div>
      <div class="value" style="font-size: 18px;">
        ${formatDate(request.date)} at ${formatTime(request.time)}
      </div>
    </div>

    ${request.message ? `
    <div class="section">
      <div class="label">Project Details</div>
      <div class="value" style="white-space: pre-wrap;">${request.message}</div>
    </div>
    ` : ''}

    <a href="mailto:${request.email}?subject=Your%20LAXMI%20Consultation%20Request&body=Dear%20${encodeURIComponent(request.name)},%0A%0AThank%20you%20for%20your%20interest%20in%20LAXMI.%0A%0A" class="action-btn">
      Reply to Client
    </a>

    <div class="footer">
      <p>This request was submitted on ${new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'short'
      })}</p>
      <p>LAXMI — Italian Luxury Interiors</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

// Generate confirmation email for client
function generateClientEmail(request: ConsultationRequest): string {
  return `
<!DOCTYPE html>
<html>
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
      <div class="logo">LAXMI</div>
      <div class="tagline">ITALIAN LUXURY INTERIORS</div>
    </div>

    <div class="content">
      <h1>Thank You, ${request.name}</h1>

      <p>We have received your consultation request and are delighted by your interest in LAXMI.</p>

      <div class="highlight">
        <div class="date">
          <strong>Your Preferred Time</strong><br>
          ${formatDate(request.date)}<br>
          ${formatTime(request.time)}
        </div>
        <div class="note">Our design concierge will contact you within 24 hours to confirm.</div>
      </div>

      <p>In the meantime, we invite you to explore our curated collection of exceptional Italian craftsmanship.</p>

      <p style="color: #8b7355; font-style: italic;">We look forward to creating something beautiful together.</p>
    </div>

    <div class="footer">
      <p>LAXMI — By Appointment Only</p>
      <p>Milan, Italy</p>
      <p><a href="mailto:thelaxmii07@gmail.com" style="color: #8b7355;">thelaxmii07@gmail.com</a></p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Please complete all required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      )
    }

    // Log the request (always, for backup)
    console.log('='.repeat(50))
    console.log('NEW CONSULTATION REQUEST')
    console.log('='.repeat(50))
    console.log(`Name: ${body.name}`)
    console.log(`Email: ${body.email}`)
    console.log(`Phone: ${body.phone || 'Not provided'}`)
    console.log(`Preferred Date: ${formatDate(body.date)}`)
    console.log(`Preferred Time: ${formatTime(body.time)}`)
    console.log(`Message: ${body.message || 'None'}`)
    console.log(`Submitted: ${new Date().toISOString()}`)
    console.log('='.repeat(50))

    // Try to send email notifications
    const transporter = createTransporter()

    if (transporter) {
      try {
        // Send notification to concierge
        await transporter.sendMail({
          from: `"LAXMI Website" <${SMTP_USER}>`,
          to: CONCIERGE_EMAIL,
          subject: `New Consultation Request — ${body.name}`,
          html: generateConciergeEmail(body),
        })
        console.log('Concierge notification sent successfully')

        // Send confirmation to client
        await transporter.sendMail({
          from: `"LAXMI" <${SMTP_USER}>`,
          to: body.email,
          subject: 'Your LAXMI Consultation Request',
          html: generateClientEmail(body),
        })
        console.log('Client confirmation sent successfully')

      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Continue even if email fails - request is logged
      }
    } else {
      console.log('Email notifications disabled (SMTP not configured)')
    }

    // Return success
    return NextResponse.json({
      success: true,
      message: 'Your consultation request has been received. Our design concierge will contact you within 24 hours.',
    })

  } catch (error) {
    console.error('Request processing error:', error)
    return NextResponse.json(
      { error: 'We could not process your request. Please try again or contact us directly.' },
      { status: 500 }
    )
  }
}
