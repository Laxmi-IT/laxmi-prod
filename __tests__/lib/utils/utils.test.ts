import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn() utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('deduplicates Tailwind conflicts', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('')
  })

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })
})
