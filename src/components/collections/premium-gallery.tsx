'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { DYNAMIC_BLUR_DATA_URL } from '@/lib/image/blur-data';
import { CategoryFilter } from './category-filter';
import { CollectionSlideshow } from './collection-slideshow';

// Types for gallery images from database
export interface GalleryImageData {
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

// Legacy type for static data compatibility
export interface CollectionImage {
  id: string;
  src: string;
  category: string;
  series?: string;
  title: {
    en: string;
    it: string;
  };
  description: {
    en: string;
    it: string;
  };
}

type ImageType = GalleryImageData | CollectionImage;

interface PremiumGalleryProps {
  locale: string;
  images: ImageType[];
  translations: {
    filterLabel: string;
    showingCount: string;
    noResults: string;
  };
}

// Helper to get series from image (for legacy static data)
function getImageSeries(image: ImageType): string {
  return 'series' in image && image.series ? image.series : '';
}

// Featured card component for hero images
function FeaturedCard({
  image,
  index,
  locale,
  onClick,
}: {
  image: ImageType;
  index: number;
  locale: string;
  onClick: () => void;
}) {
  const title = locale === 'it' ? image.title.it : image.title.en;
  const description = locale === 'it' ? image.description.it : image.description.en;
  const series = getImageSeries(image);

  return (
    <div
      className="group relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      {/* Image */}
      <Image
        src={image.src}
        alt={title}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
        sizes="(max-width: 768px) 100vw, 66vw"
        loading={index < 3 ? 'eager' : 'lazy'}
        quality={90}
        placeholder="blur"
        blurDataURL={DYNAMIC_BLUR_DATA_URL}
      />

      {/* Gradient overlay - always visible but stronger on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/90 via-laxmi-espresso/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content overlay - always visible */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 lg:p-10">
        {/* Series/Category badge */}
        <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-laxmi-gold mb-2 md:mb-3">
          {series || image.category}
        </span>

        {/* Title */}
        <h3 className="font-serif font-light text-xl md:text-2xl lg:text-3xl text-laxmi-cream mb-2 md:mb-3 group-hover:translate-x-2 transition-transform duration-500">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-laxmi-cream/80 font-light line-clamp-2 max-w-md opacity-80 group-hover:opacity-100 transition-opacity duration-500">
          {description}
        </p>

        {/* View indicator */}
        <div className="mt-4 md:mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="text-xs tracking-[0.2em] uppercase text-laxmi-gold">
            {locale === 'it' ? 'Visualizza' : 'View'}
          </span>
          <div className="w-6 h-px bg-laxmi-gold" />
        </div>
      </div>

      {/* Gold corner accents */}
      <div className="absolute top-5 left-5 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
        <div className="absolute top-0 left-0 w-full h-px bg-laxmi-gold" />
        <div className="absolute top-0 left-0 h-full w-px bg-laxmi-gold" />
      </div>
      <div className="absolute bottom-5 right-5 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
        <div className="absolute bottom-0 right-0 w-full h-px bg-laxmi-gold" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-laxmi-gold" />
      </div>
    </div>
  );
}

// Standard card component
function StandardCard({
  image,
  index,
  locale,
  onClick,
}: {
  image: ImageType;
  index: number;
  locale: string;
  onClick: () => void;
}) {
  const title = locale === 'it' ? image.title.it : image.title.en;
  const series = getImageSeries(image);

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${(index % 12) * 100}ms` }}
      onClick={onClick}
    >
      {/* Image */}
      <Image
        src={image.src}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading={index < 6 ? 'eager' : 'lazy'}
        quality={80}
        placeholder="blur"
        blurDataURL={DYNAMIC_BLUR_DATA_URL}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/80 via-laxmi-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        {/* Series/Category badge */}
        <span className="text-[10px] tracking-[0.2em] uppercase text-laxmi-champagne/90 mb-1.5">
          {series || image.category}
        </span>

        {/* Title */}
        <h3 className="font-serif font-light text-lg md:text-xl text-laxmi-cream">
          {title}
        </h3>
      </div>

      {/* Subtle gold border on hover */}
      <div className="absolute inset-0 border-2 border-laxmi-gold/0 group-hover:border-laxmi-gold/30 transition-all duration-500 pointer-events-none" />
    </div>
  );
}

// Category type for filtering
type Category = 'all' | 'Kitchen' | 'Living' | 'Pantry' | 'Details';

// Helper to filter images by category
function filterByCategory(images: ImageType[], category: Category): ImageType[] {
  if (category === 'all') return images;
  return images.filter((img) => img.category === category);
}

export function PremiumGallery({ locale, images, translations }: PremiumGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () => filterByCategory(images, activeCategory),
    [images, activeCategory]
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseSlideshow = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div className="space-y-12 md:space-y-16">
      {/* Filter section with improved spacing */}
      <div className="space-y-6">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          locale={locale}
        />

        {/* Results count with decorative elements */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-8 h-px bg-laxmi-gold/30" />
          <p className="text-sm text-laxmi-espresso/60 tracking-wide">
            {translations.showingCount.replace('{count}', String(filteredImages.length))}
          </p>
          <div className="w-8 h-px bg-laxmi-gold/30" />
        </div>
      </div>

      {/* Gallery grid - Simple uniform layout that works */}
      {filteredImages.length > 0 ? (
        <div className="space-y-6 md:space-y-8">
          {/* First row: Featured large image */}
          {filteredImages.length > 0 && (
            <FeaturedCard
              image={filteredImages[0]}
              index={0}
              locale={locale}
              onClick={() => handleImageClick(0)}
            />
          )}

          {/* Remaining images in a clean grid */}
          {filteredImages.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredImages.slice(1).map((image, idx) => {
                const actualIndex = idx + 1;
                return (
                  <StandardCard
                    key={image.id}
                    image={image}
                    index={actualIndex}
                    locale={locale}
                    onClick={() => handleImageClick(actualIndex)}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-24">
          <div className="w-16 h-px bg-laxmi-gold/30 mx-auto mb-6" />
          <p className="text-laxmi-espresso/50 italic font-serif text-lg">{translations.noResults}</p>
          <div className="w-16 h-px bg-laxmi-gold/30 mx-auto mt-6" />
        </div>
      )}

      {/* Slideshow modal */}
      {selectedImageIndex !== null && (
        <CollectionSlideshow
          images={filteredImages}
          initialIndex={selectedImageIndex}
          locale={locale}
          onClose={handleCloseSlideshow}
        />
      )}
    </div>
  );
}
