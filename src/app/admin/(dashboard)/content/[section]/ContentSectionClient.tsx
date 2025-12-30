"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { ContentItemEditor } from "@/components/admin/ContentItemEditor";
import type { SiteContent, ContentSection } from "@/lib/admin/types";

interface ContentSectionClientProps {
  sectionInfo: ContentSection;
  content: SiteContent[];
  userId: string;
}

interface ContentGroup {
  prefix: string;
  items: SiteContent[];
}

export function ContentSectionClient({
  sectionInfo,
  content,
  userId,
}: ContentSectionClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [saveCount, setSaveCount] = useState(0);

  // Group content by prefix (e.g., "hero.tagline1" and "hero.description" → "hero" group)
  const groupedContent = useMemo(() => {
    const groups: Map<string, SiteContent[]> = new Map();

    for (const item of content) {
      // Get the group prefix (first part of the key)
      const parts = item.content_key.split(".");
      const prefix = parts.length > 1 ? parts[0] : "_root";

      if (!groups.has(prefix)) {
        groups.set(prefix, []);
      }
      groups.get(prefix)!.push(item);
    }

    // Convert to array and sort
    const result: ContentGroup[] = [];
    for (const [prefix, items] of groups) {
      result.push({
        prefix,
        items: items.sort((a, b) => a.sort_order - b.sort_order),
      });
    }

    // Sort groups alphabetically, but put _root first
    return result.sort((a, b) => {
      if (a.prefix === "_root") return -1;
      if (b.prefix === "_root") return 1;
      return a.prefix.localeCompare(b.prefix);
    });
  }, [content]);

  // Filter content based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedContent;
    }

    const query = searchQuery.toLowerCase();
    return groupedContent
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.content_key.toLowerCase().includes(query) ||
            item.content_en.toLowerCase().includes(query) ||
            item.content_it.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedContent, searchQuery]);

  // Toggle group expansion
  const toggleGroup = useCallback((prefix: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) {
        next.delete(prefix);
      } else {
        next.add(prefix);
      }
      return next;
    });
  }, []);

  // Expand all groups
  const expandAll = useCallback(() => {
    setExpandedGroups(new Set(filteredGroups.map((g) => g.prefix)));
  }, [filteredGroups]);

  // Collapse all groups
  const collapseAll = useCallback(() => {
    setExpandedGroups(new Set());
  }, []);

  // Handle save notification
  const handleSaved = useCallback(() => {
    setSaveCount((prev) => prev + 1);
  }, []);

  // Total items count
  const totalItems = content.length;
  const filteredItems = filteredGroups.reduce((sum, g) => sum + g.items.length, 0);

  // Check if all groups are expanded
  const allExpanded = filteredGroups.every((g) => expandedGroups.has(g.prefix));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/content"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-amber-500 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Content
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-light text-white">{sectionInfo.display_name_en}</h1>
            {sectionInfo.description && (
              <p className="text-zinc-400 text-sm mt-1">{sectionInfo.description}</p>
            )}
            <p className="text-xs text-zinc-500 mt-2">
              {filteredItems === totalItems
                ? `${totalItems} items`
                : `Showing ${filteredItems} of ${totalItems} items`}
              {saveCount > 0 && (
                <span className="ml-2 text-emerald-400">
                  {saveCount} saved
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content keys or values..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {allExpanded ? "Collapse All" : "Expand All"}
          </button>
        </div>
      </div>

      {/* Content Groups */}
      <div className="space-y-4">
        {filteredGroups.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-zinc-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-zinc-400">No content items match your search.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-amber-500 hover:text-amber-400"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.prefix);
            const displayPrefix = group.prefix === "_root" ? "Root Level" : group.prefix;

            return (
              <div
                key={group.prefix}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden"
              >
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.prefix)}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <span className="font-medium text-white">{displayPrefix}</span>
                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </span>
                  </div>
                </button>

                {/* Group Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    {group.items.map((item) => (
                      <ContentItemEditor
                        key={item.id}
                        item={item}
                        userId={userId}
                        onSaved={handleSaved}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Info Note */}
      <div className="mt-8 p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm">
            <p className="text-amber-200/90 font-medium mb-1">Live Content Updates</p>
            <p className="text-zinc-400">
              Changes are saved immediately and will be visible on the live website after a brief cache refresh
              (up to 1 hour for cached pages, instant for uncached pages).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
