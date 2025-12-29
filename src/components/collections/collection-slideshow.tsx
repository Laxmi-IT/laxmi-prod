'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { CollectionImage } from '@/data/collections';

interface CollectionSlideshowProps {
  images: CollectionImage[];
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
    setTimeout(() => setIsTransitioning(false), 500);
  }, [images.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsTransitioning(false), 500);
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
      className="fixed inset-0 z-50 bg-laxmi-espresso/98 backdrop-blur-md flex flex-col animate-fade-in"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Series and counter */}
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-laxmi-champagne/80">
            {currentImage.series}
          </span>
          <span className="text-xs text-white/40">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition-colors duration-300"
          aria-label="Close slideshow"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 md:px-16 pb-4 md:pb-8 gap-6 md:gap-12">
        {/* Navigation - Previous (desktop only) */}
        <button
          onClick={goToPrev}
          className="hidden md:flex w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm items-center justify-center text-white hover:bg-white/10 transition-colors duration-300 shrink-0"
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Image container */}
        <div className="relative flex-1 w-full max-w-5xl aspect-[4/3] md:aspect-[16/10]">
          <div
            className={`relative w-full h-full transition-opacity duration-500 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src={currentImage.src}
              alt={title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Decorative border */}
          <div className="absolute inset-0 border border-laxmi-gold/10 pointer-events-none" />
        </div>

        {/* Navigation - Next (desktop only) */}
        <button
          onClick={goToNext}
          className="hidden md:flex w-14 h-14 rounded-full bg-white/5 backdrop-blur-sm items-center justify-center text-white hover:bg-white/10 transition-colors duration-300 shrink-0"
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Caption section */}
      <div className="px-4 md:px-8 pb-6 md:pb-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-xl md:text-3xl text-white mb-3">
            {title}
          </h2>
          <p className="text-sm md:text-base text-white/60 font-light italic leading-relaxed">
            &ldquo;{description}&rdquo;
          </p>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden flex items-center justify-center gap-4 pb-6">
        <button
          onClick={goToPrev}
          className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/5 flex items-center justify-center text-white"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5 max-w-[200px] overflow-hidden">
          {images.slice(Math.max(0, currentIndex - 3), Math.min(images.length, currentIndex + 4)).map((_, i) => {
            const actualIndex = Math.max(0, currentIndex - 3) + i;
            return (
              <button
                key={actualIndex}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  actualIndex === currentIndex
                    ? 'bg-laxmi-gold w-4'
                    : 'bg-white/30'
                }`}
                aria-label={`Go to image ${actualIndex + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={goToNext}
          className="w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/5 flex items-center justify-center text-white"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Swipe hint on mobile */}
      <p className="md:hidden text-center text-[10px] tracking-wider uppercase text-white/30 pb-4">
        Swipe to navigate
      </p>
    </div>
  );
}
