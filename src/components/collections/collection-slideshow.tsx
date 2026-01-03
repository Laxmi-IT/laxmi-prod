'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';

// Slideshow image type - compatible with both database and legacy static images
interface SlideshowImage {
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

interface CollectionSlideshowProps {
  images: SlideshowImage[];
  initialIndex: number;
  locale: string;
  onClose: () => void;
}

export function CollectionSlideshow({
  images,
  initialIndex,
  locale,
  onClose,
}: CollectionSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentImage = images[currentIndex];
  const title = locale === 'it' ? currentImage.title.it : currentImage.title.en;
  const description = locale === 'it' ? currentImage.description.it : currentImage.description.en;

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [images.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 200);
  }, [images.length, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [goToNext, goToPrev, onClose]);

  // Touch handling for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
    setTouchStart(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Strong opaque backdrop to hide background completely */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(250, 248, 243, 0.65)',
          backdropFilter: 'blur(75px) saturate(120%)',
          WebkitBackdropFilter: 'blur(75px) saturate(120%)',
        }}
      />

      {/* Header with elegant controls */}
      <div className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Series and counter */}
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-laxmi-gold font-light">
            {currentImage.series}
          </span>
          <div className="hidden sm:block w-px h-4 bg-laxmi-espresso/20" />
          <span className="text-sm md:text-base text-laxmi-espresso font-light">
            {currentIndex + 1} <span className="text-laxmi-espresso/50">/ {images.length}</span>
          </span>
        </div>

        {/* Close button - elegant on light background */}
        <button
          onClick={onClose}
          className="w-12 h-12 md:w-14 md:h-14 min-w-[48px] min-h-[48px] rounded-full bg-laxmi-espresso text-laxmi-cream flex items-center justify-center hover:bg-laxmi-bronze transition-colors duration-150 shadow-lg"
          aria-label="Close slideshow"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-16 pb-4 md:pb-8 gap-4 md:gap-8">
        {/* Navigation - Previous (desktop) */}
        <button
          onClick={goToPrev}
          className="hidden md:flex w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-laxmi-espresso/90 items-center justify-center text-laxmi-cream hover:bg-laxmi-gold transition-colors duration-150 shrink-0 shadow-lg"
          aria-label="Previous image"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image container with subtle shadow */}
        <div className="relative flex-1 w-full max-w-5xl aspect-[4/3] md:aspect-[16/10]">
          <div
            className={`relative w-full h-full transition-opacity duration-200 ease-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ willChange: 'opacity' }}
          >
            <Image
              src={currentImage.src}
              alt={title}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Elegant gold border frame */}
          <div className="absolute inset-0 border border-laxmi-gold/30 pointer-events-none" />
        </div>

        {/* Navigation - Next (desktop) */}
        <button
          onClick={goToNext}
          className="hidden md:flex w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-laxmi-espresso/90 items-center justify-center text-laxmi-cream hover:bg-laxmi-gold transition-colors duration-150 shrink-0 shadow-lg"
          aria-label="Next image"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Caption section - elegant on cream background */}
      <div className="relative z-10 px-4 md:px-8 pb-4 md:pb-6">
        <div className="max-w-3xl mx-auto text-center bg-white/60 rounded-lg p-4 md:p-6 border border-laxmi-gold/20 shadow-sm">
          <h2 className="font-serif font-light text-xl md:text-2xl lg:text-3xl text-laxmi-espresso mb-2 md:mb-3">
            {title}
          </h2>
          <p className="text-sm md:text-base text-laxmi-bronze font-light italic leading-relaxed">
            &ldquo;{description}&rdquo;
          </p>
        </div>
      </div>

      {/* Mobile navigation - elegant dark buttons */}
      <div className="relative z-10 md:hidden flex items-center justify-center gap-6 pb-4">
        <button
          onClick={goToPrev}
          className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-laxmi-espresso text-laxmi-cream flex items-center justify-center shadow-lg active:bg-laxmi-gold transition-colors duration-100"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2 items-center">
          {images.slice(Math.max(0, currentIndex - 2), Math.min(images.length, currentIndex + 3)).map((_, i) => {
            const actualIndex = Math.max(0, currentIndex - 2) + i;
            return (
              <button
                key={actualIndex}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`transition-all duration-150 rounded-full ${
                  actualIndex === currentIndex
                    ? 'bg-laxmi-gold w-6 h-2'
                    : 'bg-laxmi-espresso/40 w-2 h-2 hover:bg-laxmi-espresso/60'
                }`}
                aria-label={`Go to image ${actualIndex + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={goToNext}
          className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-laxmi-espresso text-laxmi-cream flex items-center justify-center shadow-lg active:bg-laxmi-gold transition-colors duration-100"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipe hint on mobile */}
      <p className="relative z-10 md:hidden text-center text-xs tracking-wider uppercase text-laxmi-bronze/60 pb-4 font-light">
        {locale === 'it' ? 'Scorri per navigare' : 'Swipe to navigate'}
      </p>
    </div>
  );
}
