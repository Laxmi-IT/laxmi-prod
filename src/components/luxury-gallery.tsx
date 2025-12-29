'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryImageTranslation {
  category: string
  title: string
  alt: string
}

interface LuxuryGalleryProps {
  images: GalleryImageTranslation[]
}

const imageSources = [
  '/images/hero-main.jpg',
  '/images/gallery-1.jpg',
  '/images/gallery-2.jpg',
  '/images/gallery-3.jpg',
  '/images/gallery-4.jpg',
  '/images/gallery-5.jpg',
]

export function LuxuryGallery({ images }: LuxuryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const galleryItems = images.map((img, index) => ({
    ...img,
    src: imageSources[index] || imageSources[0],
    id: String(index + 1),
  }))

  const selectedImage = selectedIndex !== null ? galleryItems[selectedIndex] : null

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {galleryItems.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-[4/3] overflow-hidden cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setSelectedIndex(index)}
          >
            {/* Image */}
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase text-laxmi-champagne/80 mb-2">
                {image.category}
              </span>
              <h3 className="font-serif text-xl text-white">
                {image.title}
              </h3>
            </div>

            {/* Border frame on hover */}
            <div className="absolute inset-3 border border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />

            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 left-0 w-full h-px bg-laxmi-gold/60" />
              <div className="absolute top-0 left-0 h-full w-px bg-laxmi-gold/60" />
            </div>
            <div className="absolute bottom-3 right-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute bottom-0 right-0 w-full h-px bg-laxmi-gold/60" />
              <div className="absolute bottom-0 right-0 h-full w-px bg-laxmi-gold/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-laxmi-espresso/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-5xl w-full aspect-[4/3] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />

            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 w-12 h-12 min-w-[48px] min-h-[48px] rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors duration-300"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-laxmi-espresso/90 to-transparent">
              <span className="text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase text-laxmi-champagne/80 mb-2 block">
                {selectedImage.category}
              </span>
              <h3 className="font-serif text-2xl text-white mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-white/70 font-light text-sm">
                {selectedImage.alt}
              </p>
            </div>

            {/* Decorative border */}
            <div className="absolute inset-4 border border-laxmi-gold/20 pointer-events-none" />
          </div>
        </div>
      )}
    </>
  )
}
