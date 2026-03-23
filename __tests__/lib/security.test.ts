import { describe, it, expect } from 'vitest'
import {
  escapeHtml,
  stripCRLF,
  truncate,
  checkRateLimit,
  isValidFutureDate,
  isValidTime,
} from '@/lib/security'

describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  it('escapes & and quotes', () => {
    expect(escapeHtml('a & b "c" \'d\'')).toBe('a &amp; b &quot;c&quot; &#039;d&#039;')
  })

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('')
  })

  it('leaves safe strings unchanged', () => {
    expect(escapeHtml('Hello World 123')).toBe('Hello World 123')
  })
})

describe('stripCRLF', () => {
  it('replaces \\r\\n with spaces', () => {
    expect(stripCRLF('line1\r\nline2')).toBe('line1  line2')
  })

  it('replaces \\n with space', () => {
    expect(stripCRLF('line1\nline2')).toBe('line1 line2')
  })

  it('replaces \\r with space', () => {
    expect(stripCRLF('line1\rline2')).toBe('line1 line2')
  })

  it('leaves normal strings unchanged', () => {
    expect(stripCRLF('normal text')).toBe('normal text')
  })
})

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('abcdef', 3)).toBe('abc')
  })

  it('leaves short strings unchanged', () => {
    expect(truncate('ab', 10)).toBe('ab')
  })

  it('handles exact length', () => {
    expect(truncate('abc', 3)).toBe('abc')
  })
})

describe('checkRateLimit', () => {
  it('allows requests under the limit', () => {
    const key = `test-${Date.now()}-under`
    expect(checkRateLimit(key, 3, 60000).allowed).toBe(true)
    expect(checkRateLimit(key, 3, 60000).allowed).toBe(true)
    expect(checkRateLimit(key, 3, 60000).allowed).toBe(true)
  })

  it('blocks requests over the limit', () => {
    const key = `test-${Date.now()}-over`
    checkRateLimit(key, 2, 60000)
    checkRateLimit(key, 2, 60000)
    const result = checkRateLimit(key, 2, 60000)
    expect(result.allowed).toBe(false)
    expect(result.retryAfterSeconds).toBeGreaterThan(0)
  })
})

describe('isValidFutureDate', () => {
  it('returns true for a date 7 days in the future', () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    expect(isValidFutureDate(future.toISOString().split('T')[0])).toBe(true)
  })

  it('returns false for a past date', () => {
    expect(isValidFutureDate('2020-01-01')).toBe(false)
  })

  it('returns false for invalid date string', () => {
    expect(isValidFutureDate('not-a-date')).toBe(false)
  })

  it('returns false for a date more than 1 year in the future', () => {
    const farFuture = new Date()
    farFuture.setFullYear(farFuture.getFullYear() + 2)
    expect(isValidFutureDate(farFuture.toISOString().split('T')[0])).toBe(false)
  })
})

describe('isValidTime', () => {
  it('returns true for valid times', () => {
    expect(isValidTime('10:00')).toBe(true)
    expect(isValidTime('0:00')).toBe(true)
    expect(isValidTime('23:59')).toBe(true)
  })

  it('returns false for invalid times', () => {
    expect(isValidTime('25:00')).toBe(false)
    expect(isValidTime('10:60')).toBe(false)
    expect(isValidTime('abc')).toBe(false)
    expect(isValidTime('')).toBe(false)
  })
})
