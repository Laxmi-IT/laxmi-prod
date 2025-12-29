'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)

  // Memoized close handler for better performance
  const handleClose = useCallback(() => setIsOpen(false), [])

  // Required for portal to work with SSR
  useEffect(() => {
    setMounted(true)
  }, [])

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
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

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

      {/* Menu Panel - rendered via portal to escape stacking context */}
      {mounted && createPortal(
        <nav
          className={`fixed inset-0 z-[9999] md:hidden transition-opacity duration-200 ease-out ${
            isOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!isOpen}
        >
          {/* Glassmorphism backdrop - semi-transparent with strong blur */}
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: 'rgba(255, 250, 231, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          />

          {/* Subtle gradient overlay for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255, 250, 231, 0.3) 0%, transparent 40%, rgba(245, 219, 185, 0.2) 100%)',
            }}
          />

          {/* Close button at top */}
          <div className="relative z-10 h-16 flex items-center justify-end px-4">
            <button
              onClick={handleClose}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-laxmi-champagne/30 transition-colors duration-150"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links - no staggered delays for instant feel */}
          <div
            className={`relative z-10 flex flex-col px-6 py-4 transition-transform duration-200 ease-out ${
              isOpen ? 'translate-y-0' : '-translate-y-4'
            }`}
            style={{ willChange: 'transform' }}
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleClose}
                className="flex items-center min-h-[52px] py-3 text-lg font-light tracking-wide text-foreground hover:text-laxmi-bronze transition-colors duration-150 border-b border-border/20"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="relative z-10 px-6 mt-8">
            <Link
              href={`/${locale}/book`}
              onClick={handleClose}
              className="btn-luxury-filled w-full text-center"
            >
              {locale === 'it' ? 'Richiedi Consulenza' : 'Request Consultation'}
            </Link>
          </div>

          {/* Decorative footer */}
          <div className="absolute bottom-8 left-0 right-0 px-6 z-10">
            <div className="gold-line w-12 mb-4" />
            <p className="text-sm text-muted-foreground font-light">
              {locale === 'it' ? 'Milano, Italia' : 'Milan, Italy'}
            </p>
          </div>
        </nav>,
        document.body
      )}
    </>
  )
}
