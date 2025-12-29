'use client';

import { Category, categories } from '@/data/collections';

interface CategoryFilterProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  locale: string;
}

export function CategoryFilter({ activeCategory, onCategoryChange, locale }: CategoryFilterProps) {
  return (
    <div className="relative">
      {/* Desktop: Centered tabs */}
      <div className="hidden md:flex justify-center items-center gap-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`relative py-3 text-sm tracking-[0.15em] uppercase transition-colors duration-300 ${
              activeCategory === cat.value
                ? 'text-laxmi-gold'
                : 'text-laxmi-espresso/60 hover:text-laxmi-espresso'
            }`}
          >
            {locale === 'it' ? cat.label.it : cat.label.en}
            {/* Underline indicator */}
            <span
              className={`absolute bottom-0 left-0 h-px bg-laxmi-gold transition-all duration-300 ${
                activeCategory === cat.value ? 'w-full' : 'w-0'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Mobile: Horizontal scrollable pills */}
      <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-3 pb-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-5 py-2.5 rounded-full text-xs tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-300 min-w-[44px] min-h-[44px] ${
                activeCategory === cat.value
                  ? 'bg-laxmi-gold text-white'
                  : 'bg-laxmi-cream border border-laxmi-espresso/10 text-laxmi-espresso/70 hover:border-laxmi-gold/30'
              }`}
            >
              {locale === 'it' ? cat.label.it : cat.label.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
