import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { getDictionary } from "@/i18n/dictionaries";
import { type Locale } from "@/i18n/config";

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

// Service Card Component
function ServiceCard({
  service,
  featured = false,
  locale,
}: {
  service: {
    name: string;
    tagline: string;
    price: string;
    priceNote?: string;
    description: string;
    features: string[];
    ideal: string;
  };
  featured?: boolean;
  locale: string;
}) {
  return (
    <div
      className={`relative flex flex-col h-full p-6 md:p-8 rounded-2xl transition-all duration-500 group ${
        featured
          ? "bg-laxmi-espresso text-laxmi-cream ring-2 ring-laxmi-gold shadow-2xl scale-[1.02] z-10"
          : "bg-white dark:bg-card border border-laxmi-champagne/50 hover:border-laxmi-gold/50 hover:shadow-xl"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-laxmi-gold text-laxmi-espresso text-xs tracking-[0.2em] uppercase rounded-full font-medium">
          {locale === "it" ? "Più Popolare" : "Most Popular"}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p
          className={`text-xs tracking-[0.2em] uppercase mb-2 ${
            featured ? "text-laxmi-champagne" : "text-laxmi-bronze"
          }`}
        >
          {service.tagline}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-light mb-4">
          {service.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span
            className={`text-4xl md:text-5xl font-light ${
              featured ? "text-laxmi-gold" : "text-laxmi-espresso dark:text-foreground"
            }`}
          >
            &euro;{service.price}
          </span>
          {service.priceNote && (
            <span
              className={`text-sm ml-2 ${
                featured ? "text-laxmi-champagne/80" : "text-muted-foreground"
              }`}
            >
              {service.priceNote}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div
        className={`w-full h-px mb-6 ${
          featured ? "bg-laxmi-gold/30" : "bg-laxmi-champagne"
        }`}
      />

      {/* Description */}
      <p
        className={`text-sm leading-relaxed mb-6 ${
          featured ? "text-laxmi-cream/90" : "text-muted-foreground"
        }`}
      >
        {service.description}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {service.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <svg
              className={`w-5 h-5 mt-0.5 shrink-0 ${
                featured ? "text-laxmi-gold" : "text-laxmi-bronze"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span
              className={`text-sm ${
                featured ? "text-laxmi-cream/90" : "text-foreground/80"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Ideal for */}
      <p
        className={`text-xs tracking-wider uppercase mt-auto pt-4 border-t ${
          featured
            ? "text-laxmi-champagne/70 border-laxmi-gold/20"
            : "text-muted-foreground border-laxmi-champagne/50"
        }`}
      >
        {service.ideal}
      </p>
    </div>
  );
}

// Process Step Component
function ProcessStep({
  step,
  isLast = false,
}: {
  step: { number: string; title: string; description: string };
  isLast?: boolean;
}) {
  return (
    <div className="relative flex gap-6 md:gap-8 pb-8 md:pb-12">
      {/* Vertical line connector */}
      {!isLast && (
        <div className="absolute left-6 md:left-7 top-14 w-px h-[calc(100%-3.5rem)] bg-gradient-to-b from-laxmi-gold/50 to-transparent" />
      )}

      {/* Number circle */}
      <div className="relative z-10 flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-laxmi-gold/40 bg-background flex items-center justify-center group-hover:border-laxmi-gold transition-colors duration-300">
        <span className="text-sm md:text-base font-light text-laxmi-bronze">
          {step.number}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 pt-2">
        <h4 className="font-serif text-xl md:text-2xl text-foreground mb-2">
          {step.title}
        </h4>
        <p className="text-muted-foreground font-light leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default async function ConsultingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = (localeParam === "it" || localeParam === "en" ? localeParam : "it") as Locale;
  const dict = await getDictionary(locale);

  const steps = [
    dict.consulting.steps.questionnaire,
    dict.consulting.steps.materials,
    dict.consulting.steps.consultation,
    dict.consulting.steps.creation,
    dict.consulting.steps.refinement,
  ];

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
            <Link href={`/${locale}/consulting`} className="nav-link text-laxmi-bronze">{dict.nav.consulting}</Link>
            <Link href={`/${locale}/collections`} className="nav-link">{dict.nav.collections}</Link>
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
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-elegant-living.jpg"
            alt={locale === "it" ? "Interior design di lusso" : "Luxury interior design"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-laxmi-espresso/90 via-laxmi-espresso/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/50 via-transparent to-laxmi-espresso/30" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="text-laxmi-gold text-sm tracking-[0.3em] uppercase mb-4">
              {locale === "it" ? "Servizio Esclusivo" : "Exclusive Service"}
            </p>

            <h1 className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-laxmi-cream mb-6 leading-tight">
              {dict.consulting.heroTitle}
            </h1>

            <p className="text-xl md:text-2xl text-laxmi-champagne font-light mb-8">
              {dict.consulting.heroSubtitle}
            </p>

            <p className="text-laxmi-cream/80 text-lg md:text-xl font-light leading-relaxed max-w-2xl mb-10">
              {dict.consulting.heroDescription}
            </p>

            {/* Quote */}
            <blockquote className="relative pl-6 border-l-2 border-laxmi-gold/60">
              <p className="text-laxmi-champagne italic font-serif text-lg md:text-xl">
                &ldquo;{dict.consulting.heroQuote}&rdquo;
              </p>
            </blockquote>

            <div className="mt-10">
              <Link
                href="#services"
                className="inline-flex items-center gap-3 bg-laxmi-gold text-laxmi-espresso px-8 py-4 rounded-full font-medium tracking-wide hover:bg-laxmi-champagne transition-colors duration-300"
              >
                {locale === "it" ? "Scopri i Percorsi" : "Discover Our Experiences"}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-laxmi-gold/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-laxmi-gold rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-32 relative">
        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-laxmi-gold/20 to-transparent hidden lg:block" style={{ left: "10%" }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <SunburstLogo className="w-16 h-10 text-laxmi-gold mx-auto mb-8" />

            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
              {dict.consulting.philosophyTitle}
            </h2>

            <div className="gold-line w-16 mx-auto mb-10" />

            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              {dict.consulting.philosophyText}
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 md:py-32 bg-laxmi-cream/30 dark:bg-card/30 relative overflow-hidden">
        {/* Decorative arch */}
        <div className="absolute -right-32 top-1/4 w-64 h-64 border border-laxmi-gold/10 rounded-full hidden lg:block" />
        <div className="absolute -right-16 top-1/4 w-32 h-32 border border-laxmi-gold/20 rounded-full hidden lg:block" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-spaced text-laxmi-gold mb-4">{dict.consulting.processSubtitle}</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl">
              {dict.consulting.processTitle}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <div className="max-w-2xl mx-auto">
            {steps.map((step, idx) => (
              <ProcessStep key={idx} step={step} isLast={idx === steps.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 relative scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-spaced text-laxmi-gold mb-4">{dict.consulting.servicesSubtitle}</p>
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl">
              {dict.consulting.servicesTitle}
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto">
            <ServiceCard service={dict.consulting.services.express} locale={locale} />
            <ServiceCard service={dict.consulting.services.singleRoom} featured locale={locale} />
            <ServiceCard service={dict.consulting.services.fullHouse} locale={locale} />
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-20 md:py-32 bg-laxmi-espresso text-laxmi-cream relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl">
              {dict.consulting.deliverablesTitle}
            </h2>
            <div className="w-24 h-px bg-laxmi-gold mx-auto mt-8" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto">
            {Object.entries(dict.consulting.deliverables).map(([key, value]) => (
              <div key={key} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:border-laxmi-gold group-hover:bg-laxmi-gold/10 transition-all duration-300">
                  {key === "layouts" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  )}
                  {key === "moodboards" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                  {key === "furniture" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )}
                  {key === "lighting" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )}
                  {key === "renders" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  )}
                  {key === "coordination" && (
                    <svg className="w-7 h-7 text-laxmi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  )}
                </div>
                <p className="font-light text-laxmi-champagne">{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Large quote mark */}
              <div className="absolute -top-8 -left-4 md:-left-12 text-laxmi-gold/20 font-serif text-[120px] md:text-[180px] leading-none select-none">
                &ldquo;
              </div>

              <div className="relative z-10 text-center py-12">
                <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
                  {dict.consulting.promiseTitle}
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed italic">
                  {dict.consulting.promiseText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-laxmi-cream/50 dark:bg-card/50 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <SunburstLogo className="w-20 h-12 text-laxmi-gold mx-auto mb-8" />

            <h2 className="font-serif font-light text-3xl md:text-4xl lg:text-5xl mb-6">
              {dict.consulting.ctaTitle}
            </h2>

            <p className="text-lg md:text-xl text-muted-foreground font-light mb-10 max-w-xl mx-auto">
              {dict.consulting.ctaText}
            </p>

            <Link
              href={`/${locale}/book`}
              className="btn-luxury-filled text-lg px-10 py-4"
            >
              {dict.consulting.ctaButton}
            </Link>

            {/* Trust badges */}
            <div className="mt-16 pt-12 border-t border-laxmi-champagne/50">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-light text-laxmi-bronze">10+</p>
                  <p className="text-sm text-muted-foreground tracking-wider uppercase">
                    {locale === "it" ? "Anni Esperienza" : "Years Experience"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-light text-laxmi-bronze">200+</p>
                  <p className="text-sm text-muted-foreground tracking-wider uppercase">
                    {locale === "it" ? "Progetti" : "Projects"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-light text-laxmi-bronze">100%</p>
                  <p className="text-sm text-muted-foreground tracking-wider uppercase">
                    {locale === "it" ? "Soddisfazione" : "Satisfaction"}
                  </p>
                </div>
              </div>
            </div>
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
