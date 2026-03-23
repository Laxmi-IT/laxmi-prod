import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock getDictionaryFromDB
const mockGetDictionaryFromDB = vi.fn()
const mockGetDictionaryFromDBNoCache = vi.fn()

vi.mock('@/lib/content/getDictionaryFromDB', () => ({
  getDictionaryFromDB: (...args: any[]) => mockGetDictionaryFromDB(...args),
  getDictionaryFromDBNoCache: (...args: any[]) => mockGetDictionaryFromDBNoCache(...args),
}))

import { getDictionary, getStaticDictionary } from '@/i18n/dictionaries'

describe('getDictionary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.NEXT_PHASE
  })

  it('returns merged static + DB dictionary for EN', async () => {
    mockGetDictionaryFromDB.mockResolvedValue({
      hero: { tagline1: 'DB Override' },
    })

    const dict = await getDictionary('en')
    // DB value should override static
    expect(dict.hero.tagline1).toBe('DB Override')
    // Static values should still exist
    expect(dict.nav.home).toBeDefined()
  })

  it('returns merged static + DB dictionary for IT', async () => {
    mockGetDictionaryFromDB.mockResolvedValue({
      hero: { tagline1: 'Sostituzione DB' },
    })

    const dict = await getDictionary('it')
    expect(dict.hero.tagline1).toBe('Sostituzione DB')
    expect(dict.nav.home).toBeDefined()
  })

  it('falls back to static dictionary on DB error', async () => {
    mockGetDictionaryFromDB.mockRejectedValue(new Error('DB down'))

    const dict = await getDictionary('en')
    // Should still return a valid dictionary from static files
    expect(dict.nav.home).toBeDefined()
    expect(dict.hero.tagline1).toBeDefined()
  })

  it('uses no-cache fetch during build phase', async () => {
    process.env.NEXT_PHASE = 'phase-production-build'
    mockGetDictionaryFromDBNoCache.mockResolvedValue({
      hero: { tagline1: 'Build Override' },
    })

    const dict = await getDictionary('en')
    expect(mockGetDictionaryFromDBNoCache).toHaveBeenCalledWith('en')
    expect(mockGetDictionaryFromDB).not.toHaveBeenCalled()
    expect(dict.hero.tagline1).toBe('Build Override')
  })

  it('DB values do not clobber existing static keys with empty string', async () => {
    mockGetDictionaryFromDB.mockResolvedValue({
      hero: { tagline1: '' }, // empty should NOT override
    })

    const dict = await getDictionary('en')
    // Should keep the static value since DB returned empty string
    expect(dict.hero.tagline1).toBeTruthy()
  })

  it('deeply merges nested objects', async () => {
    mockGetDictionaryFromDB.mockResolvedValue({
      consulting: { steps: { questionnaire: { title: 'Custom Title' } } },
    })

    const dict = await getDictionary('en')
    expect(dict.consulting.steps.questionnaire.title).toBe('Custom Title')
    // Other steps should remain from static
    expect(dict.consulting.steps.materials.title).toBeDefined()
  })

  it('DB arrays override static arrays', async () => {
    mockGetDictionaryFromDB.mockResolvedValue({
      collections: { story2Features: ['New Feature A', 'New Feature B'] },
    })

    const dict = await getDictionary('en')
    expect(dict.collections.story2Features).toEqual(['New Feature A', 'New Feature B'])
  })
})

describe('getStaticDictionary', () => {
  it('returns EN static dictionary', async () => {
    const dict = await getStaticDictionary('en')
    expect(dict.nav.home).toBeDefined()
    expect(dict.hero).toBeDefined()
  })

  it('returns IT static dictionary', async () => {
    const dict = await getStaticDictionary('it')
    expect(dict.nav.home).toBeDefined()
    expect(dict.hero).toBeDefined()
  })

  it('EN and IT have different content', async () => {
    const en = await getStaticDictionary('en')
    const it = await getStaticDictionary('it')
    // At least some keys should differ
    expect(en.hero.cta).not.toBe(it.hero.cta)
  })
})
