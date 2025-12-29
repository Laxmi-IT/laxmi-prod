'use client';

import { useState, useMemo } from 'react';
import { CollectionImage, Category, getImagesByCategory } from '@/data/collections';
import { CategoryFilter } from './category-filter';
import { GalleryCard } from './gallery-card';
import { CollectionSlideshow } from './collection-slideshow';

interface PremiumGalleryProps {
  locale: string;
  translations: {
    filterLabel: string;
    showingCount: string;
    noResults: string;
  };
}

export function PremiumGallery({ locale, translations }: PremiumGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const filteredImages = useMemo(
    () => getImagesByCategory(activeCategory),
    [activeCategory]
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseSlideshow = () => {
    setSelectedImageIndex(null);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Filter section */}
      <div className="space-y-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          locale={locale}
        />

        {/* Results count */}
        <p className="text-center text-sm text-laxmi-espresso/50">
          {translations.showingCount.replace('{count}', String(filteredImages.length))}
        </p>
      </div>

      {/* Gallery grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredImages.map((image, index) => (
            <GalleryCard
              key={image.id}
              image={image}
              index={index}
              locale={locale}
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-laxmi-espresso/50 italic">{translations.noResults}</p>
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
