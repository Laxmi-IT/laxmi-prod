'use client';

import { useState } from 'react';
import { AuthorEditor } from '@/components/admin/AuthorEditor';

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

interface AuthorsClientProps {
  authors: Author[];
}

export function AuthorsClient({ authors }: AuthorsClientProps) {
  const [editorState, setEditorState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    author?: Author;
  }>({
    isOpen: false,
    mode: 'create',
    author: undefined,
  });

  const openCreateModal = () => {
    setEditorState({ isOpen: true, mode: 'create', author: undefined });
  };

  const openEditModal = (author: Author) => {
    setEditorState({ isOpen: true, mode: 'edit', author });
  };

  const closeModal = () => {
    setEditorState({ isOpen: false, mode: 'create', author: undefined });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-foreground mb-2">Authors</h1>
          <p className="text-muted-foreground">
            Manage blog post authors. Changes are reflected immediately on the live site.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Author
        </button>
      </div>

      {/* Authors Grid */}
      {authors && authors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {authors.map((author) => (
            <div
              key={author.id}
              className="p-6 bg-card border border-border rounded-lg hover:border-border transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                {author.avatar_url ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={author.avatar_url}
                      alt={author.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center text-accent font-medium text-lg">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-foreground truncate">
                    {author.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {author.role_en}
                  </p>
                </div>
                <button
                  onClick={() => openEditModal(author)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
              {author.bio_en && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {author.bio_en}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Slug: {author.slug}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">No Authors</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get started by adding your first author.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Author
          </button>
        </div>
      )}

      {/* Author Editor Modal */}
      {editorState.isOpen && (
        <AuthorEditor
          mode={editorState.mode}
          author={editorState.author}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
