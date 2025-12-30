/**
 * Gallery Types
 */

export type GalleryCategory = 'all' | 'Kitchen' | 'Living' | 'Pantry' | 'Details';

export interface GalleryImage {
  id: string;
  src: string;
  category: string;
  categoryIT: string;
  title: {
    en: string;
    it: string;
  };
  description: {
    en: string;
    it: string;
  };
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface DBGalleryImage {
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
  updated_at: string;
}
