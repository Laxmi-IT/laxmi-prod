"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GALLERY_CATEGORIES, getCategoryByKey } from "@/lib/gallery/categories";

interface GalleryImage {
  id: string;
  image_url: string;
  image_path: string;
  title_en: string;
  title_it: string;
  category_en: string;
  category_it: string;
  alt_en: string;
  alt_it: string;
  sort_order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

function generateBulkMetadata(
  categoryEn: string,
  categoryIt: string,
  index: number,
) {
  const num = index + 1;
  return {
    title_en: `${categoryEn} Collection — ${num}`,
    title_it: `Collezione ${categoryIt} — ${num}`,
    alt_en: `LAXMI luxury ${categoryEn.toLowerCase()} interior design — Image ${num}`,
    alt_it: `LAXMI design d'interni di lusso ${categoryIt.toLowerCase()} — Immagine ${num}`,
  };
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<string>(GALLERY_CATEGORIES[0].key);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      toast.error("Failed to fetch images");
      console.error(error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const albumImages = images.filter((img) => img.category_en === activeAlbum);
  const activeCategory = getCategoryByKey(activeAlbum) ?? GALLERY_CATEGORIES[0];

  // ── Upload (drag & drop / multi-select) ──
  const uploadFiles = useCallback(
    async (fileList: File[]) => {
      const valid: File[] = [];
      let skipped = 0;
      for (const file of fileList) {
        if (file.size > MAX_FILE_SIZE || !ACCEPTED_TYPES.includes(file.type)) {
          skipped++;
          continue;
        }
        valid.push(file);
      }

      if (skipped > 0) {
        toast.warning(`${skipped} file(s) skipped (too large or unsupported format)`);
      }
      if (valid.length === 0) return;

      const cat = getCategoryByKey(activeAlbum) ?? GALLERY_CATEGORIES[0];
      const albumCountBefore = images.filter((i) => i.category_en === cat.key).length;
      const maxOrder = images.length > 0 ? Math.max(...images.map((i) => i.sort_order)) : 0;

      setUploading(true);
      setUploadProgress({ current: 0, total: valid.length });

      let done = 0;
      let failed = 0;

      for (let i = 0; i < valid.length; i++) {
        const file = valid[i];
        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
          const filePath = `gallery/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("gallery")
            .upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("gallery")
            .getPublicUrl(filePath);

          const meta = generateBulkMetadata(cat.en, cat.it, albumCountBefore + done);

          const { error: dbError } = await supabase
            .from("gallery_images")
            .insert({
              image_url: urlData.publicUrl,
              image_path: filePath,
              title_en: meta.title_en,
              title_it: meta.title_it,
              category_en: cat.key,
              category_it: cat.it,
              alt_en: meta.alt_en,
              alt_it: meta.alt_it,
              sort_order: maxOrder + done + 1,
            });
          if (dbError) throw dbError;

          done++;
        } catch (error) {
          console.error("Upload error:", error);
          failed++;
        }
        setUploadProgress({ current: done + failed, total: valid.length });
      }

      setUploading(false);
      setUploadProgress({ current: 0, total: 0 });

      if (failed === 0) {
        toast.success(`${done} photo${done !== 1 ? "s" : ""} added to ${cat.en}`);
      } else {
        toast.warning(`${done} added, ${failed} failed`);
      }

      fetchImages();
    },
    [activeAlbum, images, supabase, fetchImages],
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (uploading) return;
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(Array.from(e.target.files || []));
    if (e.target) e.target.value = "";
  };

  // ── Image actions ──
  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({
          title_en: editingImage.title_en,
          title_it: editingImage.title_it,
          category_en: editingImage.category_en,
          category_it: editingImage.category_it,
          alt_en: editingImage.alt_en,
          alt_it: editingImage.alt_it,
          is_featured: editingImage.is_featured,
          is_active: editingImage.is_active,
        })
        .eq("id", editingImage.id);

      if (error) throw error;

      toast.success("Image updated successfully");
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update image");
    }
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([image.image_path]);
      if (storageError) console.warn("Storage delete failed:", storageError);

      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", image.id);
      if (dbError) throw dbError;

      toast.success("Image deleted successfully");
      fetchImages();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  // Reorder within the active album (swap sort_order with adjacent album image)
  const handleMoveImage = async (image: GalleryImage, direction: "up" | "down") => {
    const currentIndex = albumImages.findIndex((img) => img.id === image.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= albumImages.length) return;

    const targetImage = albumImages[targetIndex];

    try {
      await supabase
        .from("gallery_images")
        .update({ sort_order: targetImage.sort_order })
        .eq("id", image.id);
      await supabase
        .from("gallery_images")
        .update({ sort_order: image.sort_order })
        .eq("id", targetImage.id);
      fetchImages();
    } catch (error) {
      console.error("Move error:", error);
      toast.error("Failed to reorder images");
    }
  };

  const handleToggleActive = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from("gallery_images")
        .update({ is_active: !image.is_active })
        .eq("id", image.id);
      if (error) throw error;
      toast.success(image.is_active ? "Image hidden" : "Image visible");
      fetchImages();
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("Failed to update image");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-foreground mb-2">Gallery Albums</h1>
        <p className="text-muted-foreground">
          Choose an album, then drag &amp; drop photos to add them to the gallery.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-light text-foreground">{images.length}</div>
          <div className="text-sm text-muted-foreground">Total Images</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-light text-foreground">
            {images.filter((img) => img.is_active).length}
          </div>
          <div className="text-sm text-muted-foreground">Visible Images</div>
        </div>
        <div className="p-4 bg-card border border-border rounded-lg">
          <div className="text-2xl font-light text-foreground">
            {images.filter((img) => img.is_featured).length}
          </div>
          <div className="text-sm text-muted-foreground">Featured</div>
        </div>
      </div>

      {/* Album tabs */}
      <div className="mb-6">
        <Label className="text-muted-foreground mb-3 block">Albums</Label>
        <div className="flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((cat) => {
            const count = images.filter((img) => img.category_en === cat.key).length;
            const isActive = activeAlbum === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveAlbum(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
                }`}
              >
                <span>{cat.en}</span>
                <span className="text-muted-foreground/70 text-xs">/ {cat.it}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Drag & drop upload zone for the active album */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!uploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative mb-10 rounded-xl border-2 border-dashed p-8 md:p-12 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40"
        } ${uploading ? "pointer-events-none opacity-80" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />

        {uploading ? (
          <div className="max-w-sm mx-auto">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>
                Uploading {uploadProgress.current} of {uploadProgress.total} to {activeCategory.en}…
              </span>
              <span>
                {uploadProgress.total > 0
                  ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{
                  width: `${
                    uploadProgress.total > 0
                      ? (uploadProgress.current / uploadProgress.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg
              className="w-12 h-12 text-muted-foreground mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-foreground font-medium">
              Drag &amp; drop photos here, or click to select
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              They&apos;ll be added to the{" "}
              <span className="text-primary font-medium">{activeCategory.en}</span> album · PNG, JPG,
              WebP up to 5MB · multiple at once
            </p>
          </>
        )}
      </div>

      {/* Album grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-light text-foreground">
          {activeCategory.en} <span className="text-muted-foreground">/ {activeCategory.it}</span>
        </h2>
        <span className="text-sm text-muted-foreground">
          {albumImages.length} photo{albumImages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {albumImages.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-lg">
          <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">No photos in {activeCategory.en} yet</h3>
          <p className="text-sm text-muted-foreground">
            Drop photos in the area above to start building this album.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albumImages.map((image, index) => (
            <div
              key={image.id}
              className={`group relative bg-card border rounded-lg overflow-hidden transition-all ${
                image.is_active ? "border-border" : "border-destructive/40 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={image.image_url}
                  alt={image.alt_en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Status badges */}
                <div className="absolute top-2 left-2 flex gap-2">
                  {image.is_featured && (
                    <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded">
                      Featured
                    </span>
                  )}
                  {!image.is_active && (
                    <span className="px-2 py-1 text-xs bg-destructive text-white rounded">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Order badge */}
                <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-background/80 text-muted-foreground rounded">
                  #{index + 1}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleToggleActive(image)}
                    className={`p-2 rounded-lg transition-colors ${
                      image.is_active
                        ? "bg-muted text-foreground hover:bg-muted/80"
                        : "bg-accent text-accent-foreground hover:bg-accent/90"
                    }`}
                    title={image.is_active ? "Hide" : "Show"}
                  >
                    {image.is_active ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image)}
                    className="p-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-primary uppercase tracking-wider">
                    {image.category_en}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveImage(image, "up")}
                      disabled={index === 0}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveImage(image, "down")}
                      disabled={index === albumImages.length - 1}
                      className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-foreground font-medium truncate">{image.title_en}</h3>
                <p className="text-sm text-muted-foreground truncate">{image.title_it}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90">
          <div className="w-full max-w-2xl bg-card border border-border rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-light text-foreground">Edit Photo</h2>
              <button
                onClick={() => setEditingImage(null)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateImage} className="p-6">
              {/* Preview */}
              <div className="relative aspect-video max-h-48 mx-auto mb-6 rounded-lg overflow-hidden">
                <Image
                  src={editingImage.image_url}
                  alt={editingImage.alt_en}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Album / Category */}
                <div>
                  <Label className="text-muted-foreground">Album</Label>
                  <select
                    value={editingImage.category_en}
                    onChange={(e) => {
                      const cat = GALLERY_CATEGORIES.find((c) => c.key === e.target.value);
                      if (cat) {
                        setEditingImage((prev) => prev ? ({
                          ...prev,
                          category_en: cat.key,
                          category_it: cat.it,
                        }) : null);
                      }
                    }}
                    className="w-full mt-2 px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.en} / {cat.it}</option>
                    ))}
                  </select>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3 mt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingImage.is_featured}
                      onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, is_featured: e.target.checked }) : null)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <span className="text-sm text-muted-foreground">Featured Image</span>
                </div>

                {/* Title EN */}
                <div>
                  <Label className="text-muted-foreground">Title (English)</Label>
                  <Input
                    value={editingImage.title_en}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, title_en: e.target.value }) : null)}
                    required
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                {/* Title IT */}
                <div>
                  <Label className="text-muted-foreground">Title (Italian)</Label>
                  <Input
                    value={editingImage.title_it}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, title_it: e.target.value }) : null)}
                    required
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                {/* Alt EN */}
                <div>
                  <Label className="text-muted-foreground">Alt Text (English)</Label>
                  <Input
                    value={editingImage.alt_en}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, alt_en: e.target.value }) : null)}
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>

                {/* Alt IT */}
                <div>
                  <Label className="text-muted-foreground">Alt Text (Italian)</Label>
                  <Input
                    value={editingImage.alt_it}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, alt_it: e.target.value }) : null)}
                    className="mt-2 bg-muted border-border text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingImage(null)}
                  className="border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
