import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { PremiumGallery } from "@/components/collections";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";
import { collectionImages } from "@/data/collections";

// Sunburst Logo Component
function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -180 + (i * 180) / 8;
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 4;
        const y1 = 22 + Math.sin(rad) * 4;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 22 + Math.sin(rad) * 12;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === 'it' || localeParam === 'en' ? localeParam : 'it') as Locale;
  const dict = await getDictionary(locale);

  // Get hero image for the collections page (first high-quality kitchen image)
  const heroImage = collectionImages.find(img => img.id === 'loft22-supermatt-wood') || collectionImages[0];

  // Translations for the collections page
  const pageTranslations = {
    en: {
      heroTitle: "Collections",
      heroSubtitle: "A curated selection of Italian kitchen excellence",
      heroDescription: "Discover our exclusive collection of premium Italian kitchens, where artisanal craftsmanship meets contemporary design. Each piece tells a story of passion, precision, and timeless elegance.",
      filterLabel: "Filter by environment",
      showingCount: "Showing {count} pieces",
      noResults: "No pieces found in this category",
      exploreButton: "Explore Gallery",
    },
    it: {
      heroTitle: "Collezioni",
      heroSubtitle: "Una selezione curata dell'eccellenza italiana",
      heroDescription: "Scopri la nostra collezione esclusiva di cucine italiane premium, dove l'artigianato incontra il design contemporaneo. Ogni pezzo racconta una storia di passione, precisione ed eleganza senza tempo.",
      filterLabel: "Filtra per ambiente",
      showingCount: "Mostrando {count} pezzi",
      noResults: "Nessun pezzo trovato in questa categoria",
      exploreButton: "Esplora la Galleria",
    }
  };

  const t = pageTranslations[locale];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 sm:px-6 lg:px-12">
          <Link href={`/${locale}`} className="flex flex-col items-center group">
            <SunburstLogo className="w-8 h-5 md:w-10 md:h-6 text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
            <span className="text-lg md:text-xl tracking-[0.25em] md:tracking-[0.3em] font-serif font-light mt-0.5 md:mt-1">
              LAXMI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link href={`/${locale}`} className="nav-link">{dict.nav.home}</Link>
            <Link href={`/${locale}/consulting`} className="nav-link">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link text-laxmi-gold">{dict.nav.collections}</Link>
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
                { href: `/${locale}/about`, label: dict.nav.about },
                { href: `/${locale}/contact`, label: dict.nav.contact },
              ]}
            />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center pt-16 md:pt-20">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage.src}
            alt={locale === 'it' ? heroImage.title.it : heroImage.title.en}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-laxmi-espresso/90 via-laxmi-espresso/70 to-laxmi-espresso/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-2xl animate-fade-in-up">
            {/* Label */}
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-laxmi-champagne/80 mb-4">
              {dict.common.madeInItaly}
            </p>

            {/* Title */}
            <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6">
              {t.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-laxmi-champagne/90 font-light mb-6 md:mb-8">
              {t.heroSubtitle}
            </p>

            {/* Gold line */}
            <div className="w-20 h-px bg-laxmi-gold/60 mb-6 md:mb-8" />

            {/* Description */}
            <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-lg">
              {t.heroDescription}
            </p>

            {/* Scroll indicator */}
            <div className="mt-10 md:mt-16 flex items-center gap-3 text-white/50">
              <div className="w-px h-8 bg-laxmi-gold/40" />
              <span className="text-xs tracking-widest uppercase">{t.exploreButton}</span>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
      </section>

      {/* Gallery Section */}
      <section className="py-16 md:py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-10 md:mb-16 animate-fade-in-up">
            <p className="text-spaced text-laxmi-gold mb-4">{t.filterLabel}</p>
            <div className="gold-line w-24 mx-auto" />
          </div>

          {/* Premium Gallery */}
          <PremiumGallery
            locale={locale}
            translations={{
              filterLabel: t.filterLabel,
              showingCount: t.showingCount,
              noResults: t.noResults,
            }}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 lg:py-32 relative bg-laxmi-cream/20 dark:bg-card/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-16 h-10 md:w-20 md:h-12 text-laxmi-gold mx-auto mb-6 md:mb-8" />
            <h2 className="font-serif font-light mb-4 md:mb-6">{dict.cta.title}</h2>
            <p className="text-base md:text-lg text-muted-foreground font-light mb-8 md:mb-10 max-w-xl mx-auto">
              {dict.cta.description}
            </p>
            <Link href={`/${locale}/book`} className="btn-luxury-filled w-full sm:w-auto">
              {dict.cta.button}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-12 lg:py-16 border-t border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start">
                <SunburstLogo className="w-10 h-6 md:w-12 md:h-8 text-laxmi-bronze mb-2" />
                <span className="text-lg tracking-[0.3em] font-serif font-light">LAXMI</span>
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
                <li><Link href={`/${locale}/about`} className="text-muted-foreground hover:text-foreground transition-colors font-light py-2 inline-flex items-center min-h-[44px]">{dict.nav.about}</Link></li>
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <h4 className="text-spaced text-xs mb-4 md:mb-6 text-laxmi-bronze">{dict.footer.contact}</h4>
              <ul className="space-y-2 text-muted-foreground font-light">
                <li className="py-1">thelaxmii07@gmail.com</li>
                <li className="py-1">+39 000 000 0000</li>
                <li className="py-1">{locale === "it" ? "Milano, Italia" : "Milan, Italy"}</li>
              </ul>
            </div>
          </div>

          <div className="gold-line mt-8 md:mt-12 mb-6 md:mb-8" />

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
