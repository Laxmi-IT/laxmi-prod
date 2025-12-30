'use client';

import { useState } from 'react';
import { CategoryEditor } from '@/components/admin/CategoryEditor';

interface Category {
  id: string;
  name_en: string;
  name_it: string;
  slug: string;
  description_en?: string;
  description_it?: string;
  sort_order?: number;
}

interface CategoriesClientProps {
  categories: Category[];
}

export function CategoriesClient({ categories }: CategoriesClientProps) {
  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    category?: Category;
  }>({
    isOpen: false,
    mode: 'create',
    category: undefined,
  });

  const openCreateModal = () => {
    setEditorState({ isOpen: true, mode: 'create', category: undefined });
  };

  const openEditModal = (category: Category) => {
    setEditorState({ isOpen: true, mode: 'edit', category });
  };

  const closeModal = () => {
    setEditorState({ isOpen: false, mode: 'create', category: undefined });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white mb-2">Categories</h1>
          <p className="text-zinc-500">
            Manage blog post categories. Changes are reflected immediately on the live site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/20">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                {category.name_en}
              </h3>
              <p className="text-sm text-zinc-500 mb-2">
                {category.name_it}
              </p>
              {category.description_en && (
                <p className="text-xs text-zinc-600 mb-2 line-clamp-2">
                  {category.description_en}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-600">
                  Slug: {category.slug}
                </p>
                {category.sort_order !== undefined && (
                  <p className="text-xs text-zinc-600">
                    Order: {category.sort_order}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-lg">
          <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No Categories</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Get started by creating your first category.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Category
          </button>
        </div>
      )}

      {/* Category Editor Modal */}
      {editorState.isOpen && (
        <CategoryEditor
          mode={editorState.mode}
          category={editorState.category}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
