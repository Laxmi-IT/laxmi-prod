import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { PremiumGallery } from "@/components/collections";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, defaultLocale, siteUrl, type Locale } from "@/i18n/config";
import { getGalleryImages } from "@/lib/gallery/queries";
import { LogoText } from "@/components/laxmi-logo";
import { DYNAMIC_BLUR_DATA_URL } from "@/lib/image/blur-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (locales.includes(localeParam as Locale) ? localeParam : defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.metadata.collectionsTitle,
    description: dict.metadata.collectionsDescription,
    openGraph: {
      title: dict.metadata.collectionsTitle,
      description: dict.metadata.collectionsDescription,
      url: `${siteUrl}/${locale}/collections`,
    },
  };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'it' || localeParam === 'en' ? localeParam : 'it') as Locale;
  const dict = await getDictionary(locale);

  // Fetch gallery images from database (cached)
  const galleryImages = await getGalleryImages();

  // Fallback image data in case database is empty
  const fallbackImage = {
    id: 'fallback',
    src: '/images/collections/loft22-supermatt-wood.webp',
    category: 'Kitchen',
    categoryIT: 'Cucina',
    title: { en: 'LAXMI Kitchen', it: 'Cucina LAXMI' },
    description: { en: 'Italian luxury kitchen design', it: 'Design cucina lusso italiano' },
    isFeatured: true,
    isActive: true,
    sortOrder: 0,
  };

  // Get hero image for the collections page - prefer featured Kitchen image
  const heroImage = galleryImages.find(img => img.isFeatured && img.category === 'Kitchen')
    || galleryImages.find(img => img.category === 'Kitchen')
    || galleryImages[0]
    || fallbackImage;

  // Get secondary images for storytelling sections
  const craftImage = galleryImages.find(img => img.category === 'Details') || galleryImages[2] || fallbackImage;
  const livingImage = galleryImages.find(img => img.category === 'Living') || galleryImages[5] || fallbackImage;

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="flex items-center group">
            <LogoText className="h-8 md:h-10 w-auto transition-transform duration-500 group-hover:scale-110" />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link text-laxmi-gold">{dict.nav.collections}</Link>
            <Link href={`/${locale}/blog`} className="nav-link">{dict.nav.blog}</Link>
            <Link href={`/${locale}/about`} className="nav-link">{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`} className="nav-link">{dict.nav.contact}</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
            <MobileNav
              locale={locale}
              navItems={[
                { href: `/${locale}`, label: dict.nav.home },
                { href: `/${locale}/consulting`, label: dict.nav.consulting },
                { href: `/${locale}/collections`, label: dict.nav.collections },
                { href: `/${locale}/blog`, label: dict.nav.blog },
                { href: `/${locale}/about`, label: dict.nav.about },
                { href: `/${locale}/contact`, label: dict.nav.contact },
              ]}
              ctaLabel={dict.hero.cta}
              location={dict.common.location}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section with Premium Glassmorphism */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center pt-20 md:pt-24">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage.src}
            alt={locale === 'it' ? heroImage.title.it : heroImage.title.en}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL={DYNAMIC_BLUR_DATA_URL}
          />
          {/* Sophisticated overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        </div>

        {/* Content with Glassmorphism Card */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-2xl lg:max-w-3xl animate-glass-fade">
            {/* Glassmorphism Card - Premium Effect */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
              {/* Glass background - Safari compatible with webkit prefix */}
              <div
                className="absolute inset-0 rounded-2xl md:rounded-3xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-transparent rounded-2xl md:rounded-3xl" />
              <div className="absolute inset-0 border border-white/20 rounded-2xl md:rounded-3xl" />

              {/* Content */}
              <div className="relative p-6 sm:p-8 md:p-12 lg:p-14">
                {/* Gold accent line */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-laxmi-gold to-laxmi-gold/50" />
                  <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-laxmi-gold font-medium">
                    {dict.common.madeInItaly}
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white mb-4 md:mb-6 leading-[1.1]">
                  {dict.collections.heroTitle}
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-light mb-6 md:mb-8 leading-relaxed">
                  {dict.collections.heroSubtitle}
                </p>

                {/* Decorative divider */}
                <div className="w-16 h-px bg-laxmi-gold/60 mb-6 md:mb-8" />

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg text-white/80 font-light leading-relaxed max-w-xl">
                  {dict.collections.heroDescription}
                </p>

                {/* CTA */}
                <div className="mt-8 md:mt-10 flex items-center gap-4">
                  <a
                    href="#gallery"
                    className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-laxmi-gold text-laxmi-espresso text-sm tracking-[0.1em] uppercase font-medium rounded-full hover:bg-white transition-all duration-300 hover:shadow-lg group"
                  >
                    {dict.collections.exploreButton}
                    <svg className="w-4 h-4 transform group-hover:translate-y-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-6 right-6 w-8 h-8 hidden md:block">
                <div className="absolute top-0 right-0 w-full h-px bg-laxmi-gold/40" />
                <div className="absolute top-0 right-0 h-full w-px bg-laxmi-gold/40" />
              </div>
              <div className="absolute bottom-6 left-6 w-8 h-8 hidden md:block">
                <div className="absolute bottom-0 left-0 w-full h-px bg-laxmi-gold/40" />
                <div className="absolute bottom-0 left-0 h-full w-px bg-laxmi-gold/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Storytelling Section 1: The Art */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-px bg-laxmi-gold" />
                <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                  {dict.collections.story1Subtitle}
                </span>
              </div>
              <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground mb-6 leading-tight">
                {dict.collections.story1Title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
                {dict.collections.story1Text}
              </p>
              <blockquote className="border-l-2 border-laxmi-gold pl-6 py-2">
                <p className="font-serif italic text-xl md:text-2xl text-laxmi-espresso dark:text-foreground">
                  &ldquo;{dict.collections.story1Quote}&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={craftImage.src}
                  alt={locale === 'it' ? craftImage.title.it : craftImage.title.en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL={DYNAMIC_BLUR_DATA_URL}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/30 to-transparent" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-laxmi-gold/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Storytelling Section 2: Materials */}
      <section className="py-20 md:py-32 relative bg-laxmi-cream/30 dark:bg-card/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={livingImage.src}
                  alt={locale === 'it' ? livingImage.title.it : livingImage.title.en}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={85}
                  placeholder="blur"
                  blurDataURL={DYNAMIC_BLUR_DATA_URL}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/30 to-transparent" />
              </div>
              {/* Decorative frame */}
              <div className="absolute -bottom-4 -left-4 w-full h-full border-2 border-laxmi-gold/20 rounded-2xl -z-10" />
            </div>

            {/* Text Content */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-px bg-laxmi-gold" />
                <span className="text-xs tracking-[0.25em] uppercase text-laxmi-gold">
                  {dict.collections.story2Subtitle}
                </span>
              </div>
              <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground mb-6 leading-tight">
                {dict.collections.story2Title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed mb-8">
                {dict.collections.story2Text}
              </p>
              {/* Features grid */}
              <div className="grid grid-cols-2 gap-4">
                {dict.collections.story2Features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-laxmi-gold" />
                    <span className="text-sm text-laxmi-espresso dark:text-foreground font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 relative scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-16">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-laxmi-gold/50" />
              <span className="text-xs md:text-sm tracking-[0.3em] uppercase text-laxmi-gold font-medium">
                {dict.collections.filterLabel}
              </span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-laxmi-gold/50" />
            </div>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-laxmi-espresso dark:text-foreground">
              {dict.collections.galleryTitle}
            </h2>
          </div>

          {/* Premium Gallery */}
          <PremiumGallery
            locale={locale}
            images={galleryImages}
            translations={{
              filterLabel: dict.collections.filterLabel,
              showingCount: dict.collections.showingCount,
              noResults: dict.collections.noResults,
            }}
          />
        </div>
      </section>

      {/* Storytelling Section 3: Your Vision - Premium CTA with Image Background */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={heroImage.src}
            alt={dict.collections.heroTitle}
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
            placeholder="blur"
            blurDataURL={DYNAMIC_BLUR_DATA_URL}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-laxmi-espresso/90" />
          <div className="absolute inset-0 bg-gradient-to-br from-laxmi-espresso/95 via-laxmi-espresso/85 to-black/80" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-laxmi-gold/30 to-transparent" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Subtitle badge - Premium Glassmorphism Gold */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-gradient-to-r from-transparent to-laxmi-gold" />
              <span className="relative text-xs md:text-sm tracking-[0.25em] uppercase text-laxmi-gold font-medium px-6 py-2.5 rounded-full overflow-hidden">
                {/* Glassmorphism background */}
                <span className="absolute inset-0 bg-laxmi-gold/15 backdrop-blur-md" />
                <span className="absolute inset-0 bg-gradient-to-br from-laxmi-gold/20 via-laxmi-gold/10 to-transparent" />
                <span className="absolute inset-0 border border-laxmi-gold/40 rounded-full" />
                <span className="absolute inset-0 shadow-[inset_0_1px_1px_rgba(212,175,55,0.2)]" />
                {/* Text */}
                <span className="relative z-10">{dict.collections.story3Subtitle}</span>
              </span>
              <div className="w-12 h-px bg-gradient-to-l from-transparent to-laxmi-gold" />
            </div>

            {/* Title */}
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white mb-8 leading-tight">
              {dict.collections.story3Title}
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-white/90 font-light leading-relaxed max-w-3xl mx-auto mb-12">
              {dict.collections.story3Text}
            </p>

            {/* CTA Button */}
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-laxmi-gold text-laxmi-espresso text-sm md:text-base tracking-[0.15em] uppercase font-medium rounded-full hover:bg-white transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
            >
              {dict.cta.button}
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Trust indicators */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-white/60 text-xs md:text-sm tracking-wider uppercase">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {dict.collections.trustCustomDesign}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {dict.collections.trustPremiumQuality}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-laxmi-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {dict.common.madeInItaly}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <LogoText className="h-8 md:h-10 w-auto" />
              </div>
              <p className="text-muted-foreground font-light mt-4 max-w-sm">
                {dict.footer.description}
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{dict.footer.navigation}</h4>
              <ul className="space-y-1">
                <li><Link href={`/${locale}`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.home}</Link></li>
                <li><Link href={`/${locale}/consulting`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.consulting}</Link></li>
                <li><Link href={`/${locale}/collections`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.collections}</Link></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{dict.footer.contact}</h4>
              <ul className="space-y-2 text-muted-foreground font-light">
                <li className="py-1">thelaxmii07@gmail.com</li>
                <li className="py-1">+39 000 000 0000</li>
                <li className="py-1">{dict.common.location}</li>
              </ul>
            </div>
          </div>

          <div className="gold-line mt-10 md:mt-12 mb-6 md:mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-sm text-muted-foreground font-light order-2 md:order-1">
              &copy; {new Date().getFullYear()} LAXMI. {dict.footer.copyright}
            </p>
            <p className="text-sm text-muted-foreground font-light italic order-1 md:order-2">
              {dict.footer.quote}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
