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
        <div className="inline-flex items-center bg-laxmi-cream/50 dark:bg-card/30 rounded-full p-1.5 border border-laxmi-espresso/5">
          {categories.map((cat, index) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`relative px-6 py-3 text-sm tracking-[0.12em] uppercase transition-all duration-400 rounded-full ${
                activeCategory === cat.value
                  ? 'bg-laxmi-espresso text-white shadow-lg'
                  : 'text-laxmi-espresso/60 hover:text-laxmi-espresso hover:bg-white/50'
              }`}
            >
              {locale === 'it' ? cat.label.it : cat.label.en}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Enhanced horizontal scrollable pills */}
      <div className="md:hidden overflow-x-auto scrollbar-hide -mx-6 px-6">
        <div className="flex gap-3 pb-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-6 py-3 rounded-full text-sm tracking-[0.1em] uppercase whitespace-nowrap transition-all duration-300 min-w-[44px] min-h-[44px] font-medium ${
                activeCategory === cat.value
                  ? 'bg-laxmi-espresso text-white shadow-lg'
                  : 'bg-white dark:bg-card border border-laxmi-espresso/10 text-laxmi-espresso/70 hover:border-laxmi-gold/50 hover:text-laxmi-espresso'
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
