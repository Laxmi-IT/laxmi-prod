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
          <h1 className="text-2xl font-light text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">
            Manage blog post categories. Changes are reflected immediately on the live site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
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
              className="p-6 bg-card border border-border rounded-lg hover:border-border transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-secondary/60 text-secondary-foreground rounded-lg border border-border">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">
                {category.name_en}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                {category.name_it}
              </p>
              {category.description_en && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {category.description_en}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Slug: {category.slug}
                </p>
                {category.sort_order !== undefined && (
                  <p className="text-xs text-muted-foreground">
                    Order: {category.sort_order}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">No Categories</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get started by creating your first category.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
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
