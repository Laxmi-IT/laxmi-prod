import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase before importing module under test
const mockSelect = vi.fn()
const mockOrder = vi.fn()
const mockFrom = vi.fn()

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

// After mocks are set up, import the module under test
import { getDictionaryFromDB, getDictionaryFromDBNoCache } from '@/lib/content/getDictionaryFromDB'

function setupSupabaseReturn(data: unknown, error: unknown = null) {
  mockOrder.mockResolvedValue({ data, error })
  mockSelect.mockReturnValue({ order: mockOrder })
  mockFrom.mockReturnValue({ select: mockSelect })
}

describe('getDictionaryFromDB', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('builds nested dictionary from flat rows (EN)', async () => {
    setupSupabaseReturn([
      { content_key: 'hero.tagline1', content_en: 'Hello', content_it: 'Ciao' },
      { content_key: 'hero.tagline2', content_en: 'World', content_it: 'Mondo' },
    ])

    const result = await getDictionaryFromDB('en')
    expect(result).toEqual({ hero: { tagline1: 'Hello', tagline2: 'World' } })
  })

  it('builds nested dictionary from flat rows (IT)', async () => {
    setupSupabaseReturn([
      { content_key: 'hero.tagline1', content_en: 'Hello', content_it: 'Ciao' },
    ])

    const result = await getDictionaryFromDB('it')
    expect(result).toEqual({ hero: { tagline1: 'Ciao' } })
  })

  it('handles deeply nested keys', async () => {
    setupSupabaseReturn([
      { content_key: 'consulting.steps.questionnaire.title', content_en: 'Q', content_it: 'D' },
    ])

    const result = await getDictionaryFromDB('en')
    expect(result).toEqual({
      consulting: { steps: { questionnaire: { title: 'Q' } } },
    })
  })

  it('parses JSON arrays in content values', async () => {
    setupSupabaseReturn([
      {
        content_key: 'collections.story2Features',
        content_en: '["Feature A","Feature B"]',
        content_it: '["Caratteristica A","Caratteristica B"]',
      },
    ])

    const result = await getDictionaryFromDB('en')
    expect((result as any).collections.story2Features).toEqual([
      'Feature A',
      'Feature B',
    ])
  })

  it('parses JSON objects in content values', async () => {
    setupSupabaseReturn([
      {
        content_key: 'test.obj',
        content_en: '{"a":1,"b":2}',
        content_it: '{"a":3,"b":4}',
      },
    ])

    const result = await getDictionaryFromDB('en')
    expect((result as any).test.obj).toEqual({ a: 1, b: 2 })
  })

  it('returns string when JSON parse fails', async () => {
    setupSupabaseReturn([
      {
        content_key: 'test.value',
        content_en: '[not valid json',
        content_it: '[non valido',
      },
    ])

    const result = await getDictionaryFromDB('en')
    expect((result as any).test.value).toBe('[not valid json')
  })

  it('handles empty string content', async () => {
    setupSupabaseReturn([
      { content_key: 'test.empty', content_en: '', content_it: '' },
    ])

    const result = await getDictionaryFromDB('en')
    expect((result as any).test.empty).toBe('')
  })

  it('throws on Supabase error', async () => {
    setupSupabaseReturn(null, { message: 'DB connection failed' })

    await expect(getDictionaryFromDB('en')).rejects.toThrow(
      'Failed to fetch dictionary from database'
    )
  })

  it('throws when no data returned', async () => {
    setupSupabaseReturn([], null)

    await expect(getDictionaryFromDB('en')).rejects.toThrow(
      'No content found in database'
    )
  })

  it('throws when data is null', async () => {
    setupSupabaseReturn(null, null)

    await expect(getDictionaryFromDB('en')).rejects.toThrow(
      'No content found in database'
    )
  })

  it('selects correct columns', async () => {
    setupSupabaseReturn([
      { content_key: 'nav.home', content_en: 'Home', content_it: 'Home' },
    ])

    await getDictionaryFromDB('en')
    expect(mockFrom).toHaveBeenCalledWith('site_content')
    expect(mockSelect).toHaveBeenCalledWith('content_key, content_en, content_it')
    expect(mockOrder).toHaveBeenCalledWith('content_key')
  })

  it('getDictionaryFromDBNoCache also works', async () => {
    setupSupabaseReturn([
      { content_key: 'nav.home', content_en: 'Home', content_it: 'Casa' },
    ])

    const result = await getDictionaryFromDBNoCache('it')
    expect(result).toEqual({ nav: { home: 'Casa' } })
  })

  it('creates intermediate objects when path is new', async () => {
    setupSupabaseReturn([
      { content_key: 'a.b.c', content_en: 'deep', content_it: 'profondo' },
      { content_key: 'a.b.d', content_en: 'also deep', content_it: 'anche profondo' },
    ])

    const result = await getDictionaryFromDB('en')
    expect(result).toEqual({ a: { b: { c: 'deep', d: 'also deep' } } })
  })

  it('handles multiple top-level sections', async () => {
    setupSupabaseReturn([
      { content_key: 'nav.home', content_en: 'Home', content_it: 'Home' },
      { content_key: 'hero.title', content_en: 'Title', content_it: 'Titolo' },
      { content_key: 'footer.text', content_en: 'Footer', content_it: 'Piè' },
    ])

    const result = await getDictionaryFromDB('en')
    expect(result).toEqual({
      nav: { home: 'Home' },
      hero: { title: 'Title' },
      footer: { text: 'Footer' },
    })
  })
})
