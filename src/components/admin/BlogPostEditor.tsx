'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createBlogPost,
  updateBlogPost,
  getBlogPostFAQs,
  saveBlogPostFAQs,
  type BlogPostFormData,
  type BlogFAQData,
} from '@/lib/admin/blog-actions';

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name_en: string;
  name_it: string;
}

interface BlogPostData {
  id: string;
  slug: string;
  title_en: string;
  title_it: string;
  excerpt_en: string;
  excerpt_it: string;
  content_en: string;
  content_it: string;
  tags_en: string[];
  tags_it: string[];
  featured_image: string | null;
  featured_image_alt_en: string | null;
  featured_image_alt_it: string | null;
  author_id: string | null;
  category_id: string | null;
  reading_time: number;
  schema_type: 'Article' | 'BlogPosting' | 'HowTo' | 'FAQPage';
  seo_title_en: string | null;
  seo_title_it: string | null;
  seo_description_en: string | null;
  seo_description_it: string | null;
  seo_keywords_en: string[];
  seo_keywords_it: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
}

interface BlogPostEditorProps {
  post?: BlogPostData;
  authors: Author[];
  categories: Category[];
  userId: string;
}

export function BlogPostEditor({ post, authors, categories, userId }: BlogPostEditorProps) {
  const router = useRouter();
  const isEditing = !!post;

  // Form state
  const [formData, setFormData] = useState<BlogPostFormData>({
    slug: post?.slug || '',
    title_en: post?.title_en || '',
    title_it: post?.title_it || '',
    excerpt_en: post?.excerpt_en || '',
    excerpt_it: post?.excerpt_it || '',
    content_en: post?.content_en || '',
    content_it: post?.content_it || '',
    tags_en: post?.tags_en || [],
    tags_it: post?.tags_it || [],
    featured_image: post?.featured_image || '',
    featured_image_alt_en: post?.featured_image_alt_en || '',
    featured_image_alt_it: post?.featured_image_alt_it || '',
    author_id: post?.author_id || '',
    category_id: post?.category_id || '',
    reading_time: post?.reading_time || 5,
    schema_type: post?.schema_type || 'BlogPosting',
    seo_title_en: post?.seo_title_en || '',
    seo_title_it: post?.seo_title_it || '',
    seo_description_en: post?.seo_description_en || '',
    seo_description_it: post?.seo_description_it || '',
    seo_keywords_en: post?.seo_keywords_en || [],
    seo_keywords_it: post?.seo_keywords_it || [],
    status: post?.status || 'draft',
    featured: post?.featured || false,
  });

  // FAQs state
  const [faqs, setFaqs] = useState<BlogFAQData[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  // Tag input states
  const [tagInputEN, setTagInputEN] = useState('');
  const [tagInputIT, setTagInputIT] = useState('');
  const [keywordInputEN, setKeywordInputEN] = useState('');
  const [keywordInputIT, setKeywordInputIT] = useState('');

  // UI state
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'faqs'>('content');

  // Load FAQs for existing post
  useEffect(() => {
    if (post?.id) {
      setLoadingFaqs(true);
      getBlogPostFAQs(post.id)
        .then(setFaqs)
        .finally(() => setLoadingFaqs(false));
    }
  }, [post?.id]);

  // Generate slug from English title
  const generateSlug = () => {
    const slug = formData.title_en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData((prev) => ({ ...prev, slug }));
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  // Tag management
  const addTag = (lang: 'en' | 'it', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const key = lang === 'en' ? 'tags_en' : 'tags_it';
    if (!formData[key].includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], trimmed],
      }));
    }
    if (lang === 'en') setTagInputEN('');
    else setTagInputIT('');
  };

  const removeTag = (lang: 'en' | 'it', tag: string) => {
    const key = lang === 'en' ? 'tags_en' : 'tags_it';
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((t) => t !== tag),
    }));
  };

  // Keyword management
  const addKeyword = (lang: 'en' | 'it', value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const key = lang === 'en' ? 'seo_keywords_en' : 'seo_keywords_it';
    if (!formData[key].includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], trimmed],
      }));
    }
    if (lang === 'en') setKeywordInputEN('');
    else setKeywordInputIT('');
  };

  const removeKeyword = (lang: 'en' | 'it', keyword: string) => {
    const key = lang === 'en' ? 'seo_keywords_en' : 'seo_keywords_it';
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((k) => k !== keyword),
    }));
  };

  // FAQ management
  const addFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        question_en: '',
        question_it: '',
        answer_en: '',
        answer_it: '',
        sort_order: prev.length,
      },
    ]);
  };

  const updateFaq = (index: number, field: keyof BlogFAQData, value: string) => {
    setFaqs((prev) =>
      prev.map((faq, i) => (i === index ? { ...faq, [field]: value } : faq))
    );
  };

  const removeFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // Save post
  const handleSave = async (publishNow = false) => {
    // Validation
    if (!formData.slug) {
      toast.error('Slug is required');
      return;
    }
    if (!formData.title_en || !formData.title_it) {
      toast.error('Title is required in both languages');
      return;
    }
    if (!formData.excerpt_en || !formData.excerpt_it) {
      toast.error('Excerpt is required in both languages');
      return;
    }
    if (!formData.content_en || !formData.content_it) {
      toast.error('Content is required in both languages');
      return;
    }

    setSaving(true);

    try {
      const dataToSave = {
        ...formData,
        status: publishNow ? 'published' : formData.status,
      } as BlogPostFormData;

      let result;
      if (isEditing && post?.id) {
        result = await updateBlogPost(post.id, dataToSave, userId);
      } else {
        result = await createBlogPost(dataToSave, userId);
      }

      if (!result.success) {
        toast.error(result.error || 'Failed to save post');
        return;
      }

      // Save FAQs if we have any
      if (faqs.length > 0 && result.data?.id) {
        const faqResult = await saveBlogPostFAQs(result.data.id as string, faqs);
        if (!faqResult.success) {
          toast.error('Post saved but FAQs failed to save');
        }
      }

      toast.success(isEditing ? 'Post updated successfully' : 'Post created successfully');
      router.push('/admin/blog');
      router.refresh();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-white">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-zinc-500 mt-1">
            {isEditing ? `Editing: ${post?.title_en}` : 'Create a new bilingual blog post'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-zinc-800 pb-2">
        {(['content', 'seo', 'faqs'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-zinc-800 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
            }`}
          >
            {tab === 'content' && 'Content'}
            {tab === 'seo' && 'SEO'}
            {tab === 'faqs' && `FAQs (${faqs.length})`}
          </button>
        ))}
      </div>

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          {/* Slug and Basic Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium text-white mb-4">Basic Information</h2>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                URL Slug
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="my-blog-post-title"
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
                >
                  Generate from Title
                </button>
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                URL: /blog/{formData.slug || 'your-slug-here'}
              </p>
            </div>

            {/* Category and Author */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Category
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Author
                </label>
                <select
                  name="author_id"
                  value={formData.author_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select author...</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status and Featured */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  name="reading_time"
                  value={formData.reading_time}
                  onChange={handleChange}
                  min={1}
                  max={60}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 bg-zinc-800 border-zinc-700 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-white">Featured Post</span>
                </label>
              </div>
            </div>
          </div>

          {/* Titles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Title</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English
                </label>
                <input
                  type="text"
                  name="title_en"
                  value={formData.title_en}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Post title in English"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian
                </label>
                <input
                  type="text"
                  name="title_it"
                  value={formData.title_it}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Titolo del post in italiano"
                />
              </div>
            </div>
          </div>

          {/* Excerpts */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Excerpt</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English
                </label>
                <textarea
                  name="excerpt_en"
                  value={formData.excerpt_en}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Brief description of the post..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian
                </label>
                <textarea
                  name="excerpt_it"
                  value={formData.excerpt_it}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Breve descrizione del post..."
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Content (Markdown)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English
                </label>
                <textarea
                  name="content_en"
                  value={formData.content_en}
                  onChange={handleChange}
                  rows={20}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 resize-y"
                  placeholder="## Your content here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian
                </label>
                <textarea
                  name="content_it"
                  value={formData.content_it}
                  onChange={handleChange}
                  rows={20}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white font-mono text-sm focus:ring-2 focus:ring-amber-500 resize-y"
                  placeholder="## Il tuo contenuto qui..."
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Tags</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInputEN}
                    onChange={(e) => setTagInputEN(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('en', tagInputEN))}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Add tag and press Enter"
                  />
                  <button
                    type="button"
                    onClick={() => addTag('en', tagInputEN)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_en.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag('en', tag)}
                        className="text-zinc-500 hover:text-white"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInputIT}
                    onChange={(e) => setTagInputIT(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('it', tagInputIT))}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Aggiungi tag e premi Invio"
                  />
                  <button
                    type="button"
                    onClick={() => addTag('it', tagInputIT)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
                  >
                    Aggiungi
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags_it.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-zinc-800 text-zinc-300 rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag('it', tag)}
                        className="text-zinc-500 hover:text-white"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Featured Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="/images/my-image.jpg or https://..."
                />
              </div>
              {formData.featured_image && (
                <div className="w-48 h-32 rounded-lg overflow-hidden bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.featured_image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg';
                    }}
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Alt Text (English)
                  </label>
                  <input
                    type="text"
                    name="featured_image_alt_en"
                    value={formData.featured_image_alt_en}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Describe the image..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Alt Text (Italian)
                  </label>
                  <input
                    type="text"
                    name="featured_image_alt_it"
                    value={formData.featured_image_alt_it}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Descrivi l'immagine..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Schema Type</h2>
            <select
              name="schema_type"
              value={formData.schema_type}
              onChange={handleChange}
              className="w-full max-w-xs px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="BlogPosting">Blog Posting</option>
              <option value="Article">Article</option>
              <option value="HowTo">How To</option>
              <option value="FAQPage">FAQ Page</option>
            </select>
          </div>

          {/* SEO Titles */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">SEO Title</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English
                </label>
                <input
                  type="text"
                  name="seo_title_en"
                  value={formData.seo_title_en}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="SEO optimized title..."
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {formData.seo_title_en?.length || 0}/60 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian
                </label>
                <input
                  type="text"
                  name="seo_title_it"
                  value={formData.seo_title_it}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                  placeholder="Titolo ottimizzato per SEO..."
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {formData.seo_title_it?.length || 0}/60 characters
                </p>
              </div>
            </div>
          </div>

          {/* SEO Descriptions */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">SEO Description</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English
                </label>
                <textarea
                  name="seo_description_en"
                  value={formData.seo_description_en}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Meta description for search engines..."
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {formData.seo_description_en?.length || 0}/160 characters
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian
                </label>
                <textarea
                  name="seo_description_it"
                  value={formData.seo_description_it}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Meta description per i motori di ricerca..."
                />
                <p className="text-xs text-zinc-500 mt-1">
                  {formData.seo_description_it?.length || 0}/160 characters
                </p>
              </div>
            </div>
          </div>

          {/* SEO Keywords */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">SEO Keywords</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  English Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInputEN}
                    onChange={(e) => setKeywordInputEN(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword('en', keywordInputEN))}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Add keyword..."
                  />
                  <button
                    type="button"
                    onClick={() => addKeyword('en', keywordInputEN)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo_keywords_en.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-sm"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword('en', kw)}
                        className="text-amber-400 hover:text-white"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Italian Keywords
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={keywordInputIT}
                    onChange={(e) => setKeywordInputIT(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword('it', keywordInputIT))}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500"
                    placeholder="Aggiungi parola chiave..."
                  />
                  <button
                    type="button"
                    onClick={() => addKeyword('it', keywordInputIT)}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg"
                  >
                    Aggiungi
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.seo_keywords_it.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-sm"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => removeKeyword('it', kw)}
                        className="text-amber-400 hover:text-white"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-medium text-white">FAQ Section</h2>
                <p className="text-sm text-zinc-500">
                  Add FAQs for rich snippets and featured snippets in search results
                </p>
              </div>
              <button
                type="button"
                onClick={addFaq}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add FAQ
              </button>
            </div>

            {loadingFaqs ? (
              <div className="text-center py-8 text-zinc-500">Loading FAQs...</div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                No FAQs added yet. Click &quot;Add FAQ&quot; to get started.
              </div>
            ) : (
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-400">FAQ #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Questions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">
                          Question (English)
                        </label>
                        <input
                          type="text"
                          value={faq.question_en}
                          onChange={(e) => updateFaq(index, 'question_en', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-amber-500"
                          placeholder="What is...?"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">
                          Question (Italian)
                        </label>
                        <input
                          type="text"
                          value={faq.question_it}
                          onChange={(e) => updateFaq(index, 'question_it', e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-amber-500"
                          placeholder="Cos'e...?"
                        />
                      </div>
                    </div>

                    {/* Answers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">
                          Answer (English)
                        </label>
                        <textarea
                          value={faq.answer_en}
                          onChange={(e) => updateFaq(index, 'answer_en', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                          placeholder="The answer is..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1">
                          Answer (Italian)
                        </label>
                        <textarea
                          value={faq.answer_it}
                          onChange={(e) => updateFaq(index, 'answer_it', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                          placeholder="La risposta e..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
