"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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

const defaultCategories = [
  { en: "Living Room", it: "Soggiorno" },
  { en: "Bedroom", it: "Camera da Letto" },
  { en: "Kitchen", it: "Cucina" },
  { en: "Dining", it: "Sala da Pranzo" },
  { en: "Foyer", it: "Ingresso" },
  { en: "Villa", it: "Villa" },
  { en: "Interior", it: "Interni" },
  { en: "Details", it: "Dettagli" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title_en: "",
    title_it: "",
    category_en: "Living Room",
    category_it: "Soggiorno",
    alt_en: "",
    alt_it: "",
  });

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (categoryEn: string) => {
    const category = defaultCategories.find((c) => c.en === categoryEn);
    if (category) {
      setUploadForm((prev) => ({
        ...prev,
        category_en: category.en,
        category_it: category.it,
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select an image");
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = uploadFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(filePath, uploadFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);

      // Get max sort order
      const maxOrder = images.length > 0
        ? Math.max(...images.map((img) => img.sort_order))
        : 0;

      // Insert into database
      const { error: dbError } = await supabase
        .from("gallery_images")
        .insert({
          image_url: urlData.publicUrl,
          image_path: filePath,
          title_en: uploadForm.title_en,
          title_it: uploadForm.title_it,
          category_en: uploadForm.category_en,
          category_it: uploadForm.category_it,
          alt_en: uploadForm.alt_en || uploadForm.title_en,
          alt_it: uploadForm.alt_it || uploadForm.title_it,
          sort_order: maxOrder + 1,
        });

      if (dbError) throw dbError;

      toast.success("Image uploaded successfully");
      setShowUploadModal(false);
      resetUploadForm();
      fetchImages();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadFile(null);
    setUploadPreview(null);
    setUploadForm({
      title_en: "",
      title_it: "",
      category_en: "Living Room",
      category_it: "Soggiorno",
      alt_en: "",
      alt_it: "",
    });
  };

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
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("gallery")
        .remove([image.image_path]);

      if (storageError) console.warn("Storage delete failed:", storageError);

      // Delete from database
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

  const handleMoveImage = async (image: GalleryImage, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === image.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= images.length) return;

    const targetImage = images[targetIndex];

    try {
      // Swap sort orders
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light text-white mb-2">Gallery Management</h1>
          <p className="text-zinc-500">
            Manage portfolio images for the inspiration gallery.
          </p>
        </div>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Image
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-light text-white">{images.length}</div>
          <div className="text-sm text-zinc-500">Total Images</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-light text-white">
            {images.filter((img) => img.is_active).length}
          </div>
          <div className="text-sm text-zinc-500">Active Images</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
          <div className="text-2xl font-light text-white">
            {images.filter((img) => img.is_featured).length}
          </div>
          <div className="text-sm text-zinc-500">Featured</div>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-lg">
          <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No Images Yet</h3>
          <p className="text-sm text-zinc-500 mb-6">
            Start building your gallery by uploading your first image.
          </p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="bg-amber-600 hover:bg-amber-500 text-white"
          >
            Upload First Image
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`group relative bg-zinc-900 border rounded-lg overflow-hidden transition-all ${
                image.is_active ? "border-zinc-800" : "border-red-900/50 opacity-60"
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
                    <span className="px-2 py-1 text-xs bg-amber-500 text-white rounded">
                      Featured
                    </span>
                  )}
                  {!image.is_active && (
                    <span className="px-2 py-1 text-xs bg-red-500 text-white rounded">
                      Hidden
                    </span>
                  )}
                </div>

                {/* Order badge */}
                <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-zinc-900/80 text-zinc-400 rounded">
                  #{index + 1}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-zinc-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors"
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
                        ? "bg-zinc-700 text-white hover:bg-zinc-600"
                        : "bg-green-600 text-white hover:bg-green-500"
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
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
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
                  <span className="text-xs text-amber-500 uppercase tracking-wider">
                    {image.category_en}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveImage(image, "up")}
                      disabled={index === 0}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveImage(image, "down")}
                      disabled={index === images.length - 1}
                      className="p-1 text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-medium truncate">{image.title_en}</h3>
                <p className="text-sm text-zinc-500 truncate">{image.title_it}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-light text-white">Upload New Image</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <Label className="text-zinc-400 mb-2 block">Image</Label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      uploadPreview ? "border-amber-500/50" : "border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    {uploadPreview ? (
                      <div className="relative aspect-video max-h-48 mx-auto">
                        <Image
                          src={uploadPreview}
                          alt="Preview"
                          fill
                          className="object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFile(null);
                            setUploadPreview(null);
                          }}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <svg className="w-12 h-12 text-zinc-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-zinc-400">Click to upload or drag and drop</span>
                        <span className="block text-sm text-zinc-600 mt-1">PNG, JPG, WebP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-zinc-400">Category</Label>
                  <select
                    id="category"
                    value={uploadForm.category_en}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat.en} value={cat.en}>{cat.en} / {cat.it}</option>
                    ))}
                  </select>
                </div>

                {/* Title EN */}
                <div>
                  <Label htmlFor="title_en" className="text-zinc-400">Title (English)</Label>
                  <Input
                    id="title_en"
                    value={uploadForm.title_en}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, title_en: e.target.value }))}
                    placeholder="e.g., Serene Elegance"
                    required
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Title IT */}
                <div>
                  <Label htmlFor="title_it" className="text-zinc-400">Title (Italian)</Label>
                  <Input
                    id="title_it"
                    value={uploadForm.title_it}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, title_it: e.target.value }))}
                    placeholder="e.g., Eleganza Serena"
                    required
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Alt EN */}
                <div>
                  <Label htmlFor="alt_en" className="text-zinc-400">Alt Text (English)</Label>
                  <Input
                    id="alt_en"
                    value={uploadForm.alt_en}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, alt_en: e.target.value }))}
                    placeholder="Describe the image for accessibility"
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Alt IT */}
                <div>
                  <Label htmlFor="alt_it" className="text-zinc-400">Alt Text (Italian)</Label>
                  <Input
                    id="alt_it"
                    value={uploadForm.alt_it}
                    onChange={(e) => setUploadForm((prev) => ({ ...prev, alt_it: e.target.value }))}
                    placeholder="Descrizione dell'immagine"
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-light text-white">Edit Image</h2>
              <button
                onClick={() => setEditingImage(null)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
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
                {/* Category */}
                <div>
                  <Label className="text-zinc-400">Category (EN)</Label>
                  <select
                    value={editingImage.category_en}
                    onChange={(e) => {
                      const cat = defaultCategories.find((c) => c.en === e.target.value);
                      if (cat) {
                        setEditingImage((prev) => prev ? ({
                          ...prev,
                          category_en: cat.en,
                          category_it: cat.it,
                        }) : null);
                      }
                    }}
                    className="w-full mt-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-amber-500"
                  >
                    {defaultCategories.map((cat) => (
                      <option key={cat.en} value={cat.en}>{cat.en}</option>
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
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                  <span className="text-sm text-zinc-400">Featured Image</span>
                </div>

                {/* Title EN */}
                <div>
                  <Label className="text-zinc-400">Title (English)</Label>
                  <Input
                    value={editingImage.title_en}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, title_en: e.target.value }) : null)}
                    required
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Title IT */}
                <div>
                  <Label className="text-zinc-400">Title (Italian)</Label>
                  <Input
                    value={editingImage.title_it}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, title_it: e.target.value }) : null)}
                    required
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Alt EN */}
                <div>
                  <Label className="text-zinc-400">Alt Text (English)</Label>
                  <Input
                    value={editingImage.alt_en}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, alt_en: e.target.value }) : null)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Alt IT */}
                <div>
                  <Label className="text-zinc-400">Alt Text (Italian)</Label>
                  <Input
                    value={editingImage.alt_it}
                    onChange={(e) => setEditingImage((prev) => prev ? ({ ...prev, alt_it: e.target.value }) : null)}
                    className="mt-2 bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-zinc-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingImage(null)}
                  className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white"
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
