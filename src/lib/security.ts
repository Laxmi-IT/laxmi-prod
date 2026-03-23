/**
 * Security utilities for input sanitization and rate limiting
 */

// ── HTML Escaping (prevents XSS in email templates) ──

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}

export function escapeHtml(unsafe: string): string {
  return unsafe.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char])
}

// ── CRLF Injection Prevention ──

export function stripCRLF(input: string): string {
  return input.replace(/[\r\n]/g, ' ')
}

// ── In-Memory Rate Limiter (no external dependencies) ──

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Check rate limit for a given key (typically IP + route).
 * Returns { allowed: true } or { allowed: false, retryAfterSeconds }.
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  entry.count++
  return { allowed: true }
}

/**
 * Extract client IP from NextRequest.
 * Checks x-forwarded-for (Vercel sets this), then x-real-ip, then fallback.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || '127.0.0.1'
}

// ── Input Length Limits ──

export function truncate(input: string, maxLength: number): string {
  if (input.length <= maxLength) return input
  return input.slice(0, maxLength)
}

// ── Date/Time Validation ──

export function isValidFutureDate(dateStr: string): boolean {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return false
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  if (date < now) return false
  // No more than 1 year in advance
  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 1)
  return date <= maxDate
}

export function isValidTime(timeStr: string): boolean {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/)
  if (!match) return false
  const h = parseInt(match[1])
  const m = parseInt(match[2])
  return h >= 0 && h <= 23 && m >= 0 && m <= 59
}
