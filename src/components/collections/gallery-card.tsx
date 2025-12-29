'use client';

import Image from 'next/image';
import { CollectionImage } from '@/data/collections';

interface GalleryCardProps {
  image: CollectionImage;
  index: number;
  locale: string;
  onClick: () => void;
}

export function GalleryCard({ image, index, locale, onClick }: GalleryCardProps) {
  const title = locale === 'it' ? image.title.it : image.title.en;
  const description = locale === 'it' ? image.description.it : image.description.en;

  return (
    <div
      className="group relative aspect-[4/3] overflow-hidden cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${(index % 9) * 80}ms` }}
      onClick={onClick}
    >
      {/* Image */}
      <Image
        src={image.src}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading={index < 6 ? 'eager' : 'lazy'}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/80 via-laxmi-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
        {/* Series badge */}
        <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-laxmi-champagne/90 mb-1.5">
          {image.series}
        </span>

        {/* Title */}
        <h3 className="font-serif text-lg md:text-xl text-white mb-2">
          {title}
        </h3>

        {/* Description - hidden on mobile for cleaner look */}
        <p className="hidden md:block text-sm text-white/70 font-light line-clamp-2">
          {description}
        </p>
      </div>

      {/* Gold corner accents on hover */}
      <div className="absolute top-4 left-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <div className="absolute top-0 left-0 w-full h-px bg-laxmi-gold/70" />
        <div className="absolute top-0 left-0 h-full w-px bg-laxmi-gold/70" />
      </div>
      <div className="absolute bottom-4 right-4 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
        <div className="absolute bottom-0 right-0 w-full h-px bg-laxmi-gold/70" />
        <div className="absolute bottom-0 right-0 h-full w-px bg-laxmi-gold/70" />
      </div>

      {/* Subtle inner border on hover */}
      <div className="absolute inset-3 border border-white/0 group-hover:border-white/10 transition-all duration-500 pointer-events-none" />
    </div>
  );
}
