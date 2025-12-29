'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { type Locale } from '@/i18n/config'

interface NavItem {
  href: string
  label: string
}

interface MobileNavProps {
  locale: Locale
  navItems: NavItem[]
}

export function MobileNav({ locale, navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <>
      {/* Hamburger Button - 44px minimum touch target */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden relative w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-laxmi-champagne/20 transition-colors duration-300 z-[60]"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <div className="relative w-5 h-4 flex flex-col justify-between">
          <span
            className={`block h-px w-full bg-foreground transition-all duration-300 origin-center ${
              isOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block h-px w-full bg-foreground transition-all duration-300 ${
              isOpen ? 'opacity-0 scale-0' : ''
            }`}
          />
          <span
            className={`block h-px w-full bg-foreground transition-all duration-300 origin-center ${
              isOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </div>
      </button>

      {/* Overlay - Strong blur for readability */}
      <div
        className={`fixed inset-0 bg-laxmi-cream/95 dark:bg-background/95 backdrop-blur-xl z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Menu Panel - Full width on mobile with solid background */}
      <nav
        className={`fixed top-0 right-0 bottom-0 w-full bg-laxmi-cream dark:bg-background border-l border-border/30 z-50 md:hidden transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Close button at top */}
        <div className="h-16 flex items-center justify-end px-4">
          <button
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-laxmi-champagne/20 transition-colors duration-300"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col px-6 py-4">
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center min-h-[52px] py-3 text-lg font-light tracking-wide text-foreground hover:text-laxmi-bronze transition-colors duration-300 border-b border-border/20 ${
                isOpen ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="px-6 mt-8">
          <Link
            href={`/${locale}/book`}
            onClick={() => setIsOpen(false)}
            className="btn-luxury-filled w-full text-center"
          >
            {locale === 'it' ? 'Richiedi Consulenza' : 'Request Consultation'}
          </Link>
        </div>

        {/* Decorative footer */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="gold-line w-12 mb-4" />
          <p className="text-sm text-muted-foreground font-light">
            {locale === 'it' ? 'Milano, Italia' : 'Milan, Italy'}
          </p>
        </div>
      </nav>
    </>
  )
}
