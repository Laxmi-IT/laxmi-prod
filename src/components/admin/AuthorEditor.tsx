'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  type AuthorFormData,
} from '@/lib/admin/blog-actions';

interface Author {
  id: string;
  name: string;
  slug: string;
  role_en: string;
  role_it: string;
  bio_en?: string;
  bio_it?: string;
  avatar_url?: string;
}

interface AuthorEditorProps {
  author?: Author;
  mode: 'create' | 'edit';
  onClose: () => void;
}

export function AuthorEditor({ author, mode, onClose }: AuthorEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<AuthorFormData>({
    name: author?.name || '',
    slug: author?.slug || '',
    role_en: author?.role_en || '',
    role_it: author?.role_it || '',
    bio_en: author?.bio_en || '',
    bio_it: author?.bio_it || '',
    avatar_url: author?.avatar_url || '',
  });

  const generateSlug = () => {
    const slug = formData.name
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error('Name is required');
      return;
    }

    if (!formData.slug) {
      toast.error('Slug is required');
      return;
    }

    if (!formData.role_en || !formData.role_it) {
      toast.error('Role is required in both languages');
      return;
    }

    startTransition(async () => {
      let result;
      if (mode === 'create') {
        result = await createAuthor(formData);
      } else if (author) {
        result = await updateAuthor(author.id, formData);
      }

      if (result?.success) {
        toast.success(mode === 'create' ? 'Author created!' : 'Author updated!');
        onClose();
        router.refresh();
      } else {
        toast.error(result?.error || 'Failed to save author');
      }
    });
  };

  const handleDelete = () => {
    if (!author) return;

    startTransition(async () => {
      const result = await deleteAuthor(author.id);
      if (result.success) {
        toast.success('Author deleted!');
        setShowDeleteConfirm(false);
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to delete author');
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
            {mode === 'create' ? 'Add Author' : 'Edit Author'}
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
              <h3 className="text-lg font-medium text-white mb-2">Delete Author?</h3>
              <p className="text-zinc-400 mb-6">
                Are you sure you want to delete &quot;{author?.name}&quot;? This action cannot be undone.
                Posts by this author will no longer show author information.
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
                  {isPending ? 'Deleting...' : 'Delete Author'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Name and Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Smith"
                  />
                </div>
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
                      placeholder="john-smith"
                    />
                    <button
                      type="button"
                      onClick={generateSlug}
                      className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors text-sm"
                    >
                      Gen
                    </button>
                  </div>
                </div>
              </div>

              {/* Roles */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Role (English) *
                  </label>
                  <input
                    type="text"
                    name="role_en"
                    value={formData.role_en}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Senior Designer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Role (Italian) *
                  </label>
                  <input
                    type="text"
                    name="role_it"
                    value={formData.role_it}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Designer Senior"
                  />
                </div>
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://example.com/avatar.jpg"
                />
                {formData.avatar_url && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <span className="text-xs text-zinc-500">Preview</span>
                  </div>
                )}
              </div>

              {/* Bios */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Bio (English)
                  </label>
                  <textarea
                    name="bio_en"
                    value={formData.bio_en}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Short biography..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Bio (Italian)
                  </label>
                  <textarea
                    name="bio_it"
                    value={formData.bio_it}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Breve biografia..."
                  />
                </div>
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
                    Delete Author
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
                  {isPending ? 'Saving...' : mode === 'create' ? 'Create Author' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
