import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock: self-referencing chain rebuilt per test ──
const mockChain: any = {}

vi.mock('@/lib/supabase/public', () => ({
  createPublicClient: vi.fn(() => ({
    from: vi.fn(() => mockChain),
  })),
}))

function resetChain() {
  mockChain.select = vi.fn(() => mockChain)
  mockChain.eq = vi.fn(() => mockChain)
  mockChain.order = vi.fn()
  mockChain.single = vi.fn()
}

import {
  transformDBImageToFrontend,
  getGalleryImages,
  getFeaturedGalleryImages,
  getGalleryImagesByCategory,
  getGalleryImageById,
  getCategories,
  filterImagesByCategory,
} from '@/lib/gallery/queries'
import type { GalleryImage, DBGalleryImage } from '@/lib/gallery/types'

const dbImage: DBGalleryImage = {
  id: 'img-1',
  image_url: '/images/kitchen.jpg',
  image_path: 'gallery/kitchen.jpg',
  title_en: 'Modern Kitchen',
  title_it: 'Cucina Moderna',
  category_en: 'Kitchen',
  category_it: 'Cucina',
  alt_en: 'A modern kitchen',
  alt_it: 'Una cucina moderna',
  sort_order: 1,
  is_featured: true,
  is_active: true,
  created_at: '2026-01-01',
  updated_at: '2026-01-02',
}

describe('transformDBImageToFrontend', () => {
  it('maps all fields correctly', () => {
    const result = transformDBImageToFrontend(dbImage)
    expect(result.id).toBe('img-1')
    expect(result.src).toBe('/images/kitchen.jpg')
    expect(result.category).toBe('Kitchen')
    expect(result.categoryIT).toBe('Cucina')
    expect(result.title).toEqual({ en: 'Modern Kitchen', it: 'Cucina Moderna' })
    expect(result.description).toEqual({ en: 'A modern kitchen', it: 'Una cucina moderna' })
    expect(result.isFeatured).toBe(true)
    expect(result.isActive).toBe(true)
    expect(result.sortOrder).toBe(1)
  })
})

describe('getGalleryImages', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns transformed images on success', async () => {
    mockChain.order.mockResolvedValue({ data: [dbImage], error: null })
    const images = await getGalleryImages()
    expect(images).toHaveLength(1)
    expect(images[0].src).toBe('/images/kitchen.jpg')
  })

  it('returns empty array on error', async () => {
    mockChain.order.mockResolvedValue({ data: null, error: { message: 'fail' } })
    const images = await getGalleryImages()
    expect(images).toEqual([])
  })
})

describe('getFeaturedGalleryImages', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns featured images', async () => {
    mockChain.order.mockResolvedValue({ data: [dbImage], error: null })
    const images = await getFeaturedGalleryImages()
    expect(images).toHaveLength(1)
  })
})

describe('getGalleryImagesByCategory', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns images for a specific category', async () => {
    mockChain.order.mockResolvedValue({ data: [dbImage], error: null })
    const images = await getGalleryImagesByCategory('Kitchen')
    expect(images).toHaveLength(1)
  })

  it('delegates to fetchActiveGalleryImages for "all"', async () => {
    mockChain.order.mockResolvedValue({ data: [dbImage], error: null })
    const images = await getGalleryImagesByCategory('all')
    expect(images).toHaveLength(1)
  })
})

describe('getGalleryImageById', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns a single image', async () => {
    mockChain.single.mockResolvedValue({ data: dbImage, error: null })
    const image = await getGalleryImageById('img-1')
    expect(image).not.toBeNull()
    expect(image!.id).toBe('img-1')
  })

  it('returns null when not found', async () => {
    mockChain.single.mockResolvedValue({ data: null, error: { message: 'not found' } })
    const image = await getGalleryImageById('nonexistent')
    expect(image).toBeNull()
  })
})

describe('helper functions', () => {
  const images: GalleryImage[] = [
    { id: '1', src: '/a.jpg', category: 'Kitchen', categoryIT: 'Cucina', title: { en: 'A', it: 'A' }, description: { en: '', it: '' }, isFeatured: false, isActive: true, sortOrder: 1 },
    { id: '2', src: '/b.jpg', category: 'Living', categoryIT: 'Soggiorno', title: { en: 'B', it: 'B' }, description: { en: '', it: '' }, isFeatured: false, isActive: true, sortOrder: 2 },
    { id: '3', src: '/c.jpg', category: 'Kitchen', categoryIT: 'Cucina', title: { en: 'C', it: 'C' }, description: { en: '', it: '' }, isFeatured: false, isActive: true, sortOrder: 3 },
  ]

  it('getCategories returns sorted unique categories', () => {
    expect(getCategories(images)).toEqual(['Kitchen', 'Living'])
  })

  it('filterImagesByCategory filters correctly', () => {
    const filtered = filterImagesByCategory(images, 'Kitchen')
    expect(filtered).toHaveLength(2)
    expect(filtered.every((img) => img.category === 'Kitchen')).toBe(true)
  })

  it('filterImagesByCategory returns all for "all"', () => {
    expect(filterImagesByCategory(images, 'all')).toHaveLength(3)
  })
})
