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
      {/* Desktop: Elegant centered tabs */}
      <div className="hidden md:flex justify-center items-center">
        <div className="inline-flex items-center bg-laxmi-cream/50 dark:bg-card/30 rounded-full p-1.5 border border-laxmi-espresso/5 shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`relative px-6 py-3 text-sm tracking-[0.12em] uppercase transition-all duration-300 rounded-full font-light ${
                activeCategory === cat.value
                  ? 'bg-laxmi-espresso text-laxmi-cream shadow-lg'
                  : 'text-laxmi-espresso/60 hover:text-laxmi-espresso hover:bg-white/50'
              }`}
            >
              {locale === 'it' ? cat.label.it : cat.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Clean 2x2 + 1 Grid layout - no horizontal scroll */}
      <div className="md:hidden">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.value;
            // "All" category spans full width on first row
            const isAll = cat.value === 'all';

            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`relative px-4 py-4 rounded-xl text-sm tracking-[0.08em] uppercase transition-all duration-300 min-h-[52px] font-light border flex items-center justify-center gap-2 ${
                  isAll ? 'col-span-2' : ''
                } ${
                  isActive
                    ? 'bg-laxmi-espresso text-laxmi-cream border-laxmi-espresso shadow-md'
                    : 'bg-white dark:bg-card border-laxmi-espresso/10 text-laxmi-espresso/70 active:bg-laxmi-cream/50'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-laxmi-gold animate-pulse" />
                )}
                {locale === 'it' ? cat.label.it : cat.label.en}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
