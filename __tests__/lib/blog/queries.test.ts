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
  mockChain.in = vi.fn(() => mockChain)
  mockChain.order = vi.fn()
  mockChain.single = vi.fn()
}

import {
  transformDBPostToFrontend,
  getPublishedPosts,
  getPostBySlug,
  getFeaturedPosts,
  getPostsByCategory,
  getAuthors,
  getCategories,
  getRelatedPosts,
  getAuthorById,
  getCategoryById,
  getAllTags,
  getAllTagsIT,
} from '@/lib/blog/queries'
import type { BlogAuthor, BlogCategory, BlogPost } from '@/lib/blog/types'

// ── Test data ──

const dbPost = {
  id: 'post-1',
  slug: 'test-post',
  title_en: 'Test Post',
  title_it: 'Post di Test',
  excerpt_en: 'Excerpt EN',
  excerpt_it: 'Excerpt IT',
  content_en: 'Content EN',
  content_it: 'Contenuto IT',
  tags_en: ['design', 'luxury'],
  tags_it: ['design', 'lusso'],
  featured_image: '/img/test.jpg',
  featured_image_alt_en: 'Alt EN',
  featured_image_alt_it: 'Alt IT',
  author_id: 'auth-1',
  category_id: 'cat-1',
  reading_time: 5,
  schema_type: 'BlogPosting' as const,
  seo_title_en: 'SEO Title',
  seo_title_it: 'SEO Titolo',
  seo_description_en: 'SEO Desc',
  seo_description_it: 'SEO Desc IT',
  seo_keywords_en: ['seo'],
  seo_keywords_it: ['seo-it'],
  status: 'published' as const,
  featured: true,
  published_at: '2026-01-15T10:00:00Z',
  created_at: '2026-01-10T10:00:00Z',
  updated_at: '2026-01-15T12:00:00Z',
}

const dbFaq = {
  id: 'faq-1',
  post_id: 'post-1',
  question_en: 'What is LAXMI?',
  question_it: 'Che cos\'è LAXMI?',
  answer_en: 'A luxury brand.',
  answer_it: 'Un marchio di lusso.',
  sort_order: 1,
}

describe('transformDBPostToFrontend', () => {
  it('maps all fields correctly', () => {
    const result = transformDBPostToFrontend(dbPost)
    expect(result.id).toBe('post-1')
    expect(result.slug).toBe('test-post')
    expect(result.title).toBe('Test Post')
    expect(result.titleIT).toBe('Post di Test')
    expect(result.excerpt).toBe('Excerpt EN')
    expect(result.excerptIT).toBe('Excerpt IT')
    expect(result.content).toBe('Content EN')
    expect(result.contentIT).toBe('Contenuto IT')
    expect(result.tags).toEqual(['design', 'luxury'])
    expect(result.tagsIT).toEqual(['design', 'lusso'])
    expect(result.featuredImage).toBe('/img/test.jpg')
    expect(result.readingTime).toBe(5)
    expect(result.schemaType).toBe('BlogPosting')
    expect(result.status).toBe('published')
    expect(result.featured).toBe(true)
    expect(result.relatedPosts).toEqual([])
  })

  it('uses fallback for null featured_image', () => {
    const post = { ...dbPost, featured_image: null }
    const result = transformDBPostToFrontend(post)
    expect(result.featuredImage).toBe('/images/placeholder.jpg')
  })

  it('uses created_at when published_at is null', () => {
    const post = { ...dbPost, published_at: null }
    const result = transformDBPostToFrontend(post)
    expect(result.publishedAt).toBe('2026-01-10T10:00:00Z')
  })

  it('falls back to title for null SEO title', () => {
    const post = { ...dbPost, seo_title_en: null, seo_title_it: null }
    const result = transformDBPostToFrontend(post)
    expect(result.seoTitle).toBe('Test Post')
    expect(result.seoTitleIT).toBe('Post di Test')
  })

  it('falls back to excerpt for null SEO description', () => {
    const post = { ...dbPost, seo_description_en: null, seo_description_it: null }
    const result = transformDBPostToFrontend(post)
    expect(result.seoDescription).toBe('Excerpt EN')
    expect(result.seoDescriptionIT).toBe('Excerpt IT')
  })

  it('maps FAQs correctly', () => {
    const result = transformDBPostToFrontend(dbPost, [dbFaq])
    expect(result.faqs).toHaveLength(1)
    expect(result.faqs![0].question).toBe('What is LAXMI?')
    expect(result.faqs![0].answerIT).toBe('Un marchio di lusso.')
  })

  it('handles empty tags arrays', () => {
    const post = { ...dbPost, tags_en: null as any, tags_it: null as any }
    const result = transformDBPostToFrontend(post)
    expect(result.tags).toEqual([])
    expect(result.tagsIT).toEqual([])
  })

  it('handles empty author_id and category_id', () => {
    const post = { ...dbPost, author_id: null, category_id: null }
    const result = transformDBPostToFrontend(post)
    expect(result.author).toBe('')
    expect(result.category).toBe('')
  })
})

