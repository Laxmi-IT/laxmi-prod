"use client";

import { useState, useCallback } from "react";
import { updateContentItem } from "@/lib/admin/actions";
import type { SiteContent } from "@/lib/admin/types";

interface ContentItemEditorProps {
  item: SiteContent;
  userId: string;
  onSaved?: () => void;
}

export function ContentItemEditor({ item, userId, onSaved }: ContentItemEditorProps) {
  const [contentEn, setContentEn] = useState(item.content_en);
  const [contentIt, setContentIt] = useState(item.content_it);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasChanges =
    contentEn !== item.content_en || contentIt !== item.content_it;

  const isLongContent =
    item.content_en.length > 100 ||
    item.content_it.length > 100 ||
    item.content_en.includes("\n") ||
    item.content_it.includes("\n");

  const handleSave = useCallback(async () => {
    if (!hasChanges) return;

    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const result = await updateContentItem(item.id, contentEn, contentIt, userId);

      if (result.success) {
        setSaved(true);
        onSaved?.();
        // Reset saved indicator after 2 seconds
        setTimeout(() => setSaved(false), 2000);
      } else {
        setError(result.error || "Failed to save");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSaving(false);
    }
  }, [item.id, contentEn, contentIt, userId, hasChanges, onSaved]);

  // Extract the key name (last part after the last dot)
  const keyParts = item.content_key.split(".");
  const displayKey = keyParts[keyParts.length - 1];

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-medium text-white">{displayKey}</h4>
          <p className="text-xs text-zinc-500 font-mono">{item.content_key}</p>
        </div>
        <div className="flex items-center gap-2">
          {error && (
            <span className="text-xs text-red-400">{error}</span>
          )}
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              hasChanges && !saving
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {saving ? (
              <span className="flex items-center gap-1">
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </div>

      {/* Content editors */}
      <div className="grid grid-cols-2 gap-4">
        {/* English */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            English (EN)
          </label>
          {isLongContent ? (
            <textarea
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 resize-y min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={contentEn}
              onChange={(e) => setContentEn(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
          )}
        </div>

        {/* Italian */}
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Italian (IT)
          </label>
          {isLongContent ? (
            <textarea
              value={contentIt}
              onChange={(e) => setContentIt(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 resize-y min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={contentIt}
              onChange={(e) => setContentIt(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
          )}
        </div>
      </div>

      {/* Description if available */}
      {item.description && (
        <p className="mt-2 text-xs text-zinc-500 italic">{item.description}</p>
      )}
    </div>
  );
}
