'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryFormData,
} from '@/lib/admin/blog-actions';

interface Category {
  id: string;
  name_en: string;
  name_it: string;
  slug: string;
  description_en?: string;
  description_it?: string;
  sort_order?: number;
}

interface CategoryEditorProps {
  category?: Category;
  mode: 'create' | 'edit';
  onClose: () => void;
}

export function CategoryEditor({ category, mode, onClose }: CategoryEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<CategoryFormData>({
    name_en: category?.name_en || '',
    name_it: category?.name_it || '',
    slug: category?.slug || '',
    description_en: category?.description_en || '',
    description_it: category?.description_it || '',
    sort_order: category?.sort_order || 0,
  });

  const generateSlug = () => {
    const slug = formData.name_en
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name_en || !formData.name_it) {
      toast.error('Name is required in both languages');
      return;
    }

    if (!formData.slug) {
      toast.error('Slug is required');
      return;
    }

    startTransition(async () => {
      let result;
      if (mode === 'create') {
        result = await createCategory(formData);
      } else if (category) {
        result = await updateCategory(category.id, formData);
      }

      if (result?.success) {
        toast.success(mode === 'create' ? 'Category created!' : 'Category updated!');
        onClose();
        router.refresh();
      } else {
        toast.error(result?.error || 'Failed to save category');
      }
    });
  };

  const handleDelete = () => {
    if (!category) return;

    startTransition(async () => {
      const result = await deleteCategory(category.id);
      if (result.success) {
        toast.success('Category deleted!');
        setShowDeleteConfirm(false);
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-xl font-medium text-white">
            {mode === 'create' ? 'Add Category' : 'Edit Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm ? (
          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Delete Category?</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete &quot;{category?.name_en}&quot;? This action cannot be undone.
                Posts using this category will become uncategorized.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isPending}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Design Tips"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Name (Italian) *
                  </label>
                  <input
                    type="text"
                    name="name_it"
                    value={formData.name_it}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Consigli di Design"
                  />
                </div>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  URL Slug *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="design-tips"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Generate
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Brief description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Description (Italian)
                  </label>
                  <textarea
                    name="description_it"
                    value={formData.description_it}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Breve descrizione..."
                  />
                </div>
              </div>

              {/* Sort Order */}
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  value={formData.sort_order}
                  onChange={handleChange}
                  min={0}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <p className="text-xs text-zinc-500 mt-1">Lower numbers appear first</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-zinc-800">
              <div>
                {mode === 'edit' && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    Delete Category
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-zinc-400 hover:text-white transition-colors"
                  disabled={isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : mode === 'create' ? 'Create Category' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