describe('getPublishedPosts', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns transformed posts on success', async () => {
    mockChain.order.mockResolvedValue({ data: [dbPost], error: null })
    const posts = await getPublishedPosts()
    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe('Test Post')
  })

  it('returns empty array on Supabase error', async () => {
    mockChain.order.mockResolvedValue({ data: null, error: { message: 'fail' } })
    const posts = await getPublishedPosts()
    expect(posts).toEqual([])
  })
})

describe('getPostBySlug', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns transformed post with FAQs and related posts', async () => {
    // First call: single() returns post
    mockChain.single.mockResolvedValueOnce({ data: dbPost, error: null })
    // Second call: order() returns FAQs
    mockChain.order.mockResolvedValueOnce({ data: [dbFaq], error: null })
    // Third call: order() returns related
    mockChain.order.mockResolvedValueOnce({
      data: [{ related_post_id: 'post-2' }],
      error: null,
    })

    const post = await getPostBySlug('test-post')
    expect(post).not.toBeNull()
    expect(post!.faqs).toHaveLength(1)
    expect(post!.relatedPosts).toEqual(['post-2'])
  })

  it('returns null when post not found', async () => {
    mockChain.single.mockResolvedValueOnce({ data: null, error: { message: 'not found' } })
    const post = await getPostBySlug('nonexistent')
    expect(post).toBeNull()
  })
})

describe('getFeaturedPosts', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns featured posts', async () => {
    mockChain.order.mockResolvedValue({ data: [dbPost], error: null })
    const posts = await getFeaturedPosts()
    expect(posts).toHaveLength(1)
    expect(posts[0].featured).toBe(true)
  })
})

describe('getAuthors', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('transforms author data correctly', async () => {
    mockChain.order.mockResolvedValue({
      data: [{ id: 'a1', name: 'Lakshmi', role_en: 'Designer', role_it: 'Designer', avatar_url: '/a.jpg', bio_en: 'Bio', bio_it: 'Bio IT' }],
      error: null,
    })
    const authors = await getAuthors()
    expect(authors[0]).toEqual({
      id: 'a1',
      name: 'Lakshmi',
      role: 'Designer',
      roleIT: 'Designer',
      avatar: '/a.jpg',
      bio: 'Bio',
      bioIT: 'Bio IT',
    })
  })
})

describe('getCategories', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('transforms category data correctly', async () => {
    mockChain.order.mockResolvedValue({
      data: [{ id: 'c1', name_en: 'Design', name_it: 'Design', slug: 'design', description_en: 'Desc', description_it: 'Desc IT', sort_order: 1 }],
      error: null,
    })
    const cats = await getCategories()
    expect(cats[0].name).toBe('Design')
    expect(cats[0].nameIT).toBe('Design')
    expect(cats[0].slug).toBe('design')
  })
})

describe('getRelatedPosts', () => {
  beforeEach(() => { vi.clearAllMocks(); resetChain() })

  it('returns empty array for empty IDs', async () => {
    const posts = await getRelatedPosts([])
    expect(posts).toEqual([])
  })
})

describe('helper functions', () => {
  const authors: BlogAuthor[] = [
    { id: 'a1', name: 'Alice', role: 'Writer', roleIT: 'Scrittrice' },
    { id: 'a2', name: 'Bob', role: 'Editor', roleIT: 'Editore' },
  ]

  const categories: BlogCategory[] = [
    { id: 'c1', name: 'Design', nameIT: 'Design', slug: 'design', description: '', descriptionIT: '' },
  ]

  it('getAuthorById finds by ID', () => {
    expect(getAuthorById(authors, 'a1')?.name).toBe('Alice')
  })

  it('getAuthorById returns undefined for missing ID', () => {
    expect(getAuthorById(authors, 'a99')).toBeUndefined()
  })

  it('getCategoryById finds by ID', () => {
    expect(getCategoryById(categories, 'c1')?.slug).toBe('design')
  })

  it('getAllTags returns sorted unique EN tags', () => {
    const posts = [
      { tags: ['luxury', 'design'] },
      { tags: ['design', 'italian'] },
    ] as BlogPost[]
    expect(getAllTags(posts)).toEqual(['design', 'italian', 'luxury'])
  })

  it('getAllTagsIT returns sorted unique IT tags', () => {
    const posts = [
      { tagsIT: ['lusso', 'design'] },
      { tagsIT: ['design', 'italiano'] },
    ] as BlogPost[]
    expect(getAllTagsIT(posts)).toEqual(['design', 'italiano', 'lusso'])
  })
})
